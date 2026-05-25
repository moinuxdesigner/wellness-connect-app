<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('trainer_applications', function (Blueprint $table): void {
            $table->id();
            $table->string('application_id', 80)->unique();
            $table->foreignId('reviewed_by_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('applicant_name', 160);
            $table->string('applicant_email', 255);
            $table->string('applicant_mobile', 30);
            $table->string('city', 120);
            $table->string('state', 120);
            $table->json('expertise_json')->nullable();
            $table->json('values_json');
            $table->enum('status', ['draft', 'submitted', 'under_review', 'needs_resubmission', 'approved', 'rejected'])->default('submitted');
            $table->text('admin_remarks')->nullable();
            $table->json('review_history_json')->nullable();
            $table->timestamp('submitted_at')->nullable();
            $table->timestamps();

            $table->index(['status', 'updated_at']);
            $table->index('applicant_email');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('trainer_applications');
    }
};
