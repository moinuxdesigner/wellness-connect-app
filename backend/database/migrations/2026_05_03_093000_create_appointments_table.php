<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('appointments', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('client_user_id')->constrained('users')->cascadeOnDelete();
            $table->unsignedBigInteger('practitioner_id')->nullable();
            $table->enum('service_type', ['psychology', 'training', 'combined', 'package']);
            $table->enum('mode', ['online', 'in_person', 'hybrid'])->default('online');
            $table->dateTime('starts_at');
            $table->dateTime('ends_at');
            $table->enum('status', ['scheduled', 'rescheduled', 'cancelled', 'completed', 'no_show'])->default('scheduled');
            $table->string('cancel_reason')->nullable();
            $table->unsignedInteger('reschedule_count')->default(0);
            $table->timestamps();

            $table->index(['client_user_id', 'starts_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('appointments');
    }
};
