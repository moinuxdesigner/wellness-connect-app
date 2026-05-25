<?php

namespace App\Services;

use App\Contracts\PaymentGateway;
use App\Models\MembershipPayment;
use App\Models\MembershipRefund;
use Illuminate\Support\Facades\Http;
use RuntimeException;

class RazorpayPaymentGateway implements PaymentGateway
{
    public function createOrder(MembershipPayment $payment): array
    {
        $this->assertConfigured();
        $response = Http::withBasicAuth((string) config('services.razorpay.key_id'), (string) config('services.razorpay.key_secret'))
            ->post('https://api.razorpay.com/v1/orders', [
                'amount' => $payment->amount_minor,
                'currency' => $payment->currency,
                'receipt' => 'membership-payment-' . $payment->id,
                'notes' => ['membership_payment_id' => (string) $payment->id],
            ])->throw()->json();

        return ['order_id' => (string) $response['id'], 'key_id' => (string) config('services.razorpay.key_id')];
    }

    public function verifyCheckout(string $orderId, string $paymentId, string $signature): bool
    {
        $secret = (string) config('services.razorpay.key_secret');
        return $secret !== '' && hash_equals(hash_hmac('sha256', "{$orderId}|{$paymentId}", $secret), $signature);
    }

    public function verifyWebhook(string $payload, string $signature): bool
    {
        $secret = (string) config('services.razorpay.webhook_secret');
        return $secret !== '' && hash_equals(hash_hmac('sha256', $payload, $secret), $signature);
    }

    public function refund(MembershipPayment $payment, MembershipRefund $refund): array
    {
        $this->assertConfigured();
        if (!$payment->provider_payment_id) {
            throw new RuntimeException('Captured provider payment reference is missing.');
        }

        $response = Http::withBasicAuth((string) config('services.razorpay.key_id'), (string) config('services.razorpay.key_secret'))
            ->post("https://api.razorpay.com/v1/payments/{$payment->provider_payment_id}/refund", [
                'amount' => $refund->amount_minor,
                'notes' => ['membership_refund_id' => (string) $refund->id],
            ])->throw()->json();

        return ['refund_id' => (string) $response['id'], 'status' => (string) ($response['status'] ?? 'processed')];
    }

    private function assertConfigured(): void
    {
        if (!config('services.razorpay.key_id') || !config('services.razorpay.key_secret')) {
            throw new RuntimeException('Razorpay is not configured for checkout.');
        }
    }
}
