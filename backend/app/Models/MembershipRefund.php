<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['payment_id', 'subscription_id', 'payment_provider', 'provider_refund_id', 'amount_minor', 'category', 'reason', 'credit_action', 'status', 'actor_user_id'])]
class MembershipRefund extends Model
{
    public function payment() { return $this->belongsTo(MembershipPayment::class, 'payment_id'); }
    public function subscription() { return $this->belongsTo(MembershipSubscription::class, 'subscription_id'); }
    public function actor() { return $this->belongsTo(User::class, 'actor_user_id'); }
}
