<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['key', 'module', 'label', 'action', 'sort_order', 'is_configurable', 'is_available'])]
class Permission extends Model
{
    protected function casts(): array
    {
        return [
            'sort_order' => 'integer',
            'is_configurable' => 'boolean',
            'is_available' => 'boolean',
        ];
    }

    public function rolePermissions(): HasMany
    {
        return $this->hasMany(RolePermission::class);
    }
}
