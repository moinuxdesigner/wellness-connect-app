<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\AppointmentEvent;
use App\Models\AvailabilitySlot;
use App\Services\SlotBookingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AppointmentController extends Controller
{
    public function __construct(private readonly SlotBookingService $slotBookingService)
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
        ]);

        $appointment = $this->slotBookingService->book(
            $request->user()->id,
            $validated['practitioner_id'],
            $validated['slot_id'],
            $validated['service_type'],
            $validated['mode'],
            $validated['intake_flow_id'] ?? null,
        );

        return response()->json(['appointment' => $appointment], 201);
    }

    public function reschedule(Request $request, Appointment $appointment): JsonResponse
    {
        abort_unless($appointment->client_user_id === $request->user()->id, 403);

        $validated = $request->validate([
            'slot_id' => ['required', 'integer', 'exists:availability_slots,id'],
        ]);

        DB::transaction(function () use ($appointment, $validated, $request) {
            $slot = AvailabilitySlot::query()->lockForUpdate()->findOrFail($validated['slot_id']);

            if ($slot->slot_status !== 'open') {
                abort(422, 'Selected slot is no longer available.');
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

        return response()->json(['message' => 'Appointment cancelled.', 'appointment' => $appointment->fresh()]);
    }
}
