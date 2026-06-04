<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\AppointmentEvent;
use App\Models\CbtCarePlan;
use App\Models\CbtExerciseTemplate;
use App\Models\CbtRiskEvent;
use App\Models\CounsellorAssessmentResult;
use App\Models\CounsellorSessionNote;
use App\Models\IntakeAnswer;
use App\Models\Practitioner;
use App\Models\User;
use App\Services\ActivityLogService;
use App\Services\MembershipEntitlementService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class CounsellorSessionController extends Controller
{
    private const ASSESSMENT_TYPES = ['phq_9', 'gad_7', 'dass_21', 'pss', 'bdi_ii'];
    private const HOMEWORK_SLUGS = ['thought-record', 'mood-diary', 'gratitude-journal', 'exposure-exercise', 'behavioural-activation'];

    public function __construct(
        private readonly ActivityLogService $activityLogs,
        private readonly MembershipEntitlementService $entitlements,
    ) {
    }

    public function index(Request $request): JsonResponse
    {
        $practitioner = $this->counsellorPractitioner($request);
        $appointments = Appointment::query()
            ->where('practitioner_id', $practitioner->id)
            ->whereBetween('starts_at', [today()->startOfDay(), today()->endOfDay()])
            ->with(['client.clientProfile', 'intakeFlow', 'events', 'practitioner.user'])
            ->orderBy('starts_at')
            ->get();

        return response()->json([
            'sessions' => $appointments
                ->map(fn (Appointment $appointment) => $this->queuePayload($appointment, $this->noteFor($appointment), $practitioner))
                ->values(),
        ]);
    }

    public function show(Request $request, Appointment $appointment): JsonResponse
    {
        $practitioner = $this->authorizeAppointment($request, $appointment);
        $appointment->loadMissing(['client.clientProfile', 'intakeFlow.answers', 'events', 'practitioner.user']);
        $note = $this->noteFor($appointment);

        return response()->json($this->workspacePayload($appointment, $note, $practitioner));
    }

    public function start(Request $request, Appointment $appointment): JsonResponse
    {
        $practitioner = $this->authorizeAppointment($request, $appointment);
        abort_if($appointment->status === 'cancelled', 422, 'Cancelled sessions cannot be started.');

        $note = $this->noteFor($appointment);
        $note->update([
            'workflow_state' => 'in_progress',
            'started_at' => $note->started_at ?? now(),
        ]);

        $this->recordActivity($request, 'counsellor_session_started', sprintf('%s started session #%d.', $request->user()->name, $appointment->id), $appointment);

        return response()->json($this->workspacePayload($appointment->fresh(['client.clientProfile', 'intakeFlow.answers', 'events', 'practitioner.user']), $note->fresh(), $practitioner));
    }

    public function saveNotes(Request $request, Appointment $appointment): JsonResponse
    {
        $practitioner = $this->authorizeAppointment($request, $appointment);
        $validated = $request->validate([
            'subjective' => ['nullable', 'string', 'max:12000'],
            'objective' => ['nullable', 'string', 'max:12000'],
            'assessment' => ['nullable', 'string', 'max:12000'],
            'plan' => ['nullable', 'string', 'max:12000'],
        ]);

        $note = $this->noteFor($appointment);
        $note->update($validated + [
            'workflow_state' => $note->workflow_state === 'upcoming' ? 'in_progress' : $note->workflow_state,
            'started_at' => $note->started_at ?? now(),
        ]);

        $this->recordActivity($request, 'counsellor_session_notes_saved', sprintf('%s saved session notes for appointment #%d.', $request->user()->name, $appointment->id), $appointment);

        return response()->json($this->workspacePayload($appointment->fresh(['client.clientProfile', 'intakeFlow.answers', 'events', 'practitioner.user']), $note->fresh(), $practitioner));
    }

    public function complete(Request $request, Appointment $appointment): JsonResponse
    {
        $practitioner = $this->authorizeAppointment($request, $appointment);
        abort_if($appointment->status === 'cancelled', 422, 'Cancelled sessions cannot be completed.');
        abort_if($appointment->status === 'completed', 422, 'This session is already completed.');

        $note = $this->noteFor($appointment);
        abort_unless($this->hasSoapNotes($note), 422, 'Save SOAP notes before completing the session.');

        DB::transaction(function () use ($appointment, $note, $request): void {
            $appointment->update(['status' => 'completed']);
            $note->update([
                'workflow_state' => 'completed',
                'completed_at' => now(),
            ]);

            AppointmentEvent::query()->create([
                'appointment_id' => $appointment->id,
                'event_type' => 'completed',
                'actor_user_id' => $request->user()->id,
                'meta_json' => ['source' => 'counsellor_session_workspace'],
                'created_at' => now(),
            ]);

            $this->entitlements->completeAppointment($appointment, $request->user()->id);
        });

        $this->recordActivity($request, 'counsellor_session_completed', sprintf('%s completed appointment #%d.', $request->user()->name, $appointment->id), $appointment);

        return response()->json($this->workspacePayload($appointment->fresh(['client.clientProfile', 'intakeFlow.answers', 'events', 'practitioner.user']), $note->fresh(), $practitioner));
    }

    public function followUp(Request $request, Appointment $appointment): JsonResponse
    {
        $practitioner = $this->authorizeAppointment($request, $appointment);
        $validated = $request->validate([
            'next_action' => ['nullable', 'string', 'max:1000'],
        ]);

        $note = $this->noteFor($appointment);
        $note->update([
            'workflow_state' => 'follow_up_required',
            'next_action' => $validated['next_action'] ?? 'Schedule follow-up appointment.',
            'follow_up_requested_at' => now(),
        ]);

        $this->recordActivity($request, 'counsellor_follow_up_required', sprintf('%s marked appointment #%d for follow-up.', $request->user()->name, $appointment->id), $appointment);

        return response()->json($this->workspacePayload($appointment->fresh(['client.clientProfile', 'intakeFlow.answers', 'events', 'practitioner.user']), $note->fresh(), $practitioner));
    }

    public function escalate(Request $request, Appointment $appointment): JsonResponse
    {
        $practitioner = $this->authorizeAppointment($request, $appointment);
        $validated = $request->validate([
            'reason' => ['nullable', 'string', 'max:1000'],
            'risk_level' => ['nullable', Rule::in(['high', 'critical'])],
        ]);

        $note = $this->noteFor($appointment);
        $riskEvent = DB::transaction(function () use ($appointment, $note, $practitioner, $validated): CbtRiskEvent {
            $note->update([
                'workflow_state' => 'escalated',
                'next_action' => $validated['reason'] ?? 'Escalated for urgent review.',
                'escalated_at' => now(),
            ]);

            return CbtRiskEvent::query()->create([
                'client_id' => $appointment->client_user_id,
                'care_plan_id' => $this->activeCbtPlan($appointment->client_user_id, $practitioner)?->id,
                'risk_type' => 'clinical_escalation',
                'risk_level' => $validated['risk_level'] ?? 'high',
                'trigger_text' => $validated['reason'] ?? 'Clinical escalation requested from session workspace.',
                'action_taken' => 'Counsellor escalated from session workspace.',
                'alerted_practitioner_id' => $practitioner->user_id,
                'status' => 'open',
            ]);
        });

        $this->recordActivity($request, 'counsellor_session_escalated', sprintf('%s escalated appointment #%d.', $request->user()->name, $appointment->id), $riskEvent);

        return response()->json($this->workspacePayload($appointment->fresh(['client.clientProfile', 'intakeFlow.answers', 'events', 'practitioner.user']), $note->fresh(), $practitioner));
    }

    public function storeAssessment(Request $request, Appointment $appointment): JsonResponse
    {
        $practitioner = $this->authorizeAppointment($request, $appointment);
        $validated = $request->validate([
            'assessment_type' => ['required', Rule::in(self::ASSESSMENT_TYPES)],
            'answers_json' => ['nullable', 'array'],
            'score' => ['nullable', 'integer', 'min:0', 'max:126'],
            'severity' => ['nullable', 'string', 'max:80'],
        ]);
        $note = $this->noteFor($appointment);

        $assessment = CounsellorAssessmentResult::query()->create([
            'appointment_id' => $appointment->id,
            'session_note_id' => $note->id,
            'client_user_id' => $appointment->client_user_id,
            'practitioner_id' => $practitioner->id,
            'assessment_type' => $validated['assessment_type'],
            'answers_json' => $validated['answers_json'] ?? [],
            'score' => $validated['score'] ?? 0,
            'severity' => $validated['severity'] ?? $this->severityFor((int) ($validated['score'] ?? 0)),
            'administered_at' => now(),
        ]);

        $this->recordActivity($request, 'counsellor_assessment_recorded', sprintf('%s recorded %s for appointment #%d.', $request->user()->name, strtoupper(str_replace('_', '-', $assessment->assessment_type)), $appointment->id), $assessment);

        return response()->json([
            'assessment' => $this->assessmentPayload($assessment),
            'workspace' => $this->workspacePayload($appointment->fresh(['client.clientProfile', 'intakeFlow.answers', 'events', 'practitioner.user']), $note->fresh(), $practitioner),
        ], 201);
    }

    private function counsellorPractitioner(Request $request): Practitioner
    {
        abort_unless($request->user()?->role === 'counsellor', 403);
        $practitioner = Practitioner::query()
            ->where('user_id', $request->user()->id)
            ->where('practitioner_type', 'counsellor')
            ->first();

        abort_unless($practitioner, 403, 'Counsellor practitioner profile is not available.');
        return $practitioner;
    }

    private function authorizeAppointment(Request $request, Appointment $appointment): Practitioner
    {
        $practitioner = $this->counsellorPractitioner($request);
        abort_unless((int) $appointment->practitioner_id === (int) $practitioner->id, 403);
        return $practitioner;
    }

    private function noteFor(Appointment $appointment): CounsellorSessionNote
    {
        return CounsellorSessionNote::query()->firstOrCreate(
            ['appointment_id' => $appointment->id],
            [
                'client_user_id' => $appointment->client_user_id,
                'practitioner_id' => $appointment->practitioner_id,
                'workflow_state' => $appointment->status === 'completed' ? 'notes_pending' : 'upcoming',
            ],
        );
    }

    private function workspacePayload(Appointment $appointment, CounsellorSessionNote $note, Practitioner $practitioner): array
    {
        $client = $appointment->client;
        $client->loadMissing(['clientProfile', 'intakeFlows']);
        $activePlan = $this->activeCbtPlan($client->id, $practitioner);
        $latestCompletedNote = CounsellorSessionNote::query()
            ->where('client_user_id', $client->id)
            ->where('appointment_id', '!=', $appointment->id)
            ->whereNotNull('completed_at')
            ->latest('completed_at')
            ->first();

        return [
            'session' => $this->queuePayload($appointment, $note, $practitioner),
            'client' => $this->clientSnapshotPayload($client, $appointment, $latestCompletedNote, $activePlan),
            'notes' => $this->notePayload($note),
            'assessments' => CounsellorAssessmentResult::query()
                ->where('client_user_id', $client->id)
                ->where('practitioner_id', $practitioner->id)
                ->latest('administered_at')
                ->limit(10)
                ->get()
                ->map(fn (CounsellorAssessmentResult $assessment) => $this->assessmentPayload($assessment))
                ->values(),
            'cbt' => [
                'activePlan' => $activePlan ? [
                    'id' => $activePlan->id,
                    'title' => $activePlan->title,
                    'status' => $activePlan->status,
                    'riskLevel' => $activePlan->risk_level,
                    'exerciseCount' => $activePlan->exercises->count(),
                ] : null,
                'homeworkTemplates' => CbtExerciseTemplate::query()
                    ->whereIn('slug', self::HOMEWORK_SLUGS)
                    ->orderBy('title')
                    ->get(['id', 'title', 'slug'])
                    ->map(fn (CbtExerciseTemplate $template) => [
                        'id' => $template->id,
                        'title' => $template->title,
                        'slug' => $template->slug,
                    ])
                    ->values(),
            ],
            'documents' => [],
        ];
    }

    private function queuePayload(Appointment $appointment, CounsellorSessionNote $note, Practitioner $practitioner): array
    {
        return [
            'id' => $appointment->id,
            'startsAt' => optional($appointment->starts_at)->toIso8601String(),
            'endsAt' => optional($appointment->ends_at)->toIso8601String(),
            'time' => optional($appointment->starts_at)->format('g:i A'),
            'clientId' => $appointment->client_user_id,
            'clientName' => $appointment->client?->name ?? 'Client',
            'sessionType' => $this->sessionType($appointment),
            'mode' => $appointment->mode,
            'appointmentStatus' => $appointment->status,
            'workflowState' => $this->derivedWorkflowState($appointment, $note),
            'actionLabel' => $this->actionLabel($appointment, $note),
            'riskLevel' => $this->latestRiskLevel($appointment->client_user_id, $practitioner),
        ];
    }

    private function clientSnapshotPayload(User $client, Appointment $appointment, ?CounsellorSessionNote $latestCompletedNote, ?CbtCarePlan $activePlan): array
    {
        $profile = $client->clientProfile;
        $intakeFlow = $appointment->intakeFlow ?? $client->intakeFlows()->latest('submitted_at')->latest('id')->first();
        $answers = $intakeFlow ? IntakeAnswer::query()->where('intake_flow_id', $intakeFlow->id)->get() : collect();
        $concerns = $this->answerLabels($answers, ['primary_concerns', 'concerns', 'symptoms']);

        return [
            'id' => $client->id,
            'name' => $client->name,
            'email' => $client->email,
            'phone' => $client->phone,
            'age' => $profile?->dob ? $profile->dob->age : null,
            'gender' => $profile?->gender,
            'occupation' => $this->answerText($answers, ['occupation', 'work_status']) ?? 'Not recorded',
            'riskFlags' => CbtRiskEvent::query()
                ->where('client_id', $client->id)
                ->whereIn('status', ['open', 'acknowledged'])
                ->latest()
                ->limit(3)
                ->get()
                ->map(fn (CbtRiskEvent $event) => [
                    'id' => $event->id,
                    'label' => str($event->risk_type)->replace('_', ' ')->title()->toString(),
                    'level' => $event->risk_level,
                ])
                ->values(),
            'previousDiagnoses' => $concerns,
            'previousSessionSummary' => $latestCompletedNote?->assessment ?: $latestCompletedNote?->subjective,
            'treatmentPlan' => $activePlan ? [
                $activePlan->title,
                ...$activePlan->goals->pluck('goal_title')->filter()->take(3)->values()->all(),
            ] : [],
        ];
    }

    private function activeCbtPlan(int $clientId, Practitioner $practitioner): ?CbtCarePlan
    {
        return CbtCarePlan::query()
            ->with(['goals', 'exercises'])
            ->where('client_id', $clientId)
            ->where('primary_practitioner_id', $practitioner->id)
            ->whereIn('status', ['active', 'draft'])
            ->latest()
            ->first();
    }

    private function notePayload(CounsellorSessionNote $note): array
    {
        return [
            'id' => $note->id,
            'workflowState' => $note->workflow_state,
            'subjective' => $note->subjective,
            'objective' => $note->objective,
            'assessment' => $note->assessment,
            'plan' => $note->plan,
            'nextAction' => $note->next_action,
            'startedAt' => optional($note->started_at)->toIso8601String(),
            'completedAt' => optional($note->completed_at)->toIso8601String(),
            'followUpRequestedAt' => optional($note->follow_up_requested_at)->toIso8601String(),
            'escalatedAt' => optional($note->escalated_at)->toIso8601String(),
        ];
    }

    private function assessmentPayload(CounsellorAssessmentResult $assessment): array
    {
        return [
            'id' => $assessment->id,
            'assessmentType' => $assessment->assessment_type,
            'score' => $assessment->score,
            'severity' => $assessment->severity,
            'administeredAt' => optional($assessment->administered_at)->toIso8601String(),
        ];
    }

    private function derivedWorkflowState(Appointment $appointment, CounsellorSessionNote $note): string
    {
        if (in_array($note->workflow_state, ['client_waiting', 'in_progress', 'follow_up_required', 'escalated', 'completed'], true)) {
            return $note->workflow_state;
        }

        if ($appointment->status === 'completed') {
            return $this->hasSoapNotes($note) ? 'completed' : 'notes_pending';
        }

        return 'upcoming';
    }

    private function actionLabel(Appointment $appointment, CounsellorSessionNote $note): string
    {
        return match ($this->derivedWorkflowState($appointment, $note)) {
            'in_progress' => 'Resume',
            'completed' => 'View Notes',
            'notes_pending' => 'Write Notes',
            'follow_up_required' => 'Follow-up',
            'escalated' => 'Review',
            default => 'Start Session',
        };
    }

    private function hasSoapNotes(CounsellorSessionNote $note): bool
    {
        return collect([$note->subjective, $note->objective, $note->assessment, $note->plan])
            ->filter(fn (?string $value) => trim((string) $value) !== '')
            ->isNotEmpty();
    }

    private function sessionType(Appointment $appointment): string
    {
        if ($appointment->intake_flow_id) {
            return 'Initial Assessment';
        }

        return match ($appointment->service_type) {
            'psychology' => 'Individual Therapy',
            'combined' => 'Integrated Therapy',
            'package' => 'Care Package Session',
            default => str($appointment->service_type)->replace('_', ' ')->title()->toString(),
        };
    }

    private function latestRiskLevel(int $clientId, Practitioner $practitioner): ?string
    {
        return CbtRiskEvent::query()
            ->where('client_id', $clientId)
            ->where(function ($query) use ($practitioner): void {
                $query
                    ->where('alerted_practitioner_id', $practitioner->user_id)
                    ->orWhereNull('alerted_practitioner_id');
            })
            ->latest()
            ->value('risk_level');
    }

    private function answerText(Collection $answers, array $keys): ?string
    {
        $answer = $answers->first(fn (IntakeAnswer $item) => in_array($item->question_key, $keys, true));
        $value = $answer?->answer_json;
        if (is_array($value)) {
            return collect($value)->flatten()->filter()->implode(', ');
        }

        return is_scalar($value) ? (string) $value : null;
    }

    private function answerLabels(Collection $answers, array $keys): array
    {
        $text = $this->answerText($answers, $keys);
        if (!$text) {
            return [];
        }

        return collect(explode(',', $text))
            ->map(fn (string $item) => trim($item))
            ->filter()
            ->take(5)
            ->values()
            ->all();
    }

    private function severityFor(int $score): string
    {
        return match (true) {
            $score >= 20 => 'Severe',
            $score >= 15 => 'Moderately severe',
            $score >= 10 => 'Moderate',
            $score >= 5 => 'Mild',
            default => 'Minimal',
        };
    }

    private function recordActivity(Request $request, string $action, string $summary, object $subject): void
    {
        $this->activityLogs->record('counsellor_session', $action, $summary, [
            'actor' => $request->user(),
            'subject' => $subject,
            'audienceUsers' => [$request->user()],
        ]);
    }
}
