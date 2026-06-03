<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['care_plan_id', 'exercise_template_id', 'assigned_by', 'assigned_to', 'title_override', 'instructions_override', 'frequency', 'start_date', 'end_date', 'due_time', 'priority', 'status'])]
class CbtPlanExercise extends Model
{
    protected function casts(): array
    {
        return [
            'start_date' => 'date',
            'end_date' => 'date',
        ];
    }

    public function carePlan(): BelongsTo
    {
        return $this->belongsTo(CbtCarePlan::class, 'care_plan_id');
    }

    public function template(): BelongsTo
    {
        return $this->belongsTo(CbtExerciseTemplate::class, 'exercise_template_id');
    }

    public function assignee(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    public function assigner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_by');
    }

    public function instances(): HasMany
    {
        return $this->hasMany(CbtExerciseInstance::class, 'plan_exercise_id');
    }
}
