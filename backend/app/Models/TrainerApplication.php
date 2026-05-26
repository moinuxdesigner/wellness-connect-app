<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'application_id',
    'applicant_user_id',
    'reviewed_by_user_id',
    'applicant_name',
    'applicant_email',
    'applicant_mobile',
    'city',
    'state',
    'expertise_json',
    'values_json',
    'status',
    'current_screen',
    'admin_remarks',
    'review_history_json',
    'submitted_at',
])]
class TrainerApplication extends Model
{
    public function applicant(): BelongsTo
    {
        return $this->belongsTo(User::class, 'applicant_user_id');
    }

    protected function casts(): array
    {
        return [
            'expertise_json' => 'array',
            'values_json' => 'array',
            'review_history_json' => 'array',
            'submitted_at' => 'datetime',
        ];
    }
}
