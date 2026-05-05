<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['user_id', 'practitioner_type', 'bio', 'rating', 'is_active'])]
class Practitioner extends Model
{
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function specialties()
    {
        return $this->hasMany(PractitionerSpecialty::class);
    }

    public function slots()
    {
        return $this->hasMany(AvailabilitySlot::class);
    }
}
