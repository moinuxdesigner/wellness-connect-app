<?php

namespace Tests\Feature;

use App\Models\Appointment;
use App\Models\AvailabilitySlot;
use App\Models\IntakeFlow;
use App\Models\Practitioner;
use App\Models\SupportRequest;
use App\Models\TrainerApplication;
use App\Models\User;
use App\Models\WorkflowCase;
use App\Services\WorkflowConfigService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class PerformanceDashboardTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_view_performance_dashboard_metrics(): void
    {
        $admin = User::factory()->create(['role' => 'admin', 'status' => 'active']);

        $counsellorUser = User::factory()->create(['role' => 'counsellor', 'status' => 'active']);
        $trainerUser = User::factory()->create(['role' => 'trainer', 'status' => 'active']);
        $client = User::factory()->create(['role' => 'client', 'status' => 'active']);

        $counsellor = Practitioner::query()->create([
            'user_id' => $counsellorUser->id,
            'practitioner_type' => 'counsellor',
            'bio' => 'Counsellor',
            'rating' => 4.8,
            'is_active' => true,
        ]);
        $trainer = Practitioner::query()->create([
            'user_id' => $trainerUser->id,
            'practitioner_type' => 'trainer',
            'bio' => 'Trainer',
            'rating' => 4.6,
            'is_active' => true,
        ]);

        foreach ([
            [
                'practitioner_id' => $counsellor->id,
                'starts_at' => now()->subDays(2)->setTime(9, 0),
                'ends_at' => now()->subDays(2)->setTime(10, 0),
                'slot_status' => 'booked',
            ],
            [
                'practitioner_id' => $counsellor->id,
                'starts_at' => now()->subDays(1)->setTime(9, 0),
                'ends_at' => now()->subDays(1)->setTime(10, 0),
                'slot_status' => 'open',
            ],
            [
                'practitioner_id' => $trainer->id,
                'starts_at' => now()->subDays(3)->setTime(9, 0),
                'ends_at' => now()->subDays(3)->setTime(10, 0),
                'slot_status' => 'booked',
            ],
            [
                'practitioner_id' => $trainer->id,
                'starts_at' => now()->subDays(2)->setTime(11, 0),
                'ends_at' => now()->subDays(2)->setTime(12, 0),
                'slot_status' => 'booked',
            ],
            [
                'practitioner_id' => $trainer->id,
                'starts_at' => now()->subDays(1)->setTime(9, 0),
                'ends_at' => now()->subDays(1)->setTime(10, 0),
                'slot_status' => 'open',
            ],
            [
                'practitioner_id' => $trainer->id,
                'starts_at' => now()->subDays(1)->setTime(12, 0),
                'ends_at' => now()->subDays(1)->setTime(13, 0),
                'slot_status' => 'blocked',
            ],
        ] as $slot) {
            AvailabilitySlot::query()->create($slot);
        }

        foreach ([
            [
                'client_user_id' => $client->id,
                'practitioner_id' => $counsellor->id,
                'service_type' => 'psychology',
                'mode' => 'online',
                'starts_at' => now()->subDays(3),
                'ends_at' => now()->subDays(3)->addHour(),
                'status' => 'completed',
                'reschedule_count' => 0,
            ],
            [
                'client_user_id' => $client->id,
                'practitioner_id' => $trainer->id,
                'service_type' => 'training',
                'mode' => 'online',
                'starts_at' => now()->subDays(2),
                'ends_at' => now()->subDays(2)->addHour(),
                'status' => 'cancelled',
                'reschedule_count' => 0,
            ],
            [
                'client_user_id' => $client->id,
                'practitioner_id' => $trainer->id,
                'service_type' => 'training',
                'mode' => 'online',
                'starts_at' => now()->subDay(),
                'ends_at' => now()->subDay()->addHour(),
                'status' => 'no_show',
                'reschedule_count' => 0,
            ],
        ] as $appointment) {
            Appointment::query()->create($appointment);
        }

        $supportRequest = SupportRequest::query()->create([
            'ticket_number' => 'WC-SUP-000101',
            'requester_user_id' => $client->id,
            'name' => 'Jordan Client',
            'email' => $client->email,
            'topic' => 'technical_issue',
            'subject' => 'Need help joining a session',
            'message' => 'Support needed.',
            'status' => 'resolved',
        ]);

        $supportCase = WorkflowCase::query()->create([
            'workflow_key' => WorkflowConfigService::CROSS_TEAM_FOLLOW_UP_SLA,
            'subject_type' => SupportRequest::class,
            'subject_id' => $supportRequest->id,
            'status' => 'resolved',
            'priority' => 'medium',
            'owner_role' => 'helpdesk',
            'due_at' => now()->subMinutes(30),
            'acknowledged_at' => now()->subHour(),
            'resolved_at' => now()->subMinutes(20),
            'meta_json' => ['title' => 'Support request WC-SUP-000101', 'summary' => 'technical_issue: Need help joining a session'],
        ]);
        $supportCase->forceFill([
            'created_at' => now()->subHours(2),
            'updated_at' => now()->subMinutes(20),
        ])->save();

        $flowOne = IntakeFlow::query()->create([
            'client_user_id' => $client->id,
            'service_type' => 'psychology',
            'current_step' => 'confirm',
            'status' => 'under_review',
            'risk_level' => 'high',
        ]);
        $flowTwo = IntakeFlow::query()->create([
            'client_user_id' => $client->id,
            'service_type' => 'psychology',
            'current_step' => 'confirm',
            'status' => 'under_review',
            'risk_level' => 'high',
        ]);

        $breachedEscalation = WorkflowCase::query()->create([
            'workflow_key' => WorkflowConfigService::CRITICAL_RISK_ESCALATION,
            'subject_type' => IntakeFlow::class,
            'subject_id' => $flowOne->id,
            'status' => 'breached',
            'priority' => 'high',
            'owner_role' => 'admin',
            'due_at' => now()->subMinutes(10),
            'breached_at' => now()->subMinutes(5),
            'meta_json' => ['title' => 'Critical risk intake requires follow-up', 'summary' => 'High-risk psychology intake'],
        ]);
        $breachedEscalation->forceFill([
            'created_at' => now()->subHours(3),
            'updated_at' => now()->subMinutes(5),
        ])->save();

        $resolvedEscalation = WorkflowCase::query()->create([
            'workflow_key' => WorkflowConfigService::CRITICAL_RISK_ESCALATION,
            'subject_type' => IntakeFlow::class,
            'subject_id' => $flowTwo->id,
            'status' => 'resolved',
            'priority' => 'high',
            'owner_role' => 'admin',
            'resolved_at' => now()->subMinutes(30),
            'meta_json' => ['title' => 'Critical risk intake requires follow-up', 'summary' => 'Resolved escalation'],
        ]);
        $resolvedEscalation->forceFill([
            'created_at' => now()->subHours(2),
            'updated_at' => now()->subMinutes(30),
        ])->save();

        TrainerApplication::query()->create([
            'application_id' => 'TRN-RESOLVED-1',
            'applicant_name' => 'Resolved Trainer',
            'applicant_email' => 'resolved@example.com',
            'applicant_mobile' => '1234567890',
            'city' => 'Hyderabad',
            'state' => 'Telangana',
            'expertise_json' => [],
            'values_json' => [],
            'status' => 'approved',
            'admin_remarks' => '',
            'submitted_at' => now()->subDays(4),
            'review_history_json' => [],
        ])->forceFill([
            'updated_at' => now()->subDays(2),
        ])->save();

        TrainerApplication::query()->create([
            'application_id' => 'TRN-PENDING-1',
            'applicant_name' => 'Pending Trainer',
            'applicant_email' => 'pending@example.com',
            'applicant_mobile' => '9999999999',
            'city' => 'Bengaluru',
            'state' => 'Karnataka',
            'expertise_json' => [],
            'values_json' => [],
            'status' => 'under_review',
            'admin_remarks' => '',
            'submitted_at' => now()->subDays(10),
            'review_history_json' => [],
        ]);

        Sanctum::actingAs($admin);

        $response = $this->getJson('/api/v1/admin/performance?window=30d')
            ->assertOk()
            ->assertJsonPath('window', '30d')
            ->assertJsonPath('utilization.counsellor.percentage', 50)
            ->assertJsonPath('utilization.trainer.percentage', 66.7)
            ->assertJsonPath('appointmentTrends.completionRate', 33.3)
            ->assertJsonPath('appointmentTrends.noShowRate', 50)
            ->assertJsonPath('workflowPerformance.support.medianFirstResponseMinutes', 60)
            ->assertJsonPath('workflowPerformance.escalation.breachRate', 50)
            ->assertJsonPath('workflowPerformance.escalation.medianResolutionMinutes', 90)
            ->assertJsonPath('trainerApplicationPerformance.medianTurnaroundHours', 48);

        $cards = collect($response->json('summaryCards'));
        $this->assertSame('helpdesk_first_response', $cards[3]['key']);
        $this->assertSame(1, count($response->json('exceptions.escalations')));
        $this->assertSame(1, count($response->json('exceptions.trainerApplications')));
    }

    public function test_performance_dashboard_respects_window_filter(): void
    {
        $admin = User::factory()->create(['role' => 'admin', 'status' => 'active']);
        $client = User::factory()->create(['role' => 'client', 'status' => 'active']);
        $trainerUser = User::factory()->create(['role' => 'trainer', 'status' => 'active']);
        $trainer = Practitioner::query()->create([
            'user_id' => $trainerUser->id,
            'practitioner_type' => 'trainer',
            'bio' => 'Trainer',
            'rating' => 4.5,
            'is_active' => true,
        ]);

        AvailabilitySlot::query()->create([
            'practitioner_id' => $trainer->id,
            'starts_at' => now()->subDays(40),
            'ends_at' => now()->subDays(40)->addHour(),
            'slot_status' => 'booked',
        ]);
        Appointment::query()->create([
            'client_user_id' => $client->id,
            'practitioner_id' => $trainer->id,
            'service_type' => 'training',
            'mode' => 'online',
            'starts_at' => now()->subDays(40),
            'ends_at' => now()->subDays(40)->addHour(),
            'status' => 'completed',
            'reschedule_count' => 0,
        ]);

        Sanctum::actingAs($admin);

        $this->getJson('/api/v1/admin/performance?window=7d')
            ->assertOk()
            ->assertJsonPath('utilization.trainer.percentage', null)
            ->assertJsonPath('appointmentTrends.completionRate', null);
    }

    public function test_non_admin_cannot_access_performance_dashboard(): void
    {
        Sanctum::actingAs(User::factory()->create(['role' => 'client', 'status' => 'active']));

        $this->getJson('/api/v1/admin/performance')->assertForbidden();
    }
}
