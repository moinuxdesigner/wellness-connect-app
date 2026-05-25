<?php

namespace Tests\Feature;

use App\Models\TrainerApplication;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AdminRoleManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_assign_operational_role_with_audit_and_session_revocation(): void
    {
        $admin = User::factory()->create(['role' => 'admin', 'status' => 'active']);
        $user = User::factory()->create(['role' => 'client', 'status' => 'active']);
        $user->createToken('existing-session');

        Sanctum::actingAs($admin);

        $this->patchJson("/api/v1/admin/users/{$user->id}/role", [
            'role' => 'helpdesk',
            'reason' => 'Assigned to handle customer support queue.',
        ])->assertOk()
            ->assertJsonPath('user.role', 'helpdesk')
            ->assertJsonPath('roleChange.previousRole', 'client')
            ->assertJsonPath('roleChange.newRole', 'helpdesk');

        $this->assertSame('helpdesk', $user->fresh()->role);
        $this->assertDatabaseHas('role_change_audits', [
            'actor_user_id' => $admin->id,
            'target_user_id' => $user->id,
            'previous_role' => 'client',
            'new_role' => 'helpdesk',
        ]);
        $this->assertDatabaseMissing('personal_access_tokens', [
            'tokenable_id' => $user->id,
            'tokenable_type' => User::class,
        ]);

        $this->getJson('/api/v1/admin/role-changes')
            ->assertOk()
            ->assertJsonPath('roleChanges.0.targetUserId', (string) $user->id);
    }

    public function test_last_active_admin_cannot_be_reassigned(): void
    {
        $admin = User::factory()->create(['role' => 'admin', 'status' => 'active']);
        Sanctum::actingAs($admin);

        $this->patchJson("/api/v1/admin/users/{$admin->id}/role", [
            'role' => 'client',
            'reason' => 'Move back to a standard account.',
        ])->assertUnprocessable();

        $this->assertSame('admin', $admin->fresh()->role);
        $this->assertDatabaseCount('role_change_audits', 0);
    }

    public function test_inactive_user_and_unavailable_professional_roles_cannot_be_assigned(): void
    {
        $admin = User::factory()->create(['role' => 'admin', 'status' => 'active']);
        $pending = User::factory()->create(['role' => 'client', 'status' => 'pending']);
        $active = User::factory()->create(['role' => 'client', 'status' => 'active']);
        Sanctum::actingAs($admin);

        $this->patchJson("/api/v1/admin/users/{$pending->id}/role", [
            'role' => 'helpdesk',
            'reason' => 'Needs operational access.',
        ])->assertUnprocessable();

        $this->patchJson("/api/v1/admin/users/{$active->id}/role", [
            'role' => 'counsellor',
            'reason' => 'Requested counselling access.',
        ])->assertUnprocessable();
    }

    public function test_role_assignment_requires_a_reason(): void
    {
        $admin = User::factory()->create(['role' => 'admin', 'status' => 'active']);
        $user = User::factory()->create(['role' => 'client', 'status' => 'active']);
        Sanctum::actingAs($admin);

        $this->patchJson("/api/v1/admin/users/{$user->id}/role", [
            'role' => 'helpdesk',
            'reason' => '   ',
        ])->assertUnprocessable();

        $this->assertSame('client', $user->fresh()->role);
        $this->assertDatabaseCount('role_change_audits', 0);
    }

    public function test_trainer_role_requires_approved_application(): void
    {
        $admin = User::factory()->create(['role' => 'admin', 'status' => 'active']);
        $user = User::factory()->create([
            'email' => 'role.trainer@example.com',
            'role' => 'client',
            'status' => 'active',
        ]);
        Sanctum::actingAs($admin);

        $this->patchJson("/api/v1/admin/users/{$user->id}/role", [
            'role' => 'trainer',
            'reason' => 'Approved for training workspace.',
        ])->assertUnprocessable();

        TrainerApplication::query()->create([
            'application_id' => 'TRN-ROLE-APPROVED',
            'applicant_name' => $user->name,
            'applicant_email' => $user->email,
            'applicant_mobile' => '+91 9000000000',
            'city' => 'Hyderabad',
            'state' => 'Telangana',
            'values_json' => [],
            'status' => 'approved',
            'submitted_at' => now(),
        ]);

        $this->patchJson("/api/v1/admin/users/{$user->id}/role", [
            'role' => 'trainer',
            'reason' => 'Approved for training workspace.',
        ])->assertOk()->assertJsonPath('user.role', 'trainer');
    }
}
