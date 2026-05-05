<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('notifications', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('type', 80);
            $table->enum('channel', ['in_app', 'email', 'sms']);
            $table->json('payload_json');
            $table->enum('status', ['queued', 'sent', 'failed', 'read'])->default('queued');
            $table->dateTime('sent_at')->nullable();
            $table->timestamps();
        });

        Schema::create('consent_records', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('consent_type', 80);
            $table->string('version', 40);
            $table->dateTime('accepted_at');
            $table->string('ip_address', 45)->nullable();
            $table->string('user_agent', 255)->nullable();
            $table->timestamps();
            $table->unique(['user_id', 'consent_type', 'version']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('consent_records');
        Schema::dropIfExists('notifications');
    }
};
