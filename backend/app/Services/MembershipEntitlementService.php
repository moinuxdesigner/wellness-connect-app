<?php

namespace App\Services;

use App\Models\Appointment;
use App\Models\CreditLedgerEntry;
use App\Models\EntitlementPeriod;
use App\Models\MembershipSubscription;
use App\Models\RevenueRecognition;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class MembershipEntitlementService
{
    public function reserve(MembershipSubscription $subscription, Appointment $appointment, int $clientUserId, string $serviceType): void
    {
        if ($subscription->client_user_id !== $clientUserId || $subscription->status !== 'active') {
            throw new RuntimeException('Selected membership is not active for this client.');
        }

        $creditTypes = $this->creditTypesForService($serviceType);
        if ($creditTypes === []) {
            throw new RuntimeException('Membership credits cannot be applied to this appointment type.');
        }

        $period = EntitlementPeriod::query()
            ->where('subscription_id', $subscription->id)
            ->where('status', 'active')
            ->where('starts_at', '<=', now())
            ->where('ends_at', '>=', now())
            ->lockForUpdate()
            ->latest('id')
            ->first();
        if (!$period) {
            throw new RuntimeException('No active membership credits are available.');
        }

        foreach ($creditTypes as $creditType) {
            if ($this->availableBalance($period, $creditType) < 1) {
                throw new RuntimeException("Insufficient {$creditType} membership credits.");
            }
        }

        foreach ($creditTypes as $creditType) {
            CreditLedgerEntry::query()->create([
                'subscription_id' => $subscription->id,
                'entitlement_period_id' => $period->id,
                'appointment_id' => $appointment->id,
                'actor_user_id' => $clientUserId,
                'credit_type' => $creditType,
                'quantity' => -1,
                'status' => 'reserved',
                'reason' => 'Reserved for appointment booking.',
            ]);
        }
    }

    public function handleClientCancellation(Appointment $appointment, int $actorUserId): void
    {
        $reservations = $this->openReservations($appointment);
        if ($reservations->isEmpty()) {
            return;
        }

        $hours = now()->diffInHours($appointment->starts_at, false);
        $restore = $hours >= (int) config('services.razorpay.free_cancellation_before_hours', 24);
        foreach ($reservations as $reservation) {
            CreditLedgerEntry::query()->create([
                'subscription_id' => $reservation->subscription_id,
                'entitlement_period_id' => $reservation->entitlement_period_id,
                'appointment_id' => $appointment->id,
                'actor_user_id' => $actorUserId,
                'credit_type' => $reservation->credit_type,
                'quantity' => $restore ? 1 : 0,
                'status' => $restore ? 'restored' : 'consumed',
                'reason' => $restore ? 'Restored after timely client cancellation.' : 'Consumed due to late client cancellation.',
            ]);
        }
    }

    public function completeAppointment(Appointment $appointment, ?int $actorUserId = null): void
    {
        foreach ($this->openReservations($appointment) as $reservation) {
            $consumed = CreditLedgerEntry::query()->create([
                'subscription_id' => $reservation->subscription_id,
                'entitlement_period_id' => $reservation->entitlement_period_id,
                'appointment_id' => $appointment->id,
                'actor_user_id' => $actorUserId,
                'credit_type' => $reservation->credit_type,
                'quantity' => 0,
                'status' => 'consumed',
                'reason' => 'Recognized on completed appointment.',
            ]);
            $period = EntitlementPeriod::query()->findOrFail($reservation->entitlement_period_id);
            $unitValue = $reservation->credit_type === 'counselling'
                ? $period->counselling_unit_value_minor
                : $period->training_unit_value_minor;
            RevenueRecognition::query()->create([
                'subscription_id' => $reservation->subscription_id,
                'payment_id' => $period->payment_id,
                'entitlement_period_id' => $period->id,
                'appointment_id' => $appointment->id,
                'credit_ledger_id' => $consumed->id,
                'amount_earned_minor' => $unitValue,
                'amount_deferred_minor' => -$unitValue,
                'recognition_reason' => 'session_completed',
                'recognized_at' => now(),
            ]);
        }
    }

    public function expireUnused(MembershipSubscription $subscription, string $reason): void
    {
        foreach ($subscription->entitlementPeriods()->where('status', 'active')->get() as $period) {
            foreach (['counselling', 'training'] as $type) {
                $available = $this->availableBalance($period, $type);
                if ($available > 0) {
                    CreditLedgerEntry::query()->create([
                        'subscription_id' => $subscription->id,
                        'entitlement_period_id' => $period->id,
                        'credit_type' => $type,
                        'quantity' => -$available,
                        'status' => 'voided',
                        'reason' => $reason,
                    ]);
                }
            }
            $period->update(['status' => 'voided']);
        }
    }

    public function balances(MembershipSubscription $subscription): array
    {
        $period = $subscription->entitlementPeriods()->latest('id')->first();
        if (!$period) {
            return ['counselling' => 0, 'training' => 0];
        }
        return [
            'counselling' => $this->availableBalance($period, 'counselling'),
            'training' => $this->availableBalance($period, 'training'),
        ];
    }

    private function availableBalance(EntitlementPeriod $period, string $creditType): int
    {
        return (int) CreditLedgerEntry::query()
            ->where('entitlement_period_id', $period->id)
            ->where('credit_type', $creditType)
            ->sum('quantity');
    }

    private function openReservations(Appointment $appointment)
    {
        return CreditLedgerEntry::query()
            ->where('appointment_id', $appointment->id)
            ->where('status', 'reserved')
            ->whereNotExists(function ($query) use ($appointment): void {
                $query->select(DB::raw(1))
                    ->from('credit_ledger_entries as resolution')
                    ->whereColumn('resolution.entitlement_period_id', 'credit_ledger_entries.entitlement_period_id')
                    ->whereColumn('resolution.credit_type', 'credit_ledger_entries.credit_type')
                    ->where('resolution.appointment_id', $appointment->id)
                    ->whereIn('resolution.status', ['restored', 'consumed']);
            })->get();
    }

    private function creditTypesForService(string $serviceType): array
    {
        return match ($serviceType) {
            'psychology', 'counselling' => ['counselling'],
            'training' => ['training'],
            'combined' => ['counselling', 'training'],
            default => [],
        };
    }
}
