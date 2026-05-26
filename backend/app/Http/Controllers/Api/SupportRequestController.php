<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SupportRequest;
use App\Services\ActivityLogService;
use App\Services\WorkflowCaseService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SupportRequestController extends Controller
{
    public function __construct(
        private readonly ActivityLogService $activityLogs,
        private readonly WorkflowCaseService $workflowCases,
    )
    {
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'min:2', 'max:120'],
            'email' => ['required', 'email', 'max:255'],
            'topic' => ['required', 'string', 'in:trainer_approval,account_access,technical_issue,billing,other'],
            'subject' => ['required', 'string', 'min:3', 'max:160'],
            'message' => ['required', 'string', 'min:10', 'max:3000'],
        ]);

        $supportRequest = SupportRequest::query()->create([
            ...$validated,
            'requester_user_id' => $request->user('sanctum')?->id,
            'status' => 'open',
        ]);
        $supportRequest->update([
            'ticket_number' => sprintf('WC-SUP-%06d', $supportRequest->id),
        ]);

        $this->workflowCases->createSupportRequestCase($supportRequest->fresh());
        $requester = $request->user('sanctum');
        $this->activityLogs->record('support', 'request_created', sprintf('Support request %s was submitted.', $supportRequest->ticket_number), [
            'actor' => $requester,
            'subject' => $supportRequest,
            'details' => [
                'topic' => $supportRequest->topic,
                'status' => $supportRequest->status,
            ],
            'audienceRoles' => ['helpdesk'],
            'audienceUsers' => array_values(array_filter([$requester])),
        ]);

        return response()->json([
            'message' => 'Your support query has been submitted.',
            'ticketNumber' => $supportRequest->ticket_number,
        ], 201);
    }
}
