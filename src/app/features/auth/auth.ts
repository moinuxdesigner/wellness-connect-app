import type { Role } from '../../types';

const AUTH_KEY = 'wc_auth';
export const AUTH_STATE_CHANGED_EVENT = 'wellness-connect:auth-state-changed';

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: Role;
  phone?: string | null;
  avatarUrl?: string | null;
  avatar_url?: string | null;
  profilePhotoUrl?: string | null;
  wellness_goal?: string | null;
  primary_goal?: 'fitness' | 'mental_health' | 'both' | null;
  dob?: string | null;
  age?: number | null;
  gender?: string | null;
  occupation?: string | null;
  consent_to_terms?: boolean;
  status?: 'active' | 'pending' | 'suspended';
  requires_client_intake?: boolean;
  permissions?: string[];
}

export interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  user: AuthUser | null;
}

// NOTE: Token is stored in localStorage for PWA offline support.
// Ensure all API calls use HTTPS and Content-Security-Policy headers
// are set server-side to mitigate XSS risk.
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
  window.dispatchEvent(new Event(AUTH_STATE_CHANGED_EVENT));
}

export function clearAuthState(): void {
  localStorage.removeItem(AUTH_KEY);
  window.dispatchEvent(new Event(AUTH_STATE_CHANGED_EVENT));
}
