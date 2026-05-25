<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('wellness_packages', function (Blueprint $table): void {
            $table->string('slug', 140)->nullable()->unique()->after('code');
            $table->string('status', 30)->default('draft')->after('description');
            $table->foreignId('current_published_version_id')->nullable()->after('status');
        });

        Schema::create('wellness_package_versions', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('wellness_package_id')->constrained('wellness_packages')->cascadeOnDelete();
            $table->unsignedInteger('version_number');
            $table->string('name', 120);
            $table->text('description')->nullable();
            $table->unsignedInteger('duration_weeks');
            $table->json('included_credits_json');
            $table->unsignedInteger('internal_cost_counselling_minor')->nullable();
            $table->unsignedInteger('internal_cost_training_minor')->nullable();
            $table->string('status', 30)->default('draft');
            $table->foreignId('published_by_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('published_at')->nullable();
            $table->timestamps();

            $table->unique(['wellness_package_id', 'version_number'], 'pkg_versions_package_version_unique');
        });

        Schema::table('wellness_packages', function (Blueprint $table): void {
            $table->foreign('current_published_version_id')->references('id')->on('wellness_package_versions')->nullOnDelete();
        });

        Schema::create('wellness_package_price_tiers', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('wellness_package_version_id')->constrained('wellness_package_versions')->cascadeOnDelete();
            $table->string('label', 100);
            $table->string('billing_type', 30)->default('one_time');
            $table->unsignedInteger('amount_minor');
            $table->string('currency', 3)->default('INR');
            $table->unsignedInteger('billing_interval_months')->nullable();
            $table->string('provider_plan_id')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('membership_subscriptions', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('client_user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('wellness_package_version_id')->constrained('wellness_package_versions')->restrictOnDelete();
            $table->foreignId('price_tier_id')->constrained('wellness_package_price_tiers')->restrictOnDelete();
            $table->string('payment_provider', 30)->default('razorpay');
            $table->string('provider_subscription_id')->nullable()->unique();
            $table->string('status', 40)->default('checkout_initiated');
            $table->timestamp('starts_at')->nullable();
            $table->timestamp('ends_at')->nullable();
            $table->timestamp('cancelled_at')->nullable();
            $table->timestamp('refunded_at')->nullable();
            $table->timestamps();
        });

        Schema::create('membership_payments', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('subscription_id')->constrained('membership_subscriptions')->cascadeOnDelete();
            $table->string('payment_provider', 30)->default('razorpay');
            $table->string('provider_order_id')->nullable()->unique();
            $table->string('provider_payment_id')->nullable()->unique();
            $table->unsignedInteger('amount_minor');
            $table->string('currency', 3)->default('INR');
            $table->string('status', 40)->default('created');
            $table->timestamp('authorized_at')->nullable();
            $table->timestamp('captured_at')->nullable();
            $table->timestamps();
        });

        Schema::create('receipt_sequences', function (Blueprint $table): void {
            $table->unsignedInteger('year')->primary();
            $table->unsignedInteger('last_number')->default(0);
            $table->timestamps();
        });

        Schema::create('membership_receipts', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('payment_id')->constrained('membership_payments')->restrictOnDelete();
            $table->foreignId('subscription_id')->constrained('membership_subscriptions')->restrictOnDelete();
            $table->string('receipt_number')->unique();
            $table->string('client_name');
            $table->string('client_email');
            $table->string('plan_name');
            $table->string('tier_label');
            $table->unsignedInteger('amount_minor');
            $table->string('currency', 3)->default('INR');
            $table->unsignedInteger('taxable_amount_minor')->nullable();
            $table->unsignedInteger('tax_amount_minor')->nullable();
            $table->decimal('tax_rate', 5, 2)->nullable();
            $table->string('place_of_supply')->nullable();
            $table->string('business_gstin', 20)->nullable();
            $table->string('client_gstin', 20)->nullable();
            $table->string('invoice_type', 30)->default('receipt');
            $table->boolean('tax_invoice_enabled')->default(false);
            $table->timestamp('issued_at');
            $table->timestamps();
        });

        Schema::create('entitlement_periods', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('subscription_id')->constrained('membership_subscriptions')->cascadeOnDelete();
            $table->foreignId('payment_id')->constrained('membership_payments')->restrictOnDelete();
            $table->dateTime('starts_at');
            $table->dateTime('ends_at');
            $table->json('granted_credits_json');
            $table->unsignedInteger('counselling_unit_value_minor')->default(0);
            $table->unsignedInteger('training_unit_value_minor')->default(0);
            $table->string('status', 30)->default('active');
            $table->timestamps();
        });

        Schema::create('credit_ledger_entries', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('subscription_id')->constrained('membership_subscriptions')->cascadeOnDelete();
            $table->foreignId('entitlement_period_id')->constrained('entitlement_periods')->cascadeOnDelete();
            $table->foreignId('appointment_id')->nullable()->constrained('appointments')->nullOnDelete();
            $table->foreignId('actor_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('credit_type', 30);
            $table->integer('quantity');
            $table->string('status', 30);
            $table->string('reason', 255)->nullable();
            $table->timestamps();
        });

        Schema::create('credit_adjustments', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('subscription_id')->constrained('membership_subscriptions')->cascadeOnDelete();
            $table->string('credit_type', 30);
            $table->integer('adjustment_amount');
            $table->string('reason', 500);
            $table->foreignId('actor_id')->constrained('users')->restrictOnDelete();
            $table->foreignId('approved_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });

        Schema::create('membership_refunds', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('payment_id')->constrained('membership_payments')->restrictOnDelete();
            $table->foreignId('subscription_id')->constrained('membership_subscriptions')->restrictOnDelete();
            $table->string('payment_provider', 30)->default('razorpay');
            $table->string('provider_refund_id')->nullable()->unique();
            $table->unsignedInteger('amount_minor');
            $table->string('category', 50);
            $table->string('reason', 500);
            $table->string('credit_action', 40)->default('preserve');
            $table->string('status', 30)->default('created');
            $table->foreignId('actor_user_id')->constrained('users')->restrictOnDelete();
            $table->timestamps();
        });

        Schema::create('payment_webhook_events', function (Blueprint $table): void {
            $table->id();
            $table->string('payment_provider', 30)->default('razorpay');
            $table->string('external_event_id')->unique();
            $table->string('event_type', 100);
            $table->string('payload_hash', 64);
            $table->json('payload_json')->nullable();
            $table->string('status', 30)->default('received');
            $table->timestamp('processed_at')->nullable();
            $table->timestamps();
        });

        Schema::create('revenue_recognitions', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('subscription_id')->constrained('membership_subscriptions')->cascadeOnDelete();
            $table->foreignId('payment_id')->constrained('membership_payments')->restrictOnDelete();
            $table->foreignId('entitlement_period_id')->constrained('entitlement_periods')->restrictOnDelete();
            $table->foreignId('appointment_id')->nullable()->constrained('appointments')->nullOnDelete();
            $table->foreignId('credit_ledger_id')->nullable()->constrained('credit_ledger_entries')->nullOnDelete();
            $table->integer('amount_earned_minor')->default(0);
            $table->integer('amount_deferred_minor')->default(0);
            $table->string('recognition_reason', 80);
            $table->timestamp('recognized_at');
            $table->timestamps();
        });

        $this->seedExistingPackageDrafts();
        $this->activateBillingPermissions();
    }

    public function down(): void
    {
        DB::table('role_permissions')->whereIn('permission_id', DB::table('permissions')
            ->whereIn('key', ['client.memberships.manage', 'finance.invoices.view', 'finance.refunds.manage'])
            ->pluck('id'))->delete();
        DB::table('permissions')->whereIn('key', ['client.memberships.manage', 'finance.refunds.manage'])->delete();
        DB::table('permissions')->whereIn('key', ['admin.memberships.manage', 'finance.invoices.view'])->update(['is_available' => false]);

        Schema::dropIfExists('revenue_recognitions');
        Schema::dropIfExists('payment_webhook_events');
        Schema::dropIfExists('membership_refunds');
        Schema::dropIfExists('credit_adjustments');
        Schema::dropIfExists('credit_ledger_entries');
        Schema::dropIfExists('entitlement_periods');
        Schema::dropIfExists('membership_receipts');
        Schema::dropIfExists('receipt_sequences');
        Schema::dropIfExists('membership_payments');
        Schema::dropIfExists('membership_subscriptions');
        Schema::dropIfExists('wellness_package_price_tiers');
        Schema::table('wellness_packages', function (Blueprint $table): void {
            $table->dropForeign(['current_published_version_id']);
        });
        Schema::dropIfExists('wellness_package_versions');
        Schema::table('wellness_packages', function (Blueprint $table): void {
            $table->dropColumn(['slug', 'status', 'current_published_version_id']);
        });
    }

    private function seedExistingPackageDrafts(): void
    {
        $now = now();
        DB::table('wellness_packages')->orderBy('id')->get()->each(function (object $package) use ($now): void {
            $slug = Str::slug((string) $package->name);
            DB::table('wellness_packages')->where('id', $package->id)->update(['slug' => "{$slug}-{$package->id}", 'status' => 'draft']);
            DB::table('wellness_package_versions')->insert([
                'wellness_package_id' => $package->id,
                'version_number' => 1,
                'name' => $package->name,
                'description' => $package->description,
                'duration_weeks' => $package->duration_weeks,
                'included_credits_json' => json_encode([
                    'counselling' => $package->sessions_counselling,
                    'training' => $package->sessions_training,
                ]),
                'status' => 'draft',
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        });
    }

    private function activateBillingPermissions(): void
    {
        $now = now();
        DB::table('permissions')->whereIn('key', ['admin.memberships.manage', 'finance.invoices.view'])->update(['is_available' => true, 'updated_at' => $now]);
        DB::table('permissions')->insert([
            [
                'key' => 'client.memberships.manage',
                'module' => 'Client Membership',
                'label' => 'Manage membership',
                'action' => 'manage',
                'sort_order' => 242,
                'is_configurable' => false,
                'is_available' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'key' => 'finance.refunds.manage',
                'module' => 'Finance Refunds',
                'label' => 'Manage refunds',
                'action' => 'manage',
                'sort_order' => 722,
                'is_configurable' => false,
                'is_available' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
        ]);

        $clientPermissionId = DB::table('permissions')->where('key', 'client.memberships.manage')->value('id');
        DB::table('role_permissions')->insert([
            'role' => 'client',
            'permission_id' => $clientPermissionId,
            'created_at' => $now,
            'updated_at' => $now,
        ]);

        $permissionIds = DB::table('permissions')->whereIn('key', ['finance.invoices.view', 'finance.refunds.manage'])->pluck('id');
        foreach ($permissionIds as $permissionId) {
            DB::table('role_permissions')->insert([
                'role' => 'finance',
                'permission_id' => $permissionId,
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        }
    }
};
