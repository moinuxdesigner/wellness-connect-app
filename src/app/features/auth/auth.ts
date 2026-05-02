import type { Role } from '../../types';

const AUTH_KEY = 'wc_auth';

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: Role;
}

export interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  user: AuthUser | null;
}

export function getAuthState(): AuthState {
  const raw = localStorage.getItem(AUTH_KEY);

  if (!raw) {
    return { isAuthenticated: false, token: null, user: null };
  }

  try {
    const parsed = JSON.parse(raw) as AuthState;

    if (!parsed.token || !parsed.user) {
      return { isAuthenticated: false, token: null, user: null };
    }

    return { isAuthenticated: true, token: parsed.token, user: parsed.user };
  } catch {
    return { isAuthenticated: false, token: null, user: null };
  }
}

export function setAuthState(token: string, user: AuthUser): void {
  localStorage.setItem(
    AUTH_KEY,
    JSON.stringify({
      isAuthenticated: true,
      token,
      user,
    }),
  );
}

export function clearAuthState(): void {
  localStorage.removeItem(AUTH_KEY);
}
