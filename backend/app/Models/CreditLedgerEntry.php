<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['subscription_id', 'entitlement_period_id', 'appointment_id', 'actor_user_id', 'credit_type', 'quantity', 'status', 'reason'])]
class CreditLedgerEntry extends Model
{
    public function subscription() { return $this->belongsTo(MembershipSubscription::class, 'subscription_id'); }
    public function entitlementPeriod() { return $this->belongsTo(EntitlementPeriod::class); }
    public function appointment() { return $this->belongsTo(Appointment::class); }
}
