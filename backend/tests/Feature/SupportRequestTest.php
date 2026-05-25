<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class SupportRequestTest extends TestCase
{
    use RefreshDatabase;

    public function test_contact_query_is_saved_to_the_database(): void
    {
        $trainer = User::factory()->create([
            'role' => 'trainer',
            'status' => 'active',
        ]);
        Sanctum::actingAs($trainer);

        $this->postJson('/api/v1/support-requests', [
            'name' => 'Arjun Mehta',
            'email' => 'arjun@example.com',
            'topic' => 'trainer_approval',
            'subject' => 'Review status query',
            'message' => 'Please share an update on my submitted trainer profile.',
        ])
            ->assertCreated()
            ->assertJsonPath('ticketNumber', 'WC-SUP-000001');

        $this->assertDatabaseHas('support_requests', [
            'ticket_number' => 'WC-SUP-000001',
            'requester_user_id' => $trainer->id,
            'email' => 'arjun@example.com',
            'topic' => 'trainer_approval',
            'status' => 'open',
        ]);
    }

    public function test_contact_query_requires_a_meaningful_message(): void
    {
        $this->postJson('/api/v1/support-requests', [
            'name' => 'Visitor',
            'email' => 'visitor@example.com',
            'topic' => 'other',
            'subject' => 'Question',
            'message' => 'Short',
        ])->assertUnprocessable();
    }
}
