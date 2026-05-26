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

    public function test_trainer_can_save_and_resume_draft_before_submission(): void
    {
        $trainer = User::factory()->create(['email' => 'draft@example.com', 'role' => 'trainer', 'status' => 'active']);
        $application = TrainerApplication::query()->create([
            'application_id' => 'TRN-DRAFT',
            'applicant_user_id' => $trainer->id,
            'applicant_name' => $trainer->name,
            'applicant_email' => $trainer->email,
            'values_json' => [],
            'status' => 'draft',
            'current_screen' => 'personalInfo',
        ]);
        Sanctum::actingAs($trainer);

        $this->putJson('/api/v1/trainer/application/draft', [
            'values' => ['profile' => ['fullName' => 'Draft Trainer', 'email' => 'draft@example.com']],
            'currentScreen' => 'clientPitch',
        ])->assertOk()
            ->assertJsonPath('application.status', 'draft')
            ->assertJsonPath('application.currentScreen', 'clientPitch');

        $this->getJson('/api/v1/trainer/application')
            ->assertOk()
            ->assertJsonPath('application.applicationId', $application->application_id)
            ->assertJsonPath('application.currentScreen', 'clientPitch')
            ->assertJsonPath('application.values.profile.fullName', 'Draft Trainer');
    }

    public function test_trainer_can_submit_complete_application_without_optional_media(): void
    {
        $trainer = User::factory()->create(['email' => 'submit@example.com', 'role' => 'trainer', 'status' => 'active']);
        TrainerApplication::query()->create([
            'application_id' => 'TRN-SUBMIT',
            'applicant_user_id' => $trainer->id,
            'applicant_name' => $trainer->name,
            'applicant_email' => $trainer->email,
            'values_json' => [],
            'status' => 'draft',
        ]);
        Sanctum::actingAs($trainer);

        $this->postJson('/api/v1/trainer/application/submit', [
            'values' => $this->completeApplicationValues(),
        ])->assertOk()
            ->assertJsonPath('application.status', 'submitted')
            ->assertJsonPath('application.values.clientPitch', $this->completeApplicationValues()['clientPitch'])
            ->assertJsonPath('application.values.showcase.transformationPhotos', [])
            ->assertJsonPath('application.values.training.introductionVideo', null);

        $this->getJson('/api/v1/trainer/access-status')->assertOk()->assertJsonPath('status', 'pending_review');
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
            ->assertForbidden();

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
        ])->assertOk()
            ->assertJsonPath('application.status', 'approved')
            ->assertJsonPath('account.created', false)
            ->assertJsonPath('account.temporaryPassword', null);

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
            'applicant_user_id' => $trainer->id,
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

    private function completeApplicationValues(): array
    {
        return [
            'profile' => [
                'fullName' => 'Complete Trainer',
                'gender' => 'Man',
                'dateOfBirth' => '1990-01-01',
                'email' => 'submit@example.com',
                'mobile' => '+91 9000000000',
                'city' => 'Hyderabad',
                'state' => 'Telangana',
            ],
            'photo' => ['file' => ['name' => 'photo.jpg']],
            'certification' => ['institute' => 'Fitness Academy', 'type' => 'CPT', 'certificate' => ['name' => 'certificate.pdf']],
            'expertise' => ['Strength Training'],
            'experience' => ['yearsExperience' => '4', 'clientsTrained' => '80'],
            'clientPitch' => 'I help clients build lasting strength through safe, practical coaching that fits real life.',
            'showcase' => ['transformationPhotos' => [], 'videos' => []],
            'training' => ['philosophy' => 'I focus on sustainable movement quality, consistency, and confident progress.', 'introductionVideo' => null],
            'availability' => [
                'modes' => ['Online Coaching'],
                'days' => ['Monday'],
                'perSessionRateInr' => '1500',
                'monthlyRateInr' => '8000',
                'pricingPlans' => '',
            ],
            'identity' => ['pan' => ['name' => 'pan.pdf'], 'aadhaar' => ['name' => 'aadhaar.pdf'], 'passport' => null, 'drivingLicense' => null],
            'payout' => ['bankName' => 'HDFC', 'accountNumber' => '012345678901', 'ifsc' => 'HDFC0001234'],
        ];
    }
}
