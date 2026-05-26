<?php

namespace App\Services;

use App\Models\Appointment;
use App\Models\AppointmentEvent;
use App\Models\Notification;
use Illuminate\Support\Facades\DB;

class SessionNoShowService
{
    public function __construct(
        private readonly ActivityLogService $activityLogs,
        private readonly WorkflowConfigService $configService,
    )
    {
    }

    public function process(): int
    {
        $config = $this->configService->get(WorkflowConfigService::SESSION_NO_SHOW);
        $eligibleStatuses = $config['eligibleStatuses'] ?? ['scheduled', 'rescheduled'];
        $delayMinutes = (int) ($config['delayAfterEndMinutes'] ?? 30);
        $notifyClient = (bool) ($config['notifyClient'] ?? false);

        $appointments = Appointment::query()
            ->whereIn('status', $eligibleStatuses)
            ->where('ends_at', '<=', now()->subMinutes($delayMinutes))
            ->get();

        foreach ($appointments as $appointment) {
            DB::transaction(function () use ($appointment, $delayMinutes, $notifyClient): void {
                $appointment->forceFill([
                    'status' => 'no_show',
                ])->save();

                AppointmentEvent::query()->create([
                    'appointment_id' => $appointment->id,
                    'event_type' => 'no_show',
                    'actor_user_id' => $appointment->client_user_id,
                    'meta_json' => [
                        'trigger' => 'automatic',
                        'delayAfterEndMinutes' => $delayMinutes,
                    ],
                    'created_at' => now(),
                ]);

                if ($notifyClient) {
                    Notification::query()->create([
                        'user_id' => $appointment->client_user_id,
                        'type' => 'appointment_no_show',
                        'channel' => 'in_app',
                        'payload_json' => [
                            'title' => 'Appointment marked as no-show',
                            'appointmentId' => $appointment->id,
                            'startsAt' => optional($appointment->starts_at)?->toIso8601String(),
                        ],
                        'status' => 'queued',
                    ]);
                }

                $appointment->loadMissing(['client', 'practitioner.user']);
                $practitionerUser = optional($appointment->practitioner)->user;
                $this->activityLogs->record('appointment', 'no_show', sprintf('Appointment #%d was marked as no-show automatically.', $appointment->id), [
                    'actorRole' => 'system',
                    'subject' => $appointment,
                    'details' => [
                        'trigger' => 'automatic',
                        'delayAfterEndMinutes' => $delayMinutes,
                    ],
                    'audienceUsers' => array_values(array_filter([$appointment->client, $practitionerUser])),
                    'audienceRoles' => $practitionerUser ? [$practitionerUser->role] : [],
                ]);
            });
        }

        return $appointments->count();
    }
}
