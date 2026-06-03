<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('cbt_exercise_categories', function (Blueprint $table): void {
            $table->id();
            $table->string('name', 120);
            $table->string('slug', 140)->unique();
            $table->text('description')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('cbt_exercise_templates', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('category_id')->nullable()->constrained('cbt_exercise_categories')->nullOnDelete();
            $table->string('title', 160);
            $table->string('slug', 180)->unique();
            $table->text('description')->nullable();
            $table->text('clinical_purpose')->nullable();
            $table->text('instructions')->nullable();
            $table->enum('difficulty_level', ['intro', 'standard', 'advanced'])->default('intro');
            $table->unsignedSmallInteger('estimated_minutes')->default(10);
            $table->json('target_conditions_json')->nullable();
            $table->json('template_schema_json');
            $table->json('scoring_schema_json')->nullable();
            $table->boolean('is_active')->default(true);
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });

        Schema::create('cbt_care_plans', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('client_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('primary_practitioner_id')->nullable()->constrained('practitioners')->nullOnDelete();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->string('title', 180);
            $table->text('description')->nullable();
            $table->string('primary_goal', 220)->nullable();
            $table->enum('status', ['draft', 'active', 'paused', 'completed', 'cancelled'])->default('draft');
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->string('review_frequency', 60)->nullable();
            $table->enum('risk_level', ['low', 'medium', 'high'])->default('low');
            $table->timestamps();

            $table->index(['client_id', 'status']);
            $table->index(['primary_practitioner_id', 'status']);
        });

        Schema::create('cbt_plan_goals', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('care_plan_id')->constrained('cbt_care_plans')->cascadeOnDelete();
            $table->string('goal_title', 180);
            $table->text('goal_description')->nullable();
            $table->decimal('baseline_score', 6, 2)->nullable();
            $table->decimal('target_score', 6, 2)->nullable();
            $table->decimal('current_score', 6, 2)->nullable();
            $table->enum('status', ['active', 'completed', 'paused'])->default('active');
            $table->timestamps();
        });

        Schema::create('cbt_plan_exercises', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('care_plan_id')->constrained('cbt_care_plans')->cascadeOnDelete();
            $table->foreignId('exercise_template_id')->constrained('cbt_exercise_templates')->restrictOnDelete();
            $table->foreignId('assigned_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('assigned_to')->constrained('users')->cascadeOnDelete();
            $table->string('title_override', 180)->nullable();
            $table->text('instructions_override')->nullable();
            $table->enum('frequency', ['once', 'daily', 'weekly', 'as_needed', 'custom'])->default('once');
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->time('due_time')->nullable();
            $table->enum('priority', ['low', 'medium', 'high'])->default('medium');
            $table->enum('status', ['active', 'paused', 'completed', 'cancelled'])->default('active');
            $table->timestamps();

            $table->index(['assigned_to', 'status']);
        });

        Schema::create('cbt_exercise_instances', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('plan_exercise_id')->constrained('cbt_plan_exercises')->cascadeOnDelete();
            $table->foreignId('client_id')->constrained('users')->cascadeOnDelete();
            $table->date('scheduled_date');
            $table->dateTime('due_at')->nullable();
            $table->enum('status', ['pending', 'in_progress', 'completed', 'missed', 'reviewed'])->default('pending');
            $table->dateTime('started_at')->nullable();
            $table->dateTime('completed_at')->nullable();
            $table->timestamps();

            $table->index(['client_id', 'status', 'scheduled_date']);
        });

        Schema::create('cbt_exercise_responses', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('exercise_instance_id')->constrained('cbt_exercise_instances')->cascadeOnDelete();
            $table->foreignId('client_id')->constrained('users')->cascadeOnDelete();
            $table->json('response_json');
            $table->json('score_json')->nullable();
            $table->unsignedSmallInteger('emotion_before')->nullable();
            $table->unsignedSmallInteger('emotion_after')->nullable();
            $table->text('client_reflection')->nullable();
            $table->dateTime('submitted_at');
            $table->timestamps();
        });

        Schema::create('cbt_practitioner_reviews', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('exercise_response_id')->constrained('cbt_exercise_responses')->cascadeOnDelete();
            $table->foreignId('reviewed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->enum('review_status', ['pending_review', 'reviewed', 'needs_follow_up', 'escalated'])->default('reviewed');
            $table->text('clinical_notes')->nullable();
            $table->text('feedback_to_client')->nullable();
            $table->boolean('risk_flag')->default(false);
            $table->string('next_action', 220)->nullable();
            $table->dateTime('reviewed_at');
            $table->timestamps();
        });

        Schema::create('cbt_progress_snapshots', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('care_plan_id')->constrained('cbt_care_plans')->cascadeOnDelete();
            $table->foreignId('client_id')->constrained('users')->cascadeOnDelete();
            $table->date('period_start');
            $table->date('period_end');
            $table->decimal('completion_rate', 5, 2)->default(0);
            $table->decimal('average_mood', 5, 2)->nullable();
            $table->decimal('average_anxiety_before', 5, 2)->nullable();
            $table->decimal('average_anxiety_after', 5, 2)->nullable();
            $table->decimal('improvement_score', 6, 2)->nullable();
            $table->json('most_common_distortions_json')->nullable();
            $table->json('summary_json')->nullable();
            $table->timestamps();
        });

        Schema::create('cbt_risk_events', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('client_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('care_plan_id')->nullable()->constrained('cbt_care_plans')->nullOnDelete();
            $table->foreignId('exercise_response_id')->nullable()->constrained('cbt_exercise_responses')->nullOnDelete();
            $table->string('risk_type', 80);
            $table->enum('risk_level', ['low', 'medium', 'high', 'critical'])->default('high');
            $table->text('trigger_text')->nullable();
            $table->string('action_taken', 220)->nullable();
            $table->foreignId('alerted_practitioner_id')->nullable()->constrained('users')->nullOnDelete();
            $table->enum('status', ['open', 'acknowledged', 'resolved'])->default('open');
            $table->timestamps();

            $table->index(['client_id', 'status']);
            $table->index(['risk_level', 'created_at']);
        });

        $now = now();
        $permissions = [
            ['key' => 'admin.cbt_templates.manage', 'module' => 'CBT Templates', 'label' => 'Manage CBT templates', 'action' => 'manage', 'sort_order' => 120, 'is_configurable' => true, 'is_available' => true],
            ['key' => 'client.cbt.view', 'module' => 'Client CBT', 'label' => 'View CBT care', 'action' => 'view', 'sort_order' => 250, 'is_configurable' => true, 'is_available' => true],
            ['key' => 'client.cbt.manage', 'module' => 'Client CBT', 'label' => 'Complete CBT exercises', 'action' => 'manage', 'sort_order' => 251, 'is_configurable' => true, 'is_available' => true],
            ['key' => 'counsellor.cbt.view', 'module' => 'Counsellor CBT', 'label' => 'View CBT care', 'action' => 'view', 'sort_order' => 410, 'is_configurable' => true, 'is_available' => true],
            ['key' => 'counsellor.cbt.manage', 'module' => 'Counsellor CBT', 'label' => 'Manage CBT care plans', 'action' => 'manage', 'sort_order' => 411, 'is_configurable' => true, 'is_available' => true],
            ['key' => 'counsellor.cbt.review', 'module' => 'Counsellor CBT', 'label' => 'Review CBT responses', 'action' => 'review', 'sort_order' => 412, 'is_configurable' => true, 'is_available' => true],
        ];

        foreach ($permissions as $permission) {
            DB::table('permissions')->updateOrInsert(
                ['key' => $permission['key']],
                $permission + ['created_at' => $now, 'updated_at' => $now]
            );
        }

        $grants = [
            'admin' => ['admin.cbt_templates.manage'],
            'client' => ['client.cbt.view', 'client.cbt.manage'],
            'counsellor' => ['counsellor.cbt.view', 'counsellor.cbt.manage', 'counsellor.cbt.review'],
        ];

        foreach ($grants as $role => $keys) {
            foreach ($keys as $key) {
                $permissionId = DB::table('permissions')->where('key', $key)->value('id');
                if ($permissionId) {
                    DB::table('role_permissions')->updateOrInsert(
                        ['role' => $role, 'permission_id' => $permissionId],
                        ['created_at' => $now, 'updated_at' => $now]
                    );
                }
            }
        }
    }

    public function down(): void
    {
        $permissionKeys = [
            'admin.cbt_templates.manage',
            'client.cbt.view',
            'client.cbt.manage',
            'counsellor.cbt.view',
            'counsellor.cbt.manage',
            'counsellor.cbt.review',
        ];

        $permissionIds = DB::table('permissions')->whereIn('key', $permissionKeys)->pluck('id')->all();
        if ($permissionIds !== []) {
            DB::table('role_permissions')->whereIn('permission_id', $permissionIds)->delete();
        }
        DB::table('permissions')->whereIn('key', $permissionKeys)->delete();

        Schema::dropIfExists('cbt_risk_events');
        Schema::dropIfExists('cbt_progress_snapshots');
        Schema::dropIfExists('cbt_practitioner_reviews');
        Schema::dropIfExists('cbt_exercise_responses');
        Schema::dropIfExists('cbt_exercise_instances');
        Schema::dropIfExists('cbt_plan_exercises');
        Schema::dropIfExists('cbt_plan_goals');
        Schema::dropIfExists('cbt_care_plans');
        Schema::dropIfExists('cbt_exercise_templates');
        Schema::dropIfExists('cbt_exercise_categories');
    }
};
