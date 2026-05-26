<?php

namespace Tests\Feature;

use App\Models\Appointment;
use App\Models\IntakeAnswer;
use App\Models\IntakeFlow;
use App\Models\SupportRequest;
use App\Models\User;
use App\Models\WorkflowCase;
use App\Services\SessionNoShowService;
use App\Services\WorkflowCaseService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class WorkflowAutomationTest extends TestCase
{
    use RefreshDatabase;

    public function test_high_risk_intake_submission_creates_escalation_case_and_notifications(): void
    {
        User::factory()->create(['role' => 'admin', 'status' => 'active']);
        User::factory()->create(['role' => 'helpdesk', 'status' => 'active']);
        $client = User::factory()->create(['role' => 'client', 'status' => 'active']);
        $flow = IntakeFlow::query()->create([
            'client_user_id' => $client->id,
            'service_type' => 'psychology',
            'current_step' => 'intake',
            'status' => 'draft',
        ]);
        IntakeAnswer::query()->create([
            'intake_flow_id' => $flow->id,
            'section_key' => 'psychology',
            'question_key' => 'psychology.symptoms',
            'answer_type' => 'multi',
            'answer_json' => ['self_harm_thoughts'],
        ]);

        Sanctum::actingAs($client);
        $this->postJson("/api/v1/intake-flows/{$flow->id}/submit")
            ->assertOk()
            ->assertJsonPath('status', 'under_review')
            ->assertJsonPath('review_eta_hours', 24);

        $this->assertDatabaseHas('workflow_cases', [
            'workflow_key' => 'critical_risk_escalation',
            'subject_type' => IntakeFlow::class,
            'subject_id' => $flow->id,
            'priority' => 'high',
        ]);
        $this->assertDatabaseCount('notifications', 2);
    }

    public function test_support_request_submission_creates_helpdesk_workflow_case(): void
    {
        $response = $this->postJson('/api/v1/support-requests', [
            'name' => 'Casey Client',
            'email' => 'casey@example.com',
            'topic' => 'technical_issue',
            'subject' => 'Unable to join my session',
            'message' => 'The session link fails to load and I need assistance right away.',
        ])->assertCreated();

        $supportRequest = SupportRequest::query()->firstOrFail();

        $this->assertDatabaseHas('workflow_cases', [
            'workflow_key' => 'cross_team_follow_up_sla',
            'subject_type' => SupportRequest::class,
            'subject_id' => $supportRequest->id,
            'owner_role' => 'helpdesk',
            'priority' => 'medium',
        ]);

        $this->assertNotSame('', (string) $response->json('ticketNumber'));
    }

    public function test_session_no_show_service_marks_overdue_appointments(): void
    {
        $client = User::factory()->create(['role' => 'client', 'status' => 'active']);
        $appointment = Appointment::query()->create([
            'client_user_id' => $client->id,
            'practitioner_id' => null,
            'service_type' => 'psychology',
            'mode' => 'online',
            'starts_at' => now()->subHours(2),
            'ends_at' => now()->subHour(),
            'status' => 'scheduled',
            'reschedule_count' => 0,
        ]);

        $processed = app(SessionNoShowService::class)->process();

        $this->assertSame(1, $processed);
        $this->assertDatabaseHas('appointments', [
            'id' => $appointment->id,
            'status' => 'no_show',
        ]);
        $this->assertDatabaseHas('appointment_events', [
            'appointment_id' => $appointment->id,
            'event_type' => 'no_show',
        ]);
    }

    public function test_sla_breach_processing_marks_cases_and_notifies_recipients(): void
    {
        User::factory()->create(['role' => 'admin', 'status' => 'active']);
        User::factory()->create(['role' => 'helpdesk', 'status' => 'active']);
        $supportRequest = SupportRequest::query()->create([
            'ticket_number' => 'WC-SUP-000001',
            'name' => 'Jordan',
            'email' => 'jordan@example.com',
            'topic' => 'billing',
            'subject' => 'Refund request',
            'message' => 'Please help me with my refund.',
            'status' => 'open',
        ]);
        $workflowCase = WorkflowCase::query()->create([
            'workflow_key' => 'cross_team_follow_up_sla',
            'subject_type' => SupportRequest::class,
            'subject_id' => $supportRequest->id,
            'status' => 'open',
            'priority' => 'medium',
            'owner_role' => 'helpdesk',
            'due_at' => now()->subMinute(),
            'meta_json' => [
                'title' => 'Support request WC-SUP-000001',
                'summary' => 'billing: Refund request',
                'history' => [],
            ],
        ]);

        $processed = app(WorkflowCaseService::class)->processSlaBreaches();

        $this->assertSame(1, $processed);
        $this->assertDatabaseHas('workflow_cases', [
            'id' => $workflowCase->id,
            'status' => 'breached',
        ]);
        $this->assertDatabaseCount('notifications', 2);
    }
}
