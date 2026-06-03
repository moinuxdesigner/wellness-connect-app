<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

#[Fillable(['plan_exercise_id', 'client_id', 'scheduled_date', 'due_at', 'status', 'started_at', 'completed_at'])]
class CbtExerciseInstance extends Model
{
    protected function casts(): array
    {
        return [
            'scheduled_date' => 'date',
            'due_at' => 'datetime',
            'started_at' => 'datetime',
            'completed_at' => 'datetime',
        ];
    }

    public function planExercise(): BelongsTo
    {
        return $this->belongsTo(CbtPlanExercise::class, 'plan_exercise_id');
    }

    public function client(): BelongsTo
    {
        return $this->belongsTo(User::class, 'client_id');
    }

    public function response(): HasOne
    {
        return $this->hasOne(CbtExerciseResponse::class, 'exercise_instance_id');
    }
}
