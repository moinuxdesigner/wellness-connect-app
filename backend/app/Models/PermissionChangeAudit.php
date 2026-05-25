<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['actor_user_id', 'target_role', 'reason', 'added_permissions_json', 'removed_permissions_json'])]
class PermissionChangeAudit extends Model
{
    protected function casts(): array
    {
        return [
            'added_permissions_json' => 'array',
            'removed_permissions_json' => 'array',
        ];
    }

    public function actor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'actor_user_id');
    }
}
