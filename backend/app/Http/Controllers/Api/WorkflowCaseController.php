<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\WorkflowCase;
use App\Services\WorkflowCaseService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WorkflowCaseController extends Controller
{
    public function __construct(private readonly WorkflowCaseService $workflowCases)
    {
    }

    public function adminIndex(Request $request): JsonResponse
    {
        return response()->json([
            'cases' => $this->workflowCases->listForAdmin([
                'workflowKey' => $request->query('workflowKey'),
                'status' => $request->query('status'),
                'ownerRole' => $request->query('ownerRole'),
            ])->values()->all(),
        ]);
    }

    public function helpdeskIndex(Request $request): JsonResponse
    {
        return response()->json([
            'cases' => $this->workflowCases->listForHelpdesk()->values()->all(),
        ]);
    }

    public function update(Request $request, WorkflowCase $workflowCase): JsonResponse
    {
        abort_unless(
            $this->workflowCases->userCanManageCase($request->user(), $workflowCase),
            403,
            'You do not have permission to manage this workflow case.'
        );

        $validated = $request->validate([
            'action' => ['required', 'string'],
            'note' => ['nullable', 'string', 'max:500'],
        ]);

        $updatedCase = $this->workflowCases->updateCase(
            $workflowCase,
            (string) $validated['action'],
            isset($validated['note']) ? (string) $validated['note'] : null,
            $request->user()
        );

        return response()->json([
            'message' => 'Workflow case updated.',
            'case' => $updatedCase,
        ]);
    }
}
