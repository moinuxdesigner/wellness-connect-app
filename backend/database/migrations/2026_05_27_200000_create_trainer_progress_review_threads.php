<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('trainer_client_threads', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('practitioner_id')->constrained('practitioners')->cascadeOnDelete();
            $table->foreignId('client_user_id')->constrained('users')->cascadeOnDelete();
            $table->timestamps();

            $table->unique(['practitioner_id', 'client_user_id'], 'trainer_client_threads_unique_pair');
            $table->index(['client_user_id', 'updated_at'], 'trainer_client_threads_client_updated_idx');
        });

        Schema::create('trainer_client_messages', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('trainer_client_thread_id')->constrained('trainer_client_threads')->cascadeOnDelete();
            $table->foreignId('sender_user_id')->constrained('users')->cascadeOnDelete();
            $table->text('body');
            $table->string('attachment_name', 255)->nullable();
            $table->string('attachment_type', 80)->nullable();
            $table->unsignedBigInteger('attachment_size_bytes')->nullable();
            $table->timestamps();

            $table->index(['trainer_client_thread_id', 'created_at'], 'trainer_client_messages_thread_created_idx');
        });

        $now = now();
        DB::table('permissions')->updateOrInsert(
            ['key' => 'trainer.messages.manage'],
            [
                'module' => 'Trainer Messages',
                'label' => 'Manage messages',
                'action' => 'manage',
                'sort_order' => 360,
                'is_configurable' => false,
                'is_available' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ]
        );

        $permissionId = DB::table('permissions')->where('key', 'trainer.messages.manage')->value('id');
        if ($permissionId) {
            DB::table('role_permissions')->updateOrInsert(
                ['role' => 'trainer', 'permission_id' => $permissionId],
                ['created_at' => $now, 'updated_at' => $now]
            );
        }
    }

    public function down(): void
    {
        $permissionId = DB::table('permissions')->where('key', 'trainer.messages.manage')->value('id');
        if ($permissionId) {
            DB::table('role_permissions')
                ->where('role', 'trainer')
                ->where('permission_id', $permissionId)
                ->delete();
        }

        DB::table('permissions')->where('key', 'trainer.messages.manage')->delete();

        Schema::dropIfExists('trainer_client_messages');
        Schema::dropIfExists('trainer_client_threads');
    }
};
