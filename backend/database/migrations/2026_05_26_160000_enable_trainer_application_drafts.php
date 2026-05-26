<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('trainer_applications', function (Blueprint $table): void {
            $table->foreignId('applicant_user_id')->nullable()->unique()->after('application_id')->constrained('users')->nullOnDelete();
            $table->string('current_screen', 40)->nullable()->after('status');
            $table->string('applicant_name', 160)->nullable()->change();
            $table->string('applicant_email', 255)->nullable()->change();
            $table->string('applicant_mobile', 30)->nullable()->change();
            $table->string('city', 120)->nullable()->change();
            $table->string('state', 120)->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('trainer_applications', function (Blueprint $table): void {
            $table->dropConstrainedForeignId('applicant_user_id');
            $table->dropColumn('current_screen');
            $table->string('applicant_name', 160)->nullable(false)->change();
            $table->string('applicant_email', 255)->nullable(false)->change();
            $table->string('applicant_mobile', 30)->nullable(false)->change();
            $table->string('city', 120)->nullable(false)->change();
            $table->string('state', 120)->nullable(false)->change();
        });
    }
};
