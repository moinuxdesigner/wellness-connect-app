<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['practitioner_id', 'client_user_id', 'trainer_plan_id', 'trainer_alert_id', 'type', 'title', 'starts_at', 'ends_at', 'status', 'notes'])]
class TrainerTask extends Model
{
    protected function casts(): array
    {
        return ['starts_at' => 'datetime', 'ends_at' => 'datetime'];
    }

    public function client() { return $this->belongsTo(User::class, 'client_user_id'); }
    public function plan() { return $this->belongsTo(TrainerPlan::class, 'trainer_plan_id'); }
    public function alert() { return $this->belongsTo(TrainerAlert::class, 'trainer_alert_id'); }
}
