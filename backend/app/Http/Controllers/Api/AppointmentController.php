<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\AppointmentEvent;
use App\Models\AvailabilitySlot;
use App\Models\MembershipSubscription;
use App\Services\ActivityLogService;
use App\Services\MembershipEntitlementService;
use App\Services\SlotBookingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class AppointmentController extends Controller
{
    public function __construct(
        private readonly ActivityLogService $activityLogs,
        private readonly SlotBookingService $slotBookingService,
        private readonly MembershipEntitlementService $entitlements,
    )
    {
    }

    public function index(Request $request): JsonResponse
    {
        $appointments = Appointment::query()
            ->where('client_user_id', $request->user()->id)
            ->with('practitioner.user')
            ->orderByDesc('starts_at')
            ->get();

        return response()->json(['appointments' => $appointments]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'intake_flow_id' => ['nullable', 'integer', 'exists:intake_flows,id'],
            'practitioner_id' => ['required', 'integer', 'exists:practitioners,id'],
            'slot_id' => ['required', 'integer', 'exists:availability_slots,id'],
            'service_type' => ['required', 'in:psychology,training,combined,package'],
            'mode' => ['required', 'in:online,in_person,hybrid'],
            'use_membership_credits' => ['nullable', 'boolean'],
            'membership_subscription_id' => ['required_if:use_membership_credits,true', 'nullable', 'integer', 'exists:membership_subscriptions,id'],
        ]);

        $subscription = ($validated['use_membership_credits'] ?? false)
            ? MembershipSubscription::query()->findOrFail($validated['membership_subscription_id'])
            : null;
        try {
            $appointment = $this->slotBookingService->book(
                $request->user()->id,
                $validated['practitioner_id'],
                $validated['slot_id'],
                $validated['service_type'],
                $validated['mode'],
                $validated['intake_flow_id'] ?? null,
                $subscription,
            );
        } catch (RuntimeException $exception) {
            return response()->json(['message' => $exception->getMessage()], 422);
        }

        $appointment->loadMissing(['client', 'practitioner.user']);
        $practitionerUser = optional($appointment->practitioner)->user;
        $this->activityLogs->record('appointment', 'booked', sprintf('%s booked appointment #%d.', $request->user()->name, $appointment->id), [
            'actor' => $request->user(),
            'subject' => $appointment,
            'details' => [
                'serviceType' => $appointment->service_type,
                'status' => $appointment->status,
                'startsAt' => optional($appointment->starts_at)->toIso8601String(),
            ],
            'audienceUsers' => array_values(array_filter([$appointment->client, $practitionerUser])),
            'audienceRoles' => $practitionerUser ? [$practitionerUser->role] : [],
        ]);

        return response()->json(['appointment' => $appointment], 201);
    }

    public function reschedule(Request $request, Appointment $appointment): JsonResponse
    {
        abort_unless($appointment->client_user_id === $request->user()->id, 403);

        $validated = $request->validate([
            'slot_id' => ['required', 'integer', 'exists:availability_slots,id'],
        ]);

        try {
            DB::transaction(function () use ($appointment, $validated, $request): void {
                $slot = AvailabilitySlot::query()->lockForUpdate()->findOrFail($validated['slot_id']);

                if ($slot->slot_status !== 'open' || (int) $slot->practitioner_id !== (int) $appointment->practitioner_id || $slot->starts_at->lte(now())) {
                    throw new RuntimeException('Selected slot is no longer available.');
                }

                $oldSlot = AvailabilitySlot::query()
                    ->where('practitioner_id', $appointment->practitioner_id)
                    ->where('starts_at', $appointment->starts_at)
                    ->where('ends_at', $appointment->ends_at)
                    ->first();

                if ($oldSlot && $oldSlot->slot_status === 'booked') {
                    $oldSlot->update(['slot_status' => 'open']);
                }

                $appointment->update([
                    'starts_at' => $slot->starts_at,
                    'ends_at' => $slot->ends_at,
                    'status' => 'rescheduled',
                    'reschedule_count' => $appointment->reschedule_count + 1,
                ]);

                $slot->update(['slot_status' => 'booked']);

                AppointmentEvent::create([
                    'appointment_id' => $appointment->id,
                    'event_type' => 'rescheduled',
                    'actor_user_id' => $request->user()->id,
                    'meta_json' => ['slot_id' => $slot->id],
                    'created_at' => now(),
                ]);
            });
        } catch (RuntimeException $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }

        $appointment->loadMissing(['client', 'practitioner.user']);
        $practitionerUser = optional($appointment->practitioner)->user;
        $this->activityLogs->record('appointment', 'rescheduled', sprintf('%s rescheduled appointment #%d.', $request->user()->name, $appointment->id), [
            'actor' => $request->user(),
            'subject' => $appointment,
            'details' => [
                'status' => $appointment->status,
                'startsAt' => optional($appointment->starts_at)->toIso8601String(),
            ],
            'audienceUsers' => array_values(array_filter([$appointment->client, $practitionerUser])),
            'audienceRoles' => $practitionerUser ? [$practitionerUser->role] : [],
        ]);

        return response()->json(['appointment' => $appointment->fresh()]);
    }

    public function cancel(Request $request, Appointment $appointment): JsonResponse
    {
        abort_unless($appointment->client_user_id === $request->user()->id, 403);

        $validated = $request->validate([
            'reason' => ['nullable', 'string', 'max:255'],
        ]);

        $appointment->update([
            'status' => 'cancelled',
            'cancel_reason' => $validated['reason'] ?? null,
        ]);

        AppointmentEvent::create([
            'appointment_id' => $appointment->id,
            'event_type' => 'cancelled',
            'actor_user_id' => $request->user()->id,
            'meta_json' => ['reason' => $validated['reason'] ?? null],
            'created_at' => now(),
        ]);
        $this->entitlements->handleClientCancellation($appointment, $request->user()->id);

        $appointment->loadMissing(['client', 'practitioner.user']);
        $practitionerUser = optional($appointment->practitioner)->user;
        $this->activityLogs->record('appointment', 'cancelled', sprintf('%s cancelled appointment #%d.', $request->user()->name, $appointment->id), [
            'actor' => $request->user(),
            'subject' => $appointment,
            'details' => ['reason' => $validated['reason'] ?? null],
            'audienceUsers' => array_values(array_filter([$appointment->client, $practitionerUser])),
            'audienceRoles' => $practitionerUser ? [$practitionerUser->role] : [],
        ]);

        return response()->json(['message' => 'Appointment cancelled.', 'appointment' => $appointment->fresh()]);
    }

    public function complete(Request $request, Appointment $appointment): JsonResponse
    {
        abort_if($appointment->status === 'cancelled', 422, 'Cancelled appointments cannot be completed.');
        $appointment->update(['status' => 'completed']);
        $this->entitlements->completeAppointment($appointment, $request->user()->id);

        $appointment->loadMissing(['client', 'practitioner.user']);
        $practitionerUser = optional($appointment->practitioner)->user;
        $this->activityLogs->record('appointment', 'completed', sprintf('Appointment #%d was completed.', $appointment->id), [
            'actor' => $request->user(),
            'subject' => $appointment,
            'details' => ['status' => $appointment->status],
            'audienceUsers' => array_values(array_filter([$appointment->client, $practitionerUser])),
            'audienceRoles' => $practitionerUser ? [$practitionerUser->role] : [],
        ]);

        return response()->json(['message' => 'Appointment completed.', 'appointment' => $appointment->fresh()]);
    }
}
