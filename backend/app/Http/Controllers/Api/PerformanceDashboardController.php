<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\PerformanceDashboardService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PerformanceDashboardController extends Controller
{
    public function __construct(private readonly PerformanceDashboardService $performance)
    {
    }

    public function show(Request $request): JsonResponse
    {
        abort_unless($request->user()?->role === 'admin', 403, 'Admin access required.');

        $validated = $request->validate([
            'window' => ['nullable', 'in:7d,30d,90d'],
        ]);

        return response()->json(
            $this->performance->build((string) ($validated['window'] ?? '30d'))
        );
    }
}
