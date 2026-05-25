<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MembershipPayment;
use App\Models\MembershipReceipt;
use App\Models\MembershipSubscription;
use App\Models\WellnessPackagePriceTier;
use App\Services\MembershipBillingService;
use App\Services\MembershipEntitlementService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use RuntimeException;

class ClientMembershipController extends Controller
{
    public function __construct(private readonly MembershipBillingService $billing, private readonly MembershipEntitlementService $entitlements)
    {
    }

    public function checkoutOrder(Request $request): JsonResponse
    {
        abort_unless($request->user()?->role === 'client', 403);
        $validated = $request->validate(['tier_id' => ['required', 'integer', 'exists:wellness_package_price_tiers,id']]);
        try {
            return response()->json($this->billing->createCheckout($request->user(), WellnessPackagePriceTier::query()->findOrFail($validated['tier_id'])), 201);
        } catch (RuntimeException $exception) {
            return response()->json(['message' => $exception->getMessage()], 422);
        }
    }

    public function verify(Request $request): JsonResponse
    {
        abort_unless($request->user()?->role === 'client', 403);
        $validated = $request->validate([
            'payment_id' => ['required', 'integer', 'exists:membership_payments,id'],
            'provider_payment_id' => ['required', 'string', 'max:255'],
            'signature' => ['required', 'string', 'max:255'],
        ]);
        try {
            $subscription = $this->billing->verifyAndActivate($request->user(), MembershipPayment::query()->findOrFail($validated['payment_id']), $validated['provider_payment_id'], $validated['signature']);
            return response()->json(['message' => 'Membership activated.', 'subscription' => $this->subscriptionPayload($subscription)]);
        } catch (RuntimeException $exception) {
            return response()->json(['message' => $exception->getMessage()], 422);
        }
    }

    public function index(Request $request): JsonResponse
    {
        abort_unless($request->user()?->role === 'client', 403);
        $subscriptions = MembershipSubscription::query()
            ->where('client_user_id', $request->user()->id)
            ->with(['version', 'tier', 'payments.receipt'])
            ->latest()
            ->get()
            ->map(fn (MembershipSubscription $subscription) => $this->subscriptionPayload($subscription));
        return response()->json(['memberships' => $subscriptions]);
    }

    public function receipt(Request $request, MembershipReceipt $receipt): JsonResponse
    {
        abort_unless($receipt->subscription()->where('client_user_id', $request->user()->id)->exists(), 403);
        return response()->json(['receipt' => $receipt]);
    }

    private function subscriptionPayload(MembershipSubscription $subscription): array
    {
        $subscription->loadMissing(['version', 'tier', 'payments.receipt']);
        return [
            'id' => $subscription->id,
            'status' => $subscription->status,
            'planName' => $subscription->version->name,
            'tierLabel' => $subscription->tier->label,
            'startsAt' => optional($subscription->starts_at)->toIso8601String(),
            'endsAt' => optional($subscription->ends_at)->toIso8601String(),
            'credits' => $this->entitlements->balances($subscription),
            'payment' => $subscription->payments->last(),
            'receipt' => optional($subscription->payments->last()?->receipt)->only(['id', 'receipt_number', 'amount_minor', 'currency', 'issued_at']),
        ];
    }
}
