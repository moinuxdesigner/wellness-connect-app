<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ActivityEvent;
use App\Models\Appointment;
use App\Models\CbtExerciseInstance;
use App\Models\CbtExerciseResponse;
use App\Models\CbtPlanExercise;
use App\Models\CbtPlanGoal;
use App\Models\TrainerCheckIn;
use App\Models\TrainerPlan;
use App\Models\TrainerPlanActivity;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;

class ClientProgressController extends Controller
{
    public function show(Request $request): JsonResponse
    {
        $user = $request->user();
        abort_unless($user?->role === 'client', 403);

        $completedDates = $this->completedActivityDates($user->id);
        $currentStreak = $this->currentStreak($completedDates);
        $sessionsThisMonth = $this->completedSessionCount($user->id, now()->startOfMonth(), now()->endOfMonth());
        $lastMonth = now()->subMonthNoOverflow();
        $sessionsLastMonth = $this->completedSessionCount($user->id, $lastMonth->copy()->startOfMonth(), $lastMonth->copy()->endOfMonth());
        $goals = $this->goalProgress($user->id);
        $goalsOnTrack = $goals->where('value', '>=', 70)->count();
        $fitness = $this->fitnessPayload($user->id);
        $mind = $this->mindPayload($user->id);
        $wellnessScore = $this->wellnessScore($goals, $fitness, $mind, $currentStreak);

        return response()->json([
            'source' => 'database',
            'generatedAt' => now()->toIso8601String(),
            'summary' => [
                'wellnessScore' => $wellnessScore,
                'wellnessDelta' => $this->wellnessDelta($wellnessScore, $goals, $fitness, $mind),
                'sessionsCompletedThisMonth' => $sessionsThisMonth,
                'sessionsDeltaFromLastMonth' => $sessionsThisMonth - $sessionsLastMonth,
                'currentStreakDays' => $currentStreak,
                'goalsOnTrack' => $goalsOnTrack,
                'totalGoals' => $goals->count(),
                'goalsOnTrackPercent' => $goals->count() > 0 ? (int) round(($goalsOnTrack / $goals->count()) * 100) : 0,
            ],
            'fitness' => $fitness,
            'mind' => $mind,
            'goals' => $goals->values(),
            'bodyMetrics' => $this->bodyMetrics($fitness),
            'milestones' => $this->milestones($goals, $fitness, $mind, $currentStreak),
            'resources' => $this->resources($user->id),
            'recentActivity' => $this->recentActivity($user->id),
        ]);
    }

    private function completedSessionCount(int $userId, Carbon $from, Carbon $to): int
    {
        return Appointment::query()
            ->where('client_user_id', $userId)
            ->where('status', 'completed')
            ->whereBetween('starts_at', [$from, $to])
            ->count();
    }

    private function completedActivityDates(int $userId): Collection
    {
        $appointmentDates = Appointment::query()
            ->where('client_user_id', $userId)
            ->where('status', 'completed')
            ->pluck('starts_at')
            ->filter()
            ->map(fn ($date) => Carbon::parse($date)->toDateString());

        $cbtDates = CbtExerciseInstance::query()
            ->where('client_id', $userId)
            ->whereIn('status', ['completed', 'reviewed'])
            ->whereNotNull('completed_at')
            ->pluck('completed_at')
            ->filter()
            ->map(fn ($date) => Carbon::parse($date)->toDateString());

        $trainingDates = TrainerPlanActivity::query()
            ->whereHas('plan', fn ($query) => $query->where('client_user_id', $userId))
            ->where('status', 'completed')
            ->whereNotNull('completed_at')
            ->pluck('completed_at')
            ->filter()
            ->map(fn ($date) => Carbon::parse($date)->toDateString());

        return $appointmentDates->merge($cbtDates)->merge($trainingDates)->unique()->values();
    }

    private function currentStreak(Collection $dates): int
    {
        $dateSet = $dates->unique()->flip();
        $cursor = today();
        $streak = 0;

        while ($dateSet->has($cursor->toDateString())) {
            $streak++;
            $cursor = $cursor->copy()->subDay();
        }

        return $streak;
    }

    private function goalProgress(int $userId): Collection
    {
        $trainingGoals = TrainerPlan::query()
            ->where('client_user_id', $userId)
            ->whereIn('status', ['active', 'completed'])
            ->with(['checkIns' => fn ($query) => $query->latest('checked_in_on')])
            ->latest()
            ->get()
            ->map(fn (TrainerPlan $plan) => [
                'id' => 'training-' . $plan->id,
                'label' => $plan->goal_title,
                'value' => $plan->status === 'completed' ? 100 : (int) ($plan->checkIns->first()?->goal_progress_percent ?? 0),
                'category' => 'training',
                'status' => $plan->status,
            ]);

        $cbtGoals = CbtPlanGoal::query()
            ->whereHas('carePlan', fn ($query) => $query->where('client_id', $userId))
            ->latest()
            ->get()
            ->map(fn (CbtPlanGoal $goal) => [
                'id' => 'cbt-' . $goal->id,
                'label' => $goal->goal_title,
                'value' => $this->goalPercent($goal),
                'category' => 'mind',
                'status' => $goal->status,
            ]);

        return collect($trainingGoals)->merge(collect($cbtGoals))
            ->map(fn (array $goal) => array_merge($goal, ['value' => $this->clampPercent((int) $goal['value'])]))
            ->take(8)
            ->values();
    }

    private function goalPercent(CbtPlanGoal $goal): int
    {
        if ($goal->status === 'completed') {
            return 100;
        }

        $current = $goal->current_score;
        $baseline = $goal->baseline_score;
        $target = $goal->target_score;

        if ($current === null || $baseline === null || $target === null || (float) $target === (float) $baseline) {
            return 0;
        }

        $current = (float) $current;
        $baseline = (float) $baseline;
        $target = (float) $target;
        $progress = $target > $baseline
            ? (($current - $baseline) / ($target - $baseline)) * 100
            : (($baseline - $current) / ($baseline - $target)) * 100;

        return $this->clampPercent((int) round($progress));
    }

    private function fitnessPayload(int $userId): array
    {
        $checkIns = TrainerCheckIn::query()
            ->where('client_user_id', $userId)
            ->orderBy('checked_in_on')
            ->get();

        $weightPoints = $checkIns
            ->filter(fn (TrainerCheckIn $checkIn) => $checkIn->weight_kg !== null)
            ->take(-15)
            ->values()
            ->map(fn (TrainerCheckIn $checkIn) => [
                'date' => optional($checkIn->checked_in_on)->toDateString(),
                'label' => optional($checkIn->checked_in_on)->format('M j'),
                'value' => round((float) $checkIn->weight_kg, 1),
            ]);

        $latestWeight = $weightPoints->last()['value'] ?? null;
        $previousWeight = $weightPoints->count() > 1 ? $weightPoints[$weightPoints->count() - 2]['value'] : null;
        $latestProgress = $checkIns->last()?->goal_progress_percent;
        $averageProgress = $checkIns->count() > 0 ? (int) round($checkIns->avg('goal_progress_percent')) : null;

        return [
            'statusLabel' => $averageProgress === null ? 'No trainer check-ins yet' : ($averageProgress >= 70 ? 'Improving steadily' : 'Needs fresh check-ins'),
            'currentWeightKg' => $latestWeight,
            'weightDeltaKg' => $latestWeight !== null && $previousWeight !== null ? round($latestWeight - $previousWeight, 1) : null,
            'latestGoalProgressPercent' => $latestProgress,
            'averageGoalProgressPercent' => $averageProgress,
            'points' => $weightPoints,
        ];
    }

    private function mindPayload(int $userId): array
    {
        $responses = CbtExerciseResponse::query()
            ->where('client_id', $userId)
            ->whereNotNull('emotion_after')
            ->where('submitted_at', '>=', now()->subWeeks(8)->startOfDay())
            ->orderBy('submitted_at')
            ->get();

        $points = $responses
            ->groupBy(fn (CbtExerciseResponse $response) => $response->submitted_at->copy()->startOfWeek()->toDateString())
            ->map(function (Collection $items, string $weekStart) {
                $averageDistress = (float) $items->avg('emotion_after');

                return [
                    'date' => $weekStart,
                    'label' => Carbon::parse($weekStart)->format('M j'),
                    'value' => round(max(1, min(5, 5 - ($averageDistress / 25))), 1),
                ];
            })
            ->values();

        $latestScore = $points->last()['value'] ?? null;
        $previousScore = $points->count() > 1 ? $points[$points->count() - 2]['value'] : null;
        $weeklyCheckIns = CbtExerciseResponse::query()
            ->where('client_id', $userId)
            ->whereBetween('submitted_at', [now()->startOfWeek(), now()->endOfWeek()])
            ->count();

        return [
            'statusLabel' => $latestScore === null ? 'No CBT mood check-ins yet' : ($latestScore >= 3.5 ? 'Feeling stable and positive' : 'More support recommended'),
            'weeklyCheckInsCompleted' => min(7, $weeklyCheckIns),
            'weeklyCheckInsTotal' => 7,
            'currentMood' => $this->moodLabel($latestScore),
            'trendLabel' => $latestScore === null || $previousScore === null ? 'Not enough data' : ($latestScore >= $previousScore ? 'Improving' : 'Needs attention'),
            'points' => $points,
        ];
    }

    private function bodyMetrics(array $fitness): array
    {
        $metrics = [];

        if ($fitness['currentWeightKg'] !== null) {
            $metrics[] = [
                'label' => 'Weight',
                'value' => $fitness['currentWeightKg'] . ' kg',
                'detail' => $fitness['weightDeltaKg'] === null ? 'Latest check-in' : (($fitness['weightDeltaKg'] >= 0 ? '+' : '') . $fitness['weightDeltaKg'] . ' kg since last check-in'),
                'positive' => $fitness['weightDeltaKg'] !== null,
            ];
        }

        if ($fitness['latestGoalProgressPercent'] !== null) {
            $metrics[] = [
                'label' => 'Training Goal',
                'value' => $fitness['latestGoalProgressPercent'] . '%',
                'detail' => 'Latest trainer check-in',
                'positive' => $fitness['latestGoalProgressPercent'] >= 70,
            ];
        }

        return $metrics;
    }

    private function milestones(Collection $goals, array $fitness, array $mind, int $currentStreak): array
    {
        $milestones = [];
        $streakTarget = max(7, $currentStreak < 10 ? 10 : $currentStreak + 3);

        $milestones[] = [
            'title' => 'Reach ' . $streakTarget . '-day activity streak',
            'subtitle' => max(0, $streakTarget - $currentStreak) . ' days to go',
            'value' => $this->clampPercent((int) round(($currentStreak / $streakTarget) * 100)),
            'category' => 'streak',
        ];

        if ($goals->isNotEmpty()) {
            $lowestGoal = $goals->sortBy('value')->first();
            $milestones[] = [
                'title' => 'Move ' . $lowestGoal['label'] . ' forward',
                'subtitle' => $lowestGoal['value'] . '% complete',
                'value' => $lowestGoal['value'],
                'category' => $lowestGoal['category'],
            ];
        }

        if ($mind['weeklyCheckInsCompleted'] < $mind['weeklyCheckInsTotal']) {
            $milestones[] = [
                'title' => 'Complete weekly mood check-ins',
                'subtitle' => ($mind['weeklyCheckInsTotal'] - $mind['weeklyCheckInsCompleted']) . ' check-ins left this week',
                'value' => $this->clampPercent((int) round(($mind['weeklyCheckInsCompleted'] / $mind['weeklyCheckInsTotal']) * 100)),
                'category' => 'mind',
            ];
        }

        if ($fitness['latestGoalProgressPercent'] !== null && $fitness['latestGoalProgressPercent'] < 100) {
            $milestones[] = [
                'title' => 'Complete current training goal',
                'subtitle' => $fitness['latestGoalProgressPercent'] . '% complete',
                'value' => $fitness['latestGoalProgressPercent'],
                'category' => 'training',
            ];
        }

        return array_slice($milestones, 0, 4);
    }

    private function resources(int $userId): array
    {
        $cbtResources = CbtPlanExercise::query()
            ->where('assigned_to', $userId)
            ->where('status', 'active')
            ->with('template')
            ->latest()
            ->limit(3)
            ->get()
            ->map(fn (CbtPlanExercise $exercise) => [
                'title' => $exercise->title_override ?: $exercise->template?->title ?: 'CBT exercise',
                'subtitle' => $exercise->template?->description ?: 'Assigned by your care team',
                'image' => '/images/trainer/live-session/plank-hold.jpg',
                'kind' => 'mind',
            ]);

        $trainingResources = TrainerPlanActivity::query()
            ->whereHas('plan', fn ($query) => $query->where('client_user_id', $userId))
            ->whereIn('status', ['scheduled', 'modified'])
            ->orderBy('scheduled_for')
            ->limit(3)
            ->get()
            ->map(fn (TrainerPlanActivity $activity) => [
                'title' => $activity->title,
                'subtitle' => 'Scheduled for ' . optional($activity->scheduled_for)->format('M j'),
                'image' => '/images/trainer/live-session/dumbbell-bench-press.jpg',
                'kind' => 'training',
            ]);

        return $cbtResources->merge($trainingResources)->take(4)->values()->all();
    }

    private function recentActivity(int $userId): array
    {
        return ActivityEvent::query()
            ->where(function ($query) use ($userId): void {
                $query
                    ->where('actor_user_id', $userId)
                    ->orWhere('target_user_id', $userId)
                    ->orWhereHas('audiences', fn ($audienceQuery) => $audienceQuery->where('user_id', $userId));
            })
            ->orderByDesc('occurred_at')
            ->orderByDesc('created_at')
            ->limit(8)
            ->get()
            ->map(fn (ActivityEvent $event) => [
                'id' => $event->id,
                'title' => $event->summary,
                'subtitle' => $event->subject_label ?: str($event->category)->replace('_', ' ')->title()->toString(),
                'time' => optional($event->occurred_at ?? $event->created_at)->format('M j, Y - g:i A'),
                'category' => $event->category,
            ])
            ->values()
            ->all();
    }

    private function wellnessScore(Collection $goals, array $fitness, array $mind, int $currentStreak): int
    {
        $inputs = [];

        if ($goals->isNotEmpty()) {
            $inputs[] = (float) $goals->avg('value');
        }
        if ($fitness['averageGoalProgressPercent'] !== null) {
            $inputs[] = (float) $fitness['averageGoalProgressPercent'];
        }
        if ($mind['points']->isNotEmpty()) {
            $inputs[] = ((float) $mind['points']->avg('value') / 5) * 100;
        }
        if ($currentStreak > 0) {
            $inputs[] = min(100, $currentStreak * 10);
        }

        return $inputs === [] ? 0 : $this->clampPercent((int) round(collect($inputs)->avg()));
    }

    private function wellnessDelta(int $score, Collection $goals, array $fitness, array $mind): int
    {
        $signals = [];

        if ($goals->isNotEmpty()) {
            $signals[] = $goals->where('value', '>=', 70)->count() - $goals->where('value', '<', 40)->count();
        }
        if ($fitness['weightDeltaKg'] !== null) {
            $signals[] = $fitness['weightDeltaKg'] === 0.0 ? 0 : 1;
        }
        if ($mind['points']->count() > 1) {
            $previousScore = $mind['points'][$mind['points']->count() - 2]['value'] ?? 0;
            $signals[] = ($mind['points']->last()['value'] ?? 0) >= $previousScore ? 1 : -1;
        }

        if ($signals === []) {
            return $score > 0 ? 1 : 0;
        }

        return max(-12, min(12, array_sum($signals) * 2));
    }

    private function moodLabel(?float $score): string
    {
        if ($score === null) {
            return 'Not recorded';
        }

        return match (true) {
            $score >= 4.2 => 'Excellent',
            $score >= 3.4 => 'Positive',
            $score >= 2.6 => 'Neutral',
            $score >= 1.8 => 'Low',
            default => 'Needs support',
        };
    }

    private function clampPercent(int $value): int
    {
        return max(0, min(100, $value));
    }
}
