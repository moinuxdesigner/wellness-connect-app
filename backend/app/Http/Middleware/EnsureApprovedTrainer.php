<?php

namespace App\Http\Middleware;

use App\Models\TrainerApplication;
use App\Models\Practitioner;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureApprovedTrainer
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        abort_unless($user?->role === 'trainer', 403, 'Trainer access required.');
        abort_if($user->status === 'suspended', 403, 'Trainer workspace access is suspended.');

        $isApproved = TrainerApplication::query()
            ->whereRaw('LOWER(applicant_email) = ?', [strtolower((string) $user->email)])
            ->latest('updated_at')
            ->value('status') === 'approved';

        abort_unless($isApproved, 403, 'Trainer profile approval is required.');

        Practitioner::query()->updateOrCreate(
            ['user_id' => $user->id],
            ['practitioner_type' => 'trainer', 'is_active' => true]
        );

        return $next($request);
    }
}
