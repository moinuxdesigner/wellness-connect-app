<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('activity_events', function (Blueprint $table): void {
            $table->id();
            $table->string('source_key', 190)->nullable()->unique();
            $table->string('category', 80);
            $table->string('action', 80);
            $table->foreignId('actor_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('actor_role', 40)->nullable();
            $table->foreignId('target_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('target_role', 40)->nullable();
            $table->string('subject_type', 191)->nullable();
            $table->unsignedBigInteger('subject_id')->nullable();
            $table->string('subject_label', 191)->nullable();
            $table->string('summary', 500);
            $table->json('details_json')->nullable();
            $table->timestamp('occurred_at');
            $table->timestamps();

            $table->index(['category', 'occurred_at']);
            $table->index(['subject_type', 'subject_id']);
            $table->index(['actor_user_id', 'occurred_at']);
            $table->index(['target_user_id', 'occurred_at']);
        });

        Schema::create('activity_event_audiences', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('activity_event_id')->constrained('activity_events')->cascadeOnDelete();
            $table->string('role', 40);
            $table->foreignId('user_id')->nullable()->constrained('users')->cascadeOnDelete();
            $table->timestamps();

            $table->index(['role', 'user_id']);
        });

        $now = now();
        $permissions = [
            ['key' => 'client.activity_logs.view', 'module' => 'Client Activity Logs', 'label' => 'View activity logs', 'action' => 'view', 'sort_order' => 241, 'is_configurable' => true, 'is_available' => true],
            ['key' => 'counsellor.activity_logs.view', 'module' => 'Counsellor Activity Logs', 'label' => 'View activity logs', 'action' => 'view', 'sort_order' => 401, 'is_configurable' => true, 'is_available' => true],
            ['key' => 'trainer.activity_logs.view', 'module' => 'Trainer Activity Logs', 'label' => 'View activity logs', 'action' => 'view', 'sort_order' => 301, 'is_configurable' => true, 'is_available' => true],
            ['key' => 'coach.activity_logs.view', 'module' => 'Coach Activity Logs', 'label' => 'View activity logs', 'action' => 'view', 'sort_order' => 501, 'is_configurable' => true, 'is_available' => true],
            ['key' => 'helpdesk.activity_logs.view', 'module' => 'Help Desk Activity Logs', 'label' => 'View activity logs', 'action' => 'view', 'sort_order' => 601, 'is_configurable' => true, 'is_available' => true],
            ['key' => 'finance.activity_logs.view', 'module' => 'Finance Activity Logs', 'label' => 'View activity logs', 'action' => 'view', 'sort_order' => 701, 'is_configurable' => true, 'is_available' => true],
            ['key' => 'legal.activity_logs.view', 'module' => 'Legal Activity Logs', 'label' => 'View activity logs', 'action' => 'view', 'sort_order' => 801, 'is_configurable' => true, 'is_available' => true],
            ['key' => 'content.activity_logs.view', 'module' => 'Content Activity Logs', 'label' => 'View activity logs', 'action' => 'view', 'sort_order' => 901, 'is_configurable' => true, 'is_available' => true],
        ];

        foreach ($permissions as $permission) {
            DB::table('permissions')->updateOrInsert(
                ['key' => $permission['key']],
                $permission + ['created_at' => $now, 'updated_at' => $now]
            );
        }

        $grants = [
            'client' => 'client.activity_logs.view',
            'counsellor' => 'counsellor.activity_logs.view',
            'trainer' => 'trainer.activity_logs.view',
            'coach' => 'coach.activity_logs.view',
            'helpdesk' => 'helpdesk.activity_logs.view',
            'finance' => 'finance.activity_logs.view',
            'legal' => 'legal.activity_logs.view',
            'content' => 'content.activity_logs.view',
        ];

        foreach ($grants as $role => $key) {
            $permissionId = DB::table('permissions')->where('key', $key)->value('id');

            if ($permissionId) {
                DB::table('role_permissions')->updateOrInsert(
                    ['role' => $role, 'permission_id' => $permissionId],
                    ['created_at' => $now, 'updated_at' => $now]
                );
            }
        }
    }

    public function down(): void
    {
        $permissionKeys = [
            'client.activity_logs.view',
            'counsellor.activity_logs.view',
            'trainer.activity_logs.view',
            'coach.activity_logs.view',
            'helpdesk.activity_logs.view',
            'finance.activity_logs.view',
            'legal.activity_logs.view',
            'content.activity_logs.view',
        ];

        $permissionIds = DB::table('permissions')
            ->whereIn('key', $permissionKeys)
            ->pluck('id')
            ->all();

        if ($permissionIds !== []) {
            DB::table('role_permissions')->whereIn('permission_id', $permissionIds)->delete();
        }

        DB::table('permissions')->whereIn('key', $permissionKeys)->delete();

        Schema::dropIfExists('activity_event_audiences');
        Schema::dropIfExists('activity_events');
    }
};
