<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable([
    'application_id',
    'reviewed_by_user_id',
    'applicant_name',
    'applicant_email',
    'applicant_mobile',
    'city',
    'state',
    'expertise_json',
    'values_json',
    'status',
    'admin_remarks',
    'review_history_json',
    'submitted_at',
])]
class TrainerApplication extends Model
{
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
