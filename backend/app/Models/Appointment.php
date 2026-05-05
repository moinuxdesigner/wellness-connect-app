<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['client_user_id', 'practitioner_id', 'intake_flow_id', 'service_type', 'mode', 'starts_at', 'ends_at', 'status', 'cancel_reason', 'reschedule_count'])]
class Appointment extends Model
{
    protected function casts(): array
    {
        return [
            'starts_at' => 'datetime',
            'ends_at' => 'datetime',
        ];
    }

    public function client()
    {
        return $this->belongsTo(User::class, 'client_user_id');
    }

    public function practitioner()
    {
        return $this->belongsTo(Practitioner::class);
    }

    public function intakeFlow()
    {
        return $this->belongsTo(IntakeFlow::class);
    }

    public function events()
    {
        return $this->hasMany(AppointmentEvent::class);
    }
}
