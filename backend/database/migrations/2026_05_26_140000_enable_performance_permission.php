<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('permissions')
            ->where('key', 'admin.performance.view')
            ->update([
                'is_available' => true,
                'updated_at' => now(),
            ]);

        $permissionId = DB::table('permissions')->where('key', 'admin.performance.view')->value('id');
        if ($permissionId) {
            DB::table('role_permissions')->updateOrInsert(
                ['role' => 'admin', 'permission_id' => $permissionId],
                ['created_at' => now(), 'updated_at' => now()]
            );
        }
    }

    public function down(): void
    {
        DB::table('permissions')
            ->where('key', 'admin.performance.view')
            ->update([
                'is_available' => false,
                'updated_at' => now(),
            ]);

        $permissionId = DB::table('permissions')->where('key', 'admin.performance.view')->value('id');
        if ($permissionId) {
            DB::table('role_permissions')
                ->where('role', 'admin')
                ->where('permission_id', $permissionId)
                ->delete();
        }
    }
};
