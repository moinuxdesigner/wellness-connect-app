<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['code', 'slug', 'name', 'description', 'status', 'current_published_version_id', 'duration_weeks', 'sessions_counselling', 'sessions_training', 'is_active'])]
class WellnessPackage extends Model
{
    public function intakeFlows()
    {
        return $this->hasMany(IntakeFlow::class);
    }

    public function versions()
    {
        return $this->hasMany(WellnessPackageVersion::class);
    }

    public function currentPublishedVersion()
    {
        return $this->belongsTo(WellnessPackageVersion::class, 'current_published_version_id');
    }
}
