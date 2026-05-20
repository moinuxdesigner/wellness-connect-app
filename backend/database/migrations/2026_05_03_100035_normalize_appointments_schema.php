<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        $driver = DB::getDriverName();

        if (!Schema::hasTable('appointments')) {
            return;
        }

        Schema::table('appointments', function (Blueprint $table): void {
            if (!Schema::hasColumn('appointments', 'client_user_id')) {
                $table->foreignId('client_user_id')->nullable()->after('id')->constrained('users')->cascadeOnDelete();
            }

            if (!Schema::hasColumn('appointments', 'practitioner_id')) {
                $table->unsignedBigInteger('practitioner_id')->nullable()->after('client_user_id');
            }

            if (!Schema::hasColumn('appointments', 'mode')) {
                $table->enum('mode', ['online', 'in_person', 'hybrid'])->default('online')->after('service_type');
            }

            if (!Schema::hasColumn('appointments', 'starts_at')) {
                $table->dateTime('starts_at')->nullable()->after('mode');
            }

            if (!Schema::hasColumn('appointments', 'ends_at')) {
                $table->dateTime('ends_at')->nullable()->after('starts_at');
            }

            if (!Schema::hasColumn('appointments', 'cancel_reason')) {
                $table->string('cancel_reason')->nullable()->after('status');
            }

            if (!Schema::hasColumn('appointments', 'reschedule_count')) {
                $table->unsignedInteger('reschedule_count')->default(0)->after('cancel_reason');
            }
        });

        if (Schema::hasColumn('appointments', 'client_id')) {
            DB::statement('UPDATE appointments SET client_user_id = client_id WHERE client_user_id IS NULL');
        }

        if (
            $driver === 'mysql' &&
            Schema::hasColumn('appointments', 'appointment_date') &&
            Schema::hasColumn('appointments', 'appointment_time') &&
            Schema::hasColumn('appointments', 'starts_at')
        ) {
            DB::statement("
                UPDATE appointments
                SET starts_at = CASE
                    WHEN appointment_time REGEXP '^[0-9]{1,2}:[0-9]{2}[[:space:]]*(AM|PM|am|pm)$'
                        THEN STR_TO_DATE(CONCAT(appointment_date, ' ', appointment_time), '%Y-%m-%d %h:%i %p')
                    WHEN appointment_time REGEXP '^[0-9]{1,2}:[0-9]{2}$'
                        THEN STR_TO_DATE(CONCAT(appointment_date, ' ', appointment_time), '%Y-%m-%d %H:%i')
                    ELSE starts_at
                END
                WHERE starts_at IS NULL
            ");
        }

        if (Schema::hasColumn('appointments', 'ends_at')) {
            if ($driver === 'sqlite') {
                DB::statement("UPDATE appointments SET ends_at = datetime(starts_at, '+60 minutes') WHERE ends_at IS NULL AND starts_at IS NOT NULL");
            } else {
                DB::statement('UPDATE appointments SET ends_at = DATE_ADD(starts_at, INTERVAL 60 MINUTE) WHERE ends_at IS NULL AND starts_at IS NOT NULL');
            }
        }

        if ($driver === 'mysql') {
            DB::statement("ALTER TABLE appointments MODIFY service_type ENUM('counselling','training','coaching','psychology','combined','package') NOT NULL");
            DB::statement("UPDATE appointments SET service_type = 'psychology' WHERE service_type = 'counselling'");
            DB::statement("UPDATE appointments SET service_type = 'combined' WHERE service_type = 'coaching'");
            DB::statement("ALTER TABLE appointments MODIFY service_type ENUM('psychology','training','combined','package') NOT NULL");
            DB::statement("ALTER TABLE appointments MODIFY status ENUM('scheduled','rescheduled','cancelled','completed','no_show') NOT NULL DEFAULT 'scheduled'");
        }
    }

    public function down(): void
    {
        // Intentionally left no-op for compatibility migration.
    }
};
