<?php

namespace App\Services;

use App\Models\ActivityEvent;
use App\Models\Appointment;
use App\Models\AppointmentEvent;
use App\Models\IntakeFlow;
use App\Models\MembershipPayment;
use App\Models\MembershipRefund;
use App\Models\MembershipSubscription;
use App\Models\PermissionChangeAudit;
use App\Models\RoleChangeAudit;
use App\Models\SupportRequest;
use App\Models\TrainerApplication;
use App\Models\User;
use App\Models\WellnessPackage;
use App\Models\WorkflowCase;
use App\Models\WorkflowConfigRevision;
use Carbon\Carbon;
use Carbon\CarbonInterface;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Collection;

class ActivityLogService
{
    public const ROLES = ['admin', 'client', 'counsellor', 'trainer', 'coach', 'helpdesk', 'finance', 'legal', 'content'];

    public function record(string $category, string $action, string $summary, array $context = []): ActivityEvent
    {
        $sourceKey = $context['sourceKey'] ?? null;
        if (is_string($sourceKey) && $sourceKey !== '') {
            $existing = ActivityEvent::query()->where('source_key', $sourceKey)->first();
            if ($existing) {
                return $existing->loadMissing(['actor:id,name,email,role,avatar_url', 'target:id,name,email,role,avatar_url']);
            }
        }

        $actor = $context['actor'] ?? null;
        $targetUser = $context['targetUser'] ?? null;
        $subject = $this->normalizeSubject($context['subject'] ?? null);
        $occurredAt = $this->normalizeOccurredAt($context['occurredAt'] ?? null);

        $event = ActivityEvent::query()->create([
            'source_key' => $sourceKey,
            'category' => $category,
            'action' => $action,
            'actor_user_id' => $actor instanceof User ? $actor->id : ($context['actorUserId'] ?? null),
            'actor_role' => $actor instanceof User ? $actor->role : ($context['actorRole'] ?? null),
            'target_user_id' => $targetUser instanceof User ? $targetUser->id : ($context['targetUserId'] ?? null),
            'target_role' => $targetUser instanceof User ? $targetUser->role : ($context['targetRole'] ?? null),
            'subject_type' => $subject['type'],
            'subject_id' => $subject['id'],
            'subject_label' => $subject['label'],
            'summary' => $summary,
            'details_json' => $context['details'] ?? [],
            'occurred_at' => $occurredAt,
        ]);

        $audienceRows = $this->buildAudienceRows(
            $context['audienceRoles'] ?? [],
            $context['audienceUsers'] ?? [],
            $actor instanceof User ? [$actor] : [],
            $targetUser instanceof User ? [$targetUser] : []
        );

        if ($audienceRows !== []) {
            $event->audiences()->createMany($audienceRows);
        }

        return $event->loadMissing(['actor:id,name,email,role,avatar_url', 'target:id,name,email,role,avatar_url']);
    }

    public function feed(User $user, array $filters = []): array
    {
        $availableCategoryQuery = $this->applyFeedFilters($this->visibleQuery($user), $filters, $user, false);
        $availableCategories = (clone $availableCategoryQuery)
            ->select('category')
            ->distinct()
            ->orderBy('category')
            ->pluck('category')
            ->values()
            ->all();

        $query = $this->applyFeedFilters($this->visibleQuery($user), $filters, $user);

        $page = max(1, (int) ($filters['page'] ?? 1));
        $pageSize = min(100, max(1, (int) ($filters['pageSize'] ?? 20)));
        $total = (clone $query)->count();

        $entries = $query
            ->with(['actor:id,name,email,role,avatar_url', 'target:id,name,email,role,avatar_url'])
            ->orderByDesc('occurred_at')
            ->orderByDesc('id')
            ->forPage($page, $pageSize)
            ->get()
            ->map(fn (ActivityEvent $event) => $this->serialize($event))
            ->values()
            ->all();

        return [
            'entries' => $entries,
            'pagination' => [
                'page' => $page,
                'pageSize' => $pageSize,
                'total' => $total,
                'totalPages' => max(1, (int) ceil($total / $pageSize)),
            ],
            'availableCategories' => $availableCategories,
            'availableActors' => $this->availableActors($user, $filters),
            'summary' => $this->summary($user, $filters, $total),
        ];
    }

    public function backfill(): int
    {
        $created = 0;

        foreach (RoleChangeAudit::query()->with(['actor', 'target'])->cursor() as $audit) {
            $created += $this->backfillRoleChange($audit);
        }

        foreach (PermissionChangeAudit::query()->with(['actor'])->cursor() as $audit) {
            $created += $this->backfillPermissionChange($audit);
        }

        foreach (AppointmentEvent::query()->with(['appointment.client', 'appointment.practitioner.user'])->cursor() as $event) {
            $created += $this->backfillAppointmentEvent($event);
        }

        foreach (SupportRequest::query()->with('requester')->cursor() as $supportRequest) {
            $created += $this->backfillSupportRequest($supportRequest);
        }

        foreach (WorkflowCase::query()->cursor() as $workflowCase) {
            $created += $this->backfillWorkflowCase($workflowCase);
        }

        foreach (WorkflowConfigRevision::query()->with(['actor', 'workflowConfig'])->cursor() as $revision) {
            $created += $this->backfillWorkflowRevision($revision);
        }

        return $created;
    }

    public function serialize(ActivityEvent $event): array
    {
        return [
            'id' => $event->id,
            'category' => $event->category,
            'action' => $event->action,
            'summary' => $event->summary,
            'occurredAt' => optional($event->occurred_at)->toIso8601String(),
            'actor' => $event->actor ? [
                'id' => $event->actor->id,
                'name' => $event->actor->name,
                'email' => $event->actor->email,
                'role' => $event->actor->role,
                'avatarUrl' => $event->actor->avatar_url,
                'avatar_url' => $event->actor->avatar_url,
            ] : ($event->actor_role ? [
                'id' => null,
                'name' => ucfirst((string) $event->actor_role),
                'email' => null,
                'role' => $event->actor_role,
            ] : null),
            'subject' => [
                'type' => $event->subject_type,
                'id' => $event->subject_id,
                'label' => $event->subject_label,
            ],
            'target' => $event->target ? [
                'id' => $event->target->id,
                'name' => $event->target->name,
                'email' => $event->target->email,
                'role' => $event->target->role,
                'avatarUrl' => $event->target->avatar_url,
                'avatar_url' => $event->target->avatar_url,
            ] : ($event->target_role ? [
                'id' => null,
                'name' => ucfirst((string) $event->target_role),
                'email' => null,
                'role' => $event->target_role,
            ] : null),
            'details' => $event->details_json ?? [],
        ];
    }

    private function visibleQuery(User $user)
    {
        $query = ActivityEvent::query();

        if ($user->role === 'admin') {
            return $query;
        }

        return $query->whereHas('audiences', function ($audienceQuery) use ($user): void {
            $audienceQuery
                ->where('role', $user->role)
                ->where(function ($visibilityQuery) use ($user): void {
                    $visibilityQuery
                        ->whereNull('user_id')
                        ->orWhere('user_id', $user->id);
                });
        });
    }

    private function applyFeedFilters(Builder $query, array $filters, User $user, bool $applyActorFilter = true): Builder
    {
        if (!empty($filters['category'])) {
            $query->where('category', $filters['category']);
        }

        if (!empty($filters['subjectType'])) {
            $query->where('subject_type', $filters['subjectType']);
        }

        if (!empty($filters['query'])) {
            $search = trim((string) $filters['query']);
            $query->where(function (Builder $searchQuery) use ($search): void {
                $like = '%' . str_replace(['%', '_'], ['\\%', '\\_'], $search) . '%';
                $searchQuery
                    ->where('summary', 'like', $like)
                    ->orWhere('subject_label', 'like', $like)
                    ->orWhereHas('actor', fn (Builder $actorQuery) => $actorQuery
                        ->where('name', 'like', $like)
                        ->orWhere('email', 'like', $like)
                    )
                    ->orWhereHas('target', fn (Builder $targetQuery) => $targetQuery
                        ->where('name', 'like', $like)
                        ->orWhere('email', 'like', $like)
                    );
            });
        }

        if (!empty($filters['dateFrom'])) {
            $query->where('occurred_at', '>=', Carbon::parse((string) $filters['dateFrom'])->startOfDay());
        }

        if (!empty($filters['dateTo'])) {
            $query->where('occurred_at', '<=', Carbon::parse((string) $filters['dateTo'])->endOfDay());
        }

        if ($user->role === 'admin') {
            if (!empty($filters['role'])) {
                $query->whereHas('audiences', fn (Builder $audienceQuery) => $audienceQuery->where('role', $filters['role']));
            }

            if ($applyActorFilter && !empty($filters['actorUserId'])) {
                $query->where('actor_user_id', (int) $filters['actorUserId']);
            }

            if (!empty($filters['targetRole'])) {
                $query->where('target_role', $filters['targetRole']);
            }
        }

        return $query;
    }

    private function availableActors(User $user, array $filters): array
    {
        $actorIds = $this->applyFeedFilters($this->visibleQuery($user), $filters, $user, false)
            ->whereNotNull('actor_user_id')
            ->select('actor_user_id')
            ->distinct()
            ->limit(50)
            ->pluck('actor_user_id')
            ->map(fn ($id) => (int) $id)
            ->all();

        if ($actorIds === []) {
            return [];
        }

        $actors = User::query()
            ->whereIn('id', $actorIds)
            ->get(['id', 'name', 'role', 'avatar_url'])
            ->keyBy('id');

        return collect($actorIds)
            ->map(function (int $actorId) use ($actors): ?array {
                $actor = $actors->get($actorId);
                if (!$actor) {
                    return null;
                }

                return [
                    'id' => $actor->id,
                    'name' => $actor->name,
                    'role' => $actor->role,
                    'avatarUrl' => $actor->avatar_url,
                    'avatar_url' => $actor->avatar_url,
                ];
            })
            ->filter()
            ->values()
            ->all();
    }

    private function summary(User $user, array $filters, int $total): array
    {
        $query = $this->applyFeedFilters($this->visibleQuery($user), $filters, $user);

        $todayActivities = (clone $query)
            ->whereDate('occurred_at', now()->toDateString())
            ->count();

        $admins = (clone $query)
            ->where(function (Builder $adminQuery): void {
                $adminQuery
                    ->where('actor_role', 'admin')
                    ->orWhereHas('actor', fn (Builder $actorQuery) => $actorQuery->where('role', 'admin'));
            })
            ->distinct()
            ->pluck('actor_user_id')
            ->filter()
            ->unique()
            ->count();

        $usersAffected = collect((clone $query)->get(['target_user_id', 'subject_type', 'subject_id']))
            ->flatMap(function (ActivityEvent $event): array {
                $ids = [];
                if ($event->target_user_id) {
                    $ids[] = 'target:' . $event->target_user_id;
                }

                if ($event->subject_type === User::class && $event->subject_id) {
                    $ids[] = 'subject:' . $event->subject_id;
                }

                return $ids;
            })
            ->unique()
            ->count();

        $criticalActions = (clone $query)
            ->where(function (Builder $criticalQuery): void {
                $criticalQuery->whereIn('action', [
                    'refund_processed',
                    'user_deleted',
                    'password_reset_forced',
                    'case_breached',
                ]);
            })
            ->count();

        return [
            'totalActivities' => $total,
            'todayActivities' => $todayActivities,
            'admins' => $admins,
            'usersAffected' => $usersAffected,
            'criticalActions' => $criticalActions,
        ];
    }

    private function buildAudienceRows(array $audienceRoles, array $audienceUsers, array $actors, array $targets): array
    {
        $rows = [];
        $keys = [];
        $queue = array_merge(
            [['role' => 'admin', 'user_id' => null]],
            array_map(fn (string $role) => ['role' => $role, 'user_id' => null], array_values(array_filter($audienceRoles))),
            $this->normalizeAudienceUsers($audienceUsers),
            $this->normalizeAudienceUsers($actors),
            $this->normalizeAudienceUsers($targets),
        );

        foreach ($queue as $row) {
            $role = $row['role'] ?? null;
            if (!$role || !in_array($role, self::ROLES, true)) {
                continue;
            }

            $key = $role . ':' . ($row['user_id'] ?? 'all');
            if (isset($keys[$key])) {
                continue;
            }

            $keys[$key] = true;
            $rows[] = [
                'role' => $role,
                'user_id' => $row['user_id'] ?? null,
            ];
        }

        return $rows;
    }

    private function normalizeAudienceUsers(array $users): array
    {
        return collect($users)
            ->map(function ($user) {
                if ($user instanceof User) {
                    return ['role' => $user->role, 'user_id' => $user->id];
                }

                if (is_array($user) && isset($user['role'])) {
                    return ['role' => $user['role'], 'user_id' => $user['id'] ?? null];
                }

                return null;
            })
            ->filter()
            ->values()
            ->all();
    }

    private function normalizeSubject(mixed $subject): array
    {
        if ($subject instanceof Appointment) {
            return ['type' => Appointment::class, 'id' => $subject->id, 'label' => sprintf('Appointment #%d', $subject->id)];
        }

        if ($subject instanceof IntakeFlow) {
            return ['type' => IntakeFlow::class, 'id' => $subject->id, 'label' => sprintf('Intake #%d', $subject->id)];
        }

        if ($subject instanceof SupportRequest) {
            return ['type' => SupportRequest::class, 'id' => $subject->id, 'label' => $subject->ticket_number ?: ('Support #' . $subject->id)];
        }

        if ($subject instanceof WorkflowCase) {
            $meta = $subject->meta_json ?? [];
            return ['type' => WorkflowCase::class, 'id' => $subject->id, 'label' => (string) ($meta['title'] ?? ('Workflow case #' . $subject->id))];
        }

        if ($subject instanceof User) {
            return ['type' => User::class, 'id' => $subject->id, 'label' => $subject->name];
        }

        if ($subject instanceof TrainerApplication) {
            return ['type' => TrainerApplication::class, 'id' => $subject->id, 'label' => (string) $subject->application_id];
        }

        if ($subject instanceof WellnessPackage) {
            return ['type' => WellnessPackage::class, 'id' => $subject->id, 'label' => (string) $subject->name];
        }

        if ($subject instanceof MembershipPayment) {
            return ['type' => MembershipPayment::class, 'id' => $subject->id, 'label' => 'Payment #' . $subject->id];
        }

        if ($subject instanceof MembershipRefund) {
            return ['type' => MembershipRefund::class, 'id' => $subject->id, 'label' => 'Refund #' . $subject->id];
        }

        if ($subject instanceof MembershipSubscription) {
            return ['type' => MembershipSubscription::class, 'id' => $subject->id, 'label' => 'Membership #' . $subject->id];
        }

        if ($subject instanceof Model) {
            return ['type' => $subject::class, 'id' => $subject->getKey(), 'label' => class_basename($subject) . ' #' . $subject->getKey()];
        }

        if (is_array($subject)) {
            return [
                'type' => $subject['type'] ?? null,
                'id' => $subject['id'] ?? null,
                'label' => $subject['label'] ?? null,
            ];
        }

        return ['type' => null, 'id' => null, 'label' => null];
    }

    private function normalizeOccurredAt(mixed $occurredAt): CarbonInterface
    {
        if ($occurredAt instanceof CarbonInterface) {
            return $occurredAt;
        }

        return now();
    }

    private function sourceExists(string $sourceKey): bool
    {
        return ActivityEvent::query()->where('source_key', $sourceKey)->exists();
    }

    private function backfillRoleChange(RoleChangeAudit $audit): int
    {
        $sourceKey = 'role-change:' . $audit->id;
        if ($this->sourceExists($sourceKey)) {
            return 0;
        }

        $this->record('rbac', 'role_changed', sprintf(
            '%s changed %s from %s to %s.',
            (string) optional($audit->actor)->name,
            (string) optional($audit->target)->name,
            (string) $audit->previous_role,
            (string) $audit->new_role
        ), [
            'sourceKey' => $sourceKey,
            'actor' => $audit->actor,
            'targetUser' => $audit->target,
            'targetRole' => $audit->new_role,
            'subject' => $audit->target,
            'details' => [
                'reason' => $audit->reason,
                'previousRole' => $audit->previous_role,
                'newRole' => $audit->new_role,
            ],
            'audienceRoles' => [$audit->new_role, $audit->previous_role],
            'occurredAt' => $audit->created_at,
        ]);

        return 1;
    }

    private function backfillPermissionChange(PermissionChangeAudit $audit): int
    {
        $sourceKey = 'permission-change:' . $audit->id;
        if ($this->sourceExists($sourceKey)) {
            return 0;
        }

        $this->record('rbac', 'permissions_updated', sprintf(
            '%s updated permissions for the %s role.',
            (string) optional($audit->actor)->name,
            (string) $audit->target_role
        ), [
            'sourceKey' => $sourceKey,
            'actor' => $audit->actor,
            'targetRole' => $audit->target_role,
            'details' => [
                'reason' => $audit->reason,
                'addedPermissions' => $audit->added_permissions_json ?? [],
                'removedPermissions' => $audit->removed_permissions_json ?? [],
            ],
            'audienceRoles' => [$audit->target_role],
            'occurredAt' => $audit->created_at,
        ]);

        return 1;
    }

    private function backfillAppointmentEvent(AppointmentEvent $event): int
    {
        $sourceKey = 'appointment-event:' . $event->appointment_id . ':' . $event->event_type . ':' . optional($event->created_at)->timestamp;
        if ($this->sourceExists($sourceKey)) {
            return 0;
        }

        $appointment = $event->appointment;
        if (!$appointment) {
            return 0;
        }

        $client = $appointment->client;
        $practitionerUser = optional($appointment->practitioner)->user;

        $this->record('appointment', (string) $event->event_type, sprintf(
            'Appointment #%d was %s.',
            $appointment->id,
            str_replace('_', ' ', (string) $event->event_type)
        ), [
            'sourceKey' => $sourceKey,
            'actorUserId' => $event->actor_user_id,
            'actorRole' => $event->actor_user_id === $appointment->client_user_id ? 'client' : null,
            'subject' => $appointment,
            'details' => $event->meta_json ?? [],
            'audienceUsers' => array_values(array_filter([$client, $practitionerUser])),
            'audienceRoles' => $practitionerUser ? [$practitionerUser->role] : [],
            'occurredAt' => $event->created_at,
        ]);

        return 1;
    }

    private function backfillSupportRequest(SupportRequest $supportRequest): int
    {
        $sourceKey = 'support-request:' . $supportRequest->id . ':created';
        if ($this->sourceExists($sourceKey)) {
            return 0;
        }

        $this->record('support', 'request_created', sprintf(
            'Support request %s was submitted.',
            (string) ($supportRequest->ticket_number ?: ('#' . $supportRequest->id))
        ), [
            'sourceKey' => $sourceKey,
            'actor' => $supportRequest->requester,
            'subject' => $supportRequest,
            'details' => [
                'topic' => $supportRequest->topic,
                'status' => $supportRequest->status,
            ],
            'audienceRoles' => ['helpdesk'],
            'audienceUsers' => array_values(array_filter([$supportRequest->requester])),
            'occurredAt' => $supportRequest->created_at,
        ]);

        return 1;
    }

    private function backfillWorkflowCase(WorkflowCase $workflowCase): int
    {
        $sourceKey = 'workflow-case:' . $workflowCase->id . ':created';
        if ($this->sourceExists($sourceKey)) {
            return 0;
        }

        $meta = $workflowCase->meta_json ?? [];
        $this->record('workflow_case', 'case_opened', sprintf(
            'Workflow case %d opened for %s.',
            $workflowCase->id,
            (string) ($meta['title'] ?? $workflowCase->workflow_key)
        ), [
            'sourceKey' => $sourceKey,
            'targetRole' => $workflowCase->owner_role,
            'subject' => $workflowCase,
            'details' => [
                'workflowKey' => $workflowCase->workflow_key,
                'status' => $workflowCase->status,
                'priority' => $workflowCase->priority,
            ],
            'audienceRoles' => [$workflowCase->owner_role],
            'occurredAt' => $workflowCase->created_at,
        ]);

        return 1;
    }

    private function backfillWorkflowRevision(WorkflowConfigRevision $revision): int
    {
        $sourceKey = 'workflow-revision:' . $revision->id;
        if ($this->sourceExists($sourceKey)) {
            return 0;
        }

        $workflowKey = (string) optional($revision->workflowConfig)->key;
        $this->record('workflow_config', 'config_updated', sprintf(
            '%s updated the %s workflow configuration.',
            (string) optional($revision->actor)->name,
            $workflowKey
        ), [
            'sourceKey' => $sourceKey,
            'actor' => $revision->actor,
            'details' => [
                'reason' => $revision->reason,
                'workflowKey' => $workflowKey,
                'config' => $revision->config_json ?? [],
            ],
            'audienceRoles' => ['helpdesk', 'finance', 'legal', 'content', 'coach', 'trainer', 'counsellor', 'client'],
            'occurredAt' => $revision->created_at,
        ]);

        return 1;
    }
}
