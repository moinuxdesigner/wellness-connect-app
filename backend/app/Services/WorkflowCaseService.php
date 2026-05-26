<?php

namespace App\Services;

use App\Models\IntakeFlow;
use App\Models\Notification;
use App\Models\SupportRequest;
use App\Models\User;
use App\Models\WorkflowCase;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class WorkflowCaseService
{
    public function __construct(
        private readonly ActivityLogService $activityLogs,
        private readonly WorkflowConfigService $configService,
        private readonly PermissionService $permissions,
    ) {
    }

    public function createCriticalRiskCase(IntakeFlow $flow): WorkflowCase
    {
        $escalationConfig = $this->configService->get(WorkflowConfigService::CRITICAL_RISK_ESCALATION);
        $slaConfig = $this->configService->get(WorkflowConfigService::CROSS_TEAM_FOLLOW_UP_SLA);
        $priority = $escalationConfig['priority'] ?? 'high';
        $recipientRoles = $escalationConfig['recipientRoles'] ?? ['admin'];
        $ownerRole = in_array('admin', $recipientRoles, true) ? 'admin' : (string) ($recipientRoles[0] ?? 'admin');
        $title = strtr((string) ($escalationConfig['titleTemplate'] ?? 'Critical risk intake requires follow-up'), [
            ':clientName' => (string) optional($flow->client)->name,
            ':serviceType' => (string) $flow->service_type,
            ':riskLevel' => (string) $flow->risk_level,
        ]);
        $dueAt = now()->addMinutes((int) ($slaConfig['escalationDueMinutesByPriority'][$priority] ?? 60));

        $workflowCase = DB::transaction(function () use ($flow, $priority, $ownerRole, $dueAt, $title): WorkflowCase {
            $case = WorkflowCase::query()->updateOrCreate(
                [
                    'workflow_key' => WorkflowConfigService::CRITICAL_RISK_ESCALATION,
                    'subject_type' => IntakeFlow::class,
                    'subject_id' => $flow->id,
                ],
                [
                    'status' => 'open',
                    'priority' => $priority,
                    'owner_role' => $ownerRole,
                    'due_at' => $dueAt,
                    'acknowledged_at' => null,
                    'resolved_at' => null,
                    'breached_at' => null,
                    'meta_json' => [
                        'title' => $title,
                        'summary' => sprintf(
                            'High-risk %s intake for %s.',
                            $flow->service_type,
                            (string) optional($flow->client)->name
                        ),
                        'clientName' => optional($flow->client)->name,
                        'clientEmail' => optional($flow->client)->email,
                        'riskLevel' => $flow->risk_level,
                        'serviceType' => $flow->service_type,
                        'history' => [],
                    ],
                ]
            );

            return $case;
        });

        $this->notifyRoles(
            collect($recipientRoles),
            'escalation',
            (string) ($escalationConfig['notificationChannel'] ?? 'in_app'),
            [
                'title' => $title,
                'priority' => $priority,
                'workflowKey' => WorkflowConfigService::CRITICAL_RISK_ESCALATION,
                'workflowCaseId' => $workflowCase->id,
                'subjectType' => IntakeFlow::class,
                'subjectId' => $flow->id,
            ]
        );

        $this->activityLogs->record('workflow_case', 'case_opened', sprintf('Critical-risk workflow case #%d was opened.', $workflowCase->id), [
            'subject' => $workflowCase,
            'targetRole' => $ownerRole,
            'details' => [
                'workflowKey' => WorkflowConfigService::CRITICAL_RISK_ESCALATION,
                'priority' => $priority,
                'dueAt' => $dueAt->toIso8601String(),
            ],
            'audienceRoles' => array_values(array_unique($recipientRoles)),
            'audienceUsers' => array_values(array_filter([$flow->client])),
        ]);

        return $workflowCase;
    }

    public function createSupportRequestCase(SupportRequest $supportRequest): WorkflowCase
    {
        $supportRequest->loadMissing('requester');
        $slaConfig = $this->configService->get(WorkflowConfigService::CROSS_TEAM_FOLLOW_UP_SLA);
        $dueAt = now()->addMinutes((int) ($slaConfig['supportRequestDueMinutes'] ?? 240));

        $workflowCase = WorkflowCase::query()->create([
            'workflow_key' => WorkflowConfigService::CROSS_TEAM_FOLLOW_UP_SLA,
            'subject_type' => SupportRequest::class,
            'subject_id' => $supportRequest->id,
            'status' => 'open',
            'priority' => 'medium',
            'owner_role' => 'helpdesk',
            'due_at' => $dueAt,
            'meta_json' => [
                'title' => sprintf('Support request %s', $supportRequest->ticket_number),
                'summary' => sprintf('%s: %s', $supportRequest->topic, $supportRequest->subject),
                'requesterName' => $supportRequest->name,
                'requesterEmail' => $supportRequest->email,
                'ticketNumber' => $supportRequest->ticket_number,
                'topic' => $supportRequest->topic,
                'history' => [],
            ],
        ]);

        $this->activityLogs->record('workflow_case', 'case_opened', sprintf('Support workflow case #%d was opened.', $workflowCase->id), [
            'subject' => $workflowCase,
            'targetRole' => 'helpdesk',
            'details' => [
                'workflowKey' => WorkflowConfigService::CROSS_TEAM_FOLLOW_UP_SLA,
                'priority' => 'medium',
                'dueAt' => optional($dueAt)->toIso8601String(),
                'ticketNumber' => $supportRequest->ticket_number,
            ],
            'audienceRoles' => ['helpdesk'],
            'audienceUsers' => array_values(array_filter([$supportRequest->requester])),
        ]);

        return $workflowCase;
    }

    public function processSlaBreaches(): int
    {
        $slaConfig = $this->configService->get(WorkflowConfigService::CROSS_TEAM_FOLLOW_UP_SLA);
        $cases = WorkflowCase::query()
            ->whereIn('status', ['open', 'acknowledged'])
            ->whereNotNull('due_at')
            ->where('due_at', '<=', now())
            ->get();

        foreach ($cases as $workflowCase) {
            $meta = $workflowCase->meta_json ?? [];
            $history = $meta['history'] ?? [];
            $history[] = [
                'action' => 'breached',
                'at' => now()->toIso8601String(),
                'note' => 'Workflow SLA breached automatically.',
            ];
            $meta['history'] = $history;

            $workflowCase->forceFill([
                'status' => 'breached',
                'breached_at' => now(),
                'meta_json' => $meta,
            ])->save();

            $this->notifyRoles(
                collect($slaConfig['breachRecipientRoles'] ?? ['admin']),
                'workflow_sla_breach',
                'in_app',
                [
                    'title' => sprintf('Workflow SLA breached: %s', (string) ($meta['title'] ?? 'workflow case')),
                    'priority' => $workflowCase->priority,
                    'workflowCaseId' => $workflowCase->id,
                    'workflowKey' => $workflowCase->workflow_key,
                ]
            );

            $this->activityLogs->record('workflow_case', 'case_breached', sprintf('Workflow case #%d breached its SLA.', $workflowCase->id), [
                'subject' => $workflowCase,
                'targetRole' => $workflowCase->owner_role,
                'details' => [
                    'workflowKey' => $workflowCase->workflow_key,
                    'priority' => $workflowCase->priority,
                ],
                'audienceRoles' => array_values(array_unique(array_merge([$workflowCase->owner_role], $slaConfig['breachRecipientRoles'] ?? ['admin']))),
            ]);
        }

        return $cases->count();
    }

    public function listForAdmin(array $filters = []): Collection
    {
        $query = WorkflowCase::query()->latest('id');

        if (!empty($filters['workflowKey'])) {
            $query->where('workflow_key', $filters['workflowKey']);
        }

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (!empty($filters['ownerRole'])) {
            $query->where('owner_role', $filters['ownerRole']);
        }

        return $query->limit(100)->get()->map(fn (WorkflowCase $case) => $this->serializeCase($case));
    }

    public function listForHelpdesk(): Collection
    {
        return WorkflowCase::query()
            ->where('owner_role', 'helpdesk')
            ->where('subject_type', SupportRequest::class)
            ->latest('id')
            ->limit(100)
            ->get()
            ->map(fn (WorkflowCase $case) => $this->serializeCase($case));
    }

    public function updateCase(WorkflowCase $workflowCase, string $action, ?string $note, User $actor): array
    {
        $normalizedAction = strtolower(trim($action));
        if (!in_array($normalizedAction, ['acknowledge', 'resolve', 'reopen', 'close'], true)) {
            throw ValidationException::withMessages([
                'action' => ['Unsupported workflow case action.'],
            ]);
        }

        $meta = $workflowCase->meta_json ?? [];
        $history = $meta['history'] ?? [];
        $history[] = [
            'action' => $normalizedAction,
            'actorName' => $actor->name,
            'actorEmail' => $actor->email,
            'at' => now()->toIso8601String(),
            'note' => $note,
        ];
        $meta['history'] = $history;

        $attributes = ['meta_json' => $meta];
        if ($normalizedAction === 'acknowledge') {
            $attributes['status'] = 'acknowledged';
            $attributes['acknowledged_at'] = now();
        } elseif ($normalizedAction === 'resolve') {
            $attributes['status'] = 'resolved';
            $attributes['resolved_at'] = now();
        } elseif ($normalizedAction === 'reopen') {
            $attributes['status'] = 'open';
            $attributes['resolved_at'] = null;
            $attributes['breached_at'] = null;
            $attributes['acknowledged_at'] = null;
        } elseif ($normalizedAction === 'close') {
            $attributes['status'] = 'closed';
        }

        $workflowCase->forceFill($attributes)->save();
        $this->syncSubjectState($workflowCase, $normalizedAction);

        $this->activityLogs->record('workflow_case', 'case_' . $normalizedAction, sprintf('%s %s workflow case #%d.', $actor->name, str_replace('_', ' ', $normalizedAction), $workflowCase->id), [
            'actor' => $actor,
            'subject' => $workflowCase,
            'targetRole' => $workflowCase->owner_role,
            'details' => [
                'workflowKey' => $workflowCase->workflow_key,
                'status' => $attributes['status'] ?? $workflowCase->status,
                'note' => $note,
            ],
            'audienceRoles' => [$workflowCase->owner_role],
        ]);

        return $this->serializeCase($workflowCase->fresh());
    }

    public function userCanManageCase(User $user, WorkflowCase $workflowCase): bool
    {
        if ($user->role === 'admin') {
            return true;
        }

        return $workflowCase->owner_role === 'helpdesk'
            && $this->permissions->userHasAny($user, ['helpdesk.tickets.manage']);
    }

    public function serializeCase(WorkflowCase $case): array
    {
        $meta = $case->meta_json ?? [];
        $subject = $this->resolveSubject($case);

        return [
            'id' => $case->id,
            'workflowKey' => $case->workflow_key,
            'workflowLabel' => $this->configService->metadata($case->workflow_key)['label'] ?? $case->workflow_key,
            'status' => $case->status,
            'priority' => $case->priority,
            'ownerRole' => $case->owner_role,
            'title' => (string) ($meta['title'] ?? 'Workflow case'),
            'summary' => (string) ($meta['summary'] ?? ''),
            'dueAt' => optional($case->due_at)?->toIso8601String(),
            'acknowledgedAt' => optional($case->acknowledged_at)?->toIso8601String(),
            'resolvedAt' => optional($case->resolved_at)?->toIso8601String(),
            'breachedAt' => optional($case->breached_at)?->toIso8601String(),
            'updatedAt' => optional($case->updated_at)?->toIso8601String(),
            'subject' => $subject,
            'meta' => $meta,
        ];
    }

    private function resolveSubject(WorkflowCase $case): array
    {
        $subject = match ($case->subject_type) {
            IntakeFlow::class => IntakeFlow::query()->with('client:id,name,email')->find($case->subject_id),
            SupportRequest::class => SupportRequest::query()->find($case->subject_id),
            default => null,
        };

        if ($subject instanceof IntakeFlow) {
            return [
                'type' => 'intake_flow',
                'id' => $subject->id,
                'label' => sprintf('Intake #%d', $subject->id),
                'secondaryLabel' => (string) optional($subject->client)->name,
                'status' => $subject->status,
            ];
        }

        if ($subject instanceof SupportRequest) {
            return [
                'type' => 'support_request',
                'id' => $subject->id,
                'label' => $subject->ticket_number ?: ('Support #' . $subject->id),
                'secondaryLabel' => $subject->subject,
                'status' => $subject->status,
            ];
        }

        return [
            'type' => 'unknown',
            'id' => $case->subject_id,
            'label' => 'Unavailable subject',
            'secondaryLabel' => '',
            'status' => 'unknown',
        ];
    }

    private function syncSubjectState(WorkflowCase $workflowCase, string $action): void
    {
        if ($workflowCase->subject_type !== SupportRequest::class) {
            return;
        }

        $supportRequest = SupportRequest::query()->find($workflowCase->subject_id);
        if (!$supportRequest) {
            return;
        }

        if ($action === 'acknowledge') {
            $supportRequest->update(['status' => 'in_progress']);
        } elseif ($action === 'resolve') {
            $supportRequest->update(['status' => 'resolved']);
        } elseif ($action === 'reopen') {
            $supportRequest->update(['status' => 'open']);
        } elseif ($action === 'close') {
            $supportRequest->update(['status' => 'closed']);
        }
    }

    private function notifyRoles(Collection $roles, string $type, string $channel, array $payload): void
    {
        $users = User::query()
            ->whereIn('role', $roles->filter()->unique()->values()->all())
            ->where('status', 'active')
            ->get();

        foreach ($users as $user) {
            Notification::query()->create([
                'user_id' => $user->id,
                'type' => $type,
                'channel' => $channel,
                'payload_json' => $payload,
                'status' => 'queued',
            ]);
        }
    }
}
