<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('counsellor_session_notes', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('appointment_id')->unique()->constrained('appointments')->cascadeOnDelete();
            $table->foreignId('client_user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('practitioner_id')->constrained('practitioners')->cascadeOnDelete();
            $table->enum('workflow_state', ['upcoming', 'client_waiting', 'in_progress', 'notes_pending', 'follow_up_required', 'escalated', 'completed'])->default('upcoming');
            $table->text('subjective')->nullable();
            $table->text('objective')->nullable();
            $table->text('assessment')->nullable();
            $table->text('plan')->nullable();
            $table->text('next_action')->nullable();
            $table->timestamp('started_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamp('follow_up_requested_at')->nullable();
            $table->timestamp('escalated_at')->nullable();
            $table->timestamps();

            $table->index(['practitioner_id', 'workflow_state'], 'csn_practitioner_state_idx');
            $table->index(['client_user_id', 'updated_at'], 'csn_client_updated_idx');
        });

        Schema::create('counsellor_assessment_results', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('appointment_id')->nullable()->constrained('appointments')->nullOnDelete();
            $table->foreignId('session_note_id')->nullable()->constrained('counsellor_session_notes')->nullOnDelete();
            $table->foreignId('client_user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('practitioner_id')->constrained('practitioners')->cascadeOnDelete();
            $table->enum('assessment_type', ['phq_9', 'gad_7', 'dass_21', 'pss', 'bdi_ii']);
            $table->json('answers_json')->nullable();
            $table->unsignedSmallInteger('score')->default(0);
            $table->string('severity', 80)->nullable();
            $table->dateTime('administered_at');
            $table->timestamps();

            $table->index(['client_user_id', 'assessment_type', 'administered_at'], 'car_client_type_admin_idx');
            $table->index(['practitioner_id', 'administered_at'], 'car_practitioner_admin_idx');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('counsellor_assessment_results');
        Schema::dropIfExists('counsellor_session_notes');
    }
};
