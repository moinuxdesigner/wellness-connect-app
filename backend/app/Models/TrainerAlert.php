<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['practitioner_id', 'client_user_id', 'trainer_plan_id', 'trainer_check_in_id', 'type', 'priority', 'status', 'summary', 'due_at', 'acknowledged_at', 'resolved_at', 'escalated_at'])]
class TrainerAlert extends Model
{
    protected function casts(): array
    {
        return ['due_at' => 'datetime', 'acknowledged_at' => 'datetime', 'resolved_at' => 'datetime', 'escalated_at' => 'datetime'];
    }

    public function client() { return $this->belongsTo(User::class, 'client_user_id'); }
    public function plan() { return $this->belongsTo(TrainerPlan::class, 'trainer_plan_id'); }
    public function checkIn() { return $this->belongsTo(TrainerCheckIn::class, 'trainer_check_in_id'); }
}
