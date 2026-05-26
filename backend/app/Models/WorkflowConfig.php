<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['key', 'config_json', 'updated_by_user_id'])]
class WorkflowConfig extends Model
{
    protected function casts(): array
    {
        return [
            'config_json' => 'array',
        ];
    }

    public function updatedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by_user_id');
    }

    public function revisions(): HasMany
    {
        return $this->hasMany(WorkflowConfigRevision::class)->latest('id');
    }
}
