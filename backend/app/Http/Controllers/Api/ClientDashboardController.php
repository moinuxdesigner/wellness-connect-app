<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ActivityEvent;
use App\Models\Appointment;
use App\Models\CbtCarePlan;
use App\Models\CbtExerciseInstance;
use App\Models\MembershipSubscription;
use App\Models\TrainerPlan;
use App\Models\TrainerPlanActivity;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;

class ClientDashboardController extends Controller
{
    public function show(Request $request): JsonResponse
    {
        $user = $request->user();
        abort_unless($user?->role === 'client', 403);

        $todayStart = today()->startOfDay();
        $todayEnd = today()->endOfDay();

        $nextAppointment = Appointment::query()
            ->where('client_user_id', $user->id)
            ->whereIn('status', ['scheduled', 'rescheduled'])
            ->where('starts_at', '>=', now())
            ->with('practitioner.user')
            ->orderBy('starts_at')
            ->first();

        $todayAppointments = Appointment::query()
            ->where('client_user_id', $user->id)
            ->whereBetween('starts_at', [$todayStart, $todayEnd])
            ->with('practitioner.user')
            ->orderBy('starts_at')
            ->get();

        $membership = MembershipSubscription::query()
            ->where('client_user_id', $user->id)
            ->with(['version', 'tier'])
            ->orderByRaw("CASE WHEN status = 'active' THEN 0 ELSE 1 END")
            ->latest()
            ->first();

        $trainerPlan = TrainerPlan::query()
            ->where('client_user_id', $user->id)
            ->where('status', 'active')
            ->latest()
            ->first();

        $cbtPlan = CbtCarePlan::query()
            ->where('client_id', $user->id)
            ->whereIn('status', ['active', 'draft'])
            ->latest()
            ->first();

        $pendingTasks = $this->pendingTaskCount($user->id);
        $completedDates = $this->completedActivityDates($user->id);

        return response()->json([
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
            ],
            'metrics' => [
                'nextSession' => $nextAppointment ? $this->nextSessionPayload($nextAppointment) : null,
                'tasksPending' => $pendingTasks,
                'activeProgram' => $this->activeProgramPayload($trainerPlan, $cbtPlan, $membership),
                'membershipStatus' => $this->membershipStatusPayload($membership),
            ],
            'schedule' => $todayAppointments->map(fn (Appointment $appointment) => $this->appointmentPayload($appointment))->values(),
            'recentActivity' => $this->recentActivity($user->id),
            'progress' => [
                'sessionsCompletedThisMonth' => Appointment::query()
                    ->where('client_user_id', $user->id)
                    ->where('status', 'completed')
                    ->whereBetween('starts_at', [now()->startOfMonth(), now()->endOfMonth()])
                    ->count(),
                'daysActiveThisMonth' => $completedDates
                    ->filter(fn (string $date) => Carbon::parse($date)->isSameMonth(now()))
                    ->unique()
                    ->count(),
                'currentStreakDays' => $this->currentStreak($completedDates),
            ],
        ]);
    }

    private function pendingTaskCount(int $userId): int
    {
        $cbtTasks = CbtExerciseInstance::query()
            ->where('client_id', $userId)
            ->whereIn('status', ['pending', 'in_progress'])
            ->count();

        $trainerTasks = TrainerPlanActivity::query()
            ->whereHas('plan', fn ($query) => $query->where('client_user_id', $userId))
            ->where('status', 'scheduled')
            ->count();

        return $cbtTasks + $trainerTasks;
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

    private function nextSessionPayload(Appointment $appointment): array
    {
        return [
            'value' => optional($appointment->starts_at)->format('g:i A'),
            'badge' => $this->serviceBadge($appointment->service_type),
            'serviceType' => $appointment->service_type,
            'startsAt' => optional($appointment->starts_at)->toIso8601String(),
        ];
    }

    private function appointmentPayload(Appointment $appointment): array
    {
        $practitionerName = $appointment->practitioner?->user?->name ?? 'Care team';

        return [
            'id' => $appointment->id,
            'time' => optional($appointment->starts_at)->format('g:i A'),
            'title' => $this->serviceTitle($appointment->service_type),
            'coach' => $practitionerName,
            'location' => $this->modeLabel($appointment->mode),
            'detail' => $this->modeDetail($appointment->mode),
            'status' => $this->statusLabel($appointment->status),
            'serviceType' => $appointment->service_type,
            'mode' => $appointment->mode,
            'startsAt' => optional($appointment->starts_at)->toIso8601String(),
        ];
    }

    private function activeProgramPayload(?TrainerPlan $trainerPlan, ?CbtCarePlan $cbtPlan, ?MembershipSubscription $membership): ?array
    {
        if ($trainerPlan) {
            return [
                'title' => $trainerPlan->goal_title,
                'type' => 'training',
                'status' => $trainerPlan->status,
            ];
        }

        if ($cbtPlan) {
            return [
                'title' => $cbtPlan->title,
                'type' => 'psychology',
                'status' => $cbtPlan->status,
            ];
        }

        if ($membership?->status === 'active') {
            return [
                'title' => $membership->version?->name ?? 'Wellness Membership',
                'type' => 'package',
                'status' => $membership->status,
            ];
        }

        return null;
    }

    private function membershipStatusPayload(?MembershipSubscription $membership): array
    {
        if (!$membership) {
            return ['label' => 'Inactive', 'status' => 'inactive'];
        }

        return [
            'label' => str($membership->status)->replace('_', ' ')->title()->toString(),
            'status' => $membership->status,
        ];
    }

    private function recentActivity(int $userId): Collection
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
            ->limit(5)
            ->get()
            ->map(fn (ActivityEvent $event) => [
                'id' => $event->id,
                'title' => $event->summary,
                'detail' => $this->activityDetail($event),
                'time' => optional($event->occurred_at ?? $event->created_at)->format('g:i A'),
                'category' => $event->category,
            ])
            ->values();
    }

    private function activityDetail(ActivityEvent $event): string
    {
        $date = optional($event->occurred_at ?? $event->created_at)->format('M j, Y');
        $subject = $event->subject_label;

        return $subject ? "{$subject} - {$date}" : (string) $date;
    }

    private function serviceTitle(string $serviceType): string
    {
        return match ($serviceType) {
            'psychology' => 'Psychology Session',
            'training' => 'Personal Training',
            'combined' => 'Combined Wellness Session',
            'package' => 'Wellness Package Session',
            default => str($serviceType)->replace('_', ' ')->title()->toString(),
        };
    }

    private function serviceBadge(string $serviceType): string
    {
        return match ($serviceType) {
            'psychology' => 'Psychology',
            'training' => 'Training',
            'combined' => 'Combined',
            'package' => 'Package',
            default => str($serviceType)->replace('_', ' ')->title()->toString(),
        };
    }

    private function modeLabel(string $mode): string
    {
        return match ($mode) {
            'online' => 'Online',
            'in_person' => 'In-Person',
            'hybrid' => 'Hybrid',
            default => str($mode)->replace('_', ' ')->title()->toString(),
        };
    }

    private function modeDetail(string $mode): string
    {
        return match ($mode) {
            'online' => 'Video Call',
            'in_person' => 'In-person session',
            'hybrid' => 'Hybrid session',
            default => 'Session',
        };
    }

    private function statusLabel(string $status): string
    {
        return match ($status) {
            'scheduled' => 'Upcoming',
            'rescheduled' => 'Rescheduled',
            'completed' => 'Completed',
            'cancelled' => 'Cancelled',
            'no_show' => 'No show',
            default => str($status)->replace('_', ' ')->title()->toString(),
        };
    }
}
