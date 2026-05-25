<?php

namespace Tests\Feature;

use App\Contracts\PaymentGateway;
use App\Models\AvailabilitySlot;
use App\Models\MembershipPayment;
use App\Models\Practitioner;
use App\Models\User;
use App\Models\WellnessPackage;
use App\Models\WellnessPackagePriceTier;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class MembershipBillingTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->app->instance(PaymentGateway::class, new FakePaymentGateway());
    }

    public function test_admin_can_publish_plan_and_public_pricing_returns_published_tiers(): void
    {
        $admin = User::factory()->create(['role' => 'admin', 'status' => 'active']);
        Sanctum::actingAs($admin);
        $created = $this->postJson('/api/v1/admin/membership-plans', $this->draft())
            ->assertCreated()->json('plan');
        $this->postJson("/api/v1/admin/membership-plans/{$created['id']}/publish")->assertOk();

        $this->getJson('/api/v1/membership-plans')
            ->assertOk()
            ->assertJsonPath('plans.0.name', 'Mind Body Starter')
            ->assertJsonPath('plans.0.tiers.0.amountMinor', 400000);
    }

    public function test_verified_payment_activates_once_with_receipt_credits_and_deferred_revenue(): void
    {
        $tier = $this->publishedTier();
        $client = User::factory()->create(['role' => 'client', 'status' => 'active']);
        Sanctum::actingAs($client);
        $checkout = $this->postJson('/api/v1/client/memberships/checkout/orders', ['tier_id' => $tier->id])->assertCreated()->json();

        $payload = ['payment_id' => $checkout['paymentId'], 'provider_payment_id' => 'pay_100', 'signature' => 'valid'];
        $this->postJson('/api/v1/client/memberships/checkout/verify', $payload)->assertOk();
        $this->postJson('/api/v1/client/memberships/checkout/verify', $payload)->assertOk();

        $this->assertDatabaseCount('membership_receipts', 1);
        $this->assertDatabaseCount('entitlement_periods', 1);
        $this->assertDatabaseHas('credit_ledger_entries', ['credit_type' => 'counselling', 'quantity' => 2, 'status' => 'granted']);
        $this->assertDatabaseHas('revenue_recognitions', ['amount_deferred_minor' => 400000, 'recognition_reason' => 'payment_captured_deferred']);
    }

    public function test_duplicate_webhook_does_not_duplicate_membership_activation(): void
    {
        $tier = $this->publishedTier();
        $client = User::factory()->create(['role' => 'client', 'status' => 'active']);
        Sanctum::actingAs($client);
        $checkout = $this->postJson('/api/v1/client/memberships/checkout/orders', ['tier_id' => $tier->id])->json();
        $webhook = ['id' => 'evt_1', 'event' => 'payment.captured', 'payload' => ['payment' => ['entity' => ['order_id' => $checkout['orderId'], 'id' => 'pay_webhook']]]];
        $this->postJson('/api/v1/payments/razorpay/webhooks', $webhook, ['X-Razorpay-Signature' => 'valid'])->assertOk();
        $this->postJson('/api/v1/payments/razorpay/webhooks', $webhook, ['X-Razorpay-Signature' => 'valid'])->assertOk();

        $this->assertDatabaseCount('payment_webhook_events', 1);
        $this->assertDatabaseCount('membership_receipts', 1);
        $this->assertDatabaseCount('entitlement_periods', 1);
    }

    public function test_credit_booking_reserves_and_timely_cancellation_restores_while_paygo_still_works(): void
    {
        $tier = $this->publishedTier();
        $client = User::factory()->create(['role' => 'client', 'status' => 'active']);
        $subscriptionId = $this->purchase($client, $tier);
        $practitionerUser = User::factory()->create(['role' => 'counsellor', 'status' => 'active']);
        $practitioner = Practitioner::query()->create(['user_id' => $practitionerUser->id, 'practitioner_type' => 'counsellor', 'is_active' => true]);
        $firstSlot = AvailabilitySlot::query()->create(['practitioner_id' => $practitioner->id, 'starts_at' => now()->addDays(3), 'ends_at' => now()->addDays(3)->addHour(), 'slot_status' => 'open']);
        $secondSlot = AvailabilitySlot::query()->create(['practitioner_id' => $practitioner->id, 'starts_at' => now()->addDays(4), 'ends_at' => now()->addDays(4)->addHour(), 'slot_status' => 'open']);
        $thirdSlot = AvailabilitySlot::query()->create(['practitioner_id' => $practitioner->id, 'starts_at' => now()->addDays(5), 'ends_at' => now()->addDays(5)->addHour(), 'slot_status' => 'open']);

        Sanctum::actingAs($client);
        $appointmentId = $this->postJson('/api/v1/appointments', [
            'practitioner_id' => $practitioner->id, 'slot_id' => $firstSlot->id, 'service_type' => 'psychology', 'mode' => 'online',
            'use_membership_credits' => true, 'membership_subscription_id' => $subscriptionId,
        ])->assertCreated()->json('appointment.id');
        $this->assertDatabaseHas('credit_ledger_entries', ['appointment_id' => $appointmentId, 'status' => 'reserved', 'quantity' => -1]);
        $this->postJson("/api/v1/appointments/{$appointmentId}/cancel", ['reason' => 'Schedule changed'])->assertOk();
        $this->assertDatabaseHas('credit_ledger_entries', ['appointment_id' => $appointmentId, 'status' => 'restored', 'quantity' => 1]);

        $completedId = $this->postJson('/api/v1/appointments', [
            'practitioner_id' => $practitioner->id, 'slot_id' => $secondSlot->id, 'service_type' => 'psychology', 'mode' => 'online',
            'use_membership_credits' => true, 'membership_subscription_id' => $subscriptionId,
        ])->assertCreated()->json('appointment.id');
        $admin = User::factory()->create(['role' => 'admin', 'status' => 'active']);
        Sanctum::actingAs($admin);
        $this->postJson("/api/v1/admin/appointments/{$completedId}/complete")->assertOk();
        $this->assertDatabaseHas('revenue_recognitions', ['appointment_id' => $completedId, 'recognition_reason' => 'session_completed', 'amount_earned_minor' => 100000]);

        Sanctum::actingAs($client);
        $this->postJson('/api/v1/appointments', [
            'practitioner_id' => $practitioner->id, 'slot_id' => $thirdSlot->id, 'service_type' => 'psychology', 'mode' => 'online',
        ])->assertCreated();
    }

    public function test_finance_can_refund_captured_payment_but_cannot_over_refund_and_clients_are_denied(): void
    {
        $tier = $this->publishedTier();
        $client = User::factory()->create(['role' => 'client', 'status' => 'active']);
        $this->purchase($client, $tier);
        $payment = MembershipPayment::query()->firstOrFail();
        $finance = User::factory()->create(['role' => 'finance', 'status' => 'active']);

        Sanctum::actingAs($client);
        $this->getJson('/api/v1/finance/billing/payments')->assertForbidden();
        Sanctum::actingAs($finance);
        $this->getJson('/api/v1/finance/billing/payments')->assertOk();
        $this->postJson("/api/v1/finance/billing/payments/{$payment->id}/refunds", [
            'amount_minor' => 100000, 'category' => 'client_request', 'reason' => 'Approved partial customer refund.',
        ])->assertCreated();
        $this->postJson("/api/v1/finance/billing/payments/{$payment->id}/refunds", [
            'amount_minor' => 400000, 'category' => 'client_request', 'reason' => 'Over refund attempt.',
        ])->assertUnprocessable();
    }

    private function draft(): array
    {
        return [
            'name' => 'Mind Body Starter', 'description' => 'Complete support.', 'duration_weeks' => 4,
            'credits' => ['counselling' => 2, 'training' => 2],
            'internal_cost_counselling_minor' => 50000, 'internal_cost_training_minor' => 30000,
            'tiers' => [['label' => 'Standard', 'amount_minor' => 400000]],
        ];
    }

    private function publishedTier(): WellnessPackagePriceTier
    {
        $package = WellnessPackage::query()->create(['code' => 'starter-' . uniqid(), 'slug' => 'starter-' . uniqid(), 'name' => 'Starter', 'status' => 'published', 'duration_weeks' => 4, 'sessions_counselling' => 2, 'sessions_training' => 2, 'is_active' => true]);
        $version = $package->versions()->create(['version_number' => 1, 'name' => 'Starter', 'duration_weeks' => 4, 'included_credits_json' => ['counselling' => 2, 'training' => 2], 'status' => 'published', 'published_at' => now()]);
        $package->update(['current_published_version_id' => $version->id]);
        return $version->tiers()->create(['label' => 'Standard', 'billing_type' => 'one_time', 'amount_minor' => 400000, 'currency' => 'INR', 'is_active' => true]);
    }

    private function purchase(User $client, WellnessPackagePriceTier $tier): int
    {
        Sanctum::actingAs($client);
        $checkout = $this->postJson('/api/v1/client/memberships/checkout/orders', ['tier_id' => $tier->id])->json();
        return (int) $this->postJson('/api/v1/client/memberships/checkout/verify', ['payment_id' => $checkout['paymentId'], 'provider_payment_id' => 'pay_' . uniqid(), 'signature' => 'valid'])->json('subscription.id');
    }
}

class FakePaymentGateway implements PaymentGateway
{
    public function createOrder(MembershipPayment $payment): array { return ['order_id' => 'order_' . $payment->id, 'key_id' => 'rzp_test']; }
    public function verifyCheckout(string $orderId, string $paymentId, string $signature): bool { return $signature === 'valid'; }
    public function verifyWebhook(string $payload, string $signature): bool { return $signature === 'valid'; }
    public function refund(MembershipPayment $payment, \App\Models\MembershipRefund $refund): array { return ['refund_id' => 'refund_' . $refund->id, 'status' => 'processed']; }
}
