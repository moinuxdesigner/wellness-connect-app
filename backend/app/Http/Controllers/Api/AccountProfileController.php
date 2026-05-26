<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\AccountProfileService;
use App\Services\ActivityLogService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AccountProfileController extends Controller
{
    public function __construct(
        private readonly AccountProfileService $profiles,
        private readonly ActivityLogService $activityLogs,
    ) {
    }

    public function show(Request $request): JsonResponse
    {
        return response()->json($this->profiles->profilePayload($request->user()));
    }

    public function update(Request $request): JsonResponse
    {
        $user = $request->user();

        $rules = [
            'name' => ['required', 'string', 'max:120'],
            'phone' => ['nullable', 'string', 'max:30'],
            'consent_to_terms' => ['required', 'boolean'],
        ];

        if ($user->role === 'client') {
            $rules['primary_goal'] = ['nullable', 'in:fitness,mental_health,both'];
            $rules['timezone'] = ['nullable', 'string', 'max:64'];
            $rules['preferred_language'] = ['nullable', 'string', 'max:32'];
        }

        $validated = $request->validate($rules);
        $payload = $this->profiles->update($user, $validated);

        $this->activityLogs->record('account', 'profile_updated', sprintf('%s updated their profile.', $user->name), [
            'actor' => $user,
            'subject' => $user,
            'details' => array_filter([
                'role' => $user->role,
                'primaryGoal' => $validated['primary_goal'] ?? null,
                'timezone' => $validated['timezone'] ?? null,
                'preferredLanguage' => $validated['preferred_language'] ?? null,
            ], static fn (mixed $value) => $value !== null),
            'audienceUsers' => [$user],
        ]);

        return response()->json([
            'message' => 'Profile updated.',
            ...$payload,
        ]);
    }
}
