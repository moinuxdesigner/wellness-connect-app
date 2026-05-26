<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['trainer_plan_id', 'title', 'activity_type', 'scheduled_for', 'status', 'notes', 'completed_at'])]
class TrainerPlanActivity extends Model
{
    protected function casts(): array
    {
        return ['scheduled_for' => 'date', 'completed_at' => 'datetime'];
    }

    public function plan() { return $this->belongsTo(TrainerPlan::class, 'trainer_plan_id'); }
}
