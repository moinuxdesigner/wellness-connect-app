<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\CbtCarePlan;
use App\Models\CbtExerciseResponse;
use App\Models\CbtRiskEvent;
use App\Models\CounsellorSessionNote;
use App\Models\Notification;
use App\Models\Practitioner;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;

class CounsellorNotificationController extends Controller
{
    private const PRIORITY_ORDER = [
        'critical' => 0,
        'high' => 1,
        'medium' => 2,
        'low' => 3,
    ];

    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        abort_unless($user?->role === 'counsellor', 403);

        $practitioner = Practitioner::query()
            ->where('user_id', $user->id)
            ->where('practitioner_type', 'counsellor')
            ->first();

        abort_unless($practitioner, 403, 'Counsellor practitioner profile is not available.');

        $clientIds = $this->assignedClientIds($practitioner);
        $notifications = Notification::query()
            ->where('user_id', $user->id)
            ->latest('id')
            ->limit(75)
            ->get();

        $notifiedRiskIds = $notifications
            ->map(fn (Notification $notification) => $this->meta($notification)['riskEventId'] ?? null)
            ->filter()
            ->map(fn ($id) => (int) $id)
            ->unique()
            ->values();

        $items = collect()
            ->merge($this->notificationItems($notifications))
            ->merge($this->sessionItems($practitioner))
            ->merge($this->riskItems($practitioner, $clientIds, $notifiedRiskIds))
            ->merge($this->cbtReviewItems($practitioner))
            ->sort(function (array $first, array $second): int {
                $priority = (self::PRIORITY_ORDER[$first['priority']] ?? 4) <=> (self::PRIORITY_ORDER[$second['priority']] ?? 4);
                if ($priority !== 0) {
                    return $priority;
                }

                $read = (int) $first['read'] <=> (int) $second['read'];
                if ($read !== 0) {
                    return $read;
                }

                return strtotime((string) ($second['createdAt'] ?? '')) <=> strtotime((string) ($first['createdAt'] ?? ''));
            })
            ->values();

        return response()->json([
            'summary' => [
                'unread' => $items->filter(fn (array $item) => !$item['read'])->count(),
                'clientActivity' => $items->filter(fn (array $item) => $item['category'] === 'clients')->count(),
                'todaysReminders' => $items->filter(fn (array $item) => $item['category'] === 'sessions')->count(),
                'urgentAlerts' => $items->filter(fn (array $item) => $item['category'] === 'urgent')->count(),
            ],
            'items' => $items,
        ]);
    }

    private function assignedClientIds(Practitioner $practitioner): Collection
    {
        $appointmentClientIds = Appointment::query()
            ->where('practitioner_id', $practitioner->id)
            ->distinct()
            ->pluck('client_user_id');

        $cbtClientIds = CbtCarePlan::query()
            ->where('primary_practitioner_id', $practitioner->id)
            ->distinct()
            ->pluck('client_id');

        return $appointmentClientIds
            ->merge($cbtClientIds)
            ->filter()
            ->map(fn ($id) => (int) $id)
            ->unique()
            ->values();
    }

    private function notificationItems(Collection $notifications): Collection
    {
        $clientNames = User::query()
            ->whereIn('id', $notifications->map(fn (Notification $notification) => $this->clientIdFromMeta($this->meta($notification)))->filter()->unique())
            ->pluck('name', 'id');

        return $notifications->map(function (Notification $notification) use ($clientNames): array {
            $meta = $this->meta($notification);
            $category = $this->categoryForNotification($notification->type);
            $clientId = $this->clientIdFromMeta($meta);
            $route = $this->routeForNotification($notification->type, $meta, $category);

            return [
                'id' => 'notification-' . $notification->id,
                'source' => 'notification',
                'notificationId' => $notification->id,
                'category' => $category,
                'priority' => $this->priorityForNotification($notification->type, $meta),
                'title' => (string) ($meta['title'] ?? $this->titleFromType($notification->type)),
                'message' => (string) ($meta['message'] ?? $meta['title'] ?? $this->titleFromType($notification->type)),
                'clientName' => $meta['clientName'] ?? ($clientId ? $clientNames[$clientId] ?? null : null),
                'clientId' => $clientId,
                'relatedId' => $meta['appointmentId'] ?? $meta['riskEventId'] ?? $meta['responseId'] ?? $meta['planId'] ?? null,
                'read' => $notification->read_at !== null || $notification->status === 'read',
                'createdAt' => optional($notification->created_at)->toIso8601String(),
                'actionLabel' => $this->actionLabelForCategory($category, $notification->type),
                'actionRoute' => $route,
            ];
        });
    }

    private function sessionItems(Practitioner $practitioner): Collection
    {
        $appointments = Appointment::query()
            ->where('practitioner_id', $practitioner->id)
            ->whereBetween('starts_at', [today()->startOfDay(), today()->endOfDay()])
            ->with('client:id,name,email')
            ->orderBy('starts_at')
            ->get();

        $notes = CounsellorSessionNote::query()
            ->whereIn('appointment_id', $appointments->pluck('id'))
            ->get()
            ->keyBy('appointment_id');

        return $appointments
            ->map(function (Appointment $appointment) use ($notes): array {
                $note = $notes->get($appointment->id);
                $state = $this->workflowState($appointment, $note);
                $startsAt = $appointment->starts_at;
                $minutesUntilStart = $startsAt ? now()->diffInMinutes($startsAt, false) : null;

                return [
                    'id' => 'session-' . $appointment->id,
                    'source' => 'session',
                    'notificationId' => null,
                    'category' => 'sessions',
                    'priority' => $this->priorityForSession($state, $minutesUntilStart),
                    'title' => $this->sessionTitle($state),
                    'message' => $this->sessionMessage($appointment, $state, $minutesUntilStart),
                    'clientName' => $appointment->client?->name,
                    'clientId' => $appointment->client_user_id,
                    'relatedId' => $appointment->id,
                    'read' => false,
                    'createdAt' => optional($appointment->starts_at)->toIso8601String(),
                    'actionLabel' => $this->sessionActionLabel($state),
                    'actionRoute' => '/counsellor/sessions',
                ];
            })
            ->filter(fn (array $item) => $item['title'] !== 'Completed Session')
            ->values();
    }

    private function riskItems(Practitioner $practitioner, Collection $clientIds, Collection $notifiedRiskIds): Collection
    {
        if ($clientIds->isEmpty()) {
            return collect();
        }

        return CbtRiskEvent::query()
            ->with(['client:id,name,email', 'carePlan:id,client_id,primary_practitioner_id,title'])
            ->whereIn('client_id', $clientIds)
            ->whereIn('status', ['open', 'acknowledged'])
            ->whereNotIn('id', $notifiedRiskIds)
            ->where(function ($query) use ($practitioner): void {
                $query
                    ->where('alerted_practitioner_id', $practitioner->user_id)
                    ->orWhereNull('alerted_practitioner_id')
                    ->orWhereHas('carePlan', fn ($planQuery) => $planQuery->where('primary_practitioner_id', $practitioner->id));
            })
            ->latest()
            ->limit(20)
            ->get()
            ->map(fn (CbtRiskEvent $event) => [
                'id' => 'risk-' . $event->id,
                'source' => 'risk_event',
                'notificationId' => null,
                'category' => 'urgent',
                'priority' => $event->risk_level === 'critical' ? 'critical' : 'high',
                'title' => 'Client Risk Escalation',
                'message' => $event->trigger_text ?: 'A client risk event needs clinical review.',
                'clientName' => $event->client?->name,
                'clientId' => $event->client_id,
                'relatedId' => $event->id,
                'read' => false,
                'createdAt' => optional($event->created_at)->toIso8601String(),
                'actionLabel' => 'Review Risk',
                'actionRoute' => $event->care_plan_id ? '/counsellor/cbt/plans/' . $event->care_plan_id : '/counsellor/clients',
            ]);
    }

    private function cbtReviewItems(Practitioner $practitioner): Collection
    {
        return CbtExerciseResponse::query()
            ->with(['client:id,name,email', 'instance.planExercise.template', 'instance.planExercise.carePlan:id,client_id,primary_practitioner_id,title'])
            ->whereDoesntHave('review')
            ->whereHas('instance.planExercise.carePlan', fn ($query) => $query->where('primary_practitioner_id', $practitioner->id))
            ->latest('submitted_at')
            ->limit(20)
            ->get()
            ->map(function (CbtExerciseResponse $response): array {
                $plan = $response->instance?->planExercise?->carePlan;
                $exerciseTitle = $response->instance?->planExercise?->title_override
                    ?: $response->instance?->planExercise?->template?->title
                    ?: 'CBT homework';

                return [
                    'id' => 'cbt-response-' . $response->id,
                    'source' => 'cbt_response',
                    'notificationId' => null,
                    'category' => 'cbt_care',
                    'priority' => 'medium',
                    'title' => 'Homework Completed',
                    'message' => $exerciseTitle . ' is ready for review.',
                    'clientName' => $response->client?->name,
                    'clientId' => $response->client_id,
                    'relatedId' => $response->id,
                    'read' => false,
                    'createdAt' => optional($response->submitted_at ?? $response->created_at)->toIso8601String(),
                    'actionLabel' => 'Review Submission',
                    'actionRoute' => $plan ? '/counsellor/cbt/plans/' . $plan->id : '/counsellor/cbt/reviews',
                ];
            });
    }

    private function meta(Notification $notification): array
    {
        return is_array($notification->payload_json) ? $notification->payload_json : [];
    }

    private function clientIdFromMeta(array $meta): ?int
    {
        $id = $meta['clientId'] ?? $meta['client_id'] ?? null;
        return $id ? (int) $id : null;
    }

    private function categoryForNotification(string $type): string
    {
        $normalized = strtolower($type);
        if (str_contains($normalized, 'risk') || str_contains($normalized, 'escalation') || str_contains($normalized, 'crisis')) {
            return 'urgent';
        }
        if (str_contains($normalized, 'appointment') || str_contains($normalized, 'session')) {
            return 'sessions';
        }
        if (str_contains($normalized, 'cbt') || str_contains($normalized, 'homework') || str_contains($normalized, 'exercise')) {
            return 'cbt_care';
        }
        if (str_contains($normalized, 'client') || str_contains($normalized, 'intake') || str_contains($normalized, 'message') || str_contains($normalized, 'document')) {
            return 'clients';
        }

        return 'system';
    }

    private function priorityForNotification(string $type, array $meta): string
    {
        $priority = strtolower((string) ($meta['priority'] ?? $meta['severity'] ?? ''));
        if (in_array($priority, ['critical', 'high', 'medium', 'low'], true)) {
            return $priority;
        }

        $normalized = strtolower($type);
        if (str_contains($normalized, 'risk') || str_contains($normalized, 'crisis')) {
            return 'critical';
        }
        if (str_contains($normalized, 'escalation') || str_contains($normalized, 'waiting') || str_contains($normalized, 'no_show')) {
            return 'high';
        }
        if (str_contains($normalized, 'cbt') || str_contains($normalized, 'client') || str_contains($normalized, 'intake')) {
            return 'medium';
        }

        return 'low';
    }

    private function routeForNotification(string $type, array $meta, string $category): ?string
    {
        if (!empty($meta['actionRoute']) && is_string($meta['actionRoute'])) {
            return $meta['actionRoute'];
        }

        if ($category === 'sessions') {
            return '/counsellor/sessions';
        }
        if ($category === 'urgent') {
            return !empty($meta['planId']) ? '/counsellor/cbt/plans/' . $meta['planId'] : '/counsellor/clients';
        }
        if ($category === 'cbt_care') {
            return !empty($meta['planId']) ? '/counsellor/cbt/plans/' . $meta['planId'] : '/counsellor/cbt/reviews';
        }
        if ($category === 'clients') {
            return !empty($meta['clientId']) ? '/counsellor/cbt/clients/' . $meta['clientId'] : '/counsellor/clients';
        }

        return null;
    }

    private function actionLabelForCategory(string $category, string $type): string
    {
        if ($category === 'urgent') {
            return 'Open Case';
        }
        if ($category === 'sessions') {
            return str_contains(strtolower($type), 'notes') ? 'Write Notes' : 'Open Session';
        }
        if ($category === 'cbt_care') {
            return 'Review';
        }
        if ($category === 'clients') {
            return 'View Client';
        }

        return 'View';
    }

    private function workflowState(Appointment $appointment, ?CounsellorSessionNote $note): string
    {
        if ($note && in_array($note->workflow_state, ['client_waiting', 'in_progress', 'follow_up_required', 'escalated', 'completed'], true)) {
            return $note->workflow_state;
        }

        if ($appointment->status === 'completed') {
            return $note && $this->hasSoapNotes($note) ? 'completed' : 'notes_pending';
        }

        return 'upcoming';
    }

    private function priorityForSession(string $state, ?int $minutesUntilStart): string
    {
        if ($state === 'escalated' || $state === 'client_waiting') {
            return 'critical';
        }
        if (in_array($state, ['in_progress', 'notes_pending', 'follow_up_required'], true)) {
            return 'high';
        }
        if ($minutesUntilStart !== null && $minutesUntilStart >= 0 && $minutesUntilStart <= 15) {
            return 'high';
        }

        return 'medium';
    }

    private function sessionTitle(string $state): string
    {
        return match ($state) {
            'client_waiting' => 'Client Joined Session',
            'in_progress' => 'Session In Progress',
            'notes_pending' => 'Session Completed',
            'follow_up_required' => 'Follow-up Required',
            'escalated' => 'Escalated Session',
            'completed' => 'Completed Session',
            default => 'Session Starts Soon',
        };
    }

    private function sessionMessage(Appointment $appointment, string $state, ?int $minutesUntilStart): string
    {
        $client = $appointment->client?->name ?? 'Client';

        return match ($state) {
            'client_waiting' => $client . ' is waiting in the virtual room.',
            'in_progress' => 'Resume the active session with ' . $client . '.',
            'notes_pending' => 'Notes are pending for the completed session with ' . $client . '.',
            'follow_up_required' => 'Follow-up needs scheduling for ' . $client . '.',
            'escalated' => 'This session has been escalated and needs review.',
            'completed' => 'Session completed successfully.',
            default => $minutesUntilStart !== null && $minutesUntilStart >= 0
                ? 'Session with ' . $client . ' starts in ' . $minutesUntilStart . ' minutes.'
                : 'Session with ' . $client . ' is scheduled today.',
        };
    }

    private function sessionActionLabel(string $state): string
    {
        return match ($state) {
            'client_waiting' => 'Join Session',
            'in_progress' => 'Resume',
            'notes_pending' => 'Write Notes',
            'follow_up_required' => 'Schedule Follow-up',
            'escalated' => 'Review',
            'completed' => 'View Notes',
            default => 'Open Client',
        };
    }

    private function hasSoapNotes(CounsellorSessionNote $note): bool
    {
        return collect([$note->subjective, $note->objective, $note->assessment, $note->plan])
            ->filter(fn (?string $value) => trim((string) $value) !== '')
            ->isNotEmpty();
    }

    private function titleFromType(string $type): string
    {
        return str($type)->replace(['_', '-'], ' ')->title()->toString();
    }
}
