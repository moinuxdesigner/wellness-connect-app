<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['wellness_package_version_id', 'label', 'billing_type', 'amount_minor', 'currency', 'billing_interval_months', 'provider_plan_id', 'is_active'])]
class WellnessPackagePriceTier extends Model
{
    protected function casts(): array
    {
        return ['is_active' => 'boolean'];
    }

    public function version()
    {
        return $this->belongsTo(WellnessPackageVersion::class, 'wellness_package_version_id');
    }
}
