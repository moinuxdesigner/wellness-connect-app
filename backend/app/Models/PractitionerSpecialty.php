<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['practitioner_id', 'specialty_code'])]
class PractitionerSpecialty extends Model
{
    public function practitioner()
    {
        return $this->belongsTo(Practitioner::class);
    }
}
