<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('permissions', function (Blueprint $table): void {
            $table->id();
            $table->string('key', 100)->unique();
            $table->string('module', 80);
            $table->string('label', 120);
            $table->string('action', 40);
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('is_configurable')->default(false);
            $table->boolean('is_available')->default(true);
            $table->timestamps();
        });

        Schema::create('role_permissions', function (Blueprint $table): void {
            $table->id();
            $table->string('role', 40);
            $table->foreignId('permission_id')->constrained('permissions')->cascadeOnDelete();
            $table->timestamps();

            $table->unique(['role', 'permission_id']);
        });

        Schema::create('permission_change_audits', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('actor_user_id')->constrained('users')->cascadeOnDelete();
            $table->string('target_role', 40);
            $table->string('reason', 500);
            $table->json('added_permissions_json')->nullable();
            $table->json('removed_permissions_json')->nullable();
            $table->timestamps();
        });

        $now = now();
        $permissions = [
            ['key' => 'admin.dashboard.view', 'module' => 'Admin Overview', 'label' => 'Dashboard overview', 'action' => 'view', 'sort_order' => 10, 'is_configurable' => true, 'is_available' => true],
            ['key' => 'admin.users.manage', 'module' => 'User Management', 'label' => 'Manage users', 'action' => 'manage', 'sort_order' => 20, 'is_configurable' => false, 'is_available' => true],
            ['key' => 'admin.roles.manage', 'module' => 'Role Management', 'label' => 'Manage roles', 'action' => 'manage', 'sort_order' => 30, 'is_configurable' => false, 'is_available' => true],
            ['key' => 'admin.permissions.manage', 'module' => 'Permission Matrix', 'label' => 'Manage permissions', 'action' => 'manage', 'sort_order' => 40, 'is_configurable' => false, 'is_available' => true],
            ['key' => 'admin.approvals.manage', 'module' => 'Professional Approvals', 'label' => 'Manage approvals', 'action' => 'approve', 'sort_order' => 50, 'is_configurable' => false, 'is_available' => true],
            ['key' => 'admin.trainer_applications.manage', 'module' => 'Trainer Applications', 'label' => 'Review applications', 'action' => 'approve', 'sort_order' => 60, 'is_configurable' => false, 'is_available' => true],
            ['key' => 'admin.activity_logs.view', 'module' => 'Activity Logs', 'label' => 'View audit logs', 'action' => 'view', 'sort_order' => 70, 'is_configurable' => false, 'is_available' => true],
            ['key' => 'admin.usage.view', 'module' => 'Usage Metrics', 'label' => 'View metrics', 'action' => 'view', 'sort_order' => 80, 'is_configurable' => true, 'is_available' => true],
            ['key' => 'admin.programs.view', 'module' => 'Program Management', 'label' => 'View programs', 'action' => 'view', 'sort_order' => 90, 'is_configurable' => true, 'is_available' => true],
            ['key' => 'admin.escalations.view', 'module' => 'Escalations', 'label' => 'View escalations', 'action' => 'view', 'sort_order' => 100, 'is_configurable' => true, 'is_available' => true],
            ['key' => 'admin.revenue.view', 'module' => 'Revenue Reports', 'label' => 'View reports', 'action' => 'view', 'sort_order' => 110, 'is_configurable' => false, 'is_available' => false],
            ['key' => 'client.dashboard.view', 'module' => 'Client Dashboard', 'label' => 'Open dashboard', 'action' => 'view', 'sort_order' => 200, 'is_configurable' => false, 'is_available' => true],
            ['key' => 'client.profile.update', 'module' => 'Client Profile', 'label' => 'Update profile', 'action' => 'update', 'sort_order' => 210, 'is_configurable' => true, 'is_available' => true],
            ['key' => 'client.intake.manage', 'module' => 'Client Intake', 'label' => 'Complete intake', 'action' => 'manage', 'sort_order' => 220, 'is_configurable' => true, 'is_available' => true],
            ['key' => 'client.appointments.view', 'module' => 'Client Appointments', 'label' => 'View appointments', 'action' => 'view', 'sort_order' => 230, 'is_configurable' => true, 'is_available' => true],
            ['key' => 'client.appointments.manage', 'module' => 'Client Appointments', 'label' => 'Manage appointments', 'action' => 'manage', 'sort_order' => 231, 'is_configurable' => true, 'is_available' => true],
            ['key' => 'client.programs.view', 'module' => 'Client Programs', 'label' => 'View programs', 'action' => 'view', 'sort_order' => 240, 'is_configurable' => false, 'is_available' => false],
            ['key' => 'trainer.dashboard.view', 'module' => 'Trainer Dashboard', 'label' => 'Open dashboard', 'action' => 'view', 'sort_order' => 300, 'is_configurable' => false, 'is_available' => true],
            ['key' => 'trainer.plans.manage', 'module' => 'Trainer Plans', 'label' => 'Manage plans', 'action' => 'manage', 'sort_order' => 310, 'is_configurable' => false, 'is_available' => false],
            ['key' => 'trainer.checkins.view', 'module' => 'Trainer Check-ins', 'label' => 'View check-ins', 'action' => 'view', 'sort_order' => 320, 'is_configurable' => false, 'is_available' => false],
            ['key' => 'counsellor.dashboard.view', 'module' => 'Counsellor Dashboard', 'label' => 'Open dashboard', 'action' => 'view', 'sort_order' => 400, 'is_configurable' => false, 'is_available' => true],
            ['key' => 'coach.dashboard.view', 'module' => 'Coach Dashboard', 'label' => 'Open dashboard', 'action' => 'view', 'sort_order' => 500, 'is_configurable' => false, 'is_available' => true],
            ['key' => 'helpdesk.dashboard.view', 'module' => 'Help Desk Dashboard', 'label' => 'Open dashboard', 'action' => 'view', 'sort_order' => 600, 'is_configurable' => false, 'is_available' => true],
            ['key' => 'finance.dashboard.view', 'module' => 'Finance Dashboard', 'label' => 'Open dashboard', 'action' => 'view', 'sort_order' => 700, 'is_configurable' => false, 'is_available' => true],
            ['key' => 'legal.dashboard.view', 'module' => 'Legal Dashboard', 'label' => 'Open dashboard', 'action' => 'view', 'sort_order' => 800, 'is_configurable' => false, 'is_available' => true],
            ['key' => 'content.dashboard.view', 'module' => 'Content Dashboard', 'label' => 'Open dashboard', 'action' => 'view', 'sort_order' => 900, 'is_configurable' => false, 'is_available' => true],
        ];

        DB::table('permissions')->insert(array_map(fn (array $permission) => $permission + [
            'created_at' => $now,
            'updated_at' => $now,
        ], $permissions));

        $defaultKeys = [
            'client' => ['client.dashboard.view', 'client.profile.update', 'client.intake.manage', 'client.appointments.view', 'client.appointments.manage'],
            'trainer' => ['trainer.dashboard.view'],
            'counsellor' => ['counsellor.dashboard.view'],
            'coach' => ['coach.dashboard.view'],
            'helpdesk' => ['helpdesk.dashboard.view'],
            'finance' => ['finance.dashboard.view'],
            'legal' => ['legal.dashboard.view'],
            'content' => ['content.dashboard.view'],
        ];
        $ids = DB::table('permissions')->pluck('id', 'key');
        $rows = [];

        foreach ($defaultKeys as $role => $keys) {
            foreach ($keys as $key) {
                $rows[] = [
                    'role' => $role,
                    'permission_id' => $ids[$key],
                    'created_at' => $now,
                    'updated_at' => $now,
                ];
            }
        }

        DB::table('role_permissions')->insert($rows);
    }

    public function down(): void
    {
        Schema::dropIfExists('permission_change_audits');
        Schema::dropIfExists('role_permissions');
        Schema::dropIfExists('permissions');
    }
};
