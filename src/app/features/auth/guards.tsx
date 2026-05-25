import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router';
import type { Role } from '../../types';
import { clearAuthState, getAuthState } from './auth';
import { meRequest } from './apiAuth';
import { getRoleHomePath } from './roleRedirects';

export function RequireAuth() {
  const auth = getAuthState();
  const [state, setState] = useState<'checking' | 'ready' | 'invalid'>(() => (
    auth.isAuthenticated && auth.token && auth.user ? 'checking' : 'invalid'
  ));

  useEffect(() => {
    let active = true;

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
  }, [auth.token]);

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
