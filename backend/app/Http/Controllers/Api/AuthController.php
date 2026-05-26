<?php

namespace App\Http\Controllers\Api;

use App\Contracts\SmsVerificationSender;
use App\Http\Controllers\Controller;
use App\Models\ClientProfile;
use App\Models\TrainerApplication;
use App\Models\TrainerRegistrationChallenge;
use App\Models\User;
use App\Services\ActivityLogService;
use App\Services\PermissionService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function __construct(
        private readonly ActivityLogService $activityLogs,
        private readonly SmsVerificationSender $smsVerificationSender,
    )
    {
    }

    public function register(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8', 'max:120'],
            'role' => ['nullable', 'string', 'in:client'],
            'phone' => ['nullable', 'string', 'max:30'],
            'consent_to_terms' => ['nullable', 'boolean'],
            'primary_goal' => ['nullable', 'in:fitness,mental_health,both'],
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => $validated['password'],
            'role' => $validated['role'] ?? 'client',
            'phone' => $validated['phone'] ?? null,
            'consent_to_terms' => (bool) ($validated['consent_to_terms'] ?? false),
            'wellness_goal' => $validated['primary_goal'] ?? null,
        ]);

        $profile = ClientProfile::updateOrCreate(
            ['user_id' => $user->id],
            ['primary_goal' => $validated['primary_goal'] ?? null]
        );

        $token = $user->createToken('auth-token')->plainTextToken;

        $this->activityLogs->record('account', 'registered', sprintf('%s created an account.', $user->name), [
            'actor' => $user,
            'subject' => $user,
            'details' => ['role' => $user->role],
            'audienceUsers' => [$user],
        ]);

        return response()->json([
            'token' => $token,
            'user' => $this->userPayload($user),
            'profile' => $profile,
        ], 201);
    }

    public function requestTrainerRegistrationOtp(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8', 'max:120'],
            'mobile' => ['required', 'string', 'max:30'],
            'consent_to_terms' => ['required', 'accepted'],
        ]);
        $mobile = $this->normalizeIndianMobile((string) $validated['mobile']);
        $this->ensureTrainerMobileAvailable($mobile);
        $token = Str::random(64);
        $now = now();
        $otp = (string) config('services.trainer_otp.code', '123456');

        TrainerRegistrationChallenge::query()
            ->where('status', 'pending')
            ->where(function ($query) use ($validated, $mobile): void {
                $query->whereRaw('LOWER(email) = ?', [strtolower((string) $validated['email'])])
                    ->orWhere('mobile', $mobile);
            })
            ->update(['status' => 'replaced']);

        $challenge = TrainerRegistrationChallenge::query()->create([
            'token_hash' => hash('sha256', $token),
            'email' => strtolower((string) $validated['email']),
            'mobile' => $mobile,
            'registration_payload' => Crypt::encryptString(json_encode([
                'name' => trim((string) $validated['name']),
                'email' => strtolower((string) $validated['email']),
                'password' => (string) $validated['password'],
                'mobile' => $mobile,
            ], JSON_THROW_ON_ERROR)),
            'otp_hash' => Hash::make($otp),
            'provider' => $this->smsVerificationSender->providerName(),
            'status' => 'pending',
            'attempts' => 0,
            'expires_at' => $now->copy()->addMinutes((int) config('services.trainer_otp.expiry_minutes', 10)),
            'resend_available_at' => $now->copy()->addSeconds((int) config('services.trainer_otp.resend_seconds', 60)),
        ]);

        $this->smsVerificationSender->send($mobile, $otp);

        return response()->json([
            'challengeToken' => $token,
            'maskedMobile' => $this->maskMobile($mobile),
            'expiresAt' => $challenge->expires_at->toIso8601String(),
            'resendAvailableAt' => $challenge->resend_available_at->toIso8601String(),
            'message' => 'Verification code sent to your mobile number.',
        ], 201);
    }

    public function verifyTrainerRegistrationOtp(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'challengeToken' => ['required', 'string', 'max:120'],
            'otp' => ['required', 'digits:6'],
        ]);

        $result = DB::transaction(function () use ($validated): array {
            $challenge = $this->findPendingTrainerChallenge((string) $validated['challengeToken'], true);

            $maxAttempts = (int) config('services.trainer_otp.max_attempts', 5);
            if ($challenge->expires_at->isPast()) {
                $challenge->forceFill(['status' => 'expired'])->save();

                return ['error' => 'This verification code has expired. Start registration again.'];
            }
            if ($challenge->attempts >= $maxAttempts) {
                $challenge->forceFill(['status' => 'blocked'])->save();

                return ['error' => 'Too many incorrect attempts. Start registration again.'];
            }
            if (!Hash::check((string) $validated['otp'], (string) $challenge->otp_hash)) {
                $challenge->increment('attempts');
                if ($challenge->attempts >= $maxAttempts) {
                    $challenge->forceFill(['status' => 'blocked'])->save();
                }

                return ['error' => $challenge->attempts >= $maxAttempts
                        ? 'Too many incorrect attempts. Start registration again.'
                        : 'Incorrect verification code.'];
            }

            $payload = json_decode(Crypt::decryptString((string) $challenge->registration_payload), true, 512, JSON_THROW_ON_ERROR);
            if (User::query()->whereRaw('LOWER(email) = ?', [strtolower((string) $payload['email'])])->exists()) {
                throw ValidationException::withMessages(['email' => ['This email is already registered.']]);
            }
            $this->ensureTrainerMobileAvailable((string) $payload['mobile']);

            $user = User::query()->create([
                'name' => $payload['name'],
                'email' => $payload['email'],
                'password' => $payload['password'],
                'role' => 'trainer',
                'status' => 'active',
                'phone' => $payload['mobile'],
                'consent_to_terms' => true,
            ]);

            $application = TrainerApplication::query()->create([
                'application_id' => 'TRN-' . now()->format('YmdHis') . '-' . Str::upper(Str::random(6)),
                'applicant_user_id' => $user->id,
                'applicant_name' => $user->name,
                'applicant_email' => $user->email,
                'applicant_mobile' => $user->phone,
                'values_json' => [
                    'profile' => [
                        'fullName' => $user->name,
                        'email' => $user->email,
                        'mobile' => $user->phone,
                    ],
                ],
                'status' => 'draft',
                'current_screen' => 'personalInfo',
                'review_history_json' => [],
            ]);

            $challenge->forceFill([
                'status' => 'verified',
                'verified_at' => now(),
            ])->save();

            return ['user' => $user, 'application' => $application];
        });

        if (isset($result['error'])) {
            throw ValidationException::withMessages(['otp' => [$result['error']]]);
        }

        /** @var User $user */
        $user = $result['user'];
        /** @var TrainerApplication $application */
        $application = $result['application'];

        $token = $user->createToken('auth-token')->plainTextToken;

        $this->activityLogs->record('account', 'registered', sprintf('%s started a trainer application.', $user->name), [
            'actor' => $user,
            'subject' => $application,
            'details' => ['role' => 'trainer', 'applicationId' => $application->application_id],
            'audienceUsers' => [$user],
            'audienceRoles' => ['admin'],
        ]);

        return response()->json([
            'token' => $token,
            'user' => $this->userPayload($user),
            'application' => [
                'applicationId' => (string) $application->application_id,
                'status' => 'draft',
                'currentScreen' => 'personalInfo',
                'values' => $application->values_json,
            ],
        ], 201);
    }

    public function resendTrainerRegistrationOtp(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'challengeToken' => ['required', 'string', 'max:120'],
        ]);
        $challenge = $this->findPendingTrainerChallenge((string) $validated['challengeToken']);
        $this->ensureChallengeUsable($challenge);

        if ($challenge->resend_available_at->isFuture()) {
            return response()->json([
                'message' => 'Please wait before requesting another code.',
                'resendAvailableAt' => $challenge->resend_available_at->toIso8601String(),
            ], 429);
        }

        $now = now();
        $otp = (string) config('services.trainer_otp.code', '123456');
        $challenge->forceFill([
            'otp_hash' => Hash::make($otp),
            'attempts' => 0,
            'expires_at' => $now->copy()->addMinutes((int) config('services.trainer_otp.expiry_minutes', 10)),
            'resend_available_at' => $now->copy()->addSeconds((int) config('services.trainer_otp.resend_seconds', 60)),
        ])->save();
        $this->smsVerificationSender->send((string) $challenge->mobile, $otp);

        return response()->json([
            'challengeToken' => $validated['challengeToken'],
            'maskedMobile' => $this->maskMobile((string) $challenge->mobile),
            'expiresAt' => $challenge->expires_at->toIso8601String(),
            'resendAvailableAt' => $challenge->resend_available_at->toIso8601String(),
            'message' => 'A new verification code has been sent.',
        ]);
    }

    public function login(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        $user = User::where('email', $validated['email'])->first();

        if (!$user || !Hash::check($validated['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Invalid credentials.'],
            ]);
        }

        if ($user->status !== 'active') {
            return response()->json([
                'message' => $user->status === 'suspended'
                    ? 'Your account has been suspended. Please contact support.'
                    : 'Your account is pending activation. Please contact support.',
            ], 403);
        }

        $user->tokens()->delete();
        $token = $user->createToken('auth-token')->plainTextToken;

        $this->activityLogs->record('auth', 'login', sprintf('%s signed in.', $user->name), [
            'actor' => $user,
            'subject' => $user,
            'audienceUsers' => [$user],
        ]);

        return response()->json([
            'token' => $token,
            'user' => $this->userPayload($user),
            'profile' => $user->clientProfile,
        ]);
    }

    public function me(Request $request): JsonResponse
    {
        $user = $request->user()->load('clientProfile');

        return response()->json([
            'user' => $this->userPayload($user),
            'profile' => $user->clientProfile,
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $user = $request->user();

        $this->activityLogs->record('auth', 'logout', sprintf('%s signed out.', (string) $user?->name), [
            'actor' => $user,
            'subject' => $user,
            'audienceUsers' => array_values(array_filter([$user])),
        ]);

        $user?->currentAccessToken()?->delete();

        return response()->json([
            'message' => 'Logged out successfully.',
        ]);
    }

    public function changePassword(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'current_password' => ['required', 'string'],
            'password' => ['required', 'string', 'min:8', 'max:120', 'confirmed'],
        ]);

        $user = $request->user();

        if (!$user || !Hash::check($validated['current_password'], (string) $user->password)) {
            throw ValidationException::withMessages([
                'current_password' => ['Current password is incorrect.'],
            ]);
        }

        $user->forceFill([
            'password' => $validated['password'],
            'remember_token' => Str::random(60),
        ])->save();

        $user->tokens()->delete();
        $token = $user->createToken('auth-token')->plainTextToken;

        $this->activityLogs->record('auth', 'password_changed', sprintf('%s changed their password.', $user->name), [
            'actor' => $user,
            'subject' => $user,
            'audienceUsers' => [$user],
        ]);

        return response()->json([
            'message' => 'Password updated successfully.',
            'token' => $token,
            'user' => $this->userPayload($user),
            'profile' => $user->clientProfile,
        ]);
    }

    public function forgotPassword(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'email'],
        ]);

        $status = Password::sendResetLink([
            'email' => $validated['email'],
        ]);

        if ($status !== Password::RESET_LINK_SENT) {
            return response()->json([
                'message' => __($status),
            ], 422);
        }

        return response()->json([
            'message' => 'Password reset link sent to your email.',
        ]);
    }

    public function resetPassword(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'token' => ['required', 'string'],
            'email' => ['required', 'email'],
            'password' => ['required', 'string', 'min:8', 'max:120', 'confirmed'],
        ]);

        $resetUser = null;
        $status = Password::reset(
            $validated,
            function (User $user, string $password) use (&$resetUser): void {
                $user->forceFill([
                    'password' => $password,
                    'remember_token' => Str::random(60),
                ])->save();

                $user->tokens()->delete();
                $resetUser = $user;
            }
        );

        if ($status !== Password::PASSWORD_RESET) {
            return response()->json([
                'message' => __($status),
            ], 422);
        }

        if ($resetUser instanceof User) {
            $this->activityLogs->record('auth', 'password_reset', sprintf('%s reset their password.', $resetUser->name), [
                'actor' => $resetUser,
                'subject' => $resetUser,
                'audienceUsers' => [$resetUser],
            ]);
        }

        return response()->json([
            'message' => 'Password reset successful. You can now login with your new password.',
        ]);
    }

    private function userPayload(User $user): array
    {
        $requiresClientIntake = $user->role === 'client' && !$user->intakeFlows()->exists();

        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role,
            'phone' => $user->phone,
            'consent_to_terms' => (bool) $user->consent_to_terms,
            'status' => $user->status ?? 'active',
            'requires_client_intake' => $requiresClientIntake,
            'permissions' => app(PermissionService::class)->effectiveKeys($user),
        ];
    }

    private function normalizeIndianMobile(string $mobile): string
    {
        $digits = preg_replace('/\D+/', '', $mobile) ?? '';
        if (strlen($digits) === 12 && str_starts_with($digits, '91')) {
            $digits = substr($digits, 2);
        }

        if (!preg_match('/^[6-9]\d{9}$/', $digits)) {
            throw ValidationException::withMessages([
                'mobile' => ['Enter a valid Indian mobile number.'],
            ]);
        }

        return '+91' . $digits;
    }

    private function ensureTrainerMobileAvailable(string $mobile): void
    {
        if (User::query()->where('phone', $mobile)->exists()) {
            throw ValidationException::withMessages([
                'mobile' => ['This mobile number is already registered.'],
            ]);
        }
    }

    private function findPendingTrainerChallenge(string $token, bool $lock = false): TrainerRegistrationChallenge
    {
        $query = TrainerRegistrationChallenge::query()->where('token_hash', hash('sha256', $token));
        if ($lock) {
            $query->lockForUpdate();
        }
        $challenge = $query->first();

        if (!$challenge || $challenge->status !== 'pending') {
            throw ValidationException::withMessages([
                'otp' => ['This verification request is no longer available. Start again.'],
            ]);
        }

        return $challenge;
    }

    private function ensureChallengeUsable(TrainerRegistrationChallenge $challenge): void
    {
        if ($challenge->expires_at->isPast()) {
            $challenge->forceFill(['status' => 'expired'])->save();
            throw ValidationException::withMessages([
                'otp' => ['This verification code has expired. Start registration again.'],
            ]);
        }

        if ($challenge->attempts >= (int) config('services.trainer_otp.max_attempts', 5)) {
            $challenge->forceFill(['status' => 'blocked'])->save();
            throw ValidationException::withMessages([
                'otp' => ['Too many incorrect attempts. Start registration again.'],
            ]);
        }
    }

    private function maskMobile(string $mobile): string
    {
        return substr($mobile, 0, 3) . ' ***** ' . substr($mobile, -4);
    }
}
