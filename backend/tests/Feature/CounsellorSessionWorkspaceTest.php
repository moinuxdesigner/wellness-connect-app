<?php

namespace Tests\Feature;

use App\Models\Appointment;
use App\Models\CounsellorSessionFlow;
use App\Models\CounsellorSessionFlowStep;
use App\Models\CounsellorSessionNote;
use App\Models\CbtRiskEvent;
use App\Models\Practitioner;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class CounsellorSessionWorkspaceTest extends TestCase
{
    use RefreshDatabase;

    public function test_counsellor_loads_session_with_default_guided_cbt_steps(): void
    {
        [$counsellor, , $appointment] = $this->sessionFixture();
        Sanctum::actingAs($counsellor);

        $response = $this->getJson("/api/v1/counsellor/sessions/{$appointment->id}")
            ->assertOk()
            ->assertJsonPath('guidedFlow.phases.0.phase', 'Opening')
            ->assertJsonPath('guidedFlow.phases.0.steps.0.stepKey', 'mood_check_in');

        $steps = collect($response->json('guidedFlow.phases'))->flatMap(fn (array $phase) => $phase['steps']);
        $this->assertGreaterThanOrEqual(19, $steps->count());
        $this->assertDatabaseHas('counsellor_session_flows', ['active_step_key' => 'mood_check_in']);
    }

    public function test_counsellor_saves_structured_step_and_reloads_it(): void
    {
        [$counsellor, , $appointment] = $this->sessionFixture();
        Sanctum::actingAs($counsellor);

        $this->getJson("/api/v1/counsellor/sessions/{$appointment->id}")->assertOk();

        $this->putJson("/api/v1/counsellor/sessions/{$appointment->id}/flow-steps/mood_check_in", [
            'status' => 'completed',
            'response_json' => [
                'mood' => 6,
                'anxiety' => 7,
                'update' => 'Meetings were stressful.',
            ],
            'clinical_note' => 'Client appeared anxious but engaged.',
        ])->assertOk()
            ->assertJsonPath('guidedFlow.activeStepKey', 'mood_check_in');

        $this->getJson("/api/v1/counsellor/sessions/{$appointment->id}")
            ->assertOk()
            ->assertJsonPath('guidedFlow.phases.0.steps.0.status', 'completed')
            ->assertJsonPath('guidedFlow.phases.0.steps.0.response.mood', 6);
    }

    public function test_completion_derives_soap_notes_from_required_structured_steps(): void
    {
        [$counsellor, , $appointment] = $this->sessionFixture();
        Sanctum::actingAs($counsellor);
        $this->getJson("/api/v1/counsellor/sessions/{$appointment->id}")->assertOk();

        foreach (['mood_check_in', 'todays_agenda', 'core_intervention', 'risk_assessment', 'session_summary', 'homework_assignment'] as $stepKey) {
            $this->putJson("/api/v1/counsellor/sessions/{$appointment->id}/flow-steps/{$stepKey}", [
                'status' => 'completed',
                'response_json' => ['note' => "{$stepKey} completed"],
                'clinical_note' => "{$stepKey} clinical note",
            ])->assertOk();
        }

        $this->putJson("/api/v1/counsellor/sessions/{$appointment->id}/summary", [
            'clinician_summary' => 'Client practiced cognitive restructuring.',
            'client_summary' => 'You practiced a balanced thought for work stress.',
            'private_summary' => 'Private formulation stays clinician-only.',
            'next_agenda' => 'Review thought record.',
            'session_rating' => 4,
        ])->assertOk();

        $this->postJson("/api/v1/counsellor/sessions/{$appointment->id}/complete")
            ->assertOk()
            ->assertJsonPath('session.appointmentStatus', 'completed')
            ->assertJsonPath('sessionSummary.clientSummary', 'You practiced a balanced thought for work stress.');

        $note = CounsellorSessionNote::query()->where('appointment_id', $appointment->id)->firstOrFail();
        $this->assertStringContainsString('mood_check_in clinical note', $note->subjective);
        $this->assertStringContainsString('Private formulation stays clinician-only.', $note->assessment);
        $this->assertStringContainsString('Review thought record.', $note->plan);
    }

    public function test_client_safe_summary_does_not_expose_private_summary_field(): void
    {
        [$counsellor, , $appointment] = $this->sessionFixture();
        Sanctum::actingAs($counsellor);
        $this->getJson("/api/v1/counsellor/sessions/{$appointment->id}")->assertOk();

        $this->putJson("/api/v1/counsellor/sessions/{$appointment->id}/summary", [
            'client_summary' => 'Client-safe recap.',
            'private_summary' => 'Private clinician-only risk formulation.',
        ])->assertOk()
            ->assertJsonPath('sessionSummary.clientSummary', 'Client-safe recap.')
            ->assertJsonPath('sessionSummary.privateSummary', 'Private clinician-only risk formulation.');

        $flow = CounsellorSessionFlow::query()->firstOrFail();
        $this->assertSame('Client-safe recap.', $flow->client_summary);
        $this->assertSame('Private clinician-only risk formulation.', $flow->private_summary);
    }

    public function test_escalation_still_creates_risk_event(): void
    {
        [$counsellor, $client, $appointment] = $this->sessionFixture();
        Sanctum::actingAs($counsellor);

        $this->postJson("/api/v1/counsellor/sessions/{$appointment->id}/escalate", [
            'reason' => 'Client disclosed acute risk.',
            'risk_level' => 'critical',
        ])->assertOk()->assertJsonPath('session.workflowState', 'escalated');

        $this->assertDatabaseHas('cbt_risk_events', [
            'client_id' => $client->id,
            'risk_type' => 'clinical_escalation',
            'risk_level' => 'critical',
        ]);
    }

    public function test_counsellor_cannot_access_another_practitioners_session(): void
    {
        [, , $appointment] = $this->sessionFixture();
        $other = User::factory()->create(['role' => 'counsellor', 'status' => 'active']);
        Practitioner::query()->create([
            'user_id' => $other->id,
            'practitioner_type' => 'counsellor',
            'is_active' => true,
        ]);

        Sanctum::actingAs($other);

        $this->getJson("/api/v1/counsellor/sessions/{$appointment->id}")->assertForbidden();
    }

    private function sessionFixture(): array
    {
        Carbon::setTestNow(Carbon::parse('2026-06-05 10:00:00'));
        $counsellor = User::factory()->create(['role' => 'counsellor', 'status' => 'active']);
        $client = User::factory()->create(['role' => 'client', 'status' => 'active']);
        $practitioner = Practitioner::query()->create([
            'user_id' => $counsellor->id,
            'practitioner_type' => 'counsellor',
            'is_active' => true,
        ]);
        $appointment = Appointment::query()->create([
            'client_user_id' => $client->id,
            'practitioner_id' => $practitioner->id,
            'service_type' => 'psychology',
            'mode' => 'online',
            'starts_at' => Carbon::parse('2026-06-05 18:00:00'),
            'ends_at' => Carbon::parse('2026-06-05 19:00:00'),
            'status' => 'scheduled',
        ]);

        return [$counsellor, $client, $appointment];
    }
}
