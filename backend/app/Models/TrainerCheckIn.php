<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['trainer_plan_id', 'practitioner_id', 'client_user_id', 'checked_in_on', 'weight_kg', 'goal_progress_percent', 'notes', 'pain_reported', 'pain_severity', 'pain_notes'])]
class TrainerCheckIn extends Model
{
    protected function casts(): array
    {
        return ['checked_in_on' => 'date', 'weight_kg' => 'decimal:2', 'pain_reported' => 'boolean'];
    }

    public function plan() { return $this->belongsTo(TrainerPlan::class, 'trainer_plan_id'); }
    public function client() { return $this->belongsTo(User::class, 'client_user_id'); }
}
