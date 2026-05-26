<?php

namespace Tests\Feature;

use App\Models\ClientProfile;
use App\Models\TrainerApplication;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AccountProfileAccessTest extends TestCase
{
    use RefreshDatabase;

    public function test_internal_role_can_fetch_and_update_shared_profile(): void
    {
        $user = User::factory()->create([
            'role' => 'helpdesk',
            'status' => 'active',
            'phone' => '+91 9000001111',
            'consent_to_terms' => true,
        ]);

        Sanctum::actingAs($user);

        $this->getJson('/api/v1/account/profile')
            ->assertOk()
            ->assertJsonPath('user.email', $user->email)
            ->assertJsonPath('roleDetails.roleLabel', 'Help Desk')
            ->assertJsonPath('roleDetails.workspaceTitle', 'Help Desk');

        $this->putJson('/api/v1/account/profile', [
            'name' => 'Updated Helpdesk Agent',
            'phone' => '+91 9000002222',
            'consent_to_terms' => false,
        ])->assertOk()
            ->assertJsonPath('user.name', 'Updated Helpdesk Agent')
            ->assertJsonPath('user.phone', '+91 9000002222')
            ->assertJsonPath('user.consent_to_terms', false);

        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'name' => 'Updated Helpdesk Agent',
            'phone' => '+91 9000002222',
            'consent_to_terms' => false,
        ]);
    }

    public function test_client_shared_profile_updates_user_and_client_profile_fields(): void
    {
        $user = User::factory()->create([
            'role' => 'client',
            'status' => 'active',
            'phone' => '+91 9000003333',
            'wellness_goal' => 'fitness',
            'consent_to_terms' => true,
        ]);
        ClientProfile::query()->create([
            'user_id' => $user->id,
            'primary_goal' => 'fitness',
            'timezone' => 'Asia/Kolkata',
            'preferred_language' => 'en',
        ]);

        Sanctum::actingAs($user);

        $this->getJson('/api/v1/account/profile')
            ->assertOk()
            ->assertJsonPath('roleDetails.client.primaryGoal', 'fitness')
            ->assertJsonPath('roleDetails.client.timezone', 'Asia/Kolkata')
            ->assertJsonPath('roleDetails.client.preferredLanguage', 'en');

        $this->putJson('/api/v1/account/profile', [
            'name' => 'Updated Client',
            'phone' => '+91 9000004444',
            'consent_to_terms' => true,
            'primary_goal' => 'both',
            'timezone' => 'Asia/Dubai',
            'preferred_language' => 'hi',
        ])->assertOk()
            ->assertJsonPath('user.name', 'Updated Client')
            ->assertJsonPath('user.primary_goal', 'both')
            ->assertJsonPath('roleDetails.client.primaryGoal', 'both')
            ->assertJsonPath('roleDetails.client.timezone', 'Asia/Dubai')
            ->assertJsonPath('roleDetails.client.preferredLanguage', 'hi');

        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'name' => 'Updated Client',
            'phone' => '+91 9000004444',
            'wellness_goal' => 'both',
        ]);
        $this->assertDatabaseHas('client_profiles', [
            'user_id' => $user->id,
            'primary_goal' => 'both',
            'timezone' => 'Asia/Dubai',
            'preferred_language' => 'hi',
        ]);
    }

    public function test_legacy_client_profile_endpoint_remains_supported(): void
    {
        $user = User::factory()->create([
            'role' => 'client',
            'status' => 'active',
            'phone' => '+91 9000005555',
            'consent_to_terms' => true,
        ]);

        Sanctum::actingAs($user);

        $this->putJson('/api/v1/client/profile', [
            'name' => 'Compatibility Client',
            'phone' => '+91 9000006666',
            'primary_goal' => 'mental_health',
            'timezone' => 'Asia/Kolkata',
            'preferred_language' => 'en',
            'consent_to_terms' => true,
        ])->assertOk()
            ->assertJsonPath('user.name', 'Compatibility Client')
            ->assertJsonPath('profile.primary_goal', 'mental_health');

        $this->assertDatabaseHas('client_profiles', [
            'user_id' => $user->id,
            'primary_goal' => 'mental_health',
        ]);
    }

    public function test_trainer_profile_returns_application_summary_without_mutating_application(): void
    {
        $trainer = User::factory()->create([
            'role' => 'trainer',
            'status' => 'active',
            'phone' => '+91 9000007777',
            'consent_to_terms' => true,
        ]);
        $application = TrainerApplication::query()->create([
            'application_id' => 'TRN-PROFILE-1',
            'applicant_user_id' => $trainer->id,
            'applicant_name' => $trainer->name,
            'applicant_email' => $trainer->email,
            'applicant_mobile' => $trainer->phone,
            'city' => 'Hyderabad',
            'state' => 'Telangana',
            'expertise_json' => ['Strength Training', 'Mobility'],
            'values_json' => [
                'profile' => [
                    'city' => 'Hyderabad',
                    'state' => 'Telangana',
                ],
                'photo' => [
                    'file' => [
                        'previewUrl' => 'https://example.test/trainer-avatar.jpg',
                    ],
                ],
                'expertise' => ['Strength Training', 'Mobility'],
            ],
            'status' => 'approved',
            'submitted_at' => now()->subDay(),
        ]);

        Sanctum::actingAs($trainer);

        $this->getJson('/api/v1/account/profile')
            ->assertOk()
            ->assertJsonPath('roleDetails.trainer.applicationStatus', 'approved')
            ->assertJsonPath('roleDetails.trainer.applicationId', 'TRN-PROFILE-1')
            ->assertJsonPath('roleDetails.trainer.profilePhotoUrl', 'https://example.test/trainer-avatar.jpg')
            ->assertJsonPath('roleDetails.trainer.location', 'Hyderabad, Telangana')
            ->assertJsonPath('roleDetails.trainer.editUrl', '/trainer/onboarding?mode=edit');

        $this->putJson('/api/v1/account/profile', [
            'name' => 'Updated Trainer',
            'phone' => '+91 9000008888',
            'consent_to_terms' => true,
        ])->assertOk()
            ->assertJsonPath('user.name', 'Updated Trainer')
            ->assertJsonPath('roleDetails.trainer.applicationId', 'TRN-PROFILE-1');

        $this->assertDatabaseHas('trainer_applications', [
            'id' => $application->id,
            'application_id' => 'TRN-PROFILE-1',
            'status' => 'approved',
            'city' => 'Hyderabad',
            'state' => 'Telangana',
        ]);
        $this->assertDatabaseHas('users', [
            'id' => $trainer->id,
            'name' => 'Updated Trainer',
            'phone' => '+91 9000008888',
        ]);
    }
}
