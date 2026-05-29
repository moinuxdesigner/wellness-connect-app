<?php

namespace App\Services;

use App\Models\Notification;
use App\Models\User;

class NotificationInboxService
{
    public function inboxPayload(User $user, ?array $types = null, int $limit = 50): array
    {
        $baseQuery = Notification::query()->where('user_id', $user->id);

        if (is_array($types) && $types !== []) {
            $baseQuery->whereIn('type', $types);
        }

        $items = (clone $baseQuery)
            ->orderByRaw("CASE WHEN read_at IS NULL AND status != 'read' THEN 0 ELSE 1 END")
            ->latest('id')
            ->limit($limit)
            ->get();

        return [
            'unreadCount' => $this->unreadQuery(clone $baseQuery)->count(),
            'items' => $items->map(fn (Notification $notification) => $this->payload($notification))->values(),
        ];
    }

    public function markAllRead(User $user): int
    {
        return $this->unreadQuery(Notification::query()->where('user_id', $user->id))->update([
            'status' => 'read',
            'read_at' => now(),
        ]);
    }

    public function updateReadState(Notification $notification, bool $read): Notification
    {
        $notification->update([
            'status' => $read ? 'read' : 'sent',
            'read_at' => $read ? now() : null,
        ]);

        return $notification->fresh();
    }

    public function payload(Notification $notification): array
    {
        $meta = is_array($notification->payload_json) ? $notification->payload_json : [];
        $message = (string) ($meta['message'] ?? $meta['title'] ?? $notification->type);

        return [
            'id' => $notification->id,
            'type' => $notification->type,
            'message' => $message,
            'read' => $notification->read_at !== null || $notification->status === 'read',
            'createdAt' => optional($notification->created_at)->toIso8601String(),
            'meta' => $meta,
        ];
    }

    private function unreadQuery($query)
    {
        return $query->where(function ($builder): void {
            $builder
                ->whereNull('read_at')
                ->where('status', '!=', 'read');
        });
    }
}
