<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\CbtRiskEvent;
use App\Models\Practitioner;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CounsellorClientController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        abort_unless($user && $user->role === 'counsellor', 403);

        $practitioner = Practitioner::query()
            ->where('user_id', $user->id)
            ->where('practitioner_type', 'counsellor')
            ->first();

        if (!$practitioner) {
            return response()->json(['clients' => []]);
        }

        $clientIds = Appointment::query()
            ->where('practitioner_id', $practitioner->id)
            ->distinct()
            ->pluck('client_user_id');

        $clients = User::query()
            ->whereIn('id', $clientIds)
            ->where('role', 'client')
            ->with([
                'clientProfile',
                'intakeFlows' => fn ($query) => $query->latest('submitted_at')->latest('id'),
                'clientAppointments' => fn ($query) => $query
                    ->where('practitioner_id', $practitioner->id)
                    ->latest('starts_at'),
            ])
            ->orderBy('name')
            ->get()
            ->map(function (User $client) use ($practitioner) {
                $appointments = $client->clientAppointments;
                $lastSession = $appointments
                    ->whereIn('status', ['completed', 'scheduled', 'rescheduled'])
                    ->where('starts_at', '<=', now())
                    ->sortByDesc('starts_at')
                    ->first();
                $nextSession = $appointments
                    ->whereIn('status', ['scheduled', 'rescheduled'])
                    ->where('starts_at', '>=', now())
                    ->sortBy('starts_at')
                    ->first();
                $latestIntake = $client->intakeFlows->first();
                $latestRisk = CbtRiskEvent::query()
                    ->where('client_id', $client->id)
                    ->where(function ($query) use ($practitioner): void {
                        $query
                            ->where('alerted_practitioner_id', $practitioner->user_id)
                            ->orWhereNull('alerted_practitioner_id');
                    })
                    ->latest()
                    ->first();
                $risk = $this->riskLabel($latestRisk?->risk_level ?? $latestIntake?->risk_level);

                return [
                    'id' => $client->id,
                    'name' => $client->name,
                    'email' => $client->email,
                    'phone' => $client->phone,
                    'avatarUrl' => $client->avatar_url ?: $client->clientProfile?->profile_photo_url,
                    'avatar_url' => $client->avatar_url,
                    'profilePhotoUrl' => $client->clientProfile?->profile_photo_url,
                    'primaryGoal' => $client->clientProfile?->primary_goal ?? $client->wellness_goal,
                    'lastSession' => $lastSession?->starts_at?->toIso8601String(),
                    'nextSession' => $nextSession?->starts_at?->toIso8601String(),
                    'intakeStatus' => $latestIntake?->status,
                    'risk' => $risk,
                    'nextAction' => $this->nextAction($risk, $nextSession !== null, $latestIntake?->status),
                ];
            })
            ->values();

        return response()->json(['clients' => $clients]);
    }

    private function riskLabel(?string $risk): string
    {
        return match ($risk) {
            'high' => 'high',
            'medium' => 'watch',
            default => 'normal',
        };
    }

    private function nextAction(string $risk, bool $hasNextSession, ?string $intakeStatus): string
    {
        if ($risk === 'high') {
            return 'Review high-risk flag';
        }

        if ($risk === 'watch') {
            return 'Review care plan';
        }

        if (!$hasNextSession) {
            return 'Schedule follow-up session';
        }

        if ($intakeStatus === 'under_review') {
            return 'Complete intake review';
        }

        return 'Continue care plan';
    }
}
