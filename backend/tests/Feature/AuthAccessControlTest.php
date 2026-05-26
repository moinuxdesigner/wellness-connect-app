<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;
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

    public function test_trainer_otp_request_does_not_create_an_account_or_draft(): void
    {
        $this->postJson('/api/v1/auth/trainer-register/otp/request', [
            'name' => 'Draft Trainer',
            'email' => 'draft.trainer@example.com',
            'password' => 'password123',
            'mobile' => '98765 43210',
            'consent_to_terms' => true,
        ])->assertCreated()
            ->assertJsonStructure(['challengeToken', 'maskedMobile', 'expiresAt', 'resendAvailableAt']);

        $this->assertDatabaseMissing('users', ['email' => 'draft.trainer@example.com']);
        $this->assertDatabaseMissing('trainer_applications', ['applicant_email' => 'draft.trainer@example.com']);
        $this->assertDatabaseHas('trainer_registration_challenges', ['email' => 'draft.trainer@example.com', 'mobile' => '+919876543210', 'status' => 'pending']);
    }

    public function test_trainer_otp_verification_creates_restricted_account_and_draft_with_verified_mobile(): void
    {
        $challengeToken = $this->requestTrainerOtp();

        $this->postJson('/api/v1/auth/trainer-register/otp/verify', [
            'challengeToken' => $challengeToken,
            'otp' => '123456',
        ])->assertCreated()
            ->assertJsonPath('user.role', 'trainer')
            ->assertJsonPath('user.phone', '+919876543210')
            ->assertJsonPath('application.status', 'draft')
            ->assertJsonPath('application.currentScreen', 'personalInfo')
            ->assertJsonPath('application.values.profile.mobile', '+919876543210');

        $this->assertDatabaseHas('users', ['email' => 'draft.trainer@example.com', 'role' => 'trainer', 'phone' => '+919876543210']);
        $this->assertDatabaseHas('trainer_applications', ['applicant_email' => 'draft.trainer@example.com', 'applicant_mobile' => '+919876543210', 'status' => 'draft']);
    }

    public function test_trainer_otp_attempt_limit_blocks_registration(): void
    {
        $challengeToken = $this->requestTrainerOtp();

        for ($attempt = 1; $attempt <= 5; $attempt++) {
            $this->postJson('/api/v1/auth/trainer-register/otp/verify', [
                'challengeToken' => $challengeToken,
                'otp' => '000000',
            ])->assertUnprocessable();
        }

        $this->assertDatabaseHas('trainer_registration_challenges', ['status' => 'blocked', 'attempts' => 5]);
        $this->postJson('/api/v1/auth/trainer-register/otp/verify', [
            'challengeToken' => $challengeToken,
            'otp' => '123456',
        ])->assertUnprocessable();
        $this->assertDatabaseMissing('users', ['email' => 'draft.trainer@example.com']);
    }

    public function test_trainer_otp_resend_respects_cooldown_and_keeps_challenge_usable(): void
    {
        Carbon::setTestNow('2026-05-26 10:00:00');
        $challengeToken = $this->requestTrainerOtp();

        $this->postJson('/api/v1/auth/trainer-register/otp/resend', [
            'challengeToken' => $challengeToken,
        ])->assertStatus(429);

        Carbon::setTestNow(now()->addMinutes(2));
        $this->postJson('/api/v1/auth/trainer-register/otp/resend', [
            'challengeToken' => $challengeToken,
        ])->assertOk()->assertJsonPath('challengeToken', $challengeToken);

        $this->postJson('/api/v1/auth/trainer-register/otp/verify', [
            'challengeToken' => $challengeToken,
            'otp' => '123456',
        ])->assertCreated();

        Carbon::setTestNow();
    }

    public function test_trainer_otp_expiry_and_replacement_prevent_old_challenges_from_registering(): void
    {
        Carbon::setTestNow('2026-05-26 10:00:00');
        $expiredToken = $this->requestTrainerOtp();
        Carbon::setTestNow(now()->addMinutes(11));

        $this->postJson('/api/v1/auth/trainer-register/otp/verify', [
            'challengeToken' => $expiredToken,
            'otp' => '123456',
        ])->assertUnprocessable();

        $firstToken = $this->requestTrainerOtp();
        $replacementToken = $this->requestTrainerOtp();

        $this->postJson('/api/v1/auth/trainer-register/otp/verify', [
            'challengeToken' => $firstToken,
            'otp' => '123456',
        ])->assertUnprocessable();
        $this->postJson('/api/v1/auth/trainer-register/otp/verify', [
            'challengeToken' => $replacementToken,
            'otp' => '123456',
        ])->assertCreated();

        $this->assertDatabaseHas('trainer_registration_challenges', ['status' => 'expired']);
        $this->assertDatabaseHas('trainer_registration_challenges', ['status' => 'replaced']);
        Carbon::setTestNow();
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

    private function requestTrainerOtp(): string
    {
        return (string) $this->postJson('/api/v1/auth/trainer-register/otp/request', [
            'name' => 'Draft Trainer',
            'email' => 'draft.trainer@example.com',
            'password' => 'password123',
            'mobile' => '+91 98765 43210',
            'consent_to_terms' => true,
        ])->assertCreated()->json('challengeToken');
    }
}
