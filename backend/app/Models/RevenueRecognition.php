<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['subscription_id', 'payment_id', 'entitlement_period_id', 'appointment_id', 'credit_ledger_id', 'amount_earned_minor', 'amount_deferred_minor', 'recognition_reason', 'recognized_at'])]
class RevenueRecognition extends Model
{
    protected function casts(): array
    {
        return ['recognized_at' => 'datetime'];
    }
}
