<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['wellness_package_id', 'version_number', 'name', 'description', 'duration_weeks', 'included_credits_json', 'internal_cost_counselling_minor', 'internal_cost_training_minor', 'status', 'published_by_user_id', 'published_at'])]
class WellnessPackageVersion extends Model
{
    protected function casts(): array
    {
        return [
            'included_credits_json' => 'array',
            'published_at' => 'datetime',
        ];
    }

    public function package()
    {
        return $this->belongsTo(WellnessPackage::class, 'wellness_package_id');
    }

    public function tiers()
    {
        return $this->hasMany(WellnessPackagePriceTier::class);
    }
}
