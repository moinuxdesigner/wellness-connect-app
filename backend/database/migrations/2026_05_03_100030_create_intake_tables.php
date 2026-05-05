<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('intake_flows', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('client_user_id')->constrained('users')->cascadeOnDelete();
            $table->enum('service_type', ['psychology', 'training', 'combined', 'package']);
            $table->foreignId('wellness_package_id')->nullable()->constrained('wellness_packages')->nullOnDelete();
            $table->enum('current_step', ['service', 'intake', 'schedule', 'confirm'])->default('service');
            $table->enum('status', ['draft', 'submitted', 'under_review', 'auto_bookable', 'booked', 'closed'])->default('draft');
            $table->enum('risk_level', ['low', 'medium', 'high'])->nullable();
            $table->dateTime('submitted_at')->nullable();
            $table->dateTime('completed_at')->nullable();
            $table->timestamps();
        });

        Schema::create('intake_answers', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('intake_flow_id')->constrained('intake_flows')->cascadeOnDelete();
            $table->string('section_key', 80);
            $table->string('question_key', 120);
            $table->enum('answer_type', ['single', 'multi', 'text', 'number', 'scale', 'date', 'boolean', 'json']);
            $table->json('answer_json');
            $table->timestamps();

            $table->unique(['intake_flow_id', 'question_key']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('intake_answers');
        Schema::dropIfExists('intake_flows');
    }
};
