<?php

namespace Tests\Feature;

use App\Models\RoleChangeAudit;
use App\Models\User;
use App\Services\ActivityLogService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ActivityLogTest extends TestCase
{
    use RefreshDatabase;

    public function test_role_change_writes_activity_event(): void
    {
        $admin = User::factory()->create(['role' => 'admin', 'status' => 'active']);
        $user = User::factory()->create(['role' => 'client', 'status' => 'active']);

        Sanctum::actingAs($admin);

        $this->patchJson("/api/v1/admin/users/{$user->id}/role", [
            'role' => 'helpdesk',
            'reason' => 'Move account into helpdesk operations.',
        ])->assertOk();

        $this->assertDatabaseHas('activity_events', [
            'category' => 'rbac',
            'action' => 'role_changed',
            'target_user_id' => $user->id,
            'target_role' => 'helpdesk',
        ]);
    }

    public function test_client_only_sees_their_own_activity_entries(): void
    {
        $clientOne = User::factory()->create(['role' => 'client', 'status' => 'active']);
        $clientTwo = User::factory()->create(['role' => 'client', 'status' => 'active']);

        app(ActivityLogService::class)->record('auth', 'login', 'Client one signed in.', [
            'actor' => $clientOne,
            'subject' => $clientOne,
            'audienceUsers' => [$clientOne],
        ]);
        app(ActivityLogService::class)->record('auth', 'login', 'Client two signed in.', [
            'actor' => $clientTwo,
            'subject' => $clientTwo,
            'audienceUsers' => [$clientTwo],
        ]);

        Sanctum::actingAs($clientOne);

        $this->getJson('/api/v1/activity-logs')
            ->assertOk()
            ->assertJsonCount(1, 'entries')
            ->assertJsonPath('entries.0.summary', 'Client one signed in.');
    }

    public function test_non_admin_cannot_use_cross_role_activity_filters(): void
    {
        $client = User::factory()->create(['role' => 'client', 'status' => 'active']);
        Sanctum::actingAs($client);

        $this->getJson('/api/v1/activity-logs?role=finance')->assertForbidden();
    }

    public function test_admin_activity_alias_returns_normalized_activity_payload(): void
    {
        $admin = User::factory()->create(['role' => 'admin', 'status' => 'active']);
        app(ActivityLogService::class)->record('auth', 'login', 'Admin signed in.', [
            'actor' => $admin,
            'subject' => $admin,
            'audienceUsers' => [$admin],
        ]);

        Sanctum::actingAs($admin);

        $this->getJson('/api/v1/admin/activities')
            ->assertOk()
            ->assertJsonPath('entries.0.category', 'auth')
            ->assertJsonStructure([
                'entries' => [
                    ['id', 'category', 'action', 'summary', 'occurredAt', 'actor', 'subject', 'target', 'details'],
                ],
                'pagination' => ['page', 'pageSize', 'total', 'totalPages'],
                'availableCategories',
                'availableActors',
                'summary' => ['totalActivities', 'todayActivities', 'admins', 'usersAffected', 'criticalActions'],
            ]);
    }

    public function test_admin_can_search_activity_logs_by_human_query(): void
    {
        $admin = User::factory()->create(['role' => 'admin', 'status' => 'active']);
        $client = User::factory()->create(['role' => 'client', 'status' => 'active', 'name' => 'Ravi Kumar']);

        app(ActivityLogService::class)->record('account', 'profile_updated', 'Ravi Kumar updated their profile.', [
            'actor' => $client,
            'subject' => $client,
            'audienceUsers' => [$client],
        ]);

        app(ActivityLogService::class)->record('auth', 'logout', 'Admin signed out.', [
            'actor' => $admin,
            'subject' => $admin,
            'audienceUsers' => [$admin],
        ]);

        Sanctum::actingAs($admin);

        $this->getJson('/api/v1/activity-logs?query=Ravi')
            ->assertOk()
            ->assertJsonCount(1, 'entries')
            ->assertJsonPath('entries.0.summary', 'Ravi Kumar updated their profile.');
    }

    public function test_activity_log_backfill_command_is_idempotent(): void
    {
        $actor = User::factory()->create(['role' => 'admin', 'status' => 'active']);
        $target = User::factory()->create(['role' => 'client', 'status' => 'active']);

        RoleChangeAudit::query()->create([
            'actor_user_id' => $actor->id,
            'target_user_id' => $target->id,
            'previous_role' => 'client',
            'new_role' => 'helpdesk',
            'reason' => 'Backfill test',
        ]);

        $this->artisan('activity-logs:backfill')->assertSuccessful();
        $this->artisan('activity-logs:backfill')->assertSuccessful();

        $this->assertDatabaseCount('activity_events', 1);
    }
}
