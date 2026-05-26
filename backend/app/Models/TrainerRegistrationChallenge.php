<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable([
    'token_hash',
    'email',
    'mobile',
    'registration_payload',
    'otp_hash',
    'provider',
    'status',
    'attempts',
    'expires_at',
    'resend_available_at',
    'verified_at',
])]
class TrainerRegistrationChallenge extends Model
{
    protected function casts(): array
    {
        return [
            'attempts' => 'integer',
            'expires_at' => 'datetime',
            'resend_available_at' => 'datetime',
            'verified_at' => 'datetime',
        ];
    }
}
