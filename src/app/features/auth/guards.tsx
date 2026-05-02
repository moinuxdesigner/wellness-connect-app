import { Navigate, Outlet } from 'react-router';
import type { Role } from '../../types';
import { getAuthState } from './auth';

export function RequireAuth() {
  const auth = getAuthState();

  if (!auth.isAuthenticated || !auth.token || !auth.user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export function RequireRole({ allow }: { allow: Role[] }) {
  const auth = getAuthState();

  if (!auth.user?.role || !allow.includes(auth.user.role)) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
