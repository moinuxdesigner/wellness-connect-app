<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TrainerApplication;
use App\Models\User;
use App\Services\ActivityLogService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class TrainerApplicationController extends Controller
{
    public function __construct(private readonly ActivityLogService $activityLogs)
    {
    }

    public function submit(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'applicationId' => ['nullable', 'string', 'max:80'],
            'values' => ['required', 'array'],
        ]);

        $values = $validated['values'];
        $summary = $this->extractSummary($values);

        Validator::make($summary, [
            'applicant_name' => ['required', 'string', 'min:2', 'max:160'],
            'applicant_email' => ['required', 'email', 'max:255'],
            'applicant_mobile' => ['required', 'string', 'max:30'],
            'city' => ['required', 'string', 'min:2', 'max:120'],
            'state' => ['required', 'string', 'min:2', 'max:120'],
        ])->validate();

        $applicationId = (string) ($validated['applicationId'] ?? ('TRN-' . now()->format('YmdHis') . '-' . Str::upper(Str::random(6))));
        $timestamp = now();

        $application = TrainerApplication::query()->firstOrNew([
            'application_id' => $applicationId,
        ]);

        $wasResubmission = $application->exists && $application->status === 'needs_resubmission';
        $history = is_array($application->review_history_json) ? $application->review_history_json : [];
        $history[] = $this->historyItem(
            action: 'submitted',
            actor: 'trainer',
            note: $wasResubmission
                ? 'Trainer resubmitted the application after admin remarks.'
                : 'Trainer submitted the onboarding application.',
            at: $timestamp,
        );

        $application->fill([
            ...$summary,
            'expertise_json' => Arr::get($values, 'expertise', []),
            'values_json' => $values,
            'status' => 'submitted',
            'admin_remarks' => '',
            'review_history_json' => $history,
            'submitted_at' => $timestamp,
        ]);
        $application->save();

        $this->activityLogs->record('trainer_application', $wasResubmission ? 'application_resubmitted' : 'application_submitted', sprintf('%s submitted a trainer application.', $application->applicant_name), [
            'subject' => $application,
            'details' => [
                'applicationId' => $application->application_id,
                'status' => $application->status,
                'city' => $application->city,
                'state' => $application->state,
            ],
            'audienceRoles' => ['admin'],
        ]);

        return response()->json([
            'application' => $this->applicationPayload($application->fresh()),
        ], $application->wasRecentlyCreated ? 201 : 200);
    }

    public function show(string $applicationId): JsonResponse
    {
        $application = TrainerApplication::query()
            ->where('application_id', $applicationId)
            ->first();

        if (!$application) {
            return response()->json([
                'message' => 'Trainer application not found.',
            ], 404);
        }

        return response()->json([
            'application' => $this->applicationPayload($application),
        ]);
    }

    public function index(Request $request): JsonResponse
    {
        $this->authorizeAdmin($request);

        $applications = TrainerApplication::query()
            ->latest('updated_at')
            ->get()
            ->map(fn (TrainerApplication $application) => $this->applicationPayload($application))
            ->values();

        return response()->json([
            'applications' => $applications,
        ]);
    }

    public function updateStatus(Request $request, string $applicationId): JsonResponse
    {
        $this->authorizeAdmin($request);

        $validated = $request->validate([
            'status' => ['required', 'string', 'in:under_review,needs_resubmission,approved,rejected'],
            'adminRemarks' => ['nullable', 'string', 'max:4000'],
        ]);

        $application = TrainerApplication::query()
            ->where('application_id', $applicationId)
            ->firstOrFail();

        $timestamp = now();
        $status = (string) $validated['status'];
        $remarks = trim((string) ($validated['adminRemarks'] ?? ''));
        $account = null;

        DB::transaction(function () use ($application, $request, $timestamp, $status, $remarks, &$account): void {
            $history = is_array($application->review_history_json) ? $application->review_history_json : [];
            $history[] = $this->historyItem(
                action: $status,
                actor: 'admin',
                note: $remarks !== '' ? $remarks : $this->defaultAdminNote($status),
                at: $timestamp,
            );

            $application->fill([
                'status' => $status,
                'admin_remarks' => $remarks,
                'review_history_json' => $history,
                'reviewed_by_user_id' => $request->user()?->id,
                'updated_at' => $timestamp,
            ]);
            $application->save();

            if ($status === 'approved') {
                $account = $this->provisionApprovedTrainerAccount($application);
            }
        });

        $this->activityLogs->record('trainer_application', 'application_' . $status, sprintf('%s marked trainer application %s as %s.', $request->user()->name, $application->application_id, str_replace('_', ' ', $status)), [
            'actor' => $request->user(),
            'subject' => $application,
            'details' => [
                'status' => $status,
                'adminRemarks' => $remarks,
                'account' => $account,
            ],
            'audienceRoles' => ['admin'],
        ]);

        return response()->json([
            'application' => $this->applicationPayload($application->fresh()),
            'account' => $account,
        ]);
    }

    private function provisionApprovedTrainerAccount(TrainerApplication $application): array
    {
        $user = User::query()
            ->whereRaw('LOWER(email) = ?', [strtolower((string) $application->applicant_email)])
            ->first();
        $temporaryPassword = null;
        $created = false;

        if ($user && $user->role === 'admin') {
            abort(422, 'An administrator account cannot be converted to a trainer.');
        }

        if (!$user) {
            $temporaryPassword = 'Trainer@' . Str::password(10, symbols: false);
            $user = User::query()->create([
                'name' => $application->applicant_name,
                'email' => $application->applicant_email,
                'password' => $temporaryPassword,
                'role' => 'trainer',
                'status' => 'active',
                'phone' => $application->applicant_mobile,
                'consent_to_terms' => true,
            ]);
            $created = true;
        } else {
            $user->forceFill([
                'name' => $application->applicant_name,
                'role' => 'trainer',
                'status' => 'active',
                'phone' => $application->applicant_mobile ?: $user->phone,
            ])->save();
        }

        $this->activityLogs->record('trainer_application', 'trainer_account_provisioned', sprintf('Trainer account %s was %s.', $user->email, $created ? 'created' : 'updated'), [
            'targetUser' => $user,
            'subject' => $user,
            'details' => [
                'created' => $created,
                'applicationId' => $application->application_id,
            ],
            'audienceRoles' => ['admin'],
            'audienceUsers' => [$user],
        ]);

        return [
            'userId' => (string) $user->id,
            'email' => (string) $user->email,
            'created' => $created,
            'temporaryPassword' => $temporaryPassword,
        ];
    }

    private function applicationPayload(TrainerApplication $application): array
    {
        return [
            'applicationId' => (string) $application->application_id,
            'status' => (string) $application->status,
            'applicantName' => (string) $application->applicant_name,
            'applicantEmail' => (string) $application->applicant_email,
            'applicantMobile' => (string) $application->applicant_mobile,
            'city' => (string) $application->city,
            'state' => (string) $application->state,
            'expertise' => array_values($application->expertise_json ?? []),
            'values' => is_array($application->values_json) ? $application->values_json : [],
            'submittedAt' => optional($application->submitted_at)->toIso8601String() ?? optional($application->created_at)->toIso8601String() ?? now()->toIso8601String(),
            'updatedAt' => optional($application->updated_at)->toIso8601String() ?? now()->toIso8601String(),
            'adminRemarks' => (string) ($application->admin_remarks ?? ''),
            'reviewHistory' => array_values($application->review_history_json ?? []),
        ];
    }

    private function extractSummary(array $values): array
    {
        return [
            'applicant_name' => trim((string) Arr::get($values, 'profile.fullName', '')),
            'applicant_email' => trim((string) Arr::get($values, 'profile.email', '')),
            'applicant_mobile' => trim((string) Arr::get($values, 'profile.mobile', '')),
            'city' => trim((string) Arr::get($values, 'profile.city', '')),
            'state' => trim((string) Arr::get($values, 'profile.state', '')),
        ];
    }

    private function historyItem(string $action, string $actor, string $note, Carbon $at): array
    {
        return [
            'id' => "{$actor}-{$action}-{$at->timestamp}",
            'action' => $action,
            'actor' => $actor,
            'note' => $note,
            'at' => $at->toIso8601String(),
        ];
    }

    private function defaultAdminNote(string $status): string
    {
        return match ($status) {
            'under_review' => 'Admin opened the application for active review.',
            'approved' => 'Admin approved the trainer application.',
            'needs_resubmission' => 'Admin requested updates before approval.',
            'rejected' => 'Admin rejected the trainer application.',
            default => 'Admin updated the trainer application status.',
        };
    }

    private function authorizeAdmin(Request $request): void
    {
        abort_unless($request->user()?->role === 'admin', 403, 'Admin access required.');
    }
}
