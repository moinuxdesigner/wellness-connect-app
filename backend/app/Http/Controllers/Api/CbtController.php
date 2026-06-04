<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CbtCarePlan;
use App\Models\CbtExerciseCategory;
use App\Models\CbtExerciseInstance;
use App\Models\CbtExerciseResponse;
use App\Models\CbtExerciseTemplate;
use App\Models\CbtPlanExercise;
use App\Models\CbtPlanGoal;
use App\Models\CbtPractitionerReview;
use App\Models\CbtRiskEvent;
use App\Models\Notification;
use App\Models\Practitioner;
use App\Models\User;
use App\Services\ActivityLogService;
use Carbon\Carbon;
use Carbon\CarbonPeriod;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class CbtController extends Controller
{
    private const RISK_KEYWORDS = [
        'want to die',
        'kill myself',
        'suicide',
        'suicidal',
        'self harm',
        'self-harm',
        'hurt myself',
        'no reason to live',
        'end my life',
    ];

    public function __construct(private readonly ActivityLogService $activityLogs)
    {
    }

    public function categories(): JsonResponse
    {
        $categories = CbtExerciseCategory::query()
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get()
            ->map(fn (CbtExerciseCategory $category) => $this->categoryPayload($category))
            ->values();

        return response()->json(['categories' => $categories]);
    }

    public function storeCategory(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'slug' => ['nullable', 'string', 'max:140', 'unique:cbt_exercise_categories,slug'],
            'description' => ['nullable', 'string'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'is_active' => ['nullable', 'boolean'],
        ]);

        $category = CbtExerciseCategory::query()->create([
            'name' => $validated['name'],
            'slug' => $validated['slug'] ?? Str::slug($validated['name']),
            'description' => $validated['description'] ?? null,
            'sort_order' => $validated['sort_order'] ?? 0,
            'is_active' => $validated['is_active'] ?? true,
        ]);

        return response()->json(['category' => $this->categoryPayload($category)], 201);
    }

    public function templates(): JsonResponse
    {
        $templates = CbtExerciseTemplate::query()
            ->with('category')
            ->orderBy('title')
            ->get()
            ->map(fn (CbtExerciseTemplate $template) => $this->templatePayload($template))
            ->values();

        return response()->json(['templates' => $templates]);
    }

    public function dashboard(Request $request): JsonResponse
    {
        abort_unless($request->user()?->role === 'counsellor', 403);

        $practitioner = Practitioner::query()
            ->where('user_id', $request->user()->id)
            ->where('practitioner_type', 'counsellor')
            ->first();

        if (!$practitioner) {
            return response()->json([
                'stats' => [
                    'activePlans' => 0,
                    'completionRate' => 0,
                    'pendingReviews' => 0,
                ],
                'plans' => [],
            ]);
        }

        $plans = CbtCarePlan::query()
            ->with(['client', 'exercises.instances.response.review'])
            ->where('primary_practitioner_id', $practitioner->id)
            ->latest()
            ->get();

        $instances = $plans->flatMap(fn (CbtCarePlan $plan) => $plan->exercises->flatMap(fn (CbtPlanExercise $exercise) => $exercise->instances));
        $responses = $instances->pluck('response')->filter();
        $totalInstances = $instances->count();
        $completedInstances = $instances->whereIn('status', ['completed', 'reviewed'])->count();

        return response()->json([
            'stats' => [
                'activePlans' => $plans->where('status', 'active')->count(),
                'completionRate' => $totalInstances > 0 ? round(($completedInstances / $totalInstances) * 100, 2) : 0,
                'pendingReviews' => $responses->filter(fn (CbtExerciseResponse $response) => !$response->review)->count(),
            ],
            'plans' => $plans
                ->map(fn (CbtCarePlan $plan) => $this->dashboardPlanPayload($plan))
                ->values(),
        ]);
    }

    public function storeTemplate(Request $request): JsonResponse
    {
        $validated = $this->validateTemplate($request);

        $template = CbtExerciseTemplate::query()->create($validated + [
            'created_by' => $request->user()->id,
            'slug' => $validated['slug'] ?? Str::slug($validated['title']),
            'is_active' => $validated['is_active'] ?? true,
        ]);

        return response()->json(['template' => $this->templatePayload($template->load('category'))], 201);
    }

    public function updateTemplate(Request $request, int $templateId): JsonResponse
    {
        $template = CbtExerciseTemplate::query()->findOrFail($templateId);
        $validated = $this->validateTemplate($request, $template->id);
        $template->update($validated + ['slug' => $validated['slug'] ?? $template->slug]);

        return response()->json(['template' => $this->templatePayload($template->fresh('category'))]);
    }

    public function clientPlans(Request $request, int $clientId): JsonResponse
    {
        $this->ensureCounsellorCanAccessClient($request->user(), $clientId);

        $plans = CbtCarePlan::query()
            ->with(['goals', 'exercises.template'])
            ->where('client_id', $clientId)
            ->latest()
            ->get()
            ->map(fn (CbtCarePlan $plan) => $this->planPayload($plan))
            ->values();

        return response()->json(['plans' => $plans]);
    }

    public function storePlan(Request $request, int $clientId): JsonResponse
    {
        $counsellor = $this->ensureCounsellorCanAccessClient($request->user(), $clientId);
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:180'],
            'description' => ['nullable', 'string'],
            'primary_goal' => ['nullable', 'string', 'max:220'],
            'status' => ['nullable', Rule::in(['draft', 'active', 'paused', 'completed', 'cancelled'])],
            'start_date' => ['nullable', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
            'review_frequency' => ['nullable', 'string', 'max:60'],
            'risk_level' => ['nullable', Rule::in(['low', 'medium', 'high'])],
            'goals' => ['nullable', 'array'],
            'goals.*.goal_title' => ['required_with:goals', 'string', 'max:180'],
            'goals.*.goal_description' => ['nullable', 'string'],
            'goals.*.baseline_score' => ['nullable', 'numeric'],
            'goals.*.target_score' => ['nullable', 'numeric'],
        ]);

        $plan = DB::transaction(function () use ($validated, $request, $clientId, $counsellor) {
            $plan = CbtCarePlan::query()->create([
                'client_id' => $clientId,
                'primary_practitioner_id' => $counsellor->id,
                'created_by' => $request->user()->id,
                'title' => $validated['title'],
                'description' => $validated['description'] ?? null,
                'primary_goal' => $validated['primary_goal'] ?? null,
                'status' => $validated['status'] ?? 'active',
                'start_date' => $validated['start_date'] ?? now()->toDateString(),
                'end_date' => $validated['end_date'] ?? null,
                'review_frequency' => $validated['review_frequency'] ?? 'weekly',
                'risk_level' => $validated['risk_level'] ?? 'low',
            ]);

            foreach ($validated['goals'] ?? [] as $goal) {
                CbtPlanGoal::query()->create($goal + ['care_plan_id' => $plan->id]);
            }

            $this->activityLogs->record('cbt', 'cbt_plan_created', sprintf('%s created CBT plan %s.', $request->user()->name, $plan->title), [
                'actor' => $request->user(),
                'targetUserId' => $clientId,
                'targetRole' => 'client',
                'subject' => $plan,
                'audienceRoles' => ['counsellor'],
                'audienceUsers' => [$request->user(), User::query()->find($clientId)],
            ]);

            return $plan;
        });

        return response()->json(['plan' => $this->planPayload($plan->load(['goals', 'exercises.template']))], 201);
    }

    public function showPlan(Request $request, int $planId): JsonResponse
    {
        $plan = CbtCarePlan::query()->with(['client', 'practitioner.user', 'goals', 'exercises.template', 'exercises.instances.response.review'])->findOrFail($planId);
        $this->ensurePlanVisible($request->user(), $plan);

        return response()->json(['plan' => $this->planPayload($plan, true)]);
    }

    public function updatePlan(Request $request, int $planId): JsonResponse
    {
        $plan = CbtCarePlan::query()->findOrFail($planId);
        $this->ensureCounsellorOwnsPlan($request->user(), $plan);

        $validated = $request->validate([
            'title' => ['sometimes', 'required', 'string', 'max:180'],
            'description' => ['nullable', 'string'],
            'primary_goal' => ['nullable', 'string', 'max:220'],
            'status' => ['sometimes', Rule::in(['draft', 'active', 'paused', 'completed', 'cancelled'])],
            'start_date' => ['nullable', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
            'review_frequency' => ['nullable', 'string', 'max:60'],
            'risk_level' => ['nullable', Rule::in(['low', 'medium', 'high'])],
        ]);

        $plan->update($validated);

        return response()->json(['plan' => $this->planPayload($plan->fresh(['goals', 'exercises.template']))]);
    }

    public function assignExercise(Request $request, int $planId): JsonResponse
    {
        $plan = CbtCarePlan::query()->findOrFail($planId);
        $this->ensureCounsellorOwnsPlan($request->user(), $plan);

        $validated = $request->validate([
            'exercise_template_id' => ['required', 'exists:cbt_exercise_templates,id'],
            'title_override' => ['nullable', 'string', 'max:180'],
            'instructions_override' => ['nullable', 'string'],
            'frequency' => ['required', Rule::in(['once', 'daily', 'weekly', 'as_needed', 'custom'])],
            'start_date' => ['required', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
            'due_time' => ['nullable', 'date_format:H:i'],
            'priority' => ['nullable', Rule::in(['low', 'medium', 'high'])],
        ]);

        $exercise = DB::transaction(function () use ($validated, $request, $plan) {
            $exercise = CbtPlanExercise::query()->create($validated + [
                'care_plan_id' => $plan->id,
                'assigned_by' => $request->user()->id,
                'assigned_to' => $plan->client_id,
                'priority' => $validated['priority'] ?? 'medium',
                'status' => 'active',
            ]);

            foreach ($this->scheduledDates($validated['frequency'], $validated['start_date'], $validated['end_date'] ?? null) as $date) {
                CbtExerciseInstance::query()->create([
                    'plan_exercise_id' => $exercise->id,
                    'client_id' => $plan->client_id,
                    'scheduled_date' => $date->toDateString(),
                    'due_at' => $validated['due_time'] ?? null ? Carbon::parse($date->toDateString() . ' ' . $validated['due_time']) : null,
                    'status' => 'pending',
                ]);
            }

            Notification::query()->create([
                'user_id' => $plan->client_id,
                'type' => 'cbt_exercise_assigned',
                'channel' => 'in_app',
                'payload_json' => [
                    'message' => 'A new CBT exercise has been assigned.',
                    'planId' => $plan->id,
                    'exerciseId' => $exercise->id,
                ],
                'status' => 'sent',
                'sent_at' => now(),
            ]);

            $this->activityLogs->record('cbt', 'cbt_exercise_assigned', sprintf('%s assigned a CBT exercise.', $request->user()->name), [
                'actor' => $request->user(),
                'targetUserId' => $plan->client_id,
                'targetRole' => 'client',
                'subject' => $exercise,
                'audienceUsers' => [$request->user(), User::query()->find($plan->client_id)],
            ]);

            return $exercise;
        });

        return response()->json(['exercise' => $this->planExercisePayload($exercise->load(['template', 'instances']))], 201);
    }

    public function planProgress(Request $request, int $planId): JsonResponse
    {
        $plan = CbtCarePlan::query()->with(['exercises.instances.response'])->findOrFail($planId);
        $this->ensurePlanVisible($request->user(), $plan);

        return response()->json(['progress' => $this->progressPayload($plan)]);
    }

    public function planResponses(Request $request, int $planId): JsonResponse
    {
        $plan = CbtCarePlan::query()->findOrFail($planId);
        $this->ensureCounsellorOwnsPlan($request->user(), $plan);

        $responses = CbtExerciseResponse::query()
            ->with(['instance.planExercise.template', 'review'])
            ->whereHas('instance.planExercise', fn ($query) => $query->where('care_plan_id', $plan->id))
            ->latest('submitted_at')
            ->get()
            ->map(fn (CbtExerciseResponse $response) => $this->responsePayload($response))
            ->values();

        return response()->json(['responses' => $responses]);
    }

    public function reviewResponse(Request $request, int $responseId): JsonResponse
    {
        $response = CbtExerciseResponse::query()->with('instance.planExercise.carePlan')->findOrFail($responseId);
        $plan = $response->instance->planExercise->carePlan;
        $this->ensureCounsellorOwnsPlan($request->user(), $plan);

        $validated = $request->validate([
            'review_status' => ['required', Rule::in(['reviewed', 'needs_follow_up', 'escalated'])],
            'clinical_notes' => ['nullable', 'string'],
            'feedback_to_client' => ['nullable', 'string'],
            'risk_flag' => ['nullable', 'boolean'],
            'next_action' => ['nullable', 'string', 'max:220'],
        ]);

        $review = DB::transaction(function () use ($validated, $request, $response, $plan) {
            $review = CbtPractitionerReview::query()->updateOrCreate(
                ['exercise_response_id' => $response->id],
                $validated + [
                    'reviewed_by' => $request->user()->id,
                    'reviewed_at' => now(),
                    'risk_flag' => $validated['risk_flag'] ?? false,
                ]
            );

            $response->instance->update(['status' => 'reviewed']);

            Notification::query()->create([
                'user_id' => $response->client_id,
                'type' => 'cbt_response_reviewed',
                'channel' => 'in_app',
                'payload_json' => [
                    'message' => 'Your counsellor reviewed a CBT exercise.',
                    'planId' => $plan->id,
                    'responseId' => $response->id,
                ],
                'status' => 'sent',
                'sent_at' => now(),
            ]);

            $this->activityLogs->record('cbt', 'cbt_response_reviewed', sprintf('%s reviewed a CBT response.', $request->user()->name), [
                'actor' => $request->user(),
                'targetUserId' => $response->client_id,
                'targetRole' => 'client',
                'subject' => $review,
                'audienceUsers' => [$request->user(), $response->client],
            ]);

            return $review;
        });

        return response()->json(['review' => $this->reviewPayload($review)]);
    }

    public function myPlan(Request $request): JsonResponse
    {
        $plan = CbtCarePlan::query()
            ->with(['goals', 'exercises.template', 'exercises.instances.response.review'])
            ->where('client_id', $request->user()->id)
            ->whereIn('status', ['active', 'draft'])
            ->latest()
            ->first();

        return response()->json(['plan' => $plan ? $this->planPayload($plan, true) : null]);
    }

    public function myExercises(Request $request): JsonResponse
    {
        $instances = CbtExerciseInstance::query()
            ->with(['planExercise.template', 'response.review'])
            ->where('client_id', $request->user()->id)
            ->orderBy('scheduled_date')
            ->orderBy('id')
            ->get()
            ->map(fn (CbtExerciseInstance $instance) => $this->instancePayload($instance, true))
            ->values();

        return response()->json(['exercises' => $instances]);
    }

    public function showInstance(Request $request, int $instanceId): JsonResponse
    {
        $instance = CbtExerciseInstance::query()->with(['planExercise.template', 'response.review'])->findOrFail($instanceId);
        abort_unless($instance->client_id === $request->user()->id, 403);

        return response()->json(['exercise' => $this->instancePayload($instance, true)]);
    }

    public function startInstance(Request $request, int $instanceId): JsonResponse
    {
        $instance = CbtExerciseInstance::query()->findOrFail($instanceId);
        abort_unless($instance->client_id === $request->user()->id, 403);

        if ($instance->status === 'pending') {
            $instance->update(['status' => 'in_progress', 'started_at' => now()]);
        }

        return response()->json(['exercise' => $this->instancePayload($instance->fresh(['planExercise.template', 'response.review']), true)]);
    }

    public function submitInstance(Request $request, int $instanceId): JsonResponse
    {
        $instance = CbtExerciseInstance::query()->with('planExercise.carePlan.practitioner.user')->findOrFail($instanceId);
        abort_unless($instance->client_id === $request->user()->id, 403);

        $validated = $request->validate([
            'response_json' => ['required', 'array'],
            'score_json' => ['nullable', 'array'],
            'emotion_before' => ['nullable', 'integer', 'min:0', 'max:100'],
            'emotion_after' => ['nullable', 'integer', 'min:0', 'max:100'],
            'client_reflection' => ['nullable', 'string'],
        ]);

        $response = DB::transaction(function () use ($validated, $request, $instance) {
            $response = CbtExerciseResponse::query()->updateOrCreate(
                ['exercise_instance_id' => $instance->id],
                $validated + [
                    'client_id' => $request->user()->id,
                    'submitted_at' => now(),
                ]
            );

            $instance->update(['status' => 'completed', 'completed_at' => now()]);
            $this->detectRisk($response->fresh(['instance.planExercise.carePlan.practitioner.user']));

            $this->activityLogs->record('cbt', 'cbt_response_submitted', sprintf('%s submitted a CBT exercise.', $request->user()->name), [
                'actor' => $request->user(),
                'subject' => $response,
                'audienceUsers' => array_values(array_filter([$request->user(), optional($instance->planExercise->carePlan->practitioner)->user])),
                'audienceRoles' => ['counsellor'],
            ]);

            return $response;
        });

        return response()->json(['response' => $this->responsePayload($response->load(['instance.planExercise.template', 'review']))], 201);
    }

    public function myProgress(Request $request): JsonResponse
    {
        $plan = CbtCarePlan::query()->with(['exercises.instances.response'])->where('client_id', $request->user()->id)->latest()->first();

        return response()->json(['progress' => $plan ? $this->progressPayload($plan) : null]);
    }

    private function validateTemplate(Request $request, ?int $templateId = null): array
    {
        return $request->validate([
            'category_id' => ['nullable', 'exists:cbt_exercise_categories,id'],
            'title' => ['required', 'string', 'max:160'],
            'slug' => ['nullable', 'string', 'max:180', Rule::unique('cbt_exercise_templates', 'slug')->ignore($templateId)],
            'description' => ['nullable', 'string'],
            'clinical_purpose' => ['nullable', 'string'],
            'instructions' => ['nullable', 'string'],
            'difficulty_level' => ['nullable', Rule::in(['intro', 'standard', 'advanced'])],
            'estimated_minutes' => ['nullable', 'integer', 'min:1', 'max:180'],
            'target_conditions_json' => ['nullable', 'array'],
            'template_schema_json' => ['required', 'array'],
            'scoring_schema_json' => ['nullable', 'array'],
            'is_active' => ['nullable', 'boolean'],
        ]);
    }

    private function ensureCounsellorCanAccessClient(User $user, int $clientId): Practitioner
    {
        abort_unless($user->role === 'counsellor', 403);
        $client = User::query()->where('role', 'client')->findOrFail($clientId);
        $practitioner = Practitioner::query()->where('user_id', $user->id)->where('practitioner_type', 'counsellor')->first();
        abort_unless($practitioner && $client, 403);

        return $practitioner;
    }

    private function ensureCounsellorOwnsPlan(User $user, CbtCarePlan $plan): void
    {
        $practitioner = $this->ensureCounsellorCanAccessClient($user, $plan->client_id);
        abort_unless((int) $plan->primary_practitioner_id === (int) $practitioner->id, 403);
    }

    private function ensurePlanVisible(User $user, CbtCarePlan $plan): void
    {
        if ($user->role === 'client') {
            abort_unless((int) $plan->client_id === (int) $user->id, 403);
            return;
        }

        $this->ensureCounsellorOwnsPlan($user, $plan);
    }

    private function scheduledDates(string $frequency, string $startDate, ?string $endDate): array
    {
        $start = Carbon::parse($startDate)->startOfDay();
        $end = $endDate ? Carbon::parse($endDate)->startOfDay() : $start;
        if (in_array($frequency, ['once', 'as_needed'], true)) {
            return [$start];
        }

        $interval = $frequency === 'weekly' ? '1 week' : '1 day';
        return collect(CarbonPeriod::create($start, $interval, $end))
            ->take(60)
            ->values()
            ->all();
    }

    private function detectRisk(CbtExerciseResponse $response): void
    {
        $text = Str::lower($this->flattenText($response->response_json));
        $matched = collect(self::RISK_KEYWORDS)->first(fn (string $keyword) => str_contains($text, $keyword));
        if (!$matched) {
            return;
        }

        $plan = $response->instance->planExercise->carePlan;
        $practitionerUser = optional($plan->practitioner)->user;

        $riskEvent = CbtRiskEvent::query()->create([
            'client_id' => $response->client_id,
            'care_plan_id' => $plan->id,
            'exercise_response_id' => $response->id,
            'risk_type' => 'self_harm',
            'risk_level' => 'critical',
            'trigger_text' => $matched,
            'action_taken' => 'In-app alert created for counsellor review.',
            'alerted_practitioner_id' => $practitionerUser?->id,
            'status' => 'open',
        ]);

        if ($practitionerUser) {
            Notification::query()->create([
                'user_id' => $practitionerUser->id,
                'type' => 'cbt_risk_alert',
                'channel' => 'in_app',
                'payload_json' => [
                    'message' => 'High-risk CBT response needs review.',
                    'riskEventId' => $riskEvent->id,
                    'planId' => $plan->id,
                    'responseId' => $response->id,
                ],
                'status' => 'sent',
                'sent_at' => now(),
            ]);
        }

        $this->activityLogs->record('cbt', 'cbt_risk_flag_created', 'A CBT response was flagged for urgent review.', [
            'targetUserId' => $response->client_id,
            'targetRole' => 'client',
            'subject' => $riskEvent,
            'audienceRoles' => ['admin', 'counsellor'],
            'audienceUsers' => array_values(array_filter([$practitionerUser])),
        ]);
    }

    private function flattenText(mixed $value): string
    {
        if (is_array($value)) {
            return collect($value)->map(fn ($item) => $this->flattenText($item))->implode(' ');
        }

        return is_scalar($value) ? (string) $value : '';
    }

    private function categoryPayload(CbtExerciseCategory $category): array
    {
        return [
            'id' => $category->id,
            'name' => $category->name,
            'slug' => $category->slug,
            'description' => $category->description,
            'sortOrder' => $category->sort_order,
            'isActive' => $category->is_active,
        ];
    }

    private function templatePayload(CbtExerciseTemplate $template): array
    {
        return [
            'id' => $template->id,
            'categoryId' => $template->category_id,
            'category' => $template->category ? $this->categoryPayload($template->category) : null,
            'title' => $template->title,
            'slug' => $template->slug,
            'description' => $template->description,
            'clinicalPurpose' => $template->clinical_purpose,
            'instructions' => $template->instructions,
            'difficultyLevel' => $template->difficulty_level,
            'estimatedMinutes' => $template->estimated_minutes,
            'targetConditions' => $template->target_conditions_json ?? [],
            'templateSchema' => $template->template_schema_json,
            'scoringSchema' => $template->scoring_schema_json,
            'isActive' => $template->is_active,
        ];
    }

    private function dashboardPlanPayload(CbtCarePlan $plan): array
    {
        $instances = $plan->exercises->flatMap(fn (CbtPlanExercise $exercise) => $exercise->instances);
        $responses = $instances->pluck('response')->filter();
        $totalInstances = $instances->count();
        $completedInstances = $instances->whereIn('status', ['completed', 'reviewed'])->count();

        return [
            'id' => $plan->id,
            'clientId' => $plan->client_id,
            'clientName' => $plan->client?->name,
            'title' => $plan->title,
            'status' => $plan->status,
            'riskLevel' => $plan->risk_level,
            'completionRate' => $totalInstances > 0 ? round(($completedInstances / $totalInstances) * 100, 2) : 0,
            'pendingReviews' => $responses->filter(fn (CbtExerciseResponse $response) => !$response->review)->count(),
            'exerciseCount' => $plan->exercises->count(),
            'updatedAt' => optional($plan->updated_at)->toIso8601String(),
        ];
    }

    private function planPayload(CbtCarePlan $plan, bool $includeInstances = false): array
    {
        return [
            'id' => $plan->id,
            'clientId' => $plan->client_id,
            'clientName' => $plan->client?->name,
            'primaryPractitionerId' => $plan->primary_practitioner_id,
            'practitionerName' => $plan->practitioner?->user?->name,
            'title' => $plan->title,
            'description' => $plan->description,
            'primaryGoal' => $plan->primary_goal,
            'status' => $plan->status,
            'startDate' => optional($plan->start_date)->toDateString(),
            'endDate' => optional($plan->end_date)->toDateString(),
            'reviewFrequency' => $plan->review_frequency,
            'riskLevel' => $plan->risk_level,
            'goals' => $plan->goals?->map(fn (CbtPlanGoal $goal) => [
                'id' => $goal->id,
                'goalTitle' => $goal->goal_title,
                'goalDescription' => $goal->goal_description,
                'baselineScore' => $goal->baseline_score,
                'targetScore' => $goal->target_score,
                'currentScore' => $goal->current_score,
                'status' => $goal->status,
            ])->values() ?? [],
            'exercises' => $plan->exercises?->map(fn (CbtPlanExercise $exercise) => $this->planExercisePayload($exercise, $includeInstances))->values() ?? [],
        ];
    }

    private function planExercisePayload(CbtPlanExercise $exercise, bool $includeInstances = false): array
    {
        return [
            'id' => $exercise->id,
            'carePlanId' => $exercise->care_plan_id,
            'exerciseTemplateId' => $exercise->exercise_template_id,
            'template' => $exercise->template ? $this->templatePayload($exercise->template) : null,
            'title' => $exercise->title_override ?: $exercise->template?->title,
            'instructions' => $exercise->instructions_override ?: $exercise->template?->instructions,
            'frequency' => $exercise->frequency,
            'startDate' => optional($exercise->start_date)->toDateString(),
            'endDate' => optional($exercise->end_date)->toDateString(),
            'dueTime' => $exercise->due_time,
            'priority' => $exercise->priority,
            'status' => $exercise->status,
            'instances' => $includeInstances ? ($exercise->instances?->map(fn (CbtExerciseInstance $instance) => $this->instancePayload($instance))->values() ?? []) : [],
        ];
    }

    private function instancePayload(CbtExerciseInstance $instance, bool $includeTemplate = false): array
    {
        return [
            'id' => $instance->id,
            'planExerciseId' => $instance->plan_exercise_id,
            'clientId' => $instance->client_id,
            'scheduledDate' => optional($instance->scheduled_date)->toDateString(),
            'dueAt' => optional($instance->due_at)->toIso8601String(),
            'status' => $instance->status,
            'startedAt' => optional($instance->started_at)->toIso8601String(),
            'completedAt' => optional($instance->completed_at)->toIso8601String(),
            'template' => $includeTemplate && $instance->planExercise?->template ? $this->templatePayload($instance->planExercise->template) : null,
            'planExercise' => $includeTemplate && $instance->planExercise ? $this->planExercisePayload($instance->planExercise) : null,
            'response' => $instance->response ? $this->responsePayload($instance->response) : null,
        ];
    }

    private function responsePayload(CbtExerciseResponse $response): array
    {
        return [
            'id' => $response->id,
            'exerciseInstanceId' => $response->exercise_instance_id,
            'clientId' => $response->client_id,
            'responseJson' => $response->response_json,
            'scoreJson' => $response->score_json,
            'emotionBefore' => $response->emotion_before,
            'emotionAfter' => $response->emotion_after,
            'clientReflection' => $response->client_reflection,
            'submittedAt' => optional($response->submitted_at)->toIso8601String(),
            'exerciseTitle' => $response->instance?->planExercise?->title_override ?: $response->instance?->planExercise?->template?->title,
            'review' => $response->review ? $this->reviewPayload($response->review) : null,
        ];
    }

    private function reviewPayload(CbtPractitionerReview $review): array
    {
        return [
            'id' => $review->id,
            'exerciseResponseId' => $review->exercise_response_id,
            'reviewedBy' => $review->reviewed_by,
            'reviewStatus' => $review->review_status,
            'clinicalNotes' => $review->clinical_notes,
            'feedbackToClient' => $review->feedback_to_client,
            'riskFlag' => $review->risk_flag,
            'nextAction' => $review->next_action,
            'reviewedAt' => optional($review->reviewed_at)->toIso8601String(),
        ];
    }

    private function progressPayload(CbtCarePlan $plan): array
    {
        $instances = $plan->exercises->flatMap(fn (CbtPlanExercise $exercise) => $exercise->instances);
        $total = $instances->count();
        $completed = $instances->whereIn('status', ['completed', 'reviewed'])->count();
        $responses = $instances->pluck('response')->filter();
        $before = $responses->pluck('emotion_before')->filter(fn ($value) => $value !== null);
        $after = $responses->pluck('emotion_after')->filter(fn ($value) => $value !== null);

        return [
            'carePlanId' => $plan->id,
            'completionRate' => $total > 0 ? round(($completed / $total) * 100, 2) : 0,
            'totalInstances' => $total,
            'completedInstances' => $completed,
            'pendingReviews' => $responses->filter(fn (CbtExerciseResponse $response) => !$response->review)->count(),
            'averageAnxietyBefore' => $before->count() ? round($before->avg(), 2) : null,
            'averageAnxietyAfter' => $after->count() ? round($after->avg(), 2) : null,
            'improvementScore' => $before->count() && $after->count() ? round($before->avg() - $after->avg(), 2) : null,
        ];
    }
}
