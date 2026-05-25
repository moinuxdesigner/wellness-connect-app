<?php

namespace App\Contracts;

use App\Models\MembershipPayment;
use App\Models\MembershipRefund;

interface PaymentGateway
{
    public function createOrder(MembershipPayment $payment): array;

    public function verifyCheckout(string $orderId, string $paymentId, string $signature): bool;

    public function verifyWebhook(string $payload, string $signature): bool;

    public function refund(MembershipPayment $payment, MembershipRefund $refund): array;
}
