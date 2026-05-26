<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use App\Services\NotificationInboxService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function __construct(private readonly NotificationInboxService $notifications)
    {
    }

    public function index(Request $request): JsonResponse
    {
        return response()->json($this->notifications->inboxPayload($request->user()));
    }

    public function update(Request $request, Notification $notification): JsonResponse
    {
        abort_unless($notification->user_id === $request->user()->id, 403, 'This notification is not assigned to you.');

        $validated = $request->validate([
            'read' => ['required', 'boolean'],
        ]);

        $updated = $this->notifications->updateReadState($notification, (bool) $validated['read']);

        return response()->json([
            'message' => 'Notification updated.',
            'notification' => $this->notifications->payload($updated),
        ]);
    }
}
