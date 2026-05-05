<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['appointment_id', 'event_type', 'actor_user_id', 'meta_json', 'created_at'])]
class AppointmentEvent extends Model
{
    public $timestamps = false;

    protected function casts(): array
    {
        return [
            'meta_json' => 'array',
            'created_at' => 'datetime',
        ];
    }
}
