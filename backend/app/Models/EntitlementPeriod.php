<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['subscription_id', 'payment_id', 'starts_at', 'ends_at', 'granted_credits_json', 'counselling_unit_value_minor', 'training_unit_value_minor', 'status'])]
class EntitlementPeriod extends Model
{
    protected function casts(): array
    {
        return ['starts_at' => 'datetime', 'ends_at' => 'datetime', 'granted_credits_json' => 'array'];
    }

    public function subscription() { return $this->belongsTo(MembershipSubscription::class, 'subscription_id'); }
    public function payment() { return $this->belongsTo(MembershipPayment::class, 'payment_id'); }
    public function ledgerEntries() { return $this->hasMany(CreditLedgerEntry::class); }
}
