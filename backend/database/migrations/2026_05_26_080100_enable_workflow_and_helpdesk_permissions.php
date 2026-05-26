<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('permissions')
            ->where('key', 'admin.workflows.manage')
            ->update([
                'is_available' => true,
                'updated_at' => now(),
            ]);

        DB::table('permissions')
            ->where('key', 'helpdesk.tickets.manage')
            ->update([
                'is_available' => true,
                'is_configurable' => true,
                'updated_at' => now(),
            ]);

        $permissionId = DB::table('permissions')->where('key', 'helpdesk.tickets.manage')->value('id');
        if ($permissionId) {
            DB::table('role_permissions')->updateOrInsert(
                ['role' => 'helpdesk', 'permission_id' => $permissionId],
                ['created_at' => now(), 'updated_at' => now()]
            );
        }
    }

    public function down(): void
    {
        DB::table('permissions')
            ->where('key', 'admin.workflows.manage')
            ->update([
                'is_available' => false,
                'updated_at' => now(),
            ]);

        DB::table('permissions')
            ->where('key', 'helpdesk.tickets.manage')
            ->update([
                'is_available' => false,
                'is_configurable' => false,
                'updated_at' => now(),
            ]);

        $permissionId = DB::table('permissions')->where('key', 'helpdesk.tickets.manage')->value('id');
        if ($permissionId) {
            DB::table('role_permissions')
                ->where('role', 'helpdesk')
                ->where('permission_id', $permissionId)
                ->delete();
        }
    }
};
