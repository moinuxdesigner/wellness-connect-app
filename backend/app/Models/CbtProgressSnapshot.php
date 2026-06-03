<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['care_plan_id', 'client_id', 'period_start', 'period_end', 'completion_rate', 'average_mood', 'average_anxiety_before', 'average_anxiety_after', 'improvement_score', 'most_common_distortions_json', 'summary_json'])]
class CbtProgressSnapshot extends Model
{
    protected function casts(): array
    {
        return [
            'period_start' => 'date',
            'period_end' => 'date',
            'most_common_distortions_json' => 'array',
            'summary_json' => 'array',
        ];
    }

    public function carePlan(): BelongsTo
    {
        return $this->belongsTo(CbtCarePlan::class, 'care_plan_id');
    }
}
