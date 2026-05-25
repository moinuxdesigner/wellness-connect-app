<?php

namespace App\Services;

use App\Models\Appointment;
use App\Models\AppointmentEvent;
use App\Models\AvailabilitySlot;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class SlotBookingService
{
    public function __construct(private readonly MembershipEntitlementService $entitlements)
    {
    }

    public function book(int $clientUserId, int $practitionerId, int $slotId, string $serviceType, string $mode, ?int $intakeFlowId = null, ?\App\Models\MembershipSubscription $subscription = null): Appointment
    {
        return DB::transaction(function () use ($clientUserId, $practitionerId, $slotId, $serviceType, $mode, $intakeFlowId, $subscription) {
            $slot = AvailabilitySlot::query()->lockForUpdate()->findOrFail($slotId);

            if ($slot->slot_status !== 'open') {
                throw new RuntimeException('Selected slot is no longer available.');
            }

            $appointment = Appointment::create([
                'client_user_id' => $clientUserId,
                'practitioner_id' => $practitionerId,
                'intake_flow_id' => $intakeFlowId,
                'service_type' => $serviceType,
                'mode' => $mode,
                'starts_at' => $slot->starts_at,
                'ends_at' => $slot->ends_at,
                'status' => 'scheduled',
            ]);

            $slot->update(['slot_status' => 'booked']);

            AppointmentEvent::create([
                'appointment_id' => $appointment->id,
                'event_type' => 'created',
                'actor_user_id' => $clientUserId,
                'meta_json' => ['slot_id' => $slot->id],
                'created_at' => now(),
            ]);

            if ($subscription) {
                $this->entitlements->reserve($subscription, $appointment, $clientUserId, $serviceType);
            }

            return $appointment;
        });
    }
}
