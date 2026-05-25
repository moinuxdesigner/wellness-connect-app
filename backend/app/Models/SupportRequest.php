<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable([
    'ticket_number',
    'requester_user_id',
    'name',
    'email',
    'topic',
    'subject',
    'message',
    'status',
])]
class SupportRequest extends Model
{
}
