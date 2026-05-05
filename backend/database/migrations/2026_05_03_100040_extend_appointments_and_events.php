<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('appointments', function (Blueprint $table): void {
            $table->foreign('practitioner_id')->references('id')->on('practitioners')->nullOnDelete();
            $table->foreignId('intake_flow_id')->nullable()->after('practitioner_id')->constrained('intake_flows')->nullOnDelete();
        });

        Schema::create('appointment_events', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('appointment_id')->constrained('appointments')->cascadeOnDelete();
            $table->enum('event_type', ['created', 'rescheduled', 'cancelled', 'completed', 'no_show']);
            $table->foreignId('actor_user_id')->constrained('users')->restrictOnDelete();
            $table->json('meta_json')->nullable();
            $table->dateTime('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('appointment_events');

        Schema::table('appointments', function (Blueprint $table): void {
            $table->dropForeign(['practitioner_id']);
            $table->dropConstrainedForeignId('intake_flow_id');
        });
    }
};
