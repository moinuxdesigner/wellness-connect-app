<?php

namespace App\Services;

use App\Contracts\PaymentGateway;
use App\Models\CreditLedgerEntry;
use App\Models\EntitlementPeriod;
use App\Models\MembershipPayment;
use App\Models\MembershipReceipt;
use App\Models\MembershipRefund;
use App\Models\MembershipSubscription;
use App\Models\RevenueRecognition;
use App\Models\User;
use App\Models\WellnessPackagePriceTier;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class MembershipBillingService
{
    public function __construct(
        private readonly ActivityLogService $activityLogs,
        private readonly PaymentGateway $gateway,
        private readonly ReceiptNumberService $receiptNumbers,
        private readonly MembershipEntitlementService $entitlements,
    ) {
    }

    public function createCheckout(User $client, WellnessPackagePriceTier $tier): array
    {
        $tier->load('version.package');
        if (
            $client->role !== 'client'
            || $tier->billing_type !== 'one_time'
            || !$tier->is_active
            || $tier->version->status !== 'published'
            || $tier->version->package->status !== 'published'
            || !$tier->version->package->is_active
        ) {
            throw new RuntimeException('This membership tier is not available for purchase.');
        }

        [$subscription, $payment] = DB::transaction(function () use ($client, $tier): array {
            $subscription = MembershipSubscription::query()->create([
                'client_user_id' => $client->id,
                'wellness_package_version_id' => $tier->wellness_package_version_id,
                'price_tier_id' => $tier->id,
                'payment_provider' => 'razorpay',
                'status' => 'checkout_initiated',
            ]);
            $payment = MembershipPayment::query()->create([
                'subscription_id' => $subscription->id,
                'payment_provider' => 'razorpay',
                'amount_minor' => $tier->amount_minor,
                'currency' => $tier->currency,
                'status' => 'created',
            ]);
            return [$subscription, $payment];
        });

        try {
            $provider = $this->gateway->createOrder($payment);
        } catch (\Throwable $exception) {
            $payment->update(['status' => 'failed']);
            $subscription->update(['status' => 'terminated']);
            throw $exception;
        }

        $payment->update(['provider_order_id' => $provider['order_id']]);
        $subscription->update(['status' => 'payment_pending']);

        $this->activityLogs->record('billing', 'checkout_initiated', sprintf('%s initiated membership checkout.', $client->name), [
            'actor' => $client,
            'subject' => $subscription,
            'details' => [
                'paymentId' => $payment->id,
                'amountMinor' => $payment->amount_minor,
                'currency' => $payment->currency,
            ],
            'audienceRoles' => ['finance'],
            'audienceUsers' => [$client],
        ]);

        return [
            'subscriptionId' => $subscription->id,
            'paymentId' => $payment->id,
            'orderId' => $provider['order_id'],
            'keyId' => $provider['key_id'],
            'amountMinor' => $payment->amount_minor,
            'currency' => $payment->currency,
            'name' => $tier->version->name,
            'tierLabel' => $tier->label,
        ];
    }

    public function verifyAndActivate(User $client, MembershipPayment $payment, string $providerPaymentId, string $signature): MembershipSubscription
    {
        $payment->load('subscription.version', 'subscription.tier');
        abort_unless($payment->subscription->client_user_id === $client->id, 403);
        if (!$payment->provider_order_id || !$this->gateway->verifyCheckout($payment->provider_order_id, $providerPaymentId, $signature)) {
            throw new RuntimeException('Payment signature verification failed.');
        }

        return $this->activateCapturedPayment($payment, $providerPaymentId);
    }

    public function activateCapturedPayment(MembershipPayment $payment, string $providerPaymentId): MembershipSubscription
    {
        return DB::transaction(function () use ($payment, $providerPaymentId): MembershipSubscription {
            $payment = MembershipPayment::query()->lockForUpdate()->with('subscription.version', 'subscription.tier', 'subscription.client')->findOrFail($payment->id);
            $subscription = $payment->subscription;
            if ($payment->status === 'captured' && $subscription->status === 'active') {
                return $subscription;
            }
            $credits = $subscription->version->included_credits_json ?? [];
            $counselling = max(0, (int) ($credits['counselling'] ?? 0));
            $training = max(0, (int) ($credits['training'] ?? 0));
            $totalCredits = $counselling + $training;
            if ($totalCredits < 1) {
                throw new RuntimeException('Published plan has no billable session credits.');
            }
            $unitValue = intdiv($payment->amount_minor, $totalCredits);
            $trainingValue = $unitValue;
            $counsellingValue = $unitValue;

            $payment->update(['provider_payment_id' => $providerPaymentId, 'status' => 'captured', 'captured_at' => now()]);
            $subscription->update([
                'status' => 'active',
                'starts_at' => now(),
                'ends_at' => now()->addWeeks($subscription->version->duration_weeks),
            ]);
            $period = EntitlementPeriod::query()->firstOrCreate(
                ['payment_id' => $payment->id],
                [
                    'subscription_id' => $subscription->id,
                    'starts_at' => $subscription->starts_at,
                    'ends_at' => $subscription->ends_at,
                    'granted_credits_json' => ['counselling' => $counselling, 'training' => $training],
                    'counselling_unit_value_minor' => $counsellingValue,
                    'training_unit_value_minor' => $trainingValue,
                    'status' => 'active',
                ]
            );
            foreach (['counselling' => $counselling, 'training' => $training] as $type => $quantity) {
                if ($quantity > 0 && !$period->ledgerEntries()->where('credit_type', $type)->where('status', 'granted')->exists()) {
                    CreditLedgerEntry::query()->create([
                        'subscription_id' => $subscription->id,
                        'entitlement_period_id' => $period->id,
                        'credit_type' => $type,
                        'quantity' => $quantity,
                        'status' => 'granted',
                        'reason' => 'Granted after captured membership payment.',
                    ]);
                }
            }
            if (!MembershipReceipt::query()->where('payment_id', $payment->id)->exists()) {
                MembershipReceipt::query()->create([
                    'payment_id' => $payment->id,
                    'subscription_id' => $subscription->id,
                    'receipt_number' => $this->receiptNumbers->next(),
                    'client_name' => $subscription->client->name,
                    'client_email' => $subscription->client->email,
                    'plan_name' => $subscription->version->name,
                    'tier_label' => $subscription->tier->label,
                    'amount_minor' => $payment->amount_minor,
                    'currency' => $payment->currency,
                    'invoice_type' => 'receipt',
                    'tax_invoice_enabled' => false,
                    'issued_at' => now(),
                ]);
            }
            RevenueRecognition::query()->firstOrCreate(
                ['payment_id' => $payment->id, 'recognition_reason' => 'payment_captured_deferred'],
                [
                    'subscription_id' => $subscription->id,
                    'entitlement_period_id' => $period->id,
                    'amount_earned_minor' => 0,
                    'amount_deferred_minor' => $payment->amount_minor,
                    'recognized_at' => now(),
                ]
            );

            $this->activityLogs->record('billing', 'payment_captured', sprintf('%s membership payment was captured.', $subscription->client->name), [
                'actor' => $subscription->client,
                'subject' => $payment,
                'details' => [
                    'subscriptionId' => $subscription->id,
                    'amountMinor' => $payment->amount_minor,
                    'currency' => $payment->currency,
                    'status' => $payment->status,
                ],
                'audienceRoles' => ['finance'],
                'audienceUsers' => [$subscription->client],
            ]);

            return $subscription->fresh();
        });
    }

    public function refund(MembershipPayment $payment, User $actor, array $data): MembershipRefund
    {
        $payment->load('subscription.entitlementPeriods');
        if ($payment->status !== 'captured' && $payment->status !== 'partially_refunded') {
            throw new RuntimeException('Only captured payments may be refunded.');
        }
        $alreadyRefunded = (int) $payment->refunds()->where('status', 'processed')->sum('amount_minor');
        $amount = (int) $data['amount_minor'];
        if ($amount < 1 || $amount > ($payment->amount_minor - $alreadyRefunded)) {
            throw new RuntimeException('Refund amount exceeds the refundable payment balance.');
        }

        $fullRefund = ($alreadyRefunded + $amount) === $payment->amount_minor;
        $hasConsumedCredits = CreditLedgerEntry::query()
            ->where('subscription_id', $payment->subscription_id)
            ->where('status', 'consumed')
            ->exists();
        if ($fullRefund && $hasConsumedCredits && !($data['confirm_consumed_credits'] ?? false)) {
            throw new RuntimeException('Full refund after used credits requires explicit confirmation.');
        }

        $refund = MembershipRefund::query()->create([
            'payment_id' => $payment->id,
            'subscription_id' => $payment->subscription_id,
            'amount_minor' => $amount,
            'category' => $data['category'],
            'reason' => trim((string) $data['reason']),
            'credit_action' => $data['credit_action'] ?? 'preserve',
            'status' => 'created',
            'actor_user_id' => $actor->id,
        ]);
        try {
            $provider = $this->gateway->refund($payment, $refund);
        } catch (\Throwable $exception) {
            $refund->update(['status' => 'failed']);
            throw $exception;
        }
        $refund->update(['provider_refund_id' => $provider['refund_id'], 'status' => 'processed']);
        $payment->update(['status' => $fullRefund ? 'fully_refunded' : 'partially_refunded']);
        if ($fullRefund && $data['category'] !== 'duplicate_payment') {
            $payment->subscription->update(['status' => 'refunded', 'refunded_at' => now()]);
            $this->entitlements->expireUnused($payment->subscription, 'Voided after full membership refund.');
        }

        $payment->loadMissing('subscription.client');
        $client = $payment->subscription->client;
        $this->activityLogs->record('billing', 'refund_processed', sprintf('%s processed a refund for %s.', $actor->name, $client->name), [
            'actor' => $actor,
            'subject' => $refund,
            'targetUser' => $client,
            'details' => [
                'paymentId' => $payment->id,
                'amountMinor' => $refund->amount_minor,
                'category' => $refund->category,
                'reason' => $refund->reason,
                'status' => $refund->status,
            ],
            'audienceRoles' => ['finance'],
            'audienceUsers' => [$client],
        ]);

        return $refund->fresh();
    }
}
