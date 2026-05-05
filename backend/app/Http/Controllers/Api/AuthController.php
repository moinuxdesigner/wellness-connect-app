<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ClientProfile;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8', 'max:120'],
            'role' => ['nullable', 'string', 'in:client,counsellor,trainer,coach,helpdesk,admin,finance,legal,content'],
            'phone' => ['nullable', 'string', 'max:30'],
            'consent_to_terms' => ['nullable', 'boolean'],
            'primary_goal' => ['nullable', 'in:fitness,mental_health,both'],
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => $validated['password'],
            'role' => $validated['role'] ?? 'client',
            'phone' => $validated['phone'] ?? null,
            'consent_to_terms' => $validated['consent_to_terms'] ?? true,
            'wellness_goal' => $validated['primary_goal'] ?? null,
        ]);

        $profile = ClientProfile::updateOrCreate(
            ['user_id' => $user->id],
            ['primary_goal' => $validated['primary_goal'] ?? null]
        );

        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => $this->userPayload($user),
            'profile' => $profile,
        ], 201);
    }

    public function login(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        $user = User::where('email', $validated['email'])->first();

        if (!$user || !Hash::check($validated['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Invalid credentials.'],
            ]);
        }

        $user->tokens()->delete();
        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => $this->userPayload($user),
            'profile' => $user->clientProfile,
        ]);
    }

    public function me(Request $request): JsonResponse
    {
        $user = $request->user()->load('clientProfile');

        return response()->json([
            'user' => $this->userPayload($user),
            'profile' => $user->clientProfile,
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()?->currentAccessToken()?->delete();

        return response()->json([
            'message' => 'Logged out successfully.',
        ]);
    }

    private function userPayload(User $user): array
    {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role,
            'phone' => $user->phone,
            'consent_to_terms' => (bool) $user->consent_to_terms,
            'status' => $user->status ?? 'active',
        ];
    }
}
