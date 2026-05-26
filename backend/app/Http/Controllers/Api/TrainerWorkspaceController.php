<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TrainerApplication;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TrainerWorkspaceController extends Controller
{
    public function accessStatus(Request $request): JsonResponse
    {
        $user = $request->user();

        abort_unless($user?->role === 'trainer', 403, 'Trainer access required.');

        if ($user->status === 'suspended') {
            return response()->json([
                'status' => 'suspended',
                'application' => null,
                'adminRemarks' => '',
            ]);
        }

        $application = TrainerApplication::query()
            ->where('applicant_user_id', $user->id)
            ->orWhere(function ($query) use ($user): void {
                $query->whereNull('applicant_user_id')
                    ->whereRaw('LOWER(applicant_email) = ?', [strtolower((string) $user->email)]);
            })
            ->latest('updated_at')
            ->first();

        if (!$application) {
            return response()->json([
                'status' => 'onboarding_pending',
                'application' => null,
                'adminRemarks' => '',
            ]);
        }

        return response()->json([
            'status' => match ($application->status) {
                'approved' => 'approved',
                'needs_resubmission' => 'needs_resubmission',
                'rejected' => 'rejected',
                'submitted', 'under_review' => 'pending_review',
                default => 'onboarding_pending',
            },
            'application' => [
                'applicationId' => (string) $application->application_id,
                'applicantUserId' => $application->applicant_user_id ? (string) $application->applicant_user_id : null,
                'status' => (string) $application->status,
                'applicantName' => (string) $application->applicant_name,
                'applicantEmail' => (string) $application->applicant_email,
                'applicantMobile' => (string) $application->applicant_mobile,
                'city' => (string) $application->city,
                'state' => (string) $application->state,
                'expertise' => array_values($application->expertise_json ?? []),
                'values' => is_array($application->values_json) ? $application->values_json : [],
                'currentScreen' => (string) ($application->current_screen ?? 'personalInfo'),
                'submittedAt' => optional($application->submitted_at)->toIso8601String() ?? optional($application->created_at)->toIso8601String() ?? now()->toIso8601String(),
                'updatedAt' => optional($application->updated_at)->toIso8601String() ?? now()->toIso8601String(),
                'adminRemarks' => (string) ($application->admin_remarks ?? ''),
                'reviewHistory' => array_values($application->review_history_json ?? []),
            ],
            'adminRemarks' => (string) ($application->admin_remarks ?? ''),
        ]);
    }

    public function dashboard(): JsonResponse
    {
        return response()->json([
            'message' => 'Trainer dashboard access granted.',
        ]);
    }
}
