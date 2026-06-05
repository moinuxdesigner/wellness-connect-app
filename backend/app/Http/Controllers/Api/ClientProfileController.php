<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\AccountProfileService;
use App\Services\ActivityLogService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ClientProfileController extends Controller
{
    public function __construct(
        private readonly ActivityLogService $activityLogs,
        private readonly AccountProfileService $profiles,
    )
    {
    }

    public function update(Request $request): JsonResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'phone' => ['nullable', 'string', 'max:30'],
            'primary_goal' => ['nullable', 'in:fitness,mental_health,both'],
            'dob' => ['nullable', 'date', 'before_or_equal:today'],
            'gender' => ['nullable', 'string', 'max:30'],
            'occupation' => ['nullable', 'string', 'max:120'],
            'timezone' => ['nullable', 'string', 'max:64'],
            'preferred_language' => ['nullable', 'string', 'max:32'],
            'consent_to_terms' => ['required', 'boolean'],
        ]);

        $payload = $this->profiles->update($user, $validated);

        $this->activityLogs->record('account', 'profile_updated', sprintf('%s updated their profile.', $user->name), [
            'actor' => $user,
            'subject' => $user,
            'details' => [
                'primaryGoal' => $validated['primary_goal'] ?? null,
                'dob' => $validated['dob'] ?? null,
                'gender' => $validated['gender'] ?? null,
                'occupation' => $validated['occupation'] ?? null,
                'timezone' => $validated['timezone'] ?? null,
                'preferredLanguage' => $validated['preferred_language'] ?? null,
            ],
            'audienceUsers' => [$user],
        ]);

        return response()->json([
            'message' => 'Profile updated.',
            'user' => $payload['user'],
            'profile' => $payload['profile'],
        ]);
    }
}
