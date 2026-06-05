<?php

namespace App\Services;

use App\Models\ClientProfile;
use App\Models\TrainerApplication;
use App\Models\User;
use Illuminate\Support\Arr;

class AccountProfileService
{
    private const WORKSPACE_TITLES = [
        'admin' => 'Admin Console',
        'client' => 'Client Portal',
        'counsellor' => 'Counsellor Workspace',
        'trainer' => 'Trainer Workspace',
        'coach' => 'Coach Workspace',
        'helpdesk' => 'Help Desk',
        'finance' => 'Finance Console',
        'legal' => 'Legal Console',
        'content' => 'Content Console',
    ];

    public function __construct(private readonly PermissionService $permissions)
    {
    }

    public function profilePayload(User $user): array
    {
        $user->loadMissing('clientProfile');

        return [
            'user' => $this->userPayload($user),
            'roleDetails' => $this->roleDetailsPayload($user),
        ];
    }

    public function update(User $user, array $validated): array
    {
        $user->update([
            'name' => $validated['name'],
            'phone' => $validated['phone'] ?? null,
            'consent_to_terms' => $validated['consent_to_terms'],
            'wellness_goal' => $user->role === 'client'
                ? ($validated['primary_goal'] ?? null)
                : $user->wellness_goal,
        ]);

        $profile = null;
        if ($user->role === 'client') {
            $profile = ClientProfile::query()->updateOrCreate(
                ['user_id' => $user->id],
                [
                    'primary_goal' => $validated['primary_goal'] ?? null,
                    'dob' => $validated['dob'] ?? null,
                    'gender' => $validated['gender'] ?? null,
                    'occupation' => $validated['occupation'] ?? null,
                    'timezone' => $validated['timezone'] ?? null,
                    'preferred_language' => $validated['preferred_language'] ?? null,
                ]
            );
        }

        $freshUser = $user->fresh();
        if (!$freshUser instanceof User) {
            $freshUser = $user;
        }
        $freshUser->load('clientProfile');

        return [
            'user' => $this->userPayload($freshUser),
            'profile' => $this->clientProfilePayload($profile ?? $freshUser->clientProfile),
            'roleDetails' => $this->roleDetailsPayload($freshUser),
        ];
    }

    public function clientProfilePayload(?ClientProfile $profile): ?array
    {
        if (!$profile instanceof ClientProfile) {
            return null;
        }

        return [
            'primary_goal' => $profile->primary_goal,
            'dob' => optional($profile->dob)->format('Y-m-d'),
            'age' => $profile->dob?->age,
            'gender' => $profile->gender,
            'occupation' => $profile->occupation,
            'timezone' => $profile->timezone,
            'preferred_language' => $profile->preferred_language,
            'profilePhotoUrl' => $profile->profile_photo_url,
            'profile_photo_url' => $profile->profile_photo_url,
        ];
    }

    public function userPayload(User $user): array
    {
        $requiresClientIntake = $user->role === 'client' && !$user->intakeFlows()->exists();
        $primaryGoal = $user->role === 'client'
            ? ($user->clientProfile?->primary_goal ?? $user->wellness_goal)
            : null;

        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role,
            'phone' => $user->phone,
            'avatarUrl' => $user->avatar_url ?: $user->clientProfile?->profile_photo_url,
            'avatar_url' => $user->avatar_url,
            'wellness_goal' => $primaryGoal,
            'primary_goal' => $primaryGoal,
            'dob' => optional($user->clientProfile?->dob)->format('Y-m-d'),
            'age' => $user->clientProfile?->dob?->age,
            'gender' => $user->clientProfile?->gender,
            'occupation' => $user->clientProfile?->occupation,
            'consent_to_terms' => (bool) $user->consent_to_terms,
            'status' => $user->status ?? 'active',
            'requires_client_intake' => $requiresClientIntake,
            'permissions' => $this->permissions->effectiveKeys($user),
        ];
    }

    private function roleDetailsPayload(User $user): array
    {
        $details = [
            'roleLabel' => $this->roleLabel($user->role),
            'workspaceTitle' => self::WORKSPACE_TITLES[$user->role] ?? 'Workspace',
        ];

        if ($user->role === 'client') {
            $details['client'] = [
                'primaryGoal' => $user->clientProfile?->primary_goal ?? $user->wellness_goal,
                'dob' => optional($user->clientProfile?->dob)->format('Y-m-d'),
                'age' => $user->clientProfile?->dob?->age,
                'gender' => $user->clientProfile?->gender,
                'occupation' => $user->clientProfile?->occupation,
                'timezone' => $user->clientProfile?->timezone,
                'preferredLanguage' => $user->clientProfile?->preferred_language,
            ];
        }

        if ($user->role === 'trainer') {
            $application = TrainerApplication::query()
                ->where('applicant_user_id', $user->id)
                ->latest('updated_at')
                ->first();

            $values = is_array($application?->values_json) ? $application->values_json : [];
            $details['trainer'] = [
                'applicationStatus' => $application?->status,
                'applicationId' => $application?->application_id,
                'submittedAt' => optional($application?->submitted_at)->toIso8601String(),
                'profilePhotoUrl' => Arr::get($values, 'photo.file.previewUrl'),
                'specialties' => Arr::get($values, 'expertise', $application?->expertise_json ?? []),
                'location' => $application
                    ? trim(implode(', ', array_filter([
                        Arr::get($values, 'profile.city', $application->city),
                        Arr::get($values, 'profile.state', $application->state),
                    ])))
                    : null,
                'editUrl' => '/trainer/onboarding?mode=edit',
            ];
        }

        return $details;
    }

    private function roleLabel(string $role): string
    {
        return match ($role) {
            'admin' => 'Administrator',
            'client' => 'Client',
            'counsellor' => 'Counsellor',
            'trainer' => 'Trainer',
            'coach' => 'Coach',
            'helpdesk' => 'Help Desk',
            'finance' => 'Finance',
            'legal' => 'Legal',
            'content' => 'Content',
            default => ucfirst($role),
        };
    }
}
