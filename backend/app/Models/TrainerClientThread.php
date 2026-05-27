<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['practitioner_id', 'client_user_id'])]
class TrainerClientThread extends Model
{
    public function practitioner()
    {
        return $this->belongsTo(Practitioner::class);
    }

    public function client()
    {
        return $this->belongsTo(User::class, 'client_user_id');
    }

    public function messages()
    {
        return $this->hasMany(TrainerClientMessage::class);
    }
}
