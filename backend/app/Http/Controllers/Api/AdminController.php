<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\Notification;
use App\Models\User;
use App\Models\WellnessPackage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class AdminController extends Controller
{
    public function overview(Request $request): JsonResponse
    {
        $this->authorizeAdmin($request);

        $usersCount = User::count();
        $activeUsersCount = User::where('status', 'active')->count();
        $appointmentsCount = Appointment::count();
        $highPriorityEscalationsCount = Notification::where('type', 'escalation')
            ->whereIn('status', ['queued', 'failed'])
            ->count();

        $roleDistribution = User::select('role', DB::raw('COUNT(*) as users'))
            ->groupBy('role')
            ->orderBy('role')
            ->get()
            ->map(function ($row) {
                $count = (int) $row->users;
                return [
                    'role' => (string) $row->role,
                    'users' => $count,
                    'status' => $count > 0 ? 'healthy' : 'attention',
                ];
            })->values();

        $recentEscalations = Notification::query()
            ->where('type', 'escalation')
            ->latest()
            ->limit(10)
            ->get()
            ->map(function (Notification $notification) {
                $payload = is_array($notification->payload_json) ? $notification->payload_json : [];
                $priority = (string) ($payload['priority'] ?? 'medium');
                return [
                    'id' => 'ESC-' . $notification->id,
                    'title' => (string) ($payload['title'] ?? 'Escalation notification'),
                    'priority' => in_array($priority, ['low', 'medium', 'high'], true) ? $priority : 'medium',
                    'status' => (string) $notification->status,
                ];
            })->values();

        $usageMetrics = [
            [
                'label' => 'Total Users',
                'value' => (string) $usersCount,
                'delta' => 'Live',
            ],
            [
                'label' => 'Active Users',
                'value' => (string) $activeUsersCount,
                'delta' => 'Current status',
            ],
            [
                'label' => 'Appointments',
                'value' => (string) $appointmentsCount,
                'delta' => 'Total booked',
            ],
            [
                'label' => 'Open Escalations',
                'value' => (string) $highPriorityEscalationsCount,
                'delta' => 'Needs action',
            ],
        ];

        $analytics = [
            [
                'label' => 'Users',
                'value' => (string) $usersCount,
                'delta' => 'Total accounts',
            ],
            [
                'label' => 'Appointments',
                'value' => (string) $appointmentsCount,
                'delta' => 'All time',
            ],
            [
                'label' => 'Escalations',
                'value' => (string) $highPriorityEscalationsCount,
                'delta' => 'Open',
            ],
            [
                'label' => 'Programs',
                'value' => (string) WellnessPackage::count(),
                'delta' => 'Package catalog',
            ],
        ];

        return response()->json([
            'analytics' => $analytics,
            'usage_metrics' => $usageMetrics,
            'role_distribution' => $roleDistribution,
            'recent_escalations' => $recentEscalations,
        ]);
    }

    public function users(Request $request): JsonResponse
    {
        $this->authorizeAdmin($request);

        $users = User::query()
            ->select('id', 'name', 'email', 'role', 'status', 'created_at')
            ->latest()
            ->get()
            ->map(fn (User $user) => [
                'id' => (string) $user->id,
                'name' => (string) $user->name,
                'email' => (string) $user->email,
                'role' => (string) $user->role,
                'status' => (string) ($user->status ?? 'active'),
                'joinedAt' => optional($user->created_at)->format('Y-m-d') ?? '',
            ])->values();

        return response()->json([
            'users' => $users,
        ]);
    }

    public function resetUserPassword(Request $request, User $user): JsonResponse
    {
        $this->authorizeAdmin($request);

        $user->forceFill([
            'password' => 'password123',
            'remember_token' => Str::random(60),
        ])->save();

        $user->tokens()->delete();

        return response()->json([
            'message' => "Password reset for {$user->email}. New password: password123",
            'user' => [
                'id' => (string) $user->id,
                'email' => (string) $user->email,
            ],
        ]);
    }

    public function programs(Request $request): JsonResponse
    {
        $this->authorizeAdmin($request);

        $programs = WellnessPackage::query()
            ->select('id', 'name', 'is_active', 'description')
            ->latest()
            ->get()
            ->map(fn (WellnessPackage $pkg) => [
                'id' => 'PRG-' . $pkg->id,
                'title' => (string) $pkg->name,
                'category' => 'lifestyle',
                'status' => $pkg->is_active ? 'published' : 'archived',
                'assignedCount' => 0,
            ])->values();

        return response()->json([
            'programs' => $programs,
        ]);
    }

    public function escalations(Request $request): JsonResponse
    {
        $this->authorizeAdmin($request);

        $tickets = Notification::query()
            ->where('type', 'escalation')
            ->latest()
            ->limit(30)
            ->get()
            ->map(function (Notification $notification) {
                $payload = is_array($notification->payload_json) ? $notification->payload_json : [];
                $priority = (string) ($payload['priority'] ?? 'medium');
                return [
                    'id' => 'ESC-' . $notification->id,
                    'title' => (string) ($payload['title'] ?? 'Escalation notification'),
                    'priority' => in_array($priority, ['low', 'medium', 'high'], true) ? $priority : 'medium',
                    'status' => (string) $notification->status,
                    'createdAt' => optional($notification->created_at)->toIso8601String(),
                ];
            })->values();

        return response()->json([
            'tickets' => $tickets,
        ]);
    }

    public function activities(Request $request): JsonResponse
    {
        $this->authorizeAdmin($request);

        $activities = Appointment::query()
            ->with(['client:id,name', 'practitioner:id,user_id', 'practitioner.user:id,name'])
            ->latest()
            ->limit(40)
            ->get()
            ->map(function (Appointment $appointment) {
                return [
                    'id' => 'APT-' . $appointment->id,
                    'serviceType' => (string) $appointment->service_type,
                    'clientName' => (string) optional($appointment->client)->name,
                    'professionalName' => (string) optional(optional($appointment->practitioner)->user)->name,
                    'scheduleAt' => optional($appointment->starts_at)->toIso8601String(),
                    'status' => (string) $appointment->status,
                ];
            })->values();

        return response()->json([
            'activities' => $activities,
        ]);
    }

    private function authorizeAdmin(Request $request): void
    {
        abort_unless($request->user()?->role === 'admin', 403, 'Admin access required.');
    }
}
