<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\Notification;
use App\Models\Practitioner;
use App\Models\TrainerAlert;
use App\Models\TrainerApplication;
use App\Models\TrainerCheckIn;
use App\Models\TrainerPlan;
use App\Models\TrainerPlanActivity;
use App\Models\TrainerTask;
use App\Models\User;
use App\Models\WorkflowCase;
use App\Services\ActivityLogService;
use App\Services\NotificationInboxService;
use App\Services\WorkflowConfigService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class TrainerWorkspaceController extends Controller
{
    public function __construct(
        private readonly ActivityLogService $activityLogs,
        private readonly NotificationInboxService $notifications,
    )
    {
    }

    public function accessStatus(Request $request): JsonResponse
    {
        $user = $request->user();

        abort_unless($user?->role === 'trainer', 403, 'Trainer access required.');

        if ($user->status === 'suspended') {
            return response()->json([
                'status' => 'suspended',
                'application' => null,
                'adminRemarks' => '',
            ]);
        }

        $application = TrainerApplication::query()
            ->where('applicant_user_id', $user->id)
            ->orWhere(function ($query) use ($user): void {
                $query->whereNull('applicant_user_id')
                    ->whereRaw('LOWER(applicant_email) = ?', [strtolower((string) $user->email)]);
            })
            ->latest('updated_at')
            ->first();

        if (!$application) {
            return response()->json([
                'status' => 'onboarding_pending',
                'application' => null,
                'adminRemarks' => '',
            ]);
        }

        return response()->json([
            'status' => match ($application->status) {
                'approved' => 'approved',
                'needs_resubmission' => 'needs_resubmission',
                'rejected' => 'rejected',
                'submitted', 'under_review' => 'pending_review',
                default => 'onboarding_pending',
            },
            'application' => [
                'applicationId' => (string) $application->application_id,
                'applicantUserId' => $application->applicant_user_id ? (string) $application->applicant_user_id : null,
                'status' => (string) $application->status,
                'applicantName' => (string) $application->applicant_name,
                'applicantEmail' => (string) $application->applicant_email,
                'applicantMobile' => (string) $application->applicant_mobile,
                'city' => (string) $application->city,
                'state' => (string) $application->state,
                'expertise' => array_values($application->expertise_json ?? []),
                'values' => is_array($application->values_json) ? $application->values_json : [],
                'currentScreen' => (string) ($application->current_screen ?? 'personalInfo'),
                'submittedAt' => optional($application->submitted_at)->toIso8601String() ?? optional($application->created_at)->toIso8601String() ?? now()->toIso8601String(),
                'updatedAt' => optional($application->updated_at)->toIso8601String() ?? now()->toIso8601String(),
                'adminRemarks' => (string) ($application->admin_remarks ?? ''),
                'reviewHistory' => array_values($application->review_history_json ?? []),
            ],
            'adminRemarks' => (string) ($application->admin_remarks ?? ''),
        ]);
    }

    public function dashboard(Request $request): JsonResponse
    {
        $practitioner = $this->practitioner($request);
        $this->synchronizeSignals($practitioner);
        $today = now()->startOfDay();
        $endOfDay = now()->endOfDay();
        $plans = TrainerPlan::query()->where('practitioner_id', $practitioner->id)->where('status', 'active')->get();
        $appointments = Appointment::query()
            ->where('practitioner_id', $practitioner->id)
            ->where('service_type', 'training')
            ->with('client:id,name,email')
            ->get();

        return response()->json([
            'snapshot' => [
                'todaySessions' => $appointments->whereBetween('starts_at', [$today, $endOfDay])->whereIn('status', ['scheduled', 'rescheduled'])->count(),
                'upcomingSessions' => $appointments->where('starts_at', '>=', now())->whereIn('status', ['scheduled', 'rescheduled'])->count(),
                'activeClients' => $plans->pluck('client_user_id')->merge($appointments->pluck('client_user_id'))->unique()->count(),
                'pendingFollowUps' => TrainerTask::query()->where('practitioner_id', $practitioner->id)->where('type', 'follow_up')->where('status', 'scheduled')->whereBetween('starts_at', [$today, $endOfDay])->count(),
                'highPriorityAlerts' => TrainerAlert::query()->where('practitioner_id', $practitioner->id)->where('priority', 'high')->whereNotIn('status', ['resolved'])->count(),
                'highRiskClients' => TrainerAlert::query()->where('practitioner_id', $practitioner->id)->where('priority', 'high')->whereNotIn('status', ['resolved'])->whereNotNull('client_user_id')->distinct('client_user_id')->count('client_user_id'),
                'lowAdherenceClients' => TrainerAlert::query()->where('practitioner_id', $practitioner->id)->where('type', 'low_adherence')->whereNotIn('status', ['resolved'])->distinct('client_user_id')->count('client_user_id'),
            ],
            'nextActions' => $this->nextActionsPayload($practitioner, $plans, $appointments),
            'dailySchedule' => $this->schedulePayload($practitioner, $today, $endOfDay),
            'notifications' => $this->notificationsPayload($request->user()),
            'priorityQueue' => TrainerAlert::query()
                ->where('practitioner_id', $practitioner->id)
                ->whereNotIn('status', ['resolved'])
                ->with('client:id,name,email')
                ->orderByRaw("CASE priority WHEN 'high' THEN 1 WHEN 'medium' THEN 2 ELSE 3 END")
                ->orderBy('due_at')
                ->latest('id')
                ->limit(20)
                ->get()
                ->map(fn (TrainerAlert $alert) => $this->alertPayload($alert))
                ->values(),
            'analytics' => $this->analyticsPayload($practitioner, $appointments),
        ]);
    }

    public function clients(Request $request): JsonResponse
    {
        $practitioner = $this->practitioner($request);
        $bookedClients = Appointment::query()
            ->where('practitioner_id', $practitioner->id)
            ->where('service_type', 'training')
            ->with('client:id,name,email')
            ->get()
            ->pluck('client')
            ->filter()
            ->keyBy('id');
        $assignedClients = TrainerPlan::query()
            ->where('practitioner_id', $practitioner->id)
            ->with('client:id,name,email')
            ->get()
            ->pluck('client')
            ->filter()
            ->keyBy('id');

        return response()->json([
            'clients' => $bookedClients->merge($assignedClients)->values()->map(fn (User $client) => [
                'id' => $client->id,
                'name' => $client->name,
                'email' => $client->email,
                'eligibleForPlan' => $bookedClients->has($client->id),
            ]),
        ]);
    }

    public function plans(Request $request): JsonResponse
    {
        $practitioner = $this->practitioner($request);
        $this->synchronizeSignals($practitioner);

        return response()->json([
            'plans' => TrainerPlan::query()
                ->where('practitioner_id', $practitioner->id)
                ->with(['client:id,name,email', 'activities' => fn ($query) => $query->orderBy('scheduled_for'), 'checkIns' => fn ($query) => $query->latest('checked_in_on')])
                ->latest('id')
                ->get()
                ->map(fn (TrainerPlan $plan) => $this->planPayload($plan))
                ->values(),
        ]);
    }

    public function storePlan(Request $request): JsonResponse
    {
        $practitioner = $this->practitioner($request);
        $validated = $request->validate([
            'clientUserId' => ['required', 'integer', 'exists:users,id'],
            'goalTitle' => ['required', 'string', 'max:160'],
            'goalDescription' => ['nullable', 'string', 'max:2000'],
            'startsOn' => ['required', 'date'],
            'targetDate' => ['nullable', 'date', 'after_or_equal:startsOn'],
        ]);
        $clientId = (int) $validated['clientUserId'];
        abort_unless(
            Appointment::query()->where('practitioner_id', $practitioner->id)->where('client_user_id', $clientId)->where('service_type', 'training')->exists(),
            422,
            'A training appointment with this client is required before assigning a plan.'
        );

        $plan = TrainerPlan::query()->create([
            'practitioner_id' => $practitioner->id,
            'client_user_id' => $clientId,
            'goal_title' => trim((string) $validated['goalTitle']),
            'goal_description' => trim((string) ($validated['goalDescription'] ?? '')),
            'starts_on' => $validated['startsOn'],
            'target_date' => $validated['targetDate'] ?? null,
            'status' => 'active',
        ]);
        $plan->load('client:id,name,email', 'activities', 'checkIns');
        $this->record($request, 'trainer_plan_created', sprintf('%s created a training plan for %s.', $request->user()->name, $plan->client->name), $plan);

        return response()->json(['message' => 'Training plan created.', 'plan' => $this->planPayload($plan)], 201);
    }

    public function updatePlan(Request $request, TrainerPlan $plan): JsonResponse
    {
        $this->authorizeOwnedPlan($request, $plan);
        $validated = $request->validate([
            'goalTitle' => ['sometimes', 'required', 'string', 'max:160'],
            'goalDescription' => ['nullable', 'string', 'max:2000'],
            'targetDate' => ['nullable', 'date'],
            'status' => ['sometimes', 'required', 'in:active,completed,paused,archived'],
        ]);
        $plan->fill([
            'goal_title' => $validated['goalTitle'] ?? $plan->goal_title,
            'goal_description' => array_key_exists('goalDescription', $validated) ? $validated['goalDescription'] : $plan->goal_description,
            'target_date' => array_key_exists('targetDate', $validated) ? $validated['targetDate'] : $plan->target_date,
            'status' => $validated['status'] ?? $plan->status,
        ])->save();

        return response()->json(['message' => 'Training plan updated.', 'plan' => $this->planPayload($plan->fresh()->load('client:id,name,email', 'activities', 'checkIns'))]);
    }

    public function storeActivity(Request $request, TrainerPlan $plan): JsonResponse
    {
        $this->authorizeOwnedPlan($request, $plan);
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:160'],
            'activityType' => ['nullable', 'string', 'max:80'],
            'scheduledFor' => ['required', 'date'],
            'notes' => ['nullable', 'string', 'max:2000'],
        ]);
        $activity = $plan->activities()->create([
            'title' => trim((string) $validated['title']),
            'activity_type' => trim((string) ($validated['activityType'] ?? 'workout')),
            'scheduled_for' => $validated['scheduledFor'],
            'notes' => trim((string) ($validated['notes'] ?? '')),
        ]);

        return response()->json(['message' => 'Workout activity scheduled.', 'activity' => $this->activityPayload($activity)], 201);
    }

    public function updateActivity(Request $request, TrainerPlanActivity $activity): JsonResponse
    {
        $activity->load('plan');
        $practitioner = $this->authorizeOwnedPlan($request, $activity->plan);
        $validated = $request->validate([
            'status' => ['required', 'in:scheduled,completed,missed,modified,cancelled'],
            'notes' => ['nullable', 'string', 'max:2000'],
        ]);
        $activity->fill([
            'status' => $validated['status'],
            'notes' => array_key_exists('notes', $validated) ? $validated['notes'] : $activity->notes,
            'completed_at' => $validated['status'] === 'completed' ? now() : null,
        ])->save();
        if ($activity->status === 'missed') {
            $this->notifyMissedActivity($practitioner, $activity);
        }
        $this->synchronizeSignals($practitioner);

        return response()->json(['message' => 'Activity status updated.', 'activity' => $this->activityPayload($activity->fresh())]);
    }

    public function checkIns(Request $request): JsonResponse
    {
        $practitioner = $this->practitioner($request);

        return response()->json([
            'checkIns' => TrainerCheckIn::query()
                ->where('practitioner_id', $practitioner->id)
                ->with(['client:id,name,email', 'plan:id,goal_title'])
                ->latest('checked_in_on')
                ->latest('id')
                ->limit(100)
                ->get()
                ->map(fn (TrainerCheckIn $checkIn) => $this->checkInPayload($checkIn))
                ->values(),
        ]);
    }

    public function storeCheckIn(Request $request): JsonResponse
    {
        $practitioner = $this->practitioner($request);
        $validated = $request->validate([
            'planId' => ['required', 'integer', 'exists:trainer_plans,id'],
            'checkedInOn' => ['required', 'date'],
            'weightKg' => ['nullable', 'numeric', 'min:20', 'max:400'],
            'goalProgressPercent' => ['required', 'integer', 'min:0', 'max:100'],
            'notes' => ['nullable', 'string', 'max:4000'],
            'painReported' => ['required', 'boolean'],
            'painSeverity' => ['nullable', 'required_if:painReported,true', 'in:mild,moderate,severe'],
            'painNotes' => ['nullable', 'string', 'max:2000'],
            'activityUpdates' => ['nullable', 'array'],
            'activityUpdates.*.id' => ['required', 'integer', 'exists:trainer_plan_activities,id'],
            'activityUpdates.*.status' => ['required', 'in:completed,missed,modified,cancelled'],
        ]);
        $plan = TrainerPlan::query()->findOrFail($validated['planId']);
        abort_unless($plan->practitioner_id === $practitioner->id, 403, 'This training plan is not assigned to you.');

        $checkIn = DB::transaction(function () use ($validated, $plan, $practitioner): TrainerCheckIn {
            foreach ($validated['activityUpdates'] ?? [] as $update) {
                $activity = TrainerPlanActivity::query()->where('trainer_plan_id', $plan->id)->findOrFail($update['id']);
                $activity->update([
                    'status' => $update['status'],
                    'completed_at' => $update['status'] === 'completed' ? now() : null,
                ]);
            }

            return TrainerCheckIn::query()->create([
                'trainer_plan_id' => $plan->id,
                'practitioner_id' => $practitioner->id,
                'client_user_id' => $plan->client_user_id,
                'checked_in_on' => $validated['checkedInOn'],
                'weight_kg' => $validated['weightKg'] ?? null,
                'goal_progress_percent' => $validated['goalProgressPercent'],
                'notes' => trim((string) ($validated['notes'] ?? '')),
                'pain_reported' => $validated['painReported'],
                'pain_severity' => $validated['painReported'] ? $validated['painSeverity'] : null,
                'pain_notes' => $validated['painReported'] ? trim((string) ($validated['painNotes'] ?? '')) : null,
            ]);
        });
        $checkIn->load('client:id,name,email', 'plan:id,goal_title');

        foreach ($validated['activityUpdates'] ?? [] as $update) {
            if ($update['status'] === 'missed') {
                $this->notifyMissedActivity($practitioner, TrainerPlanActivity::query()->findOrFail($update['id']));
            }
        }

        if ($checkIn->pain_reported) {
            $alert = TrainerAlert::query()->create([
                'practitioner_id' => $practitioner->id,
                'client_user_id' => $checkIn->client_user_id,
                'trainer_plan_id' => $plan->id,
                'trainer_check_in_id' => $checkIn->id,
                'type' => 'pain_injury',
                'priority' => $checkIn->pain_severity === 'severe' ? 'high' : 'medium',
                'summary' => sprintf('%s reported %s pain or injury concerns.', $checkIn->client->name, $checkIn->pain_severity),
                'due_at' => now()->addHours($checkIn->pain_severity === 'severe' ? 2 : 24),
            ]);
            $this->notify($request->user(), 'trainer_pain_alert', $alert->summary, ['alertId' => $alert->id, 'clientId' => $checkIn->client_user_id]);
            $this->record($request, 'trainer_pain_alert_created', $alert->summary, $alert);
        }

        $this->synchronizeSignals($practitioner);
        $this->record($request, 'trainer_check_in_submitted', sprintf('%s recorded a check-in for %s.', $request->user()->name, $checkIn->client->name), $checkIn);

        return response()->json(['message' => 'Check-in recorded.', 'checkIn' => $this->checkInPayload($checkIn)], 201);
    }

    public function tasks(Request $request): JsonResponse
    {
        $practitioner = $this->practitioner($request);
        $this->synchronizeSignals($practitioner);

        return response()->json([
            'tasks' => TrainerTask::query()
                ->where('practitioner_id', $practitioner->id)
                ->with('client:id,name,email')
                ->orderBy('starts_at')
                ->get()
                ->map(fn (TrainerTask $task) => $this->taskPayload($task))
                ->values(),
        ]);
    }

    public function storeTask(Request $request): JsonResponse
    {
        $practitioner = $this->practitioner($request);
        $validated = $request->validate([
            'clientUserId' => ['nullable', 'integer', 'exists:users,id'],
            'planId' => ['nullable', 'integer', 'exists:trainer_plans,id'],
            'alertId' => ['nullable', 'integer', 'exists:trainer_alerts,id'],
            'type' => ['required', 'in:call,follow_up'],
            'title' => ['required', 'string', 'max:160'],
            'startsAt' => ['required', 'date'],
            'endsAt' => ['required', 'date', 'after:startsAt'],
            'notes' => ['nullable', 'string', 'max:2000'],
        ]);
        if (!empty($validated['planId'])) {
            abort_unless(TrainerPlan::query()->where('id', $validated['planId'])->where('practitioner_id', $practitioner->id)->exists(), 403, 'This plan is not assigned to you.');
        }
        $sourceAlert = null;
        if (!empty($validated['alertId'])) {
            $sourceAlert = TrainerAlert::query()->where('id', $validated['alertId'])->where('practitioner_id', $practitioner->id)->first();
            abort_unless($sourceAlert, 403, 'This alert is not assigned to you.');
        }
        if (!empty($validated['clientUserId'])) {
            abort_unless($this->trainerCanAccessClient($practitioner, (int) $validated['clientUserId']), 422, 'This client is not connected to your trainer workspace.');
        }
        $task = TrainerTask::query()->create([
            'practitioner_id' => $practitioner->id,
            'client_user_id' => $validated['clientUserId'] ?? $sourceAlert?->client_user_id,
            'trainer_plan_id' => $validated['planId'] ?? $sourceAlert?->trainer_plan_id,
            'trainer_alert_id' => $validated['alertId'] ?? null,
            'type' => $validated['type'],
            'title' => trim((string) $validated['title']),
            'starts_at' => $validated['startsAt'],
            'ends_at' => $validated['endsAt'],
            'notes' => trim((string) ($validated['notes'] ?? '')),
        ]);
        if ($task->trainer_alert_id) {
            TrainerAlert::query()->whereKey($task->trainer_alert_id)->update(['status' => 'scheduled_follow_up']);
        }
        $this->record($request, 'trainer_follow_up_scheduled', sprintf('%s scheduled %s.', $request->user()->name, str_replace('_', ' ', $task->type)), $task);

        return response()->json(['message' => 'Schedule task created.', 'task' => $this->taskPayload($task->fresh()->load('client:id,name,email'))], 201);
    }

    public function updateTask(Request $request, TrainerTask $task): JsonResponse
    {
        $practitioner = $this->practitioner($request);
        abort_unless($task->practitioner_id === $practitioner->id, 403, 'This task is not assigned to you.');
        $validated = $request->validate([
            'status' => ['sometimes', 'required', 'in:scheduled,completed,cancelled'],
            'startsAt' => ['sometimes', 'required', 'date'],
            'endsAt' => ['sometimes', 'required', 'date'],
            'notes' => ['nullable', 'string', 'max:2000'],
        ]);
        $task->fill([
            'status' => $validated['status'] ?? $task->status,
            'starts_at' => $validated['startsAt'] ?? $task->starts_at,
            'ends_at' => $validated['endsAt'] ?? $task->ends_at,
            'notes' => array_key_exists('notes', $validated) ? $validated['notes'] : $task->notes,
        ])->save();
        if (($validated['status'] ?? null) === 'completed' && $task->trainer_alert_id) {
            TrainerAlert::query()->whereKey($task->trainer_alert_id)->update(['status' => 'resolved', 'resolved_at' => now()]);
        }
        if (($validated['status'] ?? null) === 'completed') {
            $this->record($request, 'trainer_follow_up_completed', sprintf('%s completed %s.', $request->user()->name, str_replace('_', ' ', $task->type)), $task);
        }

        return response()->json(['message' => 'Schedule task updated.', 'task' => $this->taskPayload($task->fresh()->load('client:id,name,email'))]);
    }

    public function updateAlert(Request $request, TrainerAlert $alert): JsonResponse
    {
        $practitioner = $this->practitioner($request);
        abort_unless($alert->practitioner_id === $practitioner->id, 403, 'This alert is not assigned to you.');
        $validated = $request->validate([
            'action' => ['required', 'in:acknowledge,resolve,escalate'],
            'note' => ['nullable', 'string', 'max:2000'],
        ]);

        if ($validated['action'] === 'acknowledge') {
            $alert->update(['status' => 'acknowledged', 'acknowledged_at' => now()]);
        } elseif ($validated['action'] === 'resolve') {
            $alert->update(['status' => 'resolved', 'resolved_at' => now()]);
            $this->record($request, 'trainer_alert_resolved', sprintf('%s resolved trainer alert #%d.', $request->user()->name, $alert->id), $alert);
        } else {
            abort_unless($alert->type === 'pain_injury', 422, 'Only pain or injury alerts may be escalated.');
            $alert->load('client:id,name,email', 'checkIn');
            WorkflowCase::query()->create([
                'workflow_key' => WorkflowConfigService::TRAINER_SAFETY_ESCALATION,
                'subject_type' => TrainerAlert::class,
                'subject_id' => $alert->id,
                'status' => 'open',
                'priority' => 'high',
                'owner_role' => 'admin',
                'due_at' => now()->addHours(2),
                'meta_json' => [
                    'title' => sprintf('Training safety escalation for %s', optional($alert->client)->name),
                    'summary' => $alert->summary,
                    'clientName' => optional($alert->client)->name,
                    'clientEmail' => optional($alert->client)->email,
                    'severity' => optional($alert->checkIn)->pain_severity,
                    'trainerNote' => $validated['note'] ?? '',
                    'history' => [],
                ],
            ]);
            $alert->update(['status' => 'escalated', 'escalated_at' => now()]);
            $this->record($request, 'trainer_pain_alert_escalated', sprintf('%s escalated a training safety alert for admin review.', $request->user()->name), $alert);
        }

        return response()->json(['message' => 'Alert updated.', 'alert' => $this->alertPayload($alert->fresh()->load('client:id,name,email'))]);
    }

    public function updateNotification(Request $request, Notification $notification): JsonResponse
    {
        abort_unless($notification->user_id === $request->user()->id, 403, 'This notification is not assigned to you.');
        $validated = $request->validate(['read' => ['required', 'boolean']]);
        $notification = $this->notifications->updateReadState($notification, (bool) $validated['read']);

        return response()->json(['message' => 'Notification updated.', 'notification' => $this->notifications->payload($notification)]);
    }

    private function practitioner(Request $request): Practitioner
    {
        $practitioner = Practitioner::query()->where('user_id', $request->user()->id)->where('practitioner_type', 'trainer')->first();
        abort_unless($practitioner && $practitioner->is_active, 403, 'Active trainer practitioner profile required.');

        return $practitioner;
    }

    private function authorizeOwnedPlan(Request $request, TrainerPlan $plan): Practitioner
    {
        $practitioner = $this->practitioner($request);
        abort_unless($plan->practitioner_id === $practitioner->id, 403, 'This training plan is not assigned to you.');

        return $practitioner;
    }

    private function trainerCanAccessClient(Practitioner $practitioner, int $clientId): bool
    {
        return Appointment::query()
            ->where('practitioner_id', $practitioner->id)
            ->where('client_user_id', $clientId)
            ->where('service_type', 'training')
            ->exists()
            || TrainerPlan::query()
                ->where('practitioner_id', $practitioner->id)
                ->where('client_user_id', $clientId)
                ->exists();
    }

    private function synchronizeSignals(Practitioner $practitioner): void
    {
        $missedActivities = TrainerPlanActivity::query()
            ->whereHas('plan', fn ($query) => $query->where('practitioner_id', $practitioner->id))
            ->where('status', 'scheduled')
            ->whereDate('scheduled_for', '<', today())
            ->with('plan.client:id,name')
            ->get();
        foreach ($missedActivities as $activity) {
            $activity->update(['status' => 'missed']);
            $this->notifyMissedActivity($practitioner, $activity);
        }

        TrainerPlan::query()->where('practitioner_id', $practitioner->id)->where('status', 'active')->with('client:id,name')->get()->each(function (TrainerPlan $plan) use ($practitioner): void {
            $outcomes = $plan->activities()->whereDate('scheduled_for', '>=', today()->subDays(6))->whereIn('status', ['completed', 'missed'])->get();
            if ($outcomes->isEmpty()) {
                return;
            }
            $adherence = round(($outcomes->where('status', 'completed')->count() / $outcomes->count()) * 100, 1);
            $existing = TrainerAlert::query()->where('trainer_plan_id', $plan->id)->where('type', 'low_adherence')->whereNotIn('status', ['resolved'])->first();
            if ($adherence < 70) {
                if (!$existing) {
                    $alert = TrainerAlert::query()->create([
                        'practitioner_id' => $practitioner->id,
                        'client_user_id' => $plan->client_user_id,
                        'trainer_plan_id' => $plan->id,
                        'type' => 'low_adherence',
                        'priority' => 'medium',
                        'summary' => sprintf('%s adherence is %.1f%% over the last 7 days.', optional($plan->client)->name, $adherence),
                        'due_at' => now()->addDay(),
                    ]);
                    $this->notify($practitioner->user, 'trainer_low_adherence', $alert->summary, ['alertId' => $alert->id, 'clientId' => $plan->client_user_id]);
                }
            } elseif ($existing) {
                $existing->update(['status' => 'resolved', 'resolved_at' => now()]);
            }
        });

        TrainerTask::query()->where('practitioner_id', $practitioner->id)->where('status', 'scheduled')->where('ends_at', '<', now())->with('client:id,name')->get()->each(function (TrainerTask $task) use ($practitioner): void {
            if (!TrainerAlert::query()->where('practitioner_id', $practitioner->id)->where('type', 'follow_up_due')->where('summary', 'like', "%#{$task->id}%")->whereNotIn('status', ['resolved'])->exists()) {
                $alert = TrainerAlert::query()->create([
                    'practitioner_id' => $practitioner->id,
                    'client_user_id' => $task->client_user_id,
                    'trainer_plan_id' => $task->trainer_plan_id,
                    'type' => 'follow_up_due',
                    'priority' => 'low',
                    'summary' => sprintf('Follow-up task #%d is overdue%s.', $task->id, $task->client ? ' for ' . $task->client->name : ''),
                    'due_at' => $task->ends_at,
                ]);
                $this->notify($practitioner->user, 'trainer_follow_up_due', $alert->summary, ['alertId' => $alert->id, 'taskId' => $task->id]);
            }
        });

        Appointment::query()->where('practitioner_id', $practitioner->id)->where('service_type', 'training')->with('client:id,name')->get()->pluck('client')->filter()->unique('id')->each(function (User $client) use ($practitioner): void {
            if (!Notification::query()->where('user_id', $practitioner->user_id)->where('type', 'trainer_new_client')->where('payload_json->clientId', $client->id)->exists()) {
                $this->notify($practitioner->user, 'trainer_new_client', sprintf('%s booked their first training session with you.', $client->name), ['clientId' => $client->id]);
            }
        });
    }

    private function schedulePayload(Practitioner $practitioner, Carbon $from, Carbon $to): array
    {
        $sessions = Appointment::query()->where('practitioner_id', $practitioner->id)->whereBetween('starts_at', [$from, $to])->with('client:id,name,email')->get()->map(fn (Appointment $appointment) => [
            'id' => 'appointment-' . $appointment->id,
            'sourceId' => $appointment->id,
            'type' => 'session',
            'title' => 'Training session',
            'clientName' => optional($appointment->client)->name,
            'startsAt' => optional($appointment->starts_at)->toIso8601String(),
            'endsAt' => optional($appointment->ends_at)->toIso8601String(),
            'status' => $appointment->status,
            'locationMode' => $appointment->mode,
        ]);
        $tasks = TrainerTask::query()->where('practitioner_id', $practitioner->id)->whereBetween('starts_at', [$from, $to])->with('client:id,name,email')->get()->map(fn (TrainerTask $task) => $this->taskPayload($task));

        return $sessions->concat($tasks)->sortBy('startsAt')->values()->all();
    }

    private function analyticsPayload(Practitioner $practitioner, $appointments): array
    {
        $labels = collect(range(6, 0))->map(fn (int $offset) => today()->subDays($offset)->format('d M'));
        $dateKeys = collect(range(6, 0))->map(fn (int $offset) => today()->subDays($offset)->toDateString());
        $currentWeekStart = today()->subDays(6);
        $previousWeekStart = today()->subDays(13);
        $previousWeekEnd = today()->subDays(7)->endOfDay();
        $attendance = $dateKeys->map(function (string $date) use ($appointments): array {
            $items = $appointments->filter(fn (Appointment $appointment) => optional($appointment->starts_at)->toDateString() === $date);
            return ['completed' => $items->where('status', 'completed')->count(), 'missed' => $items->where('status', 'no_show')->count()];
        });
        $activities = TrainerPlanActivity::query()->whereHas('plan', fn ($query) => $query->where('practitioner_id', $practitioner->id))->whereDate('scheduled_for', '>=', $previousWeekStart)->get();
        $checkIns = TrainerCheckIn::query()->where('practitioner_id', $practitioner->id)->whereDate('checked_in_on', '>=', today()->subDays(6))->with('client:id,name')->get();
        $weightCheckIns = TrainerCheckIn::query()->where('practitioner_id', $practitioner->id)->whereNotNull('weight_kg')->with('client:id,name')->orderBy('checked_in_on')->get();
        $currentAppointments = $appointments->filter(fn (Appointment $appointment) => $appointment->status === 'completed' && optional($appointment->starts_at)?->between($currentWeekStart, today()->endOfDay()));
        $previousAppointments = $appointments->filter(fn (Appointment $appointment) => $appointment->status === 'completed' && optional($appointment->starts_at)?->between($previousWeekStart, $previousWeekEnd));
        $currentActivities = $activities->filter(fn (TrainerPlanActivity $activity) => optional($activity->scheduled_for)?->between($currentWeekStart, today()->endOfDay()) && in_array($activity->status, ['completed', 'missed'], true));
        $previousActivities = $activities->filter(fn (TrainerPlanActivity $activity) => optional($activity->scheduled_for)?->between($previousWeekStart, $previousWeekEnd) && in_array($activity->status, ['completed', 'missed'], true));

        return [
            'labels' => $labels->all(),
            'attendance' => [
                'completed' => $attendance->pluck('completed')->all(),
                'missed' => $attendance->pluck('missed')->all(),
            ],
            'adherence' => $dateKeys->map(function (string $date) use ($activities): ?float {
                $items = $activities->filter(fn (TrainerPlanActivity $activity) => optional($activity->scheduled_for)->toDateString() === $date && in_array($activity->status, ['completed', 'missed'], true));
                return $items->isEmpty() ? null : round(($items->where('status', 'completed')->count() / $items->count()) * 100, 1);
            })->all(),
            'goalProgress' => $dateKeys->map(function (string $date) use ($checkIns): ?float {
                $items = $checkIns->filter(fn (TrainerCheckIn $checkIn) => optional($checkIn->checked_in_on)->toDateString() === $date);
                return $items->isEmpty() ? null : round((float) $items->avg('goal_progress_percent'), 1);
            })->all(),
            'weightSeries' => $weightCheckIns->groupBy('client_user_id')->map(fn ($items) => [
                'clientId' => $items->first()->client_user_id,
                'clientName' => optional($items->first()->client)->name,
                'points' => $items->sortBy('checked_in_on')->map(fn (TrainerCheckIn $checkIn) => [
                    'date' => optional($checkIn->checked_in_on)->format('Y-m-d'),
                    'weightKg' => (float) $checkIn->weight_kg,
                ])->values()->all(),
            ])->values()->all(),
            'weeklyPerformance' => [
                'completedSessions' => ['current' => $currentAppointments->count(), 'previous' => $previousAppointments->count()],
                'averageAdherence' => [
                    'current' => $currentActivities->isEmpty() ? null : round(($currentActivities->where('status', 'completed')->count() / $currentActivities->count()) * 100, 1),
                    'previous' => $previousActivities->isEmpty() ? null : round(($previousActivities->where('status', 'completed')->count() / $previousActivities->count()) * 100, 1),
                ],
                'clientHours' => [
                    'current' => round((float) $currentAppointments->sum(fn (Appointment $appointment) => optional($appointment->starts_at)->diffInMinutes($appointment->ends_at) / 60), 1),
                    'previous' => round((float) $previousAppointments->sum(fn (Appointment $appointment) => optional($appointment->starts_at)->diffInMinutes($appointment->ends_at) / 60), 1),
                ],
            ],
        ];
    }

    private function notificationsPayload(User $user): array
    {
        $relevantTypes = ['trainer_missed_workout', 'trainer_pain_alert', 'trainer_low_adherence', 'trainer_follow_up_due'];
        return $this->notifications->inboxPayload($user, $relevantTypes, 20);
    }

    private function nextActionsPayload(Practitioner $practitioner, $plans, $appointments): array
    {
        $actions = [];

        $highRiskClients = TrainerAlert::query()
            ->where('practitioner_id', $practitioner->id)
            ->where('priority', 'high')
            ->whereNotIn('status', ['resolved'])
            ->whereNotNull('client_user_id')
            ->distinct('client_user_id')
            ->count('client_user_id');
        if ($highRiskClients > 0) {
            $actions[] = [
                'id' => 'review-high-risk',
                'kind' => 'review_high_risk',
                'title' => 'Review high-risk clients',
                'description' => 'High-priority safety concerns need trainer attention.',
                'priority' => 'high',
                'count' => $highRiskClients,
                'to' => '/trainer',
                'ctaLabel' => 'Open priority queue',
            ];
        }

        $overdueFollowUps = TrainerTask::query()
            ->where('practitioner_id', $practitioner->id)
            ->where('type', 'follow_up')
            ->where('status', 'scheduled')
            ->where('ends_at', '<', now())
            ->count();
        $openFollowUpAlerts = TrainerAlert::query()
            ->where('practitioner_id', $practitioner->id)
            ->where('type', 'follow_up_due')
            ->whereNotIn('status', ['resolved'])
            ->count();
        $followUpCount = max($overdueFollowUps, $openFollowUpAlerts);
        if ($followUpCount > 0) {
            $actions[] = [
                'id' => 'complete-follow-up',
                'kind' => 'complete_follow_up',
                'title' => 'Complete overdue follow-ups',
                'description' => 'Scheduled follow-ups have passed their due time and need closure.',
                'priority' => 'high',
                'count' => $followUpCount,
                'to' => '/trainer',
                'ctaLabel' => 'Review follow-ups',
            ];
        }

        $lowAdherenceClients = TrainerAlert::query()
            ->where('practitioner_id', $practitioner->id)
            ->where('type', 'low_adherence')
            ->whereNotIn('status', ['resolved'])
            ->whereNotNull('client_user_id')
            ->distinct('client_user_id')
            ->count('client_user_id');
        if ($lowAdherenceClients > 0) {
            $actions[] = [
                'id' => 'resolve-low-adherence',
                'kind' => 'resolve_low_adherence',
                'title' => 'Resolve low adherence',
                'description' => 'Clients are slipping below target adherence and need intervention.',
                'priority' => 'medium',
                'count' => $lowAdherenceClients,
                'to' => '/trainer',
                'ctaLabel' => 'Open adherence alerts',
            ];
        }

        $plansMissingTodayCheckIn = TrainerPlan::query()
            ->where('practitioner_id', $practitioner->id)
            ->where('status', 'active')
            ->whereDoesntHave('checkIns', fn ($query) => $query->whereDate('checked_in_on', today()))
            ->count();
        if ($plansMissingTodayCheckIn > 0) {
            $actions[] = [
                'id' => 'log-check-in',
                'kind' => 'log_check_in',
                'title' => 'Log today\'s check-ins',
                'description' => 'Active plans are missing today\'s workout progress update.',
                'priority' => 'medium',
                'count' => $plansMissingTodayCheckIn,
                'to' => '/trainer/check-ins',
                'ctaLabel' => 'Go to check-ins',
            ];
        }

        $bookedClientIds = $appointments->pluck('client_user_id')->filter()->unique();
        $plannedClientIds = $plans->pluck('client_user_id')->filter()->unique();
        $clientsNeedingPlans = $bookedClientIds->diff($plannedClientIds)->count();
        if ($clientsNeedingPlans > 0) {
            $actions[] = [
                'id' => 'create-plan',
                'kind' => 'create_plan',
                'title' => 'Create missing workout plans',
                'description' => 'Booked training clients still need an active plan assigned.',
                'priority' => 'low',
                'count' => $clientsNeedingPlans,
                'to' => '/trainer/plans',
                'ctaLabel' => 'Create plans',
            ];
        }

        return array_slice($actions, 0, 3);
    }

    private function planPayload(TrainerPlan $plan): array
    {
        $outcomes = $plan->activities->whereIn('status', ['completed', 'missed'])->filter(fn (TrainerPlanActivity $activity) => $activity->scheduled_for->gte(today()->subDays(6)));
        $adherence = $outcomes->isEmpty() ? null : round(($outcomes->where('status', 'completed')->count() / $outcomes->count()) * 100, 1);

        return [
            'id' => $plan->id,
            'clientUserId' => $plan->client_user_id,
            'clientName' => optional($plan->client)->name,
            'clientEmail' => optional($plan->client)->email,
            'goalTitle' => $plan->goal_title,
            'goalDescription' => $plan->goal_description,
            'startsOn' => optional($plan->starts_on)->format('Y-m-d'),
            'targetDate' => optional($plan->target_date)->format('Y-m-d'),
            'status' => $plan->status,
            'weeklyAdherence' => $adherence,
            'latestProgress' => optional($plan->checkIns->first())->goal_progress_percent,
            'activities' => $plan->activities->map(fn (TrainerPlanActivity $activity) => $this->activityPayload($activity))->values(),
        ];
    }

    private function activityPayload(TrainerPlanActivity $activity): array
    {
        return ['id' => $activity->id, 'title' => $activity->title, 'activityType' => $activity->activity_type, 'scheduledFor' => optional($activity->scheduled_for)->format('Y-m-d'), 'status' => $activity->status, 'notes' => $activity->notes];
    }

    private function checkInPayload(TrainerCheckIn $checkIn): array
    {
        return ['id' => $checkIn->id, 'planId' => $checkIn->trainer_plan_id, 'planTitle' => optional($checkIn->plan)->goal_title, 'clientName' => optional($checkIn->client)->name, 'checkedInOn' => optional($checkIn->checked_in_on)->format('Y-m-d'), 'weightKg' => $checkIn->weight_kg === null ? null : (float) $checkIn->weight_kg, 'goalProgressPercent' => $checkIn->goal_progress_percent, 'notes' => $checkIn->notes, 'painReported' => $checkIn->pain_reported, 'painSeverity' => $checkIn->pain_severity, 'painNotes' => $checkIn->pain_notes];
    }

    private function taskPayload(TrainerTask $task): array
    {
        return ['id' => 'task-' . $task->id, 'sourceId' => $task->id, 'type' => $task->type, 'title' => $task->title, 'clientName' => optional($task->client)->name, 'startsAt' => optional($task->starts_at)->toIso8601String(), 'endsAt' => optional($task->ends_at)->toIso8601String(), 'status' => $task->status, 'notes' => $task->notes];
    }

    private function alertPayload(TrainerAlert $alert): array
    {
        return ['id' => $alert->id, 'type' => $alert->type, 'priority' => $alert->priority, 'status' => $alert->status, 'summary' => $alert->summary, 'clientName' => optional($alert->client)->name, 'dueAt' => optional($alert->due_at)->toIso8601String()];
    }

    private function notify(User $user, string $type, string $message, array $meta): void
    {
        Notification::query()->create(['user_id' => $user->id, 'type' => $type, 'channel' => 'in_app', 'payload_json' => ['message' => $message] + $meta, 'status' => 'sent', 'sent_at' => now()]);
    }

    private function notifyMissedActivity(Practitioner $practitioner, TrainerPlanActivity $activity): void
    {
        $activity->loadMissing('plan.client:id,name');
        if (Notification::query()->where('user_id', $practitioner->user_id)->where('type', 'trainer_missed_workout')->where('payload_json->activityId', $activity->id)->exists()) {
            return;
        }

        $this->notify(
            $practitioner->user,
            'trainer_missed_workout',
            sprintf('%s missed %s.', optional(optional($activity->plan)->client)->name, $activity->title),
            ['activityId' => $activity->id, 'clientId' => optional($activity->plan)->client_user_id]
        );
    }

    private function record(Request $request, string $action, string $summary, $subject): void
    {
        $this->activityLogs->record('trainer_workspace', $action, $summary, ['actor' => $request->user(), 'subject' => $subject, 'audienceUsers' => [$request->user()]]);
    }
}
