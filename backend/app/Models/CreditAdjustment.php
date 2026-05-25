<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['subscription_id', 'credit_type', 'adjustment_amount', 'reason', 'actor_id', 'approved_by'])]
class CreditAdjustment extends Model
{
}
