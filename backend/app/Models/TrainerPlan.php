<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['practitioner_id', 'client_user_id', 'goal_title', 'goal_description', 'starts_on', 'target_date', 'status'])]
class TrainerPlan extends Model
{
    protected function casts(): array
    {
        return ['starts_on' => 'date', 'target_date' => 'date'];
    }

    public function practitioner() { return $this->belongsTo(Practitioner::class); }
    public function client() { return $this->belongsTo(User::class, 'client_user_id'); }
    public function activities() { return $this->hasMany(TrainerPlanActivity::class); }
    public function checkIns() { return $this->hasMany(TrainerCheckIn::class); }
}
