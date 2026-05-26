<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('workflow_configs', function (Blueprint $table): void {
            $table->id();
            $table->string('key', 80)->unique();
            $table->json('config_json');
            $table->foreignId('updated_by_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });

        Schema::create('workflow_config_revisions', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('workflow_config_id')->constrained('workflow_configs')->cascadeOnDelete();
            $table->foreignId('actor_user_id')->constrained('users')->cascadeOnDelete();
            $table->string('reason', 500);
            $table->json('config_json');
            $table->timestamp('created_at')->useCurrent();
        });

        Schema::create('workflow_cases', function (Blueprint $table): void {
            $table->id();
            $table->string('workflow_key', 80);
            $table->string('subject_type', 160);
            $table->unsignedBigInteger('subject_id');
            $table->enum('status', ['open', 'acknowledged', 'resolved', 'breached', 'closed'])->default('open');
            $table->enum('priority', ['low', 'medium', 'high'])->default('medium');
            $table->string('owner_role', 40);
            $table->dateTime('due_at')->nullable();
            $table->dateTime('acknowledged_at')->nullable();
            $table->dateTime('resolved_at')->nullable();
            $table->dateTime('breached_at')->nullable();
            $table->json('meta_json')->nullable();
            $table->timestamps();

            $table->index(['workflow_key', 'status']);
            $table->index(['owner_role', 'status']);
            $table->index(['subject_type', 'subject_id']);
        });

        $now = now();

        DB::table('workflow_configs')->insert([
            [
                'key' => 'intake_assignment',
                'config_json' => json_encode([
                    'highRiskSymptoms' => ['panic_episodes', 'self_harm_thoughts'],
                    'stressThreshold' => 9,
                    'highRiskOutcome' => 'under_review',
                    'lowRiskOutcome' => 'auto_bookable',
                    'reviewEtaHours' => 24,
                ], JSON_THROW_ON_ERROR),
                'updated_by_user_id' => null,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'key' => 'session_no_show',
                'config_json' => json_encode([
                    'delayAfterEndMinutes' => 30,
                    'eligibleStatuses' => ['scheduled', 'rescheduled'],
                    'notifyClient' => true,
                ], JSON_THROW_ON_ERROR),
                'updated_by_user_id' => null,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'key' => 'critical_risk_escalation',
                'config_json' => json_encode([
                    'recipientRoles' => ['admin', 'helpdesk'],
                    'priority' => 'high',
                    'notificationChannel' => 'in_app',
                    'titleTemplate' => 'Critical risk intake requires follow-up for :clientName',
                ], JSON_THROW_ON_ERROR),
                'updated_by_user_id' => null,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'key' => 'cross_team_follow_up_sla',
                'config_json' => json_encode([
                    'supportRequestDueMinutes' => 240,
                    'escalationDueMinutesByPriority' => [
                        'low' => 1440,
                        'medium' => 480,
                        'high' => 60,
                    ],
                    'breachRecipientRoles' => ['admin', 'helpdesk'],
                ], JSON_THROW_ON_ERROR),
                'updated_by_user_id' => null,
                'created_at' => $now,
                'updated_at' => $now,
            ],
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('workflow_cases');
        Schema::dropIfExists('workflow_config_revisions');
        Schema::dropIfExists('workflow_configs');
    }
};
