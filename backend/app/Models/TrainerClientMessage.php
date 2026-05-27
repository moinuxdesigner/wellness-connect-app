<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['trainer_client_thread_id', 'sender_user_id', 'body', 'attachment_name', 'attachment_type', 'attachment_size_bytes'])]
class TrainerClientMessage extends Model
{
    public function thread()
    {
        return $this->belongsTo(TrainerClientThread::class, 'trainer_client_thread_id');
    }

    public function sender()
    {
        return $this->belongsTo(User::class, 'sender_user_id');
    }
}
