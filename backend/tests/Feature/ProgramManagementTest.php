<?php

namespace Tests\Feature;

use App\Models\IntakeFlow;
use App\Models\User;
use App\Models\WellnessPackage;
use App\Models\WellnessPackageVersion;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ProgramManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_list_programs(): void
    {
        $admin = User::factory()->create(['role' => 'admin', 'status' => 'active']);
        $program = WellnessPackage::query()->create([
            'code' => 'fit-start',
            'slug' => 'fit-start',
            'name' => 'Fit Start',
            'description' => 'Starter program',
            'duration_weeks' => 4,
            'sessions_counselling' => 0,
            'sessions_training' => 4,
            'status' => 'draft',
            'is_active' => true,
        ]);
        $program->versions()->create([
            'version_number' => 1,
            'name' => 'Fit Start',
            'description' => 'Starter program',
            'duration_weeks' => 4,
            'included_credits_json' => ['counselling' => 0, 'training' => 4],
            'status' => 'draft',
        ]);

        Sanctum::actingAs($admin);

        $this->getJson('/api/v1/admin/programs')
            ->assertOk()
            ->assertJsonPath('programs.0.name', 'Fit Start')
            ->assertJsonPath('programs.0.versionCount', 1);
    }

    public function test_admin_can_create_program_draft(): void
    {
        $admin = User::factory()->create(['role' => 'admin', 'status' => 'active']);
        Sanctum::actingAs($admin);

        $this->postJson('/api/v1/admin/programs', [
            'name' => 'Mind Reset',
            'description' => 'Mind reset program',
            'duration_weeks' => 6,
            'credits' => ['counselling' => 3, 'training' => 1],
        ])->assertCreated()
            ->assertJsonPath('program.status', 'draft')
            ->assertJsonPath('program.latestVersion.versionNumber', 1);

        $this->assertDatabaseHas('activity_events', [
            'category' => 'program',
            'action' => 'program_created',
        ]);
    }

    public function test_admin_can_update_existing_program_draft(): void
    {
        $admin = User::factory()->create(['role' => 'admin', 'status' => 'active']);
        $program = WellnessPackage::query()->create([
            'code' => 'mind-care',
            'slug' => 'mind-care',
            'name' => 'Mind Care',
            'description' => 'Mind care',
            'duration_weeks' => 4,
            'sessions_counselling' => 2,
            'sessions_training' => 0,
            'status' => 'draft',
            'is_active' => true,
        ]);
        $draft = $program->versions()->create([
            'version_number' => 1,
            'name' => 'Mind Care',
            'description' => 'Mind care',
            'duration_weeks' => 4,
            'included_credits_json' => ['counselling' => 2, 'training' => 0],
            'status' => 'draft',
        ]);

        Sanctum::actingAs($admin);

        $this->putJson("/api/v1/admin/programs/{$program->id}/draft", [
            'name' => 'Mind Care Updated',
            'description' => 'Updated description',
            'duration_weeks' => 8,
            'credits' => ['counselling' => 4, 'training' => 0],
        ])->assertOk()
            ->assertJsonPath('program.name', 'Mind Care Updated')
            ->assertJsonPath('program.latestVersion.id', $draft->id)
            ->assertJsonPath('program.versionCount', 1);
    }

    public function test_updating_when_no_draft_exists_creates_next_draft_version(): void
    {
        $admin = User::factory()->create(['role' => 'admin', 'status' => 'active']);
        $program = WellnessPackage::query()->create([
            'code' => 'fit-advanced',
            'slug' => 'fit-advanced',
            'name' => 'Fit Advanced',
            'description' => 'Advanced',
            'duration_weeks' => 4,
            'sessions_counselling' => 0,
            'sessions_training' => 6,
            'status' => 'published',
            'is_active' => true,
        ]);
        $published = $program->versions()->create([
            'version_number' => 1,
            'name' => 'Fit Advanced',
            'description' => 'Advanced',
            'duration_weeks' => 4,
            'included_credits_json' => ['counselling' => 0, 'training' => 6],
            'status' => 'published',
        ]);
        $program->update(['current_published_version_id' => $published->id]);

        Sanctum::actingAs($admin);

        $this->putJson("/api/v1/admin/programs/{$program->id}/draft", [
            'name' => 'Fit Advanced v2',
            'description' => 'Advanced next version',
            'duration_weeks' => 5,
            'credits' => ['counselling' => 0, 'training' => 8],
        ])->assertOk()
            ->assertJsonPath('program.versionCount', 2)
            ->assertJsonPath('program.latestVersion.versionNumber', 2)
            ->assertJsonPath('program.latestVersion.status', 'draft');
    }

    public function test_admin_can_publish_program_and_update_current_published_version(): void
    {
        $admin = User::factory()->create(['role' => 'admin', 'status' => 'active']);
        $program = WellnessPackage::query()->create([
            'code' => 'body-reset',
            'slug' => 'body-reset',
            'name' => 'Body Reset',
            'description' => 'Body reset',
            'duration_weeks' => 6,
            'sessions_counselling' => 0,
            'sessions_training' => 4,
            'status' => 'draft',
            'is_active' => true,
        ]);
        $draft = $program->versions()->create([
            'version_number' => 1,
            'name' => 'Body Reset',
            'description' => 'Body reset',
            'duration_weeks' => 6,
            'included_credits_json' => ['counselling' => 0, 'training' => 4],
            'status' => 'draft',
        ]);

        Sanctum::actingAs($admin);

        $this->postJson("/api/v1/admin/programs/{$program->id}/publish")
            ->assertOk()
            ->assertJsonPath('program.status', 'published')
            ->assertJsonPath('program.publishedVersionId', $draft->id);

        $this->assertDatabaseHas('activity_events', [
            'category' => 'program',
            'action' => 'program_published',
        ]);
    }

    public function test_publishing_rejects_zero_total_credit_programs(): void
    {
        $admin = User::factory()->create(['role' => 'admin', 'status' => 'active']);
        $program = WellnessPackage::query()->create([
            'code' => 'empty',
            'slug' => 'empty',
            'name' => 'Empty Program',
            'description' => 'No credits',
            'duration_weeks' => 4,
            'sessions_counselling' => 0,
            'sessions_training' => 0,
            'status' => 'draft',
            'is_active' => true,
        ]);
        $program->versions()->create([
            'version_number' => 1,
            'name' => 'Empty Program',
            'description' => 'No credits',
            'duration_weeks' => 4,
            'included_credits_json' => ['counselling' => 0, 'training' => 0],
            'status' => 'draft',
        ]);

        Sanctum::actingAs($admin);

        $this->postJson("/api/v1/admin/programs/{$program->id}/publish")
            ->assertStatus(422);
    }

    public function test_admin_can_archive_program_without_breaking_intake_references(): void
    {
        $admin = User::factory()->create(['role' => 'admin', 'status' => 'active']);
        $client = User::factory()->create(['role' => 'client', 'status' => 'active']);
        $program = WellnessPackage::query()->create([
            'code' => 'archive-me',
            'slug' => 'archive-me',
            'name' => 'Archive Me',
            'description' => 'Archive',
            'duration_weeks' => 4,
            'sessions_counselling' => 2,
            'sessions_training' => 2,
            'status' => 'published',
            'is_active' => true,
        ]);
        IntakeFlow::query()->create([
            'client_user_id' => $client->id,
            'service_type' => 'package',
            'wellness_package_id' => $program->id,
            'current_step' => 'service',
            'status' => 'draft',
        ]);

        Sanctum::actingAs($admin);

        $this->postJson("/api/v1/admin/programs/{$program->id}/archive")
            ->assertOk()
            ->assertJsonPath('program.status', 'archived');

        $this->assertDatabaseHas('intake_flows', [
            'wellness_package_id' => $program->id,
        ]);
        $this->assertDatabaseHas('activity_events', [
            'category' => 'program',
            'action' => 'program_archived',
        ]);
    }

    public function test_versions_endpoint_returns_historical_versions(): void
    {
        $admin = User::factory()->create(['role' => 'admin', 'status' => 'active']);
        $program = WellnessPackage::query()->create([
            'code' => 'history',
            'slug' => 'history',
            'name' => 'History',
            'description' => 'History',
            'duration_weeks' => 4,
            'sessions_counselling' => 1,
            'sessions_training' => 1,
            'status' => 'draft',
            'is_active' => true,
        ]);
        $program->versions()->createMany([
            [
                'version_number' => 1,
                'name' => 'History',
                'description' => 'v1',
                'duration_weeks' => 4,
                'included_credits_json' => ['counselling' => 1, 'training' => 1],
                'status' => 'published',
            ],
            [
                'version_number' => 2,
                'name' => 'History',
                'description' => 'v2',
                'duration_weeks' => 6,
                'included_credits_json' => ['counselling' => 2, 'training' => 1],
                'status' => 'draft',
            ],
        ]);

        Sanctum::actingAs($admin);

        $this->getJson("/api/v1/admin/programs/{$program->id}/versions")
            ->assertOk()
            ->assertJsonCount(2, 'versions')
            ->assertJsonPath('versions.0.versionNumber', 2)
            ->assertJsonPath('versions.1.versionNumber', 1);
    }

    public function test_non_admin_cannot_access_program_management_endpoints(): void
    {
        Sanctum::actingAs(User::factory()->create(['role' => 'client', 'status' => 'active']));

        $this->getJson('/api/v1/admin/programs')->assertForbidden();
    }
}
