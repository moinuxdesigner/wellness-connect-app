<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\AccountProfileService;
use App\Services\ActivityLogService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

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
            $rules['dob'] = ['nullable', 'date', 'before_or_equal:today'];
            $rules['gender'] = ['nullable', 'string', 'max:30'];
            $rules['occupation'] = ['nullable', 'string', 'max:120'];
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
                'dob' => $validated['dob'] ?? null,
                'gender' => $validated['gender'] ?? null,
                'occupation' => $validated['occupation'] ?? null,
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

    public function updateAvatar(Request $request): JsonResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'avatar' => ['required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
        ]);

        $file = $validated['avatar'];
        $disk = Storage::disk('public');
        $directory = sprintf('avatars/users/%d', $user->id);
        $extension = $file->extension() ?: 'jpg';
        $path = $file->storeAs($directory, Str::uuid() . '.' . $extension, 'public');
        $previousPath = $this->ownedAvatarPath($user->avatar_url, $directory);

        $user->forceFill([
            'avatar_url' => $disk->url($path),
        ])->save();

        if ($previousPath && $previousPath !== $path) {
            $disk->delete($previousPath);
        }

        $freshUser = $user->fresh();
        $payload = $this->profiles->profilePayload($freshUser ?? $user);

        $this->activityLogs->record('account', 'profile_updated', sprintf('%s updated their profile photo.', $user->name), [
            'actor' => $freshUser ?? $user,
            'subject' => $freshUser ?? $user,
            'details' => ['updatedField' => 'avatar'],
            'audienceUsers' => [$freshUser ?? $user],
        ]);

        return response()->json([
            'message' => 'Profile photo updated.',
            ...$payload,
        ]);
    }

    private function ownedAvatarPath(?string $avatarUrl, string $directory): ?string
    {
        if (!$avatarUrl) {
            return null;
        }

        $urlHost = parse_url($avatarUrl, PHP_URL_HOST);
        $appHost = parse_url((string) config('app.url'), PHP_URL_HOST);

        if ($urlHost && $appHost && strtolower($urlHost) !== strtolower($appHost)) {
            return null;
        }

        $urlPath = parse_url($avatarUrl, PHP_URL_PATH) ?: $avatarUrl;
        $storageMarker = '/storage/';
        $normalizedPath = '/' . ltrim($urlPath, '/');

        if (!str_starts_with($normalizedPath, $storageMarker)) {
            return null;
        }

        $path = substr($normalizedPath, strlen($storageMarker));

        return str_starts_with($path, rtrim($directory, '/') . '/') ? $path : null;
    }
}
