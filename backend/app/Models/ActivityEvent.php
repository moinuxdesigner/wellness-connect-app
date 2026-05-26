<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable([
    'source_key',
    'category',
    'action',
    'actor_user_id',
    'actor_role',
    'target_user_id',
    'target_role',
    'subject_type',
    'subject_id',
    'subject_label',
    'summary',
    'details_json',
    'occurred_at',
])]
class ActivityEvent extends Model
{
    protected function casts(): array
    {
        return [
            'details_json' => 'array',
            'occurred_at' => 'datetime',
        ];
    }

    public function actor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'actor_user_id');
    }

    public function target(): BelongsTo
    {
        return $this->belongsTo(User::class, 'target_user_id');
    }

    public function audiences(): HasMany
    {
        return $this->hasMany(ActivityEventAudience::class);
    }
}
