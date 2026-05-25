import { useEffect, useState, type ReactNode } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router';
import type { Role } from '../../types';
import { clearAuthState, getAuthState } from './auth';
import { meRequest } from './apiAuth';
import { getRoleHomePath } from './roleRedirects';
import { hasAnyPermission } from './permissions';

export function RequireAuth() {
  const auth = getAuthState();
  const location = useLocation();
  const [state, setState] = useState<'checking' | 'ready' | 'invalid'>(() => (
    auth.isAuthenticated && auth.token && auth.user ? 'checking' : 'invalid'
  ));

  useEffect(() => {
    let active = true;
    setState('checking');

    if (!auth.isAuthenticated || !auth.token || !auth.user || auth.token.startsWith('demo-token-')) {
      clearAuthState();
      setState('invalid');
      return () => {
        active = false;
      };
    }

    void meRequest()
      .then(() => {
        if (active) setState('ready');
      })
      .catch(() => {
        if (active) setState('invalid');
      });

    return () => {
      active = false;
    };
  }, [auth.token, location.pathname]);

  if (state === 'checking') {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white">
        <p className="text-sm font-medium text-slate-500">Verifying your session...</p>
      </main>
    );
  }

  if (state === 'invalid') {
    return <Navigate to="/login" replace state={{ authNotice: 'Your session is no longer active. Please sign in again.' }} />;
  }

  return <Outlet />;
}

export function RequireRole({ allow }: { allow: Role[] }) {
  const auth = getAuthState();

  if (!auth.user?.role || !allow.includes(auth.user.role)) {
    return <Navigate to={auth.user?.role ? getRoleHomePath(auth.user.role) : '/login'} replace />;
  }

  return <Outlet />;
}

export function RequirePermission({ anyOf }: { anyOf: string[] }) {
  const auth = getAuthState();

  if (!hasAnyPermission(auth.user, anyOf)) {
    return <AccessDeniedPage />;
  }

  return <Outlet />;
}

export function PermissionBoundary({ anyOf, children }: { anyOf: string[]; children: ReactNode }) {
  const auth = getAuthState();

  return hasAnyPermission(auth.user, anyOf) ? children : <AccessDeniedPage />;
}

export function AccessDeniedPage() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center px-4">
      <section className="max-w-lg rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-widest text-rose-600">403 Access denied</p>
        <h1 className="mt-3 text-2xl font-semibold text-slate-950">You do not have permission to view this page</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">Your administrator controls access to this module. Contact support if you think this access is required.</p>
      </section>
    </main>
  );
}
