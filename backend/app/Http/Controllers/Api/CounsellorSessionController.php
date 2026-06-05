<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\AppointmentEvent;
use App\Models\CbtCarePlan;
use App\Models\CbtExerciseTemplate;
use App\Models\CbtRiskEvent;
use App\Models\CounsellorAssessmentResult;
use App\Models\CounsellorSessionFlow;
use App\Models\CounsellorSessionFlowStep;
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
    private const REQUIRED_FLOW_STEPS = ['mood_check_in', 'todays_agenda', 'core_intervention', 'risk_assessment', 'session_summary', 'homework_assignment'];
    private const FLOW_STEPS = [
        ['key' => 'mood_check_in', 'phase' => 'Opening', 'title' => 'Mood Check-in', 'prompt' => 'Record current mood, anxiety, depression, stress, and a brief update since the last session.'],
        ['key' => 'previous_session_review', 'phase' => 'Opening', 'title' => 'Previous Session Review', 'prompt' => 'Review last session summary, insights, learning points, and notes.'],
        ['key' => 'homework_review', 'phase' => 'Opening', 'title' => 'Homework Review', 'prompt' => 'Capture completion status, successes, difficulties, obstacles, and lessons learned.'],
        ['key' => 'significant_events', 'phase' => 'Opening', 'title' => 'Significant Events', 'prompt' => 'Document positive events, stressors, triggers, relationships, work or academic issues, and health concerns.'],
        ['key' => 'todays_agenda', 'phase' => 'Opening', 'title' => "Set Today's Agenda", 'prompt' => 'Prioritize one to three session goals collaboratively.'],
        ['key' => 'current_problem', 'phase' => 'Assessment & Exploration', 'title' => 'Explore Current Problem', 'prompt' => 'Explore the selected issue, situation, emotional impact, behavior, and consequences.'],
        ['key' => 'automatic_thoughts', 'phase' => 'Assessment & Exploration', 'title' => 'Automatic Thoughts', 'prompt' => 'Capture situation, automatic thought, emotion, and intensity.'],
        ['key' => 'cognitive_distortions', 'phase' => 'Assessment & Exploration', 'title' => 'Cognitive Distortions', 'prompt' => 'Identify distortions such as catastrophizing, mind reading, fortune telling, or all-or-nothing thinking.'],
        ['key' => 'thought_challenge', 'phase' => 'Assessment & Exploration', 'title' => 'Challenge Thoughts', 'prompt' => 'Use Socratic questions: evidence for, evidence against, alternative explanation, and advice to a friend.'],
        ['key' => 'balanced_thoughts', 'phase' => 'Assessment & Exploration', 'title' => 'Balanced Thoughts', 'prompt' => 'Generate rational alternatives and coping statements.'],
        ['key' => 'core_intervention', 'phase' => 'Core CBT Intervention', 'title' => 'Cognitive Restructuring', 'prompt' => 'Document belief replacement, rational alternatives, and coping statements.'],
        ['key' => 'behavioral_analysis', 'phase' => 'Core CBT Intervention', 'title' => 'Behavioral Analysis', 'prompt' => 'Review avoidance, safety behaviors, and reinforcement patterns.'],
        ['key' => 'behavioral_intervention', 'phase' => 'Core CBT Intervention', 'title' => 'Behavioral Intervention', 'prompt' => 'Plan exposure, behavioral activation, problem solving, anger work, or behavioral experiments as clinically appropriate.'],
        ['key' => 'skills_training', 'phase' => 'Core CBT Intervention', 'title' => 'Skills Training', 'prompt' => 'Practice relaxation, PMR, assertiveness, communication, mindfulness, or emotional regulation.'],
        ['key' => 'assessment_review', 'phase' => 'Planning', 'title' => 'Assessment Review', 'prompt' => 'Review assessment scores, symptom severity, trends, and treatment implications.'],
        ['key' => 'case_conceptualization', 'phase' => 'Planning', 'title' => 'Case Conceptualization', 'prompt' => 'Update core beliefs, intermediate beliefs, triggers, maintaining factors, and protective factors.'],
        ['key' => 'treatment_plan_review', 'phase' => 'Planning', 'title' => 'Treatment Plan Review', 'prompt' => 'Review goals achieved, pending goals, phase status, and treatment plan adjustments.'],
        ['key' => 'risk_assessment', 'phase' => 'Closure', 'title' => 'Risk Assessment', 'prompt' => 'Record suicide/self-harm risk, protective factors, safety planning, and escalation need.'],
        ['key' => 'session_summary', 'phase' => 'Closure', 'title' => 'Session Summary & Feedback', 'prompt' => 'Summarize insights, learning points, cognitive shifts, client feedback, and concerns.'],
        ['key' => 'homework_assignment', 'phase' => 'Closure', 'title' => 'Homework Assignment', 'prompt' => 'Assign homework with objective, instructions, due date, reminders, and note if no homework was assigned.'],
        ['key' => 'next_session', 'phase' => 'Closure', 'title' => 'Next Session Scheduling', 'prompt' => 'Set date/time, follow-up plan, and next session focus.'],
        ['key' => 'clinical_documentation', 'phase' => 'Closure', 'title' => 'Clinical Documentation', 'prompt' => 'Finalize progress note, risk assessment, homework assigned, treatment updates, and next agenda.'],
    ];

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

    public function saveFlowStep(Request $request, Appointment $appointment, string $stepKey): JsonResponse
    {
        $practitioner = $this->authorizeAppointment($request, $appointment);
        $validated = $request->validate([
            'status' => ['required', Rule::in(['not_started', 'in_progress', 'completed', 'skipped'])],
            'response_json' => ['nullable', 'array'],
            'clinical_note' => ['nullable', 'string', 'max:12000'],
        ]);

        $note = $this->noteFor($appointment);
        $flow = $this->flowFor($note);
        $step = $flow->steps()->where('step_key', $stepKey)->first();
        abort_unless($step, 404, 'Session flow step not found.');

        $status = $validated['status'];
        $step->update([
            'status' => $status,
            'response_json' => $validated['response_json'] ?? [],
            'clinical_note' => $validated['clinical_note'] ?? null,
            'started_at' => in_array($status, ['in_progress', 'completed'], true) ? ($step->started_at ?? now()) : $step->started_at,
            'completed_at' => $status === 'completed' ? now() : ($status === 'skipped' ? null : $step->completed_at),
        ]);

        $flow->update([
            'active_step_key' => $stepKey,
            'completion_percent' => $this->completionPercent($flow->fresh('steps')),
        ]);
        $this->syncSoapFromFlow($note->fresh(), $flow->fresh('steps'));

        $this->recordActivity($request, 'counsellor_session_flow_step_saved', sprintf('%s saved %s for appointment #%d.', $request->user()->name, $step->title, $appointment->id), $appointment);

        return response()->json($this->workspacePayload($appointment->fresh(['client.clientProfile', 'intakeFlow.answers', 'events', 'practitioner.user']), $note->fresh(), $practitioner));
    }

    public function saveSummary(Request $request, Appointment $appointment): JsonResponse
    {
        $practitioner = $this->authorizeAppointment($request, $appointment);
        $validated = $request->validate([
            'session_rating' => ['nullable', 'integer', 'min:1', 'max:5'],
            'client_feedback' => ['nullable', 'string', 'max:4000'],
            'clinician_summary' => ['nullable', 'string', 'max:12000'],
            'client_summary' => ['nullable', 'string', 'max:12000'],
            'private_summary' => ['nullable', 'string', 'max:12000'],
            'next_agenda' => ['nullable', 'string', 'max:4000'],
        ]);

        $note = $this->noteFor($appointment);
        $flow = $this->flowFor($note);
        $flow->update($validated + ['completion_percent' => $this->completionPercent($flow->fresh('steps'))]);
        $this->syncSoapFromFlow($note->fresh(), $flow->fresh('steps'));

        $this->recordActivity($request, 'counsellor_session_summary_saved', sprintf('%s saved session summary for appointment #%d.', $request->user()->name, $appointment->id), $appointment);

        return response()->json($this->workspacePayload($appointment->fresh(['client.clientProfile', 'intakeFlow.answers', 'events', 'practitioner.user']), $note->fresh(), $practitioner));
    }

    public function complete(Request $request, Appointment $appointment): JsonResponse
    {
        $practitioner = $this->authorizeAppointment($request, $appointment);
        abort_if($appointment->status === 'cancelled', 422, 'Cancelled sessions cannot be completed.');
        abort_if($appointment->status === 'completed', 422, 'This session is already completed.');

        $note = $this->noteFor($appointment);
        $flow = $this->flowFor($note);
        $missingSteps = $this->missingRequiredSteps($flow);
        abort_if($missingSteps !== [], 422, 'Complete required CBT flow steps before locking the session: ' . implode(', ', $missingSteps));
        $this->syncSoapFromFlow($note, $flow->fresh('steps'));
        $note = $note->fresh();
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

    private function flowFor(CounsellorSessionNote $note): CounsellorSessionFlow
    {
        $flow = CounsellorSessionFlow::query()->firstOrCreate(
            ['session_note_id' => $note->id],
            [
                'active_step_key' => self::FLOW_STEPS[0]['key'],
                'completion_percent' => 0,
            ],
        );

        foreach (self::FLOW_STEPS as $index => $definition) {
            CounsellorSessionFlowStep::query()->firstOrCreate(
                ['session_flow_id' => $flow->id, 'step_key' => $definition['key']],
                [
                    'phase' => $definition['phase'],
                    'title' => $definition['title'],
                    'sort_order' => ($index + 1) * 10,
                    'prompt' => $definition['prompt'],
                    'response_json' => [],
                ],
            );
        }

        return $flow->fresh('steps');
    }

    private function syncSoapFromFlow(CounsellorSessionNote $note, CounsellorSessionFlow $flow): void
    {
        $steps = $flow->steps;
        $textFor = fn (string $key): ?string => $this->stepText($steps->firstWhere('step_key', $key));

        $subjective = collect([
            $textFor('mood_check_in'),
            $textFor('significant_events'),
            $textFor('current_problem'),
            $textFor('automatic_thoughts'),
        ])->filter()->implode("\n\n");

        $objective = collect([
            $textFor('homework_review'),
            $textFor('behavioral_analysis'),
            $textFor('skills_training'),
            $textFor('assessment_review'),
        ])->filter()->implode("\n\n");

        $assessment = collect([
            $flow->clinician_summary,
            $flow->private_summary,
            $textFor('cognitive_distortions'),
            $textFor('thought_challenge'),
            $textFor('case_conceptualization'),
            $textFor('risk_assessment'),
        ])->filter()->implode("\n\n");

        $plan = collect([
            $textFor('balanced_thoughts'),
            $textFor('core_intervention'),
            $textFor('behavioral_intervention'),
            $textFor('treatment_plan_review'),
            $textFor('homework_assignment'),
            $flow->next_agenda,
        ])->filter()->implode("\n\n");

        $note->update([
            'subjective' => $subjective ?: $note->subjective,
            'objective' => $objective ?: $note->objective,
            'assessment' => $assessment ?: $note->assessment,
            'plan' => $plan ?: $note->plan,
            'workflow_state' => $note->workflow_state === 'upcoming' ? 'in_progress' : $note->workflow_state,
            'started_at' => $note->started_at ?? now(),
        ]);
    }

    private function stepText(?CounsellorSessionFlowStep $step): ?string
    {
        if (!$step) {
            return null;
        }

        $response = collect($step->response_json ?? [])
            ->map(function ($value, string|int $key): ?string {
                if (is_array($value)) {
                    $value = collect($value)->flatten()->filter()->implode(', ');
                }

                if (!is_scalar($value) || trim((string) $value) === '') {
                    return null;
                }

                return str((string) $key)->replace('_', ' ')->title()->toString() . ': ' . trim((string) $value);
            })
            ->filter()
            ->implode("\n");

        return collect([$step->clinical_note, $response])->filter()->implode("\n");
    }

    private function completionPercent(CounsellorSessionFlow $flow): int
    {
        $steps = $flow->steps;
        if ($steps->isEmpty()) {
            return 0;
        }

        $done = $steps->filter(fn (CounsellorSessionFlowStep $step) => in_array($step->status, ['completed', 'skipped'], true))->count();
        return (int) round(($done / $steps->count()) * 100);
    }

    private function missingRequiredSteps(CounsellorSessionFlow $flow): array
    {
        return collect(self::REQUIRED_FLOW_STEPS)
            ->filter(fn (string $key) => !in_array($flow->steps->firstWhere('step_key', $key)?->status, ['completed', 'skipped'], true))
            ->map(fn (string $key) => collect(self::FLOW_STEPS)->firstWhere('key', $key)['title'] ?? $key)
            ->values()
            ->all();
    }

    private function workspacePayload(Appointment $appointment, CounsellorSessionNote $note, Practitioner $practitioner): array
    {
        $client = $appointment->client;
        $client->loadMissing(['clientProfile', 'intakeFlows']);
        $activePlan = $this->activeCbtPlan($client->id, $practitioner);
        $flow = $this->flowFor($note);
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
            'guidedFlow' => $this->flowPayload($flow->fresh('steps')),
            'sessionSummary' => $this->sessionSummaryPayload($flow),
            'assessments' => CounsellorAssessmentResult::query()
                ->where('client_user_id', $client->id)
                ->where('practitioner_id', $practitioner->id)
                ->latest('administered_at')
                ->limit(10)
                ->get()
                ->map(fn (CounsellorAssessmentResult $assessment) => $this->assessmentPayload($assessment))
                ->values(),
            'homeworkReview' => $this->homeworkReviewPayload($activePlan),
            'treatmentProgress' => $this->treatmentProgressPayload($activePlan),
            'cbt' => [
                'activePlan' => $activePlan ? [
                    'id' => $activePlan->id,
                    'title' => $activePlan->title,
                    'status' => $activePlan->status,
                    'riskLevel' => $activePlan->risk_level,
                    'exerciseCount' => $activePlan->exercises->count(),
                    'goalCount' => $activePlan->goals->count(),
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
            'occupation' => $profile?->occupation ?: $this->answerText($answers, ['occupation', 'work_status']),
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
            'label' => strtoupper(str_replace('_', '-', $assessment->assessment_type)),
            'score' => $assessment->score,
            'severity' => $assessment->severity,
            'tone' => $this->assessmentTone($assessment->severity),
            'administeredAt' => optional($assessment->administered_at)->toIso8601String(),
        ];
    }

    private function flowPayload(CounsellorSessionFlow $flow): array
    {
        return [
            'id' => $flow->id,
            'activeStepKey' => $flow->active_step_key,
            'completionPercent' => $this->completionPercent($flow),
            'requiredStepKeys' => self::REQUIRED_FLOW_STEPS,
            'phases' => $flow->steps
                ->groupBy('phase')
                ->map(fn (Collection $steps, string $phase) => [
                    'phase' => $phase,
                    'steps' => $steps->map(fn (CounsellorSessionFlowStep $step) => $this->flowStepPayload($step))->values(),
                ])
                ->values(),
        ];
    }

    private function flowStepPayload(CounsellorSessionFlowStep $step): array
    {
        return [
            'id' => $step->id,
            'stepKey' => $step->step_key,
            'phase' => $step->phase,
            'title' => $step->title,
            'sortOrder' => $step->sort_order,
            'status' => $step->status,
            'prompt' => $step->prompt,
            'response' => $step->response_json ?? [],
            'clinicalNote' => $step->clinical_note,
            'startedAt' => optional($step->started_at)->toIso8601String(),
            'completedAt' => optional($step->completed_at)->toIso8601String(),
        ];
    }

    private function sessionSummaryPayload(CounsellorSessionFlow $flow): array
    {
        return [
            'sessionRating' => $flow->session_rating,
            'clientFeedback' => $flow->client_feedback,
            'clinicianSummary' => $flow->clinician_summary,
            'clientSummary' => $flow->client_summary,
            'privateSummary' => $flow->private_summary,
            'nextAgenda' => $flow->next_agenda,
        ];
    }

    private function homeworkReviewPayload(?CbtCarePlan $activePlan): array
    {
        if (!$activePlan) {
            return [];
        }

        return $activePlan->exercises()
            ->with(['template', 'instances'])
            ->latest()
            ->limit(4)
            ->get()
            ->map(fn ($exercise) => [
                'id' => $exercise->id,
                'title' => $exercise->title_override ?: $exercise->template?->title ?: 'CBT homework',
                'status' => $exercise->status,
                'dueLabel' => $exercise->end_date ? $exercise->end_date->toFormattedDateString() : 'No due date',
                'reviewState' => $exercise->instances->contains(fn ($instance) => $instance->status === 'reviewed') ? 'Reviewed' : ($exercise->instances->contains(fn ($instance) => $instance->status === 'completed') ? 'Ready for review' : 'Pending'),
            ])
            ->values()
            ->all();
    }

    private function treatmentProgressPayload(?CbtCarePlan $activePlan): ?array
    {
        if (!$activePlan) {
            return null;
        }

        $goals = $activePlan->goals;
        $completed = $goals->where('status', 'completed')->count();
        $total = max($goals->count(), 1);

        return [
            'title' => $activePlan->title,
            'status' => $activePlan->status,
            'startedAt' => optional($activePlan->start_date)->toDateString(),
            'goalProgressPercent' => (int) round(($completed / $total) * 100),
            'goalSummary' => "{$completed} of {$total} goals achieved",
            'riskLevel' => $activePlan->risk_level,
        ];
    }

    private function assessmentTone(?string $severity): string
    {
        $severity = strtolower((string) $severity);
        return match (true) {
            str_contains($severity, 'severe') => 'danger',
            str_contains($severity, 'moderate') => 'warning',
            str_contains($severity, 'mild') => 'success',
            default => 'neutral',
        };
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
