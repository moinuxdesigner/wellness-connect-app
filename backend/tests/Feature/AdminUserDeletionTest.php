<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AdminUserDeletionTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_delete_a_user_and_revoke_tokens(): void
    {
        $admin = User::factory()->create(['role' => 'admin', 'status' => 'active']);
        $user = User::factory()->create(['role' => 'client', 'status' => 'active']);
        $user->createToken('existing-session');
        Sanctum::actingAs($admin);

        $this->deleteJson("/api/v1/admin/users/{$user->id}")
            ->assertOk()
            ->assertJsonPath('user.id', (string) $user->id);

        $this->assertDatabaseMissing('users', ['id' => $user->id]);
        $this->assertDatabaseMissing('personal_access_tokens', [
            'tokenable_id' => $user->id,
            'tokenable_type' => User::class,
        ]);
        $this->assertDatabaseHas('activity_events', [
            'category' => 'account',
            'action' => 'user_deleted',
            'actor_user_id' => $admin->id,
        ]);
    }

    public function test_admin_cannot_delete_their_own_account(): void
    {
        $admin = User::factory()->create(['role' => 'admin', 'status' => 'active']);
        Sanctum::actingAs($admin);

        $this->deleteJson("/api/v1/admin/users/{$admin->id}")->assertUnprocessable();
        $this->assertDatabaseHas('users', ['id' => $admin->id]);

    }

    public function test_non_admin_cannot_delete_a_user(): void
    {
        $requester = User::factory()->create(['role' => 'client', 'status' => 'active']);
        $user = User::factory()->create();
        Sanctum::actingAs($requester);

        $this->deleteJson("/api/v1/admin/users/{$user->id}")->assertForbidden();
        $this->assertDatabaseHas('users', ['id' => $user->id]);
    }
}
