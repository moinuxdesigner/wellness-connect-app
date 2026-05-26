<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AuthAccessControlTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_registration_cannot_create_privileged_user(): void
    {
        $this->postJson('/api/v1/auth/register', [
            'name' => 'Unsafe Admin',
            'email' => 'unsafe-admin@example.com',
            'password' => 'password123',
            'role' => 'admin',
        ])->assertUnprocessable();

        $this->assertDatabaseMissing('users', ['email' => 'unsafe-admin@example.com']);
    }

    public function test_public_registration_still_creates_client_account(): void
    {
        $this->postJson('/api/v1/auth/register', [
            'name' => 'New Client',
            'email' => 'new-client@example.com',
            'password' => 'password123',
            'role' => 'client',
        ])->assertCreated()->assertJsonPath('user.role', 'client');
    }

    public function test_trainer_applicant_registration_creates_restricted_account_and_draft(): void
    {
        $this->postJson('/api/v1/auth/trainer-register', [
            'name' => 'Draft Trainer',
            'email' => 'draft.trainer@example.com',
            'password' => 'password123',
            'consent_to_terms' => true,
        ])->assertCreated()
            ->assertJsonPath('user.role', 'trainer')
            ->assertJsonPath('application.status', 'draft')
            ->assertJsonPath('application.currentScreen', 'personalInfo');

        $this->assertDatabaseHas('users', ['email' => 'draft.trainer@example.com', 'role' => 'trainer']);
        $this->assertDatabaseHas('trainer_applications', ['applicant_email' => 'draft.trainer@example.com', 'status' => 'draft']);
    }

    public function test_inactive_accounts_cannot_login(): void
    {
        foreach (['pending', 'suspended'] as $status) {
            User::factory()->create([
                'email' => "{$status}@example.com",
                'password' => 'password123',
                'role' => 'client',
                'status' => $status,
            ]);

            $this->postJson('/api/v1/auth/login', [
                'email' => "{$status}@example.com",
                'password' => 'password123',
            ])->assertForbidden();
        }
    }

    public function test_inactive_account_token_is_rejected_on_protected_api(): void
    {
        $suspended = User::factory()->create(['role' => 'client', 'status' => 'suspended']);
        Sanctum::actingAs($suspended);

        $this->getJson('/api/v1/auth/me')->assertForbidden();
        $this->putJson('/api/v1/client/profile', [
            'name' => 'Blocked User',
            'consent_to_terms' => true,
        ])->assertForbidden();
    }
}
