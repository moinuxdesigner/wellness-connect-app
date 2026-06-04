<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['user_id', 'primary_goal', 'dob', 'gender', 'timezone', 'preferred_language', 'emergency_contact_name', 'emergency_contact_phone'])]
class ClientProfile extends Model
{
    protected function casts(): array
    {
        return [
            'dob' => 'date',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
