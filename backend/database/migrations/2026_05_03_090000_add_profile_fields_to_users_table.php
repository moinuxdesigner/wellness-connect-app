<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table): void {
            $table->string('phone', 30)->nullable()->after('role');
            $table->string('wellness_goal')->nullable()->after('phone');
            $table->boolean('consent_to_terms')->default(false)->after('wellness_goal');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table): void {
            $table->dropColumn(['phone', 'wellness_goal', 'consent_to_terms']);
        });
    }
};
