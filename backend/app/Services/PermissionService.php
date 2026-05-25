<?php

namespace App\Services;

use App\Models\Permission;
use App\Models\RolePermission;
use App\Models\User;

class PermissionService
{
    public function effectiveKeys(User $user): array
    {
        if ($user->role === 'admin') {
            return Permission::query()->orderBy('sort_order')->pluck('key')->all();
        }

        return RolePermission::query()
            ->where('role', $user->role)
            ->join('permissions', 'permissions.id', '=', 'role_permissions.permission_id')
            ->orderBy('permissions.sort_order')
            ->pluck('permissions.key')
            ->all();
    }

    public function userHasAny(User $user, array $permissionKeys): bool
    {
        if ($user->role === 'admin') {
            return true;
        }

        return RolePermission::query()
            ->where('role', $user->role)
            ->whereHas('permission', fn ($query) => $query->whereIn('key', $permissionKeys))
            ->exists();
    }
}
