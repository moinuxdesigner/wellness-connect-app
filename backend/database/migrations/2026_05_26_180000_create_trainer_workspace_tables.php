<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('trainer_plans', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('practitioner_id')->constrained('practitioners')->cascadeOnDelete();
            $table->foreignId('client_user_id')->constrained('users')->cascadeOnDelete();
            $table->string('goal_title', 160);
            $table->text('goal_description')->nullable();
            $table->date('starts_on');
            $table->date('target_date')->nullable();
            $table->enum('status', ['active', 'completed', 'paused', 'archived'])->default('active');
            $table->timestamps();

            $table->index(['practitioner_id', 'status']);
            $table->index(['client_user_id', 'status']);
        });

        Schema::create('trainer_plan_activities', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('trainer_plan_id')->constrained('trainer_plans')->cascadeOnDelete();
            $table->string('title', 160);
            $table->string('activity_type', 80)->default('workout');
            $table->date('scheduled_for');
            $table->enum('status', ['scheduled', 'completed', 'missed', 'modified', 'cancelled'])->default('scheduled');
            $table->text('notes')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();

            $table->index(['trainer_plan_id', 'scheduled_for', 'status']);
        });

        Schema::create('trainer_check_ins', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('trainer_plan_id')->constrained('trainer_plans')->cascadeOnDelete();
            $table->foreignId('practitioner_id')->constrained('practitioners')->cascadeOnDelete();
            $table->foreignId('client_user_id')->constrained('users')->cascadeOnDelete();
            $table->date('checked_in_on');
            $table->decimal('weight_kg', 5, 2)->nullable();
            $table->unsignedTinyInteger('goal_progress_percent');
            $table->text('notes')->nullable();
            $table->boolean('pain_reported')->default(false);
            $table->enum('pain_severity', ['mild', 'moderate', 'severe'])->nullable();
            $table->text('pain_notes')->nullable();
            $table->timestamps();

            $table->index(['practitioner_id', 'checked_in_on']);
            $table->index(['client_user_id', 'checked_in_on']);
        });

        Schema::create('trainer_alerts', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('practitioner_id')->constrained('practitioners')->cascadeOnDelete();
            $table->foreignId('client_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('trainer_plan_id')->nullable()->constrained('trainer_plans')->cascadeOnDelete();
            $table->foreignId('trainer_check_in_id')->nullable()->constrained('trainer_check_ins')->cascadeOnDelete();
            $table->enum('type', ['pain_injury', 'low_adherence', 'follow_up_due']);
            $table->enum('priority', ['high', 'medium', 'low']);
            $table->enum('status', ['open', 'acknowledged', 'scheduled_follow_up', 'escalated', 'resolved'])->default('open');
            $table->string('summary', 255);
            $table->timestamp('due_at')->nullable();
            $table->timestamp('acknowledged_at')->nullable();
            $table->timestamp('resolved_at')->nullable();
            $table->timestamp('escalated_at')->nullable();
            $table->timestamps();

            $table->index(['practitioner_id', 'status', 'priority']);
        });

        Schema::create('trainer_tasks', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('practitioner_id')->constrained('practitioners')->cascadeOnDelete();
            $table->foreignId('client_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('trainer_plan_id')->nullable()->constrained('trainer_plans')->nullOnDelete();
            $table->foreignId('trainer_alert_id')->nullable()->constrained('trainer_alerts')->nullOnDelete();
            $table->enum('type', ['call', 'follow_up']);
            $table->string('title', 160);
            $table->dateTime('starts_at');
            $table->dateTime('ends_at');
            $table->enum('status', ['scheduled', 'completed', 'cancelled'])->default('scheduled');
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index(['practitioner_id', 'starts_at', 'status']);
        });

        Schema::table('notifications', function (Blueprint $table): void {
            $table->timestamp('read_at')->nullable()->after('sent_at');
        });

        $now = now();
        $permissions = [
            ['key' => 'trainer.tasks.manage', 'module' => 'Trainer Schedule', 'label' => 'Manage tasks', 'action' => 'manage', 'sort_order' => 330],
            ['key' => 'trainer.alerts.manage', 'module' => 'Trainer Alerts', 'label' => 'Manage alerts', 'action' => 'manage', 'sort_order' => 340],
            ['key' => 'trainer.notifications.view', 'module' => 'Trainer Notifications', 'label' => 'View notifications', 'action' => 'view', 'sort_order' => 350],
        ];

        DB::table('permissions')->whereIn('key', ['trainer.plans.manage', 'trainer.checkins.view'])
            ->update(['is_available' => true, 'updated_at' => $now]);
        foreach ($permissions as $permission) {
            DB::table('permissions')->updateOrInsert(
                ['key' => $permission['key']],
                $permission + ['is_configurable' => false, 'is_available' => true, 'created_at' => $now, 'updated_at' => $now]
            );
        }
        foreach (['trainer.plans.manage', 'trainer.checkins.view', 'trainer.tasks.manage', 'trainer.alerts.manage', 'trainer.notifications.view'] as $key) {
            $permissionId = DB::table('permissions')->where('key', $key)->value('id');
            if ($permissionId) {
                DB::table('role_permissions')->updateOrInsert(
                    ['role' => 'trainer', 'permission_id' => $permissionId],
                    ['created_at' => $now, 'updated_at' => $now]
                );
            }
        }

        DB::table('users')
            ->join('trainer_applications', 'trainer_applications.applicant_user_id', '=', 'users.id')
            ->where('users.role', 'trainer')
            ->where('trainer_applications.status', 'approved')
            ->select('users.id')
            ->get()
            ->each(function (object $user) use ($now): void {
                DB::table('practitioners')->updateOrInsert(
                    ['user_id' => $user->id],
                    ['practitioner_type' => 'trainer', 'is_active' => true, 'created_at' => $now, 'updated_at' => $now]
                );
            });
    }

    public function down(): void
    {
        foreach (['trainer.plans.manage', 'trainer.checkins.view', 'trainer.tasks.manage', 'trainer.alerts.manage', 'trainer.notifications.view'] as $key) {
            $permissionId = DB::table('permissions')->where('key', $key)->value('id');
            if ($permissionId) {
                DB::table('role_permissions')->where('role', 'trainer')->where('permission_id', $permissionId)->delete();
            }
        }
        DB::table('permissions')->whereIn('key', ['trainer.plans.manage', 'trainer.checkins.view'])
            ->update(['is_available' => false, 'updated_at' => now()]);
        DB::table('permissions')->whereIn('key', ['trainer.tasks.manage', 'trainer.alerts.manage', 'trainer.notifications.view'])->delete();

        Schema::table('notifications', function (Blueprint $table): void {
            $table->dropColumn('read_at');
        });
        Schema::dropIfExists('trainer_tasks');
        Schema::dropIfExists('trainer_alerts');
        Schema::dropIfExists('trainer_check_ins');
        Schema::dropIfExists('trainer_plan_activities');
        Schema::dropIfExists('trainer_plans');
    }
};
