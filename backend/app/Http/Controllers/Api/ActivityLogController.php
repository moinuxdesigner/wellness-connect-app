<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\ActivityLogService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ActivityLogController extends Controller
{
    public function __construct(private readonly ActivityLogService $activityLogs)
    {
    }

    public function index(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'category' => ['nullable', 'string', 'max:80'],
            'subjectType' => ['nullable', 'string', 'max:191'],
            'query' => ['nullable', 'string', 'max:120'],
            'dateFrom' => ['nullable', 'date'],
            'dateTo' => ['nullable', 'date'],
            'page' => ['nullable', 'integer', 'min:1'],
            'pageSize' => ['nullable', 'integer', 'min:1', 'max:100'],
            'role' => ['nullable', Rule::in(ActivityLogService::ROLES)],
            'actorUserId' => ['nullable', 'integer', 'min:1'],
            'targetRole' => ['nullable', Rule::in(ActivityLogService::ROLES)],
        ]);

        $user = $request->user();
        if ($user->role !== 'admin' && (
            !empty($validated['role'])
            || !empty($validated['actorUserId'])
            || !empty($validated['targetRole'])
        )) {
            abort(403, 'Only administrators may use cross-role activity filters.');
        }

        return response()->json($this->activityLogs->feed($user, $validated));
    }
}
