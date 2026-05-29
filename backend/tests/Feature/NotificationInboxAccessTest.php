<?php

namespace Tests\Feature;

use App\Models\Notification;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class NotificationInboxAccessTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_only_receives_their_notifications_in_unread_first_newest_order(): void
    {
        $user = User::factory()->create(['role' => 'client', 'status' => 'active']);
        $otherUser = User::factory()->create(['role' => 'helpdesk', 'status' => 'active']);

        $oldUnread = Notification::query()->create([
            'user_id' => $user->id,
            'type' => 'appointment_no_show',
            'channel' => 'in_app',
            'payload_json' => ['message' => 'Older unread'],
            'status' => 'sent',
            'sent_at' => now()->subMinutes(5),
        ]);
        $read = Notification::query()->create([
            'user_id' => $user->id,
            'type' => 'workflow_sla_breach',
            'channel' => 'in_app',
            'payload_json' => ['title' => 'Read notification'],
            'status' => 'read',
            'sent_at' => now()->subMinutes(4),
            'read_at' => now()->subMinutes(3),
        ]);
        $newUnread = Notification::query()->create([
            'user_id' => $user->id,
            'type' => 'trainer_pain_alert',
            'channel' => 'in_app',
            'payload_json' => ['message' => 'Newest unread'],
            'status' => 'sent',
            'sent_at' => now()->subMinutes(2),
        ]);
        Notification::query()->create([
            'user_id' => $otherUser->id,
            'type' => 'escalation',
            'channel' => 'in_app',
            'payload_json' => ['title' => 'Other user notification'],
            'status' => 'queued',
        ]);

        Sanctum::actingAs($user);

        $this->getJson('/api/v1/notifications')
            ->assertOk()
            ->assertJsonPath('unreadCount', 2)
            ->assertJsonCount(3, 'items')
            ->assertJsonPath('items.0.id', $newUnread->id)
            ->assertJsonPath('items.1.id', $oldUnread->id)
            ->assertJsonPath('items.2.id', $read->id)
            ->assertJsonMissing(['title' => 'Other user notification']);
    }

    public function test_user_can_toggle_notification_read_state_through_shared_endpoint(): void
    {
        $user = User::factory()->create(['role' => 'trainer', 'status' => 'active']);
        $notification = Notification::query()->create([
            'user_id' => $user->id,
            'type' => 'trainer_follow_up_due',
            'channel' => 'in_app',
            'payload_json' => ['message' => 'Follow-up due'],
            'status' => 'sent',
            'sent_at' => now(),
        ]);

        Sanctum::actingAs($user);

        $this->patchJson("/api/v1/notifications/{$notification->id}", ['read' => true])
            ->assertOk()
            ->assertJsonPath('notification.read', true);

        $this->assertDatabaseHas('notifications', [
            'id' => $notification->id,
            'status' => 'read',
        ]);

        $this->patchJson("/api/v1/notifications/{$notification->id}", ['read' => false])
            ->assertOk()
            ->assertJsonPath('notification.read', false);

        $this->assertDatabaseHas('notifications', [
            'id' => $notification->id,
            'status' => 'sent',
            'read_at' => null,
        ]);
    }

    public function test_user_can_mark_all_of_their_unread_notifications_as_read(): void
    {
        $user = User::factory()->create(['role' => 'admin', 'status' => 'active']);
        $otherUser = User::factory()->create(['role' => 'helpdesk', 'status' => 'active']);

        $alreadyRead = Notification::query()->create([
            'user_id' => $user->id,
            'type' => 'workflow_sla_breach',
            'channel' => 'in_app',
            'payload_json' => ['title' => 'Already read'],
            'status' => 'read',
            'sent_at' => now()->subHour(),
            'read_at' => now()->subMinutes(30),
        ]);
        $firstUnread = Notification::query()->create([
            'user_id' => $user->id,
            'type' => 'escalation',
            'channel' => 'in_app',
            'payload_json' => ['title' => 'First unread'],
            'status' => 'queued',
            'sent_at' => now()->subMinutes(20),
        ]);
        $secondUnread = Notification::query()->create([
            'user_id' => $user->id,
            'type' => 'appointment_no_show',
            'channel' => 'in_app',
            'payload_json' => ['title' => 'Second unread'],
            'status' => 'sent',
            'sent_at' => now()->subMinutes(5),
        ]);
        $otherUsersUnread = Notification::query()->create([
            'user_id' => $otherUser->id,
            'type' => 'escalation',
            'channel' => 'in_app',
            'payload_json' => ['title' => 'Other user unread'],
            'status' => 'queued',
            'sent_at' => now()->subMinutes(2),
        ]);

        Sanctum::actingAs($user);

        $this->patchJson('/api/v1/notifications/mark-all-read')
            ->assertOk()
            ->assertJsonPath('updatedCount', 2)
            ->assertJsonPath('unreadCount', 0);

        $this->assertDatabaseHas('notifications', [
            'id' => $alreadyRead->id,
            'status' => 'read',
        ]);
        $this->assertDatabaseHas('notifications', [
            'id' => $firstUnread->id,
            'status' => 'read',
        ]);
        $this->assertDatabaseHas('notifications', [
            'id' => $secondUnread->id,
            'status' => 'read',
        ]);
        $this->assertDatabaseHas('notifications', [
            'id' => $otherUsersUnread->id,
            'status' => 'queued',
            'read_at' => null,
        ]);
    }

    public function test_mark_all_read_is_idempotent_when_everything_is_already_read(): void
    {
        $user = User::factory()->create(['role' => 'admin', 'status' => 'active']);
        Notification::query()->create([
            'user_id' => $user->id,
            'type' => 'workflow_sla_breach',
            'channel' => 'in_app',
            'payload_json' => ['title' => 'Read item'],
            'status' => 'read',
            'sent_at' => now()->subMinutes(5),
            'read_at' => now()->subMinutes(4),
        ]);

        Sanctum::actingAs($user);

        $this->patchJson('/api/v1/notifications/mark-all-read')
            ->assertOk()
            ->assertJsonPath('updatedCount', 0)
            ->assertJsonPath('unreadCount', 0);
    }

    public function test_user_cannot_update_someone_elses_notification(): void
    {
        $user = User::factory()->create(['role' => 'client', 'status' => 'active']);
        $otherUser = User::factory()->create(['role' => 'admin', 'status' => 'active']);
        $notification = Notification::query()->create([
            'user_id' => $otherUser->id,
            'type' => 'escalation',
            'channel' => 'in_app',
            'payload_json' => ['title' => 'Admin escalation'],
            'status' => 'queued',
        ]);

        Sanctum::actingAs($user);

        $this->patchJson("/api/v1/notifications/{$notification->id}", ['read' => true])
            ->assertForbidden();
    }
}
