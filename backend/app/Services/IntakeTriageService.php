<?php

namespace App\Services;

use App\Models\IntakeFlow;

class IntakeTriageService
{
    public function __construct(private readonly WorkflowConfigService $workflowConfigs)
    {
    }

    public function evaluate(IntakeFlow $flow): array
    {
        $config = $this->workflowConfigs->get(WorkflowConfigService::INTAKE_ASSIGNMENT);
        $answers = $flow->answers->pluck('answer_json', 'question_key')->toArray();

        $symptoms = $answers['psychology.symptoms'] ?? [];
        $stressScale = (int) ($answers['combined.stress_level'] ?? 0);
        $highRiskSymptoms = $config['highRiskSymptoms'] ?? ['panic_episodes', 'self_harm_thoughts'];
        $stressThreshold = (int) ($config['stressThreshold'] ?? 9);
        $isHighRisk = count(array_intersect($highRiskSymptoms, is_array($symptoms) ? $symptoms : [])) > 0 || $stressScale >= $stressThreshold;

        if ($isHighRisk) {
            return [
                'status' => $config['highRiskOutcome'] ?? 'under_review',
                'risk_level' => 'high',
                'current_step' => 'confirm',
                'review_eta_hours' => (int) ($config['reviewEtaHours'] ?? 24),
            ];
        }

        return [
            'status' => $config['lowRiskOutcome'] ?? 'auto_bookable',
            'risk_level' => 'low',
            'current_step' => 'schedule',
            'review_eta_hours' => null,
        ];
    }
}
