<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\WorkflowConfigService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WorkflowConfigController extends Controller
{
    public function __construct(private readonly WorkflowConfigService $workflowConfigs)
    {
    }

    public function index(Request $request): JsonResponse
    {
        return response()->json([
            'workflows' => $this->workflowConfigs->list()->values()->all(),
        ]);
    }

    public function update(Request $request, string $workflowKey): JsonResponse
    {
        $validated = $request->validate([
            'config' => ['required', 'array'],
            'reason' => ['required', 'string', 'max:500'],
        ]);

        $workflow = $this->workflowConfigs->update(
            $workflowKey,
            $validated['config'],
            (string) $validated['reason'],
            $request->user()
        );

        return response()->json([
            'message' => 'Workflow configuration updated.',
            'workflow' => $workflow,
        ]);
    }
}
