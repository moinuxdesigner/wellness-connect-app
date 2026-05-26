<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class WorkflowConfigurationTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_load_all_workflow_configurations(): void
    {
        Sanctum::actingAs(User::factory()->create([
            'role' => 'admin',
            'status' => 'active',
        ]));

        $this->getJson('/api/v1/admin/workflows')
            ->assertOk()
            ->assertJsonCount(4, 'workflows')
            ->assertJsonPath('workflows.0.key', 'intake_assignment');
    }

    public function test_admin_can_update_workflow_configuration_and_create_revision(): void
    {
        $admin = User::factory()->create([
            'role' => 'admin',
            'status' => 'active',
        ]);
        Sanctum::actingAs($admin);

        $this->putJson('/api/v1/admin/workflows/intake_assignment', [
            'config' => [
                'highRiskSymptoms' => ['panic_episodes', 'self_harm_thoughts', 'severe_insomnia'],
                'stressThreshold' => 8,
                'highRiskOutcome' => 'under_review',
                'lowRiskOutcome' => 'auto_bookable',
                'reviewEtaHours' => 12,
            ],
            'reason' => 'Tighten triage threshold for the pilot cohort.',
        ])->assertOk()
            ->assertJsonPath('workflow.config.stressThreshold', 8)
            ->assertJsonPath('workflow.updatedBy.email', $admin->email);

        $this->assertDatabaseHas('workflow_config_revisions', [
            'reason' => 'Tighten triage threshold for the pilot cohort.',
            'actor_user_id' => $admin->id,
        ]);
    }

    public function test_non_admin_cannot_access_workflow_configuration_api(): void
    {
        Sanctum::actingAs(User::factory()->create([
            'role' => 'client',
            'status' => 'active',
        ]));

        $this->getJson('/api/v1/admin/workflows')->assertForbidden();
    }
}
