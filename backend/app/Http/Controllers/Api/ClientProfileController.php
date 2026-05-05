<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ClientProfile;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ClientProfileController extends Controller
{
    public function update(Request $request): JsonResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'phone' => ['nullable', 'string', 'max:30'],
            'primary_goal' => ['nullable', 'in:fitness,mental_health,both'],
            'timezone' => ['nullable', 'string', 'max:64'],
            'preferred_language' => ['nullable', 'string', 'max:32'],
            'consent_to_terms' => ['required', 'boolean'],
        ]);

        $user->update([
            'name' => $validated['name'],
            'phone' => $validated['phone'] ?? null,
            'consent_to_terms' => $validated['consent_to_terms'],
            'wellness_goal' => $validated['primary_goal'] ?? null,
        ]);

        $profile = ClientProfile::updateOrCreate(
            ['user_id' => $user->id],
            [
                'primary_goal' => $validated['primary_goal'] ?? null,
                'timezone' => $validated['timezone'] ?? null,
                'preferred_language' => $validated['preferred_language'] ?? null,
            ]
        );

        return response()->json([
            'message' => 'Profile updated.',
            'user' => $user->fresh(),
            'profile' => $profile,
        ]);
    }
}
