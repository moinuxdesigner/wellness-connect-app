<?php

namespace Tests\Feature;

use App\Models\TrainerApplication;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class TrainerWorkspaceAccessTest extends TestCase
{
    use RefreshDatabase;

    public function test_unapproved_trainer_cannot_access_workspace_dashboard(): void
    {
        $trainer = User::factory()->create([
            'email' => 'pending.trainer@example.com',
            'role' => 'trainer',
            'status' => 'active',
        ]);
        $this->createTrainerApplication($trainer, 'submitted');
        Sanctum::actingAs($trainer);

        $this->getJson('/api/v1/trainer/access-status')
            ->assertOk()
            ->assertJsonPath('status', 'pending_review')
            ->assertJsonPath('application.applicantEmail', 'pending.trainer@example.com');

        $this->getJson('/api/v1/trainer/dashboard')
            ->assertForbidden();
    }

    public function test_approved_trainer_can_access_workspace_dashboard(): void
    {
        $trainer = User::factory()->create([
            'email' => 'approved.trainer@example.com',
            'role' => 'trainer',
            'status' => 'active',
        ]);
        $this->createTrainerApplication($trainer, 'approved');
        Sanctum::actingAs($trainer);

        $this->getJson('/api/v1/trainer/access-status')
            ->assertOk()
            ->assertJsonPath('status', 'approved');

        $this->getJson('/api/v1/trainer/dashboard')
            ->assertOk();
    }

    public function test_suspended_trainer_is_blocked_even_with_an_approved_application(): void
    {
        $trainer = User::factory()->create([
            'email' => 'suspended.trainer@example.com',
            'role' => 'trainer',
            'status' => 'suspended',
        ]);
        $this->createTrainerApplication($trainer, 'approved');
        Sanctum::actingAs($trainer);

        $this->getJson('/api/v1/trainer/access-status')
            ->assertOk()
            ->assertJsonPath('status', 'suspended');

        $this->getJson('/api/v1/trainer/dashboard')
            ->assertForbidden();
    }

    public function test_admin_approval_unlocks_trainer_workspace_access(): void
    {
        $trainer = User::factory()->create([
            'email' => 'review.trainer@example.com',
            'role' => 'trainer',
            'status' => 'active',
        ]);
        $application = $this->createTrainerApplication($trainer, 'under_review');
        $admin = User::factory()->create([
            'role' => 'admin',
            'status' => 'active',
        ]);

        Sanctum::actingAs($trainer);
        $this->getJson('/api/v1/trainer/dashboard')->assertForbidden();

        Sanctum::actingAs($admin);
        $this->patchJson("/api/v1/admin/trainer-applications/{$application->application_id}", [
            'status' => 'approved',
            'adminRemarks' => 'Qualifications verified.',
        ])->assertOk()->assertJsonPath('application.status', 'approved');

        Sanctum::actingAs($trainer);
        $this->getJson('/api/v1/trainer/dashboard')->assertOk();
    }

    public function test_admin_approval_provisions_account_for_application_without_user(): void
    {
        $application = TrainerApplication::query()->create([
            'application_id' => 'TRN-NEW-APPLICANT',
            'applicant_name' => 'New Trainer',
            'applicant_email' => 'new.trainer@example.com',
            'applicant_mobile' => '+91 9000000022',
            'city' => 'Hyderabad',
            'state' => 'Telangana',
            'values_json' => [],
            'status' => 'submitted',
            'submitted_at' => now(),
        ]);
        $admin = User::factory()->create([
            'role' => 'admin',
            'status' => 'active',
        ]);

        Sanctum::actingAs($admin);
        $response = $this->patchJson("/api/v1/admin/trainer-applications/{$application->application_id}", [
            'status' => 'approved',
            'adminRemarks' => 'Approved for activation.',
        ])->assertOk()
            ->assertJsonPath('application.status', 'approved')
            ->assertJsonPath('account.email', 'new.trainer@example.com')
            ->assertJsonPath('account.created', true);

        $temporaryPassword = (string) $response->json('account.temporaryPassword');
        $this->assertNotSame('', $temporaryPassword);

        $trainer = User::query()->where('email', 'new.trainer@example.com')->firstOrFail();
        $this->assertSame('trainer', $trainer->role);
        $this->assertSame('active', $trainer->status);

        $this->postJson('/api/v1/auth/login', [
            'email' => 'new.trainer@example.com',
            'password' => $temporaryPassword,
        ])->assertOk()->assertJsonPath('user.role', 'trainer');

        Sanctum::actingAs($admin);
        $this->getJson('/api/v1/admin/users')
            ->assertOk()
            ->assertJsonFragment(['email' => 'new.trainer@example.com']);
    }

    private function createTrainerApplication(User $trainer, string $status): TrainerApplication
    {
        return TrainerApplication::query()->create([
            'application_id' => 'TRN-' . $trainer->id,
            'applicant_name' => $trainer->name,
            'applicant_email' => $trainer->email,
            'applicant_mobile' => '+91 9000000000',
            'city' => 'Hyderabad',
            'state' => 'Telangana',
            'values_json' => [],
            'status' => $status,
            'submitted_at' => now(),
        ]);
    }
}
