<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['practitioner_id', 'starts_at', 'ends_at', 'slot_status', 'held_by_user_id'])]
class AvailabilitySlot extends Model
{
    public function practitioner()
    {
        return $this->belongsTo(Practitioner::class);
    }
}
