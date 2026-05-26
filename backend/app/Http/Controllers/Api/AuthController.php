<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ClientProfile;
use App\Models\TrainerApplication;
use App\Models\User;
use App\Services\ActivityLogService;
use App\Services\PermissionService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function __construct(private readonly ActivityLogService $activityLogs)
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

    public function registerTrainerApplicant(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8', 'max:120'],
            'consent_to_terms' => ['required', 'accepted'],
        ]);

        [$user, $application] = DB::transaction(function () use ($validated): array {
            $user = User::query()->create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => $validated['password'],
                'role' => 'trainer',
                'status' => 'active',
                'consent_to_terms' => true,
            ]);

            $application = TrainerApplication::query()->create([
                'application_id' => 'TRN-' . now()->format('YmdHis') . '-' . Str::upper(Str::random(6)),
                'applicant_user_id' => $user->id,
                'applicant_name' => $user->name,
                'applicant_email' => $user->email,
                'values_json' => [
                    'profile' => [
                        'fullName' => $user->name,
                        'email' => $user->email,
                    ],
                ],
                'status' => 'draft',
                'current_screen' => 'personalInfo',
                'review_history_json' => [],
            ]);

            return [$user, $application];
        });

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
}
