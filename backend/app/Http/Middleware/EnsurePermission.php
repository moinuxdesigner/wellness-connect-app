<?php

namespace App\Http\Middleware;

use App\Services\PermissionService;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsurePermission
{
    public function __construct(private readonly PermissionService $permissions)
    {
    }

    public function handle(Request $request, Closure $next, string ...$permissionKeys): Response
    {
        $user = $request->user();

        abort_unless($user && $this->permissions->userHasAny($user, $permissionKeys), 403, 'You do not have permission to access this resource.');

        return $next($request);
    }
}
