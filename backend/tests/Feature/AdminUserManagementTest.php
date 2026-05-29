<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AdminUserManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_users_index_returns_phone_and_last_active_fields(): void
    {
        $admin = User::factory()->create([
            'role' => 'admin',
            'status' => 'active',
        ]);
        $activeUser = User::factory()->create([
            'name' => 'Active Client',
            'email' => 'active.client@example.com',
            'phone' => '+91 9000001111',
            'role' => 'client',
            'status' => 'active',
        ]);
        $neverActiveUser = User::factory()->create([
            'name' => 'Pending Trainer',
            'email' => 'pending.trainer@example.com',
            'phone' => '+91 9000002222',
            'role' => 'trainer',
            'status' => 'pending',
        ]);

        $lastUsedAt = now()->subHour()->startOfMinute();
        $activeUser->createToken('admin-users-test')
            ->accessToken
            ->forceFill(['last_used_at' => $lastUsedAt])
            ->save();

        Sanctum::actingAs($admin);

        $response = $this->getJson('/api/v1/admin/users')
            ->assertOk()
            ->assertJsonFragment([
                'id' => (string) $activeUser->id,
                'name' => 'Active Client',
                'email' => 'active.client@example.com',
                'phone' => '+91 9000001111',
                'role' => 'client',
                'status' => 'active',
                'lastActiveAt' => $lastUsedAt->toIso8601String(),
            ])
            ->assertJsonFragment([
                'id' => (string) $neverActiveUser->id,
                'name' => 'Pending Trainer',
                'email' => 'pending.trainer@example.com',
                'phone' => '+91 9000002222',
                'role' => 'trainer',
                'status' => 'pending',
                'lastActiveAt' => null,
            ]);

        $returnedUserIds = collect($response->json('users'))->pluck('id')->all();

        $this->assertContains((string) $activeUser->id, $returnedUserIds);
        $this->assertContains((string) $neverActiveUser->id, $returnedUserIds);
    }
}
