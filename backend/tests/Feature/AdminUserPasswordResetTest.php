<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AdminUserPasswordResetTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_reset_registered_user_password_and_revoke_tokens(): void
    {
        $admin = User::factory()->create([
            'role' => 'admin',
            'status' => 'active',
        ]);
        $user = User::factory()->create([
            'password' => 'old-password',
            'role' => 'client',
            'status' => 'active',
        ]);
        $user->createToken('existing-session');

        Sanctum::actingAs($admin);

        $this->postJson("/api/v1/admin/users/{$user->id}/reset-password")
            ->assertOk()
            ->assertJsonPath('user.id', (string) $user->id);

        $user->refresh();

        $this->assertTrue(Hash::check('password123', $user->password));
        $this->assertDatabaseMissing('personal_access_tokens', [
            'tokenable_id' => $user->id,
            'tokenable_type' => User::class,
        ]);
    }

    public function test_non_admin_cannot_reset_a_user_password(): void
    {
        $requester = User::factory()->create([
            'role' => 'client',
            'status' => 'active',
        ]);
        $user = User::factory()->create([
            'password' => 'old-password',
        ]);

        Sanctum::actingAs($requester);

        $this->postJson("/api/v1/admin/users/{$user->id}/reset-password")
            ->assertForbidden();

        $this->assertTrue(Hash::check('old-password', $user->fresh()->password));
    }
}
