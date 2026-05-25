<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['subscription_id', 'payment_provider', 'provider_order_id', 'provider_payment_id', 'amount_minor', 'currency', 'status', 'authorized_at', 'captured_at'])]
class MembershipPayment extends Model
{
    protected function casts(): array
    {
        return ['authorized_at' => 'datetime', 'captured_at' => 'datetime'];
    }

    public function subscription() { return $this->belongsTo(MembershipSubscription::class, 'subscription_id'); }
    public function receipt() { return $this->hasOne(MembershipReceipt::class, 'payment_id'); }
    public function refunds() { return $this->hasMany(MembershipRefund::class, 'payment_id'); }
}
