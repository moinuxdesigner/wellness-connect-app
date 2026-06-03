<?php

namespace Tests\Feature;

use App\Models\CbtExerciseInstance;
use App\Models\CbtExerciseTemplate;
use App\Models\Practitioner;
use App\Models\User;
use Database\Seeders\CbtTemplateSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class CbtModuleTest extends TestCase
{
    use RefreshDatabase;

    public function test_counsellor_can_create_plan_assign_exercise_and_review_client_response(): void
    {
        [$client, $counsellor] = $this->cbtUsers();
        $this->seed(CbtTemplateSeeder::class);
        Sanctum::actingAs($counsellor);

        $planId = $this->postJson("/api/v1/cbt/clients/{$client->id}/plans", [
            'title' => 'Work Anxiety CBT Plan',
            'primary_goal' => 'Reduce office anxiety.',
            'status' => 'active',
            'start_date' => today()->toDateString(),
        ])->assertCreated()->json('plan.id');

        $template = CbtExerciseTemplate::query()->where('slug', 'thought-record')->firstOrFail();

        $this->postJson("/api/v1/cbt/plans/{$planId}/exercises", [
            'exercise_template_id' => $template->id,
            'frequency' => 'once',
            'start_date' => today()->toDateString(),
            'due_time' => '18:00',
        ])->assertCreated();

        $instance = CbtExerciseInstance::query()->where('client_id', $client->id)->firstOrFail();

        Sanctum::actingAs($client);
        $responseId = $this->postJson("/api/v1/cbt/exercise-instances/{$instance->id}/submit", [
            'response_json' => [
                'situation' => 'My manager asked for an update.',
                'automatic_thought' => 'I will fail.',
                'emotion_before' => 80,
                'balanced_thought' => 'I can ask clarifying questions.',
                'emotion_after' => 45,
            ],
            'emotion_before' => 80,
            'emotion_after' => 45,
        ])->assertCreated()->json('response.id');

        Sanctum::actingAs($counsellor);
        $this->postJson("/api/v1/cbt/responses/{$responseId}/review", [
            'review_status' => 'reviewed',
            'feedback_to_client' => 'This is a useful balanced thought. Practice it before the next meeting.',
            'clinical_notes' => 'No risk flags.',
        ])->assertOk()->assertJsonPath('review.reviewStatus', 'reviewed');

        $this->assertDatabaseHas('activity_events', ['category' => 'cbt', 'action' => 'cbt_response_reviewed']);
        $this->assertDatabaseHas('notifications', ['user_id' => $client->id, 'type' => 'cbt_response_reviewed']);
    }

    public function test_high_risk_response_creates_risk_event_and_counsellor_notification(): void
    {
        [$client, $counsellor] = $this->cbtUsers();
        $this->seed(CbtTemplateSeeder::class);
        Sanctum::actingAs($counsellor);

        $planId = $this->postJson("/api/v1/cbt/clients/{$client->id}/plans", [
            'title' => 'Safety Aware CBT Plan',
            'status' => 'active',
            'start_date' => today()->toDateString(),
        ])->json('plan.id');

        $template = CbtExerciseTemplate::query()->where('slug', 'mood-check-in')->firstOrFail();
        $this->postJson("/api/v1/cbt/plans/{$planId}/exercises", [
            'exercise_template_id' => $template->id,
            'frequency' => 'once',
            'start_date' => today()->toDateString(),
        ])->assertCreated();

        $instance = CbtExerciseInstance::query()->where('client_id', $client->id)->firstOrFail();

        Sanctum::actingAs($client);
        $this->postJson("/api/v1/cbt/exercise-instances/{$instance->id}/submit", [
            'response_json' => [
                'note' => 'I feel like there is no reason to live today.',
                'mood_score' => 1,
                'anxiety_score' => 9,
            ],
            'emotion_before' => 90,
        ])->assertCreated();

        $this->assertDatabaseHas('cbt_risk_events', [
            'client_id' => $client->id,
            'risk_type' => 'self_harm',
            'risk_level' => 'critical',
        ]);
        $this->assertDatabaseHas('notifications', [
            'user_id' => $counsellor->id,
            'type' => 'cbt_risk_alert',
        ]);
    }

    private function cbtUsers(): array
    {
        $client = User::factory()->create(['role' => 'client', 'status' => 'active']);
        $counsellor = User::factory()->create(['role' => 'counsellor', 'status' => 'active']);
        Practitioner::query()->create([
            'user_id' => $counsellor->id,
            'practitioner_type' => 'counsellor',
            'is_active' => true,
        ]);

        return [$client, $counsellor];
    }
}
