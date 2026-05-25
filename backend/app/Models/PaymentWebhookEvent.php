<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['payment_provider', 'external_event_id', 'event_type', 'payload_hash', 'payload_json', 'status', 'processed_at'])]
class PaymentWebhookEvent extends Model
{
    protected function casts(): array
    {
        return ['payload_json' => 'array', 'processed_at' => 'datetime'];
    }
}
