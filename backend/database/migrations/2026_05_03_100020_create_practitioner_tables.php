<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('practitioners', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->enum('practitioner_type', ['counsellor', 'trainer', 'coach']);
            $table->text('bio')->nullable();
            $table->decimal('rating', 3, 2)->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('practitioner_specialties', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('practitioner_id')->constrained('practitioners')->cascadeOnDelete();
            $table->string('specialty_code', 80);
            $table->unique(['practitioner_id', 'specialty_code']);
            $table->timestamps();
        });

        Schema::create('availability_slots', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('practitioner_id')->constrained('practitioners')->cascadeOnDelete();
            $table->dateTime('starts_at');
            $table->dateTime('ends_at');
            $table->enum('slot_status', ['open', 'held', 'booked', 'blocked'])->default('open');
            $table->foreignId('held_by_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->index(['practitioner_id', 'starts_at', 'slot_status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('availability_slots');
        Schema::dropIfExists('practitioner_specialties');
        Schema::dropIfExists('practitioners');
    }
};
