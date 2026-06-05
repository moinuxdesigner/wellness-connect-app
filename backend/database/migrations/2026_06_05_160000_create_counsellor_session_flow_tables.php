<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('counsellor_session_flows', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('session_note_id')->unique()->constrained('counsellor_session_notes')->cascadeOnDelete();
            $table->string('active_step_key', 80)->nullable();
            $table->unsignedTinyInteger('completion_percent')->default(0);
            $table->unsignedTinyInteger('session_rating')->nullable();
            $table->text('client_feedback')->nullable();
            $table->text('clinician_summary')->nullable();
            $table->text('client_summary')->nullable();
            $table->text('private_summary')->nullable();
            $table->text('next_agenda')->nullable();
            $table->timestamps();
        });

        Schema::create('counsellor_session_flow_steps', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('session_flow_id')->constrained('counsellor_session_flows')->cascadeOnDelete();
            $table->string('step_key', 80);
            $table->string('phase', 80);
            $table->string('title', 160);
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->enum('status', ['not_started', 'in_progress', 'completed', 'skipped'])->default('not_started');
            $table->text('prompt')->nullable();
            $table->json('response_json')->nullable();
            $table->text('clinical_note')->nullable();
            $table->timestamp('started_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();

            $table->unique(['session_flow_id', 'step_key'], 'csfs_flow_step_unique');
            $table->index(['session_flow_id', 'status'], 'csfs_flow_status_idx');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('counsellor_session_flow_steps');
        Schema::dropIfExists('counsellor_session_flows');
    }
};
