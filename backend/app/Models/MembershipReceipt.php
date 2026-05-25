<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['payment_id', 'subscription_id', 'receipt_number', 'client_name', 'client_email', 'plan_name', 'tier_label', 'amount_minor', 'currency', 'taxable_amount_minor', 'tax_amount_minor', 'tax_rate', 'place_of_supply', 'business_gstin', 'client_gstin', 'invoice_type', 'tax_invoice_enabled', 'issued_at'])]
class MembershipReceipt extends Model
{
    protected function casts(): array
    {
        return ['tax_invoice_enabled' => 'boolean', 'issued_at' => 'datetime'];
    }

    public function payment() { return $this->belongsTo(MembershipPayment::class, 'payment_id'); }
    public function subscription() { return $this->belongsTo(MembershipSubscription::class, 'subscription_id'); }
}
