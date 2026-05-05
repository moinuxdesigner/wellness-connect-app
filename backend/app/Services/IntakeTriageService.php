<?php

namespace App\Services;

use App\Models\IntakeFlow;

class IntakeTriageService
{
    public function evaluate(IntakeFlow $flow): array
    {
        $answers = $flow->answers->pluck('answer_json', 'question_key')->toArray();

        $symptoms = $answers['psychology.symptoms'] ?? [];
        $stressScale = (int) ($answers['combined.stress_level'] ?? 0);

        $highRiskSymptoms = ['panic_episodes', 'self_harm_thoughts'];
        $isHighRisk = count(array_intersect($highRiskSymptoms, is_array($symptoms) ? $symptoms : [])) > 0 || $stressScale >= 9;

        if ($isHighRisk) {
            return ['status' => 'under_review', 'risk_level' => 'high', 'current_step' => 'confirm'];
        }

        return ['status' => 'auto_bookable', 'risk_level' => 'low', 'current_step' => 'schedule'];
    }
}
