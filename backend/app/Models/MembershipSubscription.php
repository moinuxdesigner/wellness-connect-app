<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['client_user_id', 'wellness_package_version_id', 'price_tier_id', 'payment_provider', 'provider_subscription_id', 'status', 'starts_at', 'ends_at', 'cancelled_at', 'refunded_at'])]
class MembershipSubscription extends Model
{
    protected function casts(): array
    {
        return ['starts_at' => 'datetime', 'ends_at' => 'datetime', 'cancelled_at' => 'datetime', 'refunded_at' => 'datetime'];
    }

    public function client() { return $this->belongsTo(User::class, 'client_user_id'); }
    public function version() { return $this->belongsTo(WellnessPackageVersion::class, 'wellness_package_version_id'); }
    public function tier() { return $this->belongsTo(WellnessPackagePriceTier::class, 'price_tier_id'); }
    public function payments() { return $this->hasMany(MembershipPayment::class, 'subscription_id'); }
    public function entitlementPeriods() { return $this->hasMany(EntitlementPeriod::class, 'subscription_id'); }
    public function receipts() { return $this->hasMany(MembershipReceipt::class, 'subscription_id'); }
}
