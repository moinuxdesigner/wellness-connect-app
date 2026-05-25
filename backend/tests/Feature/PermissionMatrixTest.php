<?php

namespace Tests\Feature;

use App\Models\TrainerApplication;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class PermissionMatrixTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_fetch_and_update_a_role_permission_set_with_audit(): void
    {
        $admin = User::factory()->create(['role' => 'admin', 'status' => 'active']);
        Sanctum::actingAs($admin);

        $this->getJson('/api/v1/admin/permissions')
            ->assertOk()
            ->assertJsonFragment(['key' => 'admin.escalations.view'])
            ->assertJsonPath('grants.helpdesk.0', 'helpdesk.dashboard.view');

        $this->putJson('/api/v1/admin/permissions/helpdesk', [
            'permissions' => ['helpdesk.dashboard.view', 'admin.escalations.view'],
            'reason' => 'Allow support leads to review escalation tickets.',
        ])->assertOk()
            ->assertJsonPath('role', 'helpdesk')
            ->assertJsonPath('audit.targetRole', 'helpdesk');

        $this->assertDatabaseHas('permission_change_audits', [
            'actor_user_id' => $admin->id,
            'target_role' => 'helpdesk',
            'reason' => 'Allow support leads to review escalation tickets.',
        ]);
    }

    public function test_permission_edits_reject_blank_reason_invalid_locked_unavailable_and_admin_changes(): void
    {
        $admin = User::factory()->create(['role' => 'admin', 'status' => 'active']);
        Sanctum::actingAs($admin);

        $this->putJson('/api/v1/admin/permissions/client', [
            'permissions' => ['client.dashboard.view', 'client.profile.update'],
            'reason' => '  ',
        ])->assertUnprocessable();

        $this->putJson('/api/v1/admin/permissions/client', [
            'permissions' => ['client.dashboard.view', 'missing.permission'],
            'reason' => 'Attempt invalid key.',
        ])->assertUnprocessable();

        $this->putJson('/api/v1/admin/permissions/client', [
            'permissions' => ['client.profile.update', 'client.intake.manage', 'client.appointments.view', 'client.appointments.manage'],
            'reason' => 'Attempt to remove required home.',
        ])->assertUnprocessable();

        $this->putJson('/api/v1/admin/permissions/client', [
            'permissions' => ['client.dashboard.view', 'client.profile.update', 'client.intake.manage', 'client.appointments.view', 'client.appointments.manage', 'client.programs.view'],
            'reason' => 'Attempt unavailable page.',
        ])->assertUnprocessable();

        $this->putJson('/api/v1/admin/permissions/admin', [
            'permissions' => ['admin.dashboard.view'],
            'reason' => 'Attempt admin edit.',
        ])->assertUnprocessable();
    }

    public function test_removed_permission_immediately_denies_existing_user_requests(): void
    {
        $admin = User::factory()->create(['role' => 'admin', 'status' => 'active']);
        $client = User::factory()->create(['role' => 'client', 'status' => 'active']);

        Sanctum::actingAs($client);
        $this->putJson('/api/v1/client/profile', [
            'name' => 'Permitted Client',
            'consent_to_terms' => true,
        ])->assertOk();

        Sanctum::actingAs($admin);
        $this->putJson('/api/v1/admin/permissions/client', [
            'permissions' => ['client.dashboard.view', 'client.intake.manage', 'client.appointments.view', 'client.appointments.manage', 'client.memberships.manage'],
            'reason' => 'Disable profile changes during verification.',
        ])->assertOk();

        Sanctum::actingAs($client);
        $this->putJson('/api/v1/client/profile', [
            'name' => 'Denied Client',
            'consent_to_terms' => true,
        ])->assertForbidden();
    }

    public function test_delegated_operational_access_does_not_unlock_governance(): void
    {
        $admin = User::factory()->create(['role' => 'admin', 'status' => 'active']);
        $helpdesk = User::factory()->create(['role' => 'helpdesk', 'status' => 'active']);
        Sanctum::actingAs($admin);
        $this->putJson('/api/v1/admin/permissions/helpdesk', [
            'permissions' => ['helpdesk.dashboard.view', 'admin.escalations.view'],
            'reason' => 'Delegate escalations.',
        ])->assertOk();

        Sanctum::actingAs($helpdesk);
        $this->getJson('/api/v1/admin/escalations')->assertOk();
        $this->getJson('/api/v1/admin/users')->assertForbidden();
        $this->getJson('/api/v1/admin/permissions')->assertForbidden();
    }

    public function test_trainer_dashboard_permission_does_not_bypass_approval_or_account_status(): void
    {
        $trainer = User::factory()->create(['role' => 'trainer', 'status' => 'active']);
        TrainerApplication::query()->create([
            'application_id' => 'TRN-RBAC-PENDING',
            'applicant_name' => $trainer->name,
            'applicant_email' => $trainer->email,
            'applicant_mobile' => '+91 9000000099',
            'city' => 'Hyderabad',
            'state' => 'Telangana',
            'values_json' => [],
            'status' => 'submitted',
            'submitted_at' => now(),
        ]);
        Sanctum::actingAs($trainer);
        $this->getJson('/api/v1/trainer/dashboard')->assertForbidden();

        $trainer->forceFill(['status' => 'suspended'])->save();
        $this->getJson('/api/v1/trainer/access-status')->assertForbidden();
    }
}
