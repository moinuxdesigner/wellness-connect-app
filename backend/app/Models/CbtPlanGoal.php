<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['care_plan_id', 'goal_title', 'goal_description', 'baseline_score', 'target_score', 'current_score', 'status'])]
class CbtPlanGoal extends Model
{
    public function carePlan(): BelongsTo
    {
        return $this->belongsTo(CbtCarePlan::class, 'care_plan_id');
    }
}
