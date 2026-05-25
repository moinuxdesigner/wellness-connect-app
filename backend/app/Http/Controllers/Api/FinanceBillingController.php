<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MembershipPayment;
use App\Models\MembershipReceipt;
use App\Models\MembershipRefund;
use App\Models\MembershipSubscription;
use App\Models\RevenueRecognition;
use App\Services\MembershipBillingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use RuntimeException;

class FinanceBillingController extends Controller
{
    public function __construct(private readonly MembershipBillingService $billing)
    {
    }

    public function summary(): JsonResponse
    {
        return response()->json(['summary' => [
            'capturedMinor' => (int) MembershipPayment::query()->whereIn('status', ['captured', 'partially_refunded', 'fully_refunded'])->sum('amount_minor'),
            'refundedMinor' => (int) MembershipRefund::query()->where('status', 'processed')->sum('amount_minor'),
            'deferredMinor' => (int) RevenueRecognition::query()->sum('amount_deferred_minor'),
            'earnedMinor' => (int) RevenueRecognition::query()->sum('amount_earned_minor'),
            'activeMemberships' => MembershipSubscription::query()->where('status', 'active')->count(),
        ]]);
    }

    public function payments(): JsonResponse
    {
        return response()->json(['payments' => MembershipPayment::query()->with(['subscription.client', 'subscription.version', 'receipt'])->latest()->limit(100)->get()]);
    }

    public function receipts(): JsonResponse
    {
        return response()->json(['receipts' => MembershipReceipt::query()->latest()->limit(100)->get()]);
    }

    public function refunds(): JsonResponse
    {
        return response()->json(['refunds' => MembershipRefund::query()->with(['payment', 'actor:id,name,email'])->latest()->limit(100)->get()]);
    }

    public function refund(Request $request, MembershipPayment $payment): JsonResponse
    {
        $validated = $request->validate([
            'amount_minor' => ['required', 'integer', 'min:1'],
            'category' => ['required', 'in:duplicate_payment,client_request,service_not_delivered,professional_unavailable,billing_error,goodwill,admin_adjustment'],
            'reason' => ['required', 'string', 'min:5', 'max:500'],
            'credit_action' => ['nullable', 'in:preserve,expire_remaining'],
            'confirm_consumed_credits' => ['nullable', 'boolean'],
        ]);
        try {
            return response()->json(['message' => 'Refund submitted.', 'refund' => $this->billing->refund($payment, $request->user(), $validated)], 201);
        } catch (RuntimeException $exception) {
            return response()->json(['message' => $exception->getMessage()], 422);
        }
    }
}
