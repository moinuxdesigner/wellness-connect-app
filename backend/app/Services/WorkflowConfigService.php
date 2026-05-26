<?php

namespace App\Services;

use App\Models\User;
use App\Models\WorkflowConfig;
use App\Models\WorkflowConfigRevision;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class WorkflowConfigService
{
    public const INTAKE_ASSIGNMENT = 'intake_assignment';
    public const SESSION_NO_SHOW = 'session_no_show';
    public const CRITICAL_RISK_ESCALATION = 'critical_risk_escalation';
    public const CROSS_TEAM_FOLLOW_UP_SLA = 'cross_team_follow_up_sla';
    public const TRAINER_SAFETY_ESCALATION = 'trainer_safety_escalation';

    public const WORKFLOW_KEYS = [
        self::INTAKE_ASSIGNMENT,
        self::SESSION_NO_SHOW,
        self::CRITICAL_RISK_ESCALATION,
        self::CROSS_TEAM_FOLLOW_UP_SLA,
    ];

    public function __construct(private readonly ActivityLogService $activityLogs)
    {
    }

    public function list(): Collection
    {
        $configs = WorkflowConfig::query()
            ->with([
                'updatedBy:id,name,email',
                'revisions' => fn ($query) => $query->with('actor:id,name,email'),
            ])
            ->orderBy('id')
            ->get()
            ->keyBy('key');

        return collect(self::WORKFLOW_KEYS)->map(function (string $key) use ($configs) {
            $config = $configs->get($key);

            return [
                'key' => $key,
                'label' => $this->metadata($key)['label'],
                'description' => $this->metadata($key)['description'],
                'config' => $config?->config_json ?? $this->defaultConfig($key),
                'updatedAt' => optional($config?->updated_at)?->toIso8601String(),
                'updatedBy' => $config?->updatedBy ? [
                    'id' => $config->updatedBy->id,
                    'name' => $config->updatedBy->name,
                    'email' => $config->updatedBy->email,
                ] : null,
                'revisions' => $config?->revisions->take(5)->map(fn (WorkflowConfigRevision $revision) => [
                    'id' => $revision->id,
                    'reason' => $revision->reason,
                    'config' => $revision->config_json ?? [],
                    'createdAt' => optional($revision->created_at)?->toIso8601String(),
                    'actor' => $revision->actor ? [
                        'id' => $revision->actor->id,
                        'name' => $revision->actor->name,
                        'email' => $revision->actor->email,
                    ] : null,
                ])->values()->all() ?? [],
            ];
        });
    }

    public function get(string $key): array
    {
        $this->assertKnownKey($key);

        return Cache::rememberForever($this->cacheKey($key), function () use ($key) {
            $workflowConfig = WorkflowConfig::query()
                ->where('key', $key)
                ->first();

            return $workflowConfig?->config_json ?? $this->defaultConfig($key);
        });
    }

    public function update(string $key, array $config, string $reason, User $actor): array
    {
        $this->assertKnownKey($key);

        $validatedConfig = $this->validate($key, $config);
        $validatedReason = trim($reason);

        if ($validatedReason === '') {
            throw ValidationException::withMessages([
                'reason' => ['A save reason is required.'],
            ]);
        }

        DB::transaction(function () use ($key, $validatedConfig, $validatedReason, $actor): void {
            $workflowConfig = WorkflowConfig::query()->firstOrCreate(
                ['key' => $key],
                ['config_json' => $this->defaultConfig($key)]
            );

            $workflowConfig->forceFill([
                'config_json' => $validatedConfig,
                'updated_by_user_id' => $actor->id,
            ])->save();

            WorkflowConfigRevision::query()->create([
                'workflow_config_id' => $workflowConfig->id,
                'actor_user_id' => $actor->id,
                'reason' => $validatedReason,
                'config_json' => $validatedConfig,
            ]);
        });

        Cache::forget($this->cacheKey($key));

        $this->activityLogs->record('workflow_config', 'config_updated', sprintf('%s updated the %s workflow configuration.', $actor->name, $key), [
            'actor' => $actor,
            'details' => [
                'workflowKey' => $key,
                'reason' => $validatedReason,
                'config' => $validatedConfig,
            ],
            'audienceRoles' => ['helpdesk', 'finance', 'legal', 'content', 'coach', 'trainer', 'counsellor', 'client'],
        ]);

        return $this->list()->firstWhere('key', $key) ?? [];
    }

    public function metadata(string $key): array
    {
        return match ($key) {
            self::INTAKE_ASSIGNMENT => [
                'label' => 'Intake assignment workflow',
                'description' => 'Configure high-risk intake routing and review timing.',
            ],
            self::SESSION_NO_SHOW => [
                'label' => 'Session no-show handling',
                'description' => 'Configure automatic no-show detection after appointment end time.',
            ],
            self::CRITICAL_RISK_ESCALATION => [
                'label' => 'Critical risk escalation path',
                'description' => 'Configure who gets notified when high-risk intake needs immediate follow-up.',
            ],
            self::CROSS_TEAM_FOLLOW_UP_SLA => [
                'label' => 'Cross-team follow-up SLA policy',
                'description' => 'Configure support and escalation response targets and breach notifications.',
            ],
            self::TRAINER_SAFETY_ESCALATION => [
                'label' => 'Trainer safety escalation',
                'description' => 'Training-related pain or injury concerns escalated by approved trainers.',
            ],
            default => throw ValidationException::withMessages([
                'workflow' => ['Unknown workflow key.'],
            ]),
        };
    }

    public function defaultConfig(string $key): array
    {
        return match ($key) {
            self::INTAKE_ASSIGNMENT => [
                'highRiskSymptoms' => ['panic_episodes', 'self_harm_thoughts'],
                'stressThreshold' => 9,
                'highRiskOutcome' => 'under_review',
                'lowRiskOutcome' => 'auto_bookable',
                'reviewEtaHours' => 24,
            ],
            self::SESSION_NO_SHOW => [
                'delayAfterEndMinutes' => 30,
                'eligibleStatuses' => ['scheduled', 'rescheduled'],
                'notifyClient' => true,
            ],
            self::CRITICAL_RISK_ESCALATION => [
                'recipientRoles' => ['admin', 'helpdesk'],
                'priority' => 'high',
                'notificationChannel' => 'in_app',
                'titleTemplate' => 'Critical risk intake requires follow-up for :clientName',
            ],
            self::CROSS_TEAM_FOLLOW_UP_SLA => [
                'supportRequestDueMinutes' => 240,
                'escalationDueMinutesByPriority' => [
                    'low' => 1440,
                    'medium' => 480,
                    'high' => 60,
                ],
                'breachRecipientRoles' => ['admin', 'helpdesk'],
            ],
            default => throw ValidationException::withMessages([
                'workflow' => ['Unknown workflow key.'],
            ]),
        };
    }

    public function validate(string $key, array $config): array
    {
        $rules = match ($key) {
            self::INTAKE_ASSIGNMENT => [
                'highRiskSymptoms' => ['required', 'array', 'min:1'],
                'highRiskSymptoms.*' => ['required', 'string', 'max:120', 'distinct'],
                'stressThreshold' => ['required', 'integer', 'min:1', 'max:10'],
                'highRiskOutcome' => ['required', Rule::in(['under_review'])],
                'lowRiskOutcome' => ['required', Rule::in(['auto_bookable'])],
                'reviewEtaHours' => ['required', 'integer', 'min:1', 'max:168'],
            ],
            self::SESSION_NO_SHOW => [
                'delayAfterEndMinutes' => ['required', 'integer', 'min:1', 'max:1440'],
                'eligibleStatuses' => ['required', 'array', 'min:1'],
                'eligibleStatuses.*' => ['required', Rule::in(['scheduled', 'rescheduled'])],
                'notifyClient' => ['required', 'boolean'],
            ],
            self::CRITICAL_RISK_ESCALATION => [
                'recipientRoles' => ['required', 'array', 'min:1'],
                'recipientRoles.*' => ['required', Rule::in(['admin', 'helpdesk'])],
                'priority' => ['required', Rule::in(['high'])],
                'notificationChannel' => ['required', Rule::in(['in_app'])],
                'titleTemplate' => ['required', 'string', 'min:5', 'max:160'],
            ],
            self::CROSS_TEAM_FOLLOW_UP_SLA => [
                'supportRequestDueMinutes' => ['required', 'integer', 'min:1', 'max:10080'],
                'escalationDueMinutesByPriority' => ['required', 'array'],
                'escalationDueMinutesByPriority.low' => ['required', 'integer', 'min:1', 'max:10080'],
                'escalationDueMinutesByPriority.medium' => ['required', 'integer', 'min:1', 'max:10080'],
                'escalationDueMinutesByPriority.high' => ['required', 'integer', 'min:1', 'max:10080'],
                'breachRecipientRoles' => ['required', 'array', 'min:1'],
                'breachRecipientRoles.*' => ['required', Rule::in(['admin', 'helpdesk'])],
            ],
            default => [],
        };

        $validator = Validator::make($config, $rules);
        if ($validator->fails()) {
            throw new ValidationException($validator);
        }

        return $validator->validated();
    }

    private function assertKnownKey(string $key): void
    {
        if (!in_array($key, self::WORKFLOW_KEYS, true)) {
            throw ValidationException::withMessages([
                'workflow' => ['Unknown workflow key.'],
            ]);
        }
    }

    private function cacheKey(string $key): string
    {
        return 'workflow-config:' . $key;
    }
}
