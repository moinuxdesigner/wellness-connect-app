<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['code', 'name', 'description', 'duration_weeks', 'sessions_counselling', 'sessions_training', 'is_active'])]
class WellnessPackage extends Model
{
    public function intakeFlows()
    {
        return $this->hasMany(IntakeFlow::class);
    }
}
