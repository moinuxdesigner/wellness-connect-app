<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Permission;
use App\Models\PermissionChangeAudit;
use App\Models\RolePermission;
use App\Services\ActivityLogService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PermissionController extends Controller
{
    private const ROLES = ['admin', 'client', 'counsellor', 'trainer', 'coach', 'helpdesk', 'finance', 'legal', 'content'];

    public function __construct(private readonly ActivityLogService $activityLogs)
    {
    }

    public function index(Request $request): JsonResponse
    {
        $this->authorizeAdmin($request);

        $permissions = Permission::query()->orderBy('sort_order')->get();
        $grants = RolePermission::query()
            ->with('permission:id,key')
            ->get()
            ->groupBy('role')
            ->map(fn ($roleGrants) => $roleGrants->pluck('permission.key')->values()->all())
            ->all();
        $grants['admin'] = $permissions->pluck('key')->all();

        $audits = PermissionChangeAudit::query()
            ->with('actor:id,name,email')
            ->latest()
            ->limit(30)
            ->get()
            ->map(fn (PermissionChangeAudit $audit) => $this->auditPayload($audit))
            ->values();

        return response()->json([
            'roles' => self::ROLES,
            'permissions' => $permissions->map(fn (Permission $permission) => [
                'key' => $permission->key,
                'module' => $permission->module,
                'label' => $permission->label,
                'action' => $permission->action,
                'sortOrder' => $permission->sort_order,
                'configurable' => $permission->is_configurable,
                'available' => $permission->is_available,
            ])->values(),
            'grants' => $grants,
            'audits' => $audits,
        ]);
    }

    public function update(Request $request, string $role): JsonResponse
    {
        $this->authorizeAdmin($request);
        abort_unless(in_array($role, self::ROLES, true), 404, 'Role not found.');
        abort_if($role === 'admin', 422, 'Administrator permissions are locked to full access.');

        $validated = $request->validate([
            'permissions' => ['required', 'array'],
            'permissions.*' => ['required', 'string', 'distinct'],
            'reason' => ['required', 'string', 'max:500'],
        ]);
        $reason = trim((string) $validated['reason']);
        abort_if($reason === '', 422, 'A permission change reason is required.');

        $requestedKeys = collect($validated['permissions'])->values();
        $catalogue = Permission::query()->get()->keyBy('key');
        abort_if($requestedKeys->contains(fn ($key) => !$catalogue->has($key)), 422, 'One or more permission keys are invalid.');

        $currentKeys = collect(RolePermission::query()
            ->where('role', $role)
            ->with('permission:id,key')
            ->get()
            ->pluck('permission.key')
            ->all());
        $nonConfigurableKeys = $catalogue->filter(fn (Permission $permission) => !$permission->is_configurable)->keys();
        $unavailableKeys = $catalogue->filter(fn (Permission $permission) => !$permission->is_available)->keys();

        foreach ([$nonConfigurableKeys, $unavailableKeys] as $lockedKeys) {
            abort_if(
                $currentKeys->intersect($lockedKeys)->sort()->values()->all() !== $requestedKeys->intersect($lockedKeys)->sort()->values()->all(),
                422,
                'Locked or unavailable permissions cannot be changed.'
            );
        }

        $added = $requestedKeys->diff($currentKeys)->values()->all();
        $removed = $currentKeys->diff($requestedKeys)->values()->all();
        abort_if($added === [] && $removed === [], 422, 'No permission changes were selected.');

        $audit = DB::transaction(function () use ($request, $role, $reason, $requestedKeys, $catalogue, $added, $removed): PermissionChangeAudit {
            RolePermission::query()->where('role', $role)->delete();

            foreach ($requestedKeys as $key) {
                RolePermission::query()->create([
                    'role' => $role,
                    'permission_id' => $catalogue[$key]->id,
                ]);
            }

            return PermissionChangeAudit::query()->create([
                'actor_user_id' => $request->user()->id,
                'target_role' => $role,
                'reason' => $reason,
                'added_permissions_json' => $added,
                'removed_permissions_json' => $removed,
            ]);
        });

        $audit->load('actor:id,name,email');

        $this->activityLogs->record('rbac', 'permissions_updated', sprintf('%s updated permissions for the %s role.', $request->user()->name, $role), [
            'actor' => $request->user(),
            'targetRole' => $role,
            'details' => [
                'reason' => $reason,
                'addedPermissions' => $added,
                'removedPermissions' => $removed,
            ],
            'audienceRoles' => [$role],
        ]);

        return response()->json([
            'message' => "Permissions updated for {$role}.",
            'role' => $role,
            'permissions' => $requestedKeys->all(),
            'audit' => $this->auditPayload($audit),
        ]);
    }

    private function authorizeAdmin(Request $request): void
    {
        abort_unless($request->user()?->role === 'admin', 403, 'Admin access required.');
    }

    private function auditPayload(PermissionChangeAudit $audit): array
    {
        return [
            'id' => (string) $audit->id,
            'actorName' => (string) optional($audit->actor)->name,
            'actorEmail' => (string) optional($audit->actor)->email,
            'targetRole' => $audit->target_role,
            'reason' => $audit->reason,
            'addedPermissions' => $audit->added_permissions_json ?? [],
            'removedPermissions' => $audit->removed_permissions_json ?? [],
            'changedAt' => optional($audit->created_at)->toIso8601String(),
        ];
    }
}
