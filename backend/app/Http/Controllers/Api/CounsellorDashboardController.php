<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\CbtRiskEvent;
use App\Models\Practitioner;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;

class CounsellorDashboardController extends Controller
{
    public function show(Request $request): JsonResponse
    {
        $user = $request->user();
        abort_unless($user && $user->role === 'counsellor', 403);

        $practitioner = Practitioner::query()
            ->where('user_id', $user->id)
            ->where('practitioner_type', 'counsellor')
            ->first();

        if (!$practitioner) {
            return response()->json($this->emptyPayload());
        }

        $todayStart = today()->startOfDay();
        $todayEnd = today()->endOfDay();
        $activeStatuses = ['scheduled', 'rescheduled', 'completed'];
        $upcomingStatuses = ['scheduled', 'rescheduled'];

        $clientIds = Appointment::query()
            ->where('practitioner_id', $practitioner->id)
            ->distinct()
            ->pluck('client_user_id')
            ->filter()
            ->values();

        $todayAppointments = Appointment::query()
            ->where('practitioner_id', $practitioner->id)
            ->whereIn('status', $activeStatuses)
            ->whereBetween('starts_at', [$todayStart, $todayEnd])
            ->get();

        $upcomingClientIds = Appointment::query()
            ->where('practitioner_id', $practitioner->id)
            ->whereIn('status', $upcomingStatuses)
            ->where('starts_at', '>=', now())
            ->distinct()
            ->pluck('client_user_id')
            ->filter()
            ->values();

        $riskEvents = $this->openRiskEvents($clientIds, $practitioner->user_id);
        $riskClientIds = $riskEvents->pluck('client_id')->unique();
        $clientsWithoutUpcomingSession = $clientIds->diff($upcomingClientIds);
        $followUpCount = $clientsWithoutUpcomingSession->merge($riskClientIds)->unique()->count();

        $todaySessionCount = $todayAppointments->count();
        $todayIntakeCount = $todayAppointments->whereNotNull('intake_flow_id')->count();
        $assignedClientCount = $clientIds->count();
        $riskFlagCount = $riskEvents->count();
        $criticalRiskCount = $riskEvents
            ->whereIn('risk_level', ['high', 'critical'])
            ->count();
        $completedTodayCount = $todayAppointments->where('status', 'completed')->count();

        return response()->json([
            'metrics' => [
                [
                    'title' => "Today's Sessions",
                    'value' => (string) $todaySessionCount,
                    'hint' => $todayIntakeCount === 1 ? '1 intake session' : "{$todayIntakeCount} intake sessions",
                ],
                [
                    'title' => 'Assigned Clients',
                    'value' => (string) $assignedClientCount,
                    'hint' => $followUpCount === 1 ? '1 needs follow-up' : "{$followUpCount} need follow-up",
                ],
                [
                    'title' => 'Risk Flags',
                    'value' => (string) $riskFlagCount,
                    'hint' => $criticalRiskCount > 0 ? "{$criticalRiskCount} high priority" : 'No high priority flags',
                ],
            ],
            'actions' => $this->actions($todaySessionCount, $followUpCount, $riskFlagCount),
            'flowReadiness' => [
                'happyPath' => [
                    [
                        'id' => 'session-queue',
                        'title' => 'Session Queue',
                        'status' => $todaySessionCount > 0 ? 'in_progress' : 'not_started',
                    ],
                    [
                        'id' => 'client-summary',
                        'title' => 'Client Summary',
                        'status' => $assignedClientCount > 0 ? 'completed' : 'not_started',
                    ],
                    [
                        'id' => 'session-notes',
                        'title' => 'Session Notes',
                        'status' => $completedTodayCount > 0 ? 'in_progress' : 'not_started',
                    ],
                ],
                'exceptionPath' => [
                    [
                        'id' => 'risk-flag',
                        'title' => 'Risk Flag',
                        'status' => $riskFlagCount > 0 ? 'escalated' : 'completed',
                    ],
                    [
                        'id' => 'escalate-admin',
                        'title' => 'Escalate to Admin',
                        'status' => $criticalRiskCount > 0 ? 'escalated' : 'completed',
                    ],
                ],
            ],
        ]);
    }

    private function emptyPayload(): array
    {
        return [
            'metrics' => [
                ['title' => "Today's Sessions", 'value' => '0', 'hint' => '0 intake sessions'],
                ['title' => 'Assigned Clients', 'value' => '0', 'hint' => '0 need follow-up'],
                ['title' => 'Risk Flags', 'value' => '0', 'hint' => 'No high priority flags'],
            ],
            'actions' => ['Review upcoming availability', 'Review assigned clients', 'Monitor risk flags'],
            'flowReadiness' => [
                'happyPath' => [
                    ['id' => 'session-queue', 'title' => 'Session Queue', 'status' => 'not_started'],
                    ['id' => 'client-summary', 'title' => 'Client Summary', 'status' => 'not_started'],
                    ['id' => 'session-notes', 'title' => 'Session Notes', 'status' => 'not_started'],
                ],
                'exceptionPath' => [
                    ['id' => 'risk-flag', 'title' => 'Risk Flag', 'status' => 'completed'],
                    ['id' => 'escalate-admin', 'title' => 'Escalate to Admin', 'status' => 'completed'],
                ],
            ],
        ];
    }

    private function openRiskEvents(Collection $clientIds, int $practitionerUserId): Collection
    {
        if ($clientIds->isEmpty()) {
            return collect();
        }

        return CbtRiskEvent::query()
            ->whereIn('client_id', $clientIds)
            ->whereIn('status', ['open', 'acknowledged'])
            ->where(function ($query) use ($practitionerUserId): void {
                $query
                    ->where('alerted_practitioner_id', $practitionerUserId)
                    ->orWhereNull('alerted_practitioner_id');
            })
            ->get();
    }

    private function actions(int $todaySessions, int $followUpCount, int $riskFlagCount): array
    {
        return [
            $todaySessions > 0 ? 'Review session queue' : 'Review upcoming availability',
            $followUpCount > 0 ? "Follow up with {$followUpCount} clients" : 'Review assigned clients',
            $riskFlagCount > 0 ? 'Review risk flags' : 'Monitor risk flags',
        ];
    }
}
