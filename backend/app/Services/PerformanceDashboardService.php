<?php

namespace App\Services;

use App\Models\Appointment;
use App\Models\AvailabilitySlot;
use App\Models\Practitioner;
use App\Models\SupportRequest;
use App\Models\TrainerApplication;
use App\Models\WorkflowCase;
use Carbon\Carbon;
use Carbon\CarbonPeriod;
use Illuminate\Support\Collection;

class PerformanceDashboardService
{
    private const WINDOW_DAYS = [
        '7d' => 7,
        '30d' => 30,
        '90d' => 90,
    ];

    public function build(string $window = '30d'): array
    {
        $window = array_key_exists($window, self::WINDOW_DAYS) ? $window : '30d';
        [$start, $end, $dateKeys, $labels] = $this->windowBounds($window);

        $counsellorUtilization = $this->buildUtilizationMetric('counsellor', $start, $end);
        $trainerUtilization = $this->buildUtilizationMetric('trainer', $start, $end);
        $appointments = Appointment::query()
            ->whereBetween('starts_at', [$start, $end])
            ->get(['id', 'starts_at', 'status']);

        $appointmentOutcomes = $this->buildAppointmentOutcomes($appointments, $dateKeys);
        $workflowPerformance = $this->buildWorkflowPerformance($start, $end, $dateKeys, $labels);
        $trainerApplications = $this->buildTrainerApplicationPerformance($start, $end);

        $completionRate = $this->ratio(
            $appointments->where('status', 'completed')->count(),
            $appointments->whereIn('status', ['completed', 'cancelled', 'no_show'])->count()
        );

        $noShowRate = $this->ratio(
            $appointments->where('status', 'no_show')->count(),
            $appointments->whereIn('status', ['completed', 'no_show'])->count()
        );

        return [
            'window' => $window,
            'summaryCards' => [
                $this->summaryCard(
                    key: 'counsellor_utilization',
                    label: 'Counsellor Utilization',
                    value: $counsellorUtilization['percentage'],
                    unit: 'percent',
                    deltaLabel: "{$counsellorUtilization['numerator']} of {$counsellorUtilization['denominator']} available slots booked",
                    tone: $this->toneForPercent($counsellorUtilization['percentage'])
                ),
                $this->summaryCard(
                    key: 'trainer_utilization',
                    label: 'Trainer Utilization',
                    value: $trainerUtilization['percentage'],
                    unit: 'percent',
                    deltaLabel: "{$trainerUtilization['numerator']} of {$trainerUtilization['denominator']} available slots booked",
                    tone: $this->toneForPercent($trainerUtilization['percentage'])
                ),
                $this->summaryCard(
                    key: 'appointment_completion_rate',
                    label: 'Appointment Completion Rate',
                    value: $completionRate,
                    unit: 'percent',
                    deltaLabel: "{$appointments->where('status', 'completed')->count()} completed from {$appointments->whereIn('status', ['completed', 'cancelled', 'no_show'])->count()} final outcomes",
                    tone: $this->toneForPercent($completionRate)
                ),
                $this->summaryCard(
                    key: 'helpdesk_first_response',
                    label: 'Helpdesk First Response',
                    value: $workflowPerformance['support']['medianFirstResponseMinutes'],
                    unit: 'minutes',
                    deltaLabel: "{$workflowPerformance['support']['acknowledged']} cases acknowledged in this window",
                    tone: $this->toneForLatency($workflowPerformance['support']['medianFirstResponseMinutes'], 60, 240)
                ),
                $this->summaryCard(
                    key: 'critical_escalation_breach_rate',
                    label: 'Escalation Breach Rate',
                    value: $workflowPerformance['escalation']['breachRate'],
                    unit: 'percent',
                    deltaLabel: "{$workflowPerformance['escalation']['breached']} breached of {$workflowPerformance['escalation']['opened']} opened",
                    tone: $this->toneForInversePercent($workflowPerformance['escalation']['breachRate'])
                ),
                $this->summaryCard(
                    key: 'trainer_review_turnaround',
                    label: 'Trainer Review Turnaround',
                    value: $trainerApplications['medianTurnaroundHours'],
                    unit: 'hours',
                    deltaLabel: "{$trainerApplications['resolved']} reviewed applications in this window",
                    tone: $this->toneForLatency($trainerApplications['medianTurnaroundHours'], 48, 120)
                ),
            ],
            'utilization' => [
                'counsellor' => $counsellorUtilization,
                'trainer' => $trainerUtilization,
            ],
            'appointmentTrends' => [
                'labels' => $labels,
                'series' => [
                    ['key' => 'completed', 'label' => 'Completed', 'data' => $appointmentOutcomes['completed']],
                    ['key' => 'cancelled', 'label' => 'Cancelled', 'data' => $appointmentOutcomes['cancelled']],
                    ['key' => 'no_show', 'label' => 'No-show', 'data' => $appointmentOutcomes['no_show']],
                ],
                'completionRate' => $completionRate,
                'noShowRate' => $noShowRate,
            ],
            'workflowPerformance' => $workflowPerformance,
            'trainerApplicationPerformance' => $trainerApplications,
            'exceptions' => [
                'escalations' => $this->buildEscalationExceptions(),
                'supportCases' => $this->buildSupportExceptions(),
                'trainerApplications' => $this->buildTrainerApplicationExceptions(),
            ],
        ];
    }

    private function buildUtilizationMetric(string $type, Carbon $start, Carbon $end): array
    {
        $baseQuery = AvailabilitySlot::query()
            ->whereBetween('starts_at', [$start, $end])
            ->whereIn('slot_status', ['open', 'booked'])
            ->whereHas('practitioner', fn ($query) => $query->where('practitioner_type', $type));

        $denominator = (clone $baseQuery)->count();
        $numerator = (clone $baseQuery)->where('slot_status', 'booked')->count();

        return [
            'label' => ucfirst($type) . ' utilization',
            'numerator' => $numerator,
            'denominator' => $denominator,
            'percentage' => $this->ratio($numerator, $denominator),
        ];
    }

    private function buildAppointmentOutcomes(Collection $appointments, array $dateKeys): array
    {
        $outcomes = [
            'completed' => array_fill(0, count($dateKeys), 0),
            'cancelled' => array_fill(0, count($dateKeys), 0),
            'no_show' => array_fill(0, count($dateKeys), 0),
        ];
        $indexByDate = array_flip($dateKeys);

        foreach ($appointments as $appointment) {
            if (!in_array($appointment->status, ['completed', 'cancelled', 'no_show'], true)) {
                continue;
            }

            $key = optional($appointment->starts_at)->toDateString();
            if ($key === null || !isset($indexByDate[$key])) {
                continue;
            }

            $outcomes[$appointment->status][$indexByDate[$key]]++;
        }

        return $outcomes;
    }

    private function buildWorkflowPerformance(Carbon $start, Carbon $end, array $dateKeys, array $labels): array
    {
        $escalationCases = WorkflowCase::query()
            ->where('workflow_key', WorkflowConfigService::CRITICAL_RISK_ESCALATION)
            ->get();

        $supportCases = WorkflowCase::query()
            ->where('workflow_key', WorkflowConfigService::CROSS_TEAM_FOLLOW_UP_SLA)
            ->where('subject_type', SupportRequest::class)
            ->get();

        $escalationOpenedInWindow = $escalationCases->filter(fn (WorkflowCase $case) => $this->inWindow($case->created_at, $start, $end));
        $escalationResolvedInWindow = $escalationCases->filter(fn (WorkflowCase $case) => $this->inWindow($case->resolved_at, $start, $end));
        $escalationDurations = $escalationResolvedInWindow
            ->filter(fn (WorkflowCase $case) => $case->resolved_at !== null)
            ->map(fn (WorkflowCase $case) => $case->created_at?->diffInMinutes($case->resolved_at))
            ->filter(fn ($value) => $value !== null)
            ->values()
            ->all();
        $escalationBreached = $escalationOpenedInWindow
            ->filter(fn (WorkflowCase $case) => $case->breached_at !== null || $case->status === 'breached')
            ->count();

        $supportOpenedInWindow = $supportCases->filter(fn (WorkflowCase $case) => $this->inWindow($case->created_at, $start, $end));
        $supportAcknowledgedInWindow = $supportCases->filter(fn (WorkflowCase $case) => $this->inWindow($case->acknowledged_at, $start, $end));
        $supportResolvedInWindow = $supportCases->filter(fn (WorkflowCase $case) => $this->inWindow($case->resolved_at, $start, $end));
        $supportResponseDurations = $supportAcknowledgedInWindow
            ->filter(fn (WorkflowCase $case) => $case->acknowledged_at !== null)
            ->map(fn (WorkflowCase $case) => $case->created_at?->diffInMinutes($case->acknowledged_at))
            ->filter(fn ($value) => $value !== null)
            ->values()
            ->all();

        return [
            'labels' => $labels,
            'escalation' => [
                'opened' => $escalationOpenedInWindow->count(),
                'resolved' => $escalationResolvedInWindow->count(),
                'breached' => $escalationBreached,
                'openNow' => $escalationCases->whereIn('status', ['open', 'acknowledged'])->count(),
                'breachedNow' => $escalationCases->where('status', 'breached')->count(),
                'breachRate' => $this->ratio($escalationBreached, $escalationOpenedInWindow->count()),
                'medianResolutionMinutes' => $this->median($escalationDurations),
                'openedSeries' => $this->dailyCountSeries($escalationOpenedInWindow, $dateKeys, 'created_at'),
                'resolvedSeries' => $this->dailyCountSeries($escalationResolvedInWindow, $dateKeys, 'resolved_at'),
            ],
            'support' => [
                'opened' => $supportOpenedInWindow->count(),
                'acknowledged' => $supportAcknowledgedInWindow->count(),
                'resolved' => $supportResolvedInWindow->count(),
                'openNow' => $supportCases->whereIn('status', ['open', 'acknowledged'])->count(),
                'breachedNow' => $supportCases->where('status', 'breached')->count(),
                'medianFirstResponseMinutes' => $this->median($supportResponseDurations),
                'openedSeries' => $this->dailyCountSeries($supportOpenedInWindow, $dateKeys, 'created_at'),
                'resolvedSeries' => $this->dailyCountSeries($supportResolvedInWindow, $dateKeys, 'resolved_at'),
            ],
        ];
    }

    private function buildTrainerApplicationPerformance(Carbon $start, Carbon $end): array
    {
        $submitted = TrainerApplication::query()
            ->whereBetween('submitted_at', [$start, $end])
            ->count();

        $underReview = TrainerApplication::query()
            ->where('status', 'under_review')
            ->whereBetween('submitted_at', [$start, $end])
            ->count();

        $resolvedApplications = TrainerApplication::query()
            ->whereIn('status', ['approved', 'rejected', 'needs_resubmission'])
            ->whereBetween('updated_at', [$start, $end])
            ->get();

        $turnaroundHours = $resolvedApplications
            ->map(fn (TrainerApplication $application) => $application->submitted_at?->diffInHours($application->updated_at))
            ->filter(fn ($value) => $value !== null)
            ->values()
            ->all();

        return [
            'submitted' => $submitted,
            'underReview' => $underReview,
            'resolved' => $resolvedApplications->count(),
            'medianTurnaroundHours' => $this->median($turnaroundHours),
        ];
    }

    private function buildEscalationExceptions(): array
    {
        return WorkflowCase::query()
            ->where('workflow_key', WorkflowConfigService::CRITICAL_RISK_ESCALATION)
            ->where(function ($query): void {
                $query->where(function ($subQuery): void {
                    $subQuery->whereIn('status', ['open', 'acknowledged'])
                        ->whereNotNull('due_at')
                        ->where('due_at', '<', now());
                })->orWhere('status', 'breached');
            })
            ->latest('id')
            ->limit(10)
            ->get()
            ->map(fn (WorkflowCase $case) => $this->workflowExceptionRow($case))
            ->values()
            ->all();
    }

    private function buildSupportExceptions(): array
    {
        return WorkflowCase::query()
            ->where('workflow_key', WorkflowConfigService::CROSS_TEAM_FOLLOW_UP_SLA)
            ->where('subject_type', SupportRequest::class)
            ->where(function ($query): void {
                $query->where(function ($subQuery): void {
                    $subQuery->whereIn('status', ['open', 'acknowledged'])
                        ->whereNotNull('due_at')
                        ->where('due_at', '<', now());
                })->orWhere('status', 'breached');
            })
            ->latest('id')
            ->limit(10)
            ->get()
            ->map(fn (WorkflowCase $case) => $this->workflowExceptionRow($case))
            ->values()
            ->all();
    }

    private function buildTrainerApplicationExceptions(): array
    {
        return TrainerApplication::query()
            ->whereIn('status', ['submitted', 'under_review'])
            ->where('submitted_at', '<=', now()->subDays(7))
            ->latest('submitted_at')
            ->limit(10)
            ->get()
            ->map(fn (TrainerApplication $application) => [
                'id' => $application->application_id,
                'title' => $application->applicant_name,
                'secondaryLabel' => $application->applicant_email,
                'status' => $application->status,
                'priority' => null,
                'ownerRole' => 'admin',
                'dueAt' => null,
                'ageHours' => $application->submitted_at?->diffInHours(now()),
            ])
            ->values()
            ->all();
    }

    private function workflowExceptionRow(WorkflowCase $case): array
    {
        $meta = $case->meta_json ?? [];

        return [
            'id' => $case->id,
            'title' => (string) ($meta['title'] ?? 'Workflow case'),
            'secondaryLabel' => (string) ($meta['summary'] ?? ''),
            'status' => $case->status,
            'priority' => $case->priority,
            'ownerRole' => $case->owner_role,
            'dueAt' => optional($case->due_at)?->toIso8601String(),
            'ageHours' => $case->created_at?->diffInHours(now()),
        ];
    }

    private function dailyCountSeries(Collection $items, array $dateKeys, string $dateField): array
    {
        $series = array_fill(0, count($dateKeys), 0);
        $indexByDate = array_flip($dateKeys);

        foreach ($items as $item) {
            $date = $item->{$dateField};
            $key = $date?->toDateString();
            if ($key === null || !isset($indexByDate[$key])) {
                continue;
            }

            $series[$indexByDate[$key]]++;
        }

        return $series;
    }

    private function windowBounds(string $window): array
    {
        $days = self::WINDOW_DAYS[$window];
        $end = now()->endOfDay();
        $start = now()->subDays($days - 1)->startOfDay();
        $period = CarbonPeriod::create($start, '1 day', $end);
        $dateKeys = [];
        $labels = [];

        foreach ($period as $date) {
            $dateKeys[] = $date->toDateString();
            $labels[] = $date->format('M j');
        }

        return [$start, $end, $dateKeys, $labels];
    }

    private function summaryCard(string $key, string $label, ?float $value, string $unit, string $deltaLabel, string $tone): array
    {
        return [
            'key' => $key,
            'label' => $label,
            'value' => $value,
            'unit' => $unit,
            'deltaLabel' => $deltaLabel,
            'tone' => $tone,
        ];
    }

    private function ratio(int $numerator, int $denominator): ?float
    {
        if ($denominator < 1) {
            return null;
        }

        return round(($numerator / $denominator) * 100, 1);
    }

    private function median(array $values): ?float
    {
        if ($values === []) {
            return null;
        }

        sort($values);
        $count = count($values);
        $middle = intdiv($count, 2);

        if ($count % 2 === 1) {
            return round((float) $values[$middle], 1);
        }

        return round(((float) $values[$middle - 1] + (float) $values[$middle]) / 2, 1);
    }

    private function toneForPercent(?float $value): string
    {
        if ($value === null) {
            return 'neutral';
        }

        if ($value >= 75) {
            return 'success';
        }

        if ($value >= 50) {
            return 'warning';
        }

        return 'danger';
    }

    private function toneForInversePercent(?float $value): string
    {
        if ($value === null) {
            return 'neutral';
        }

        if ($value <= 10) {
            return 'success';
        }

        if ($value <= 25) {
            return 'warning';
        }

        return 'danger';
    }

    private function toneForLatency(?float $value, float $goodThreshold, float $warningThreshold): string
    {
        if ($value === null) {
            return 'neutral';
        }

        if ($value <= $goodThreshold) {
            return 'success';
        }

        if ($value <= $warningThreshold) {
            return 'warning';
        }

        return 'danger';
    }

    private function inWindow(?Carbon $value, Carbon $start, Carbon $end): bool
    {
        return $value !== null && $value->between($start, $end);
    }
}
