import { clearAuthState, getAuthState, setAuthState, type AuthUser } from './auth';
import type { Role } from '../../types';

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api';

async function readJson(response: Response) {
  const contentType = response.headers.get('content-type') ?? '';
  if (contentType.includes('application/json')) {
    return response.json();
  }
  return null;
}

export async function loginRequest(email: string, password: string) {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const payload = await readJson(response);

  if (!response.ok) {
    const message = payload?.message ?? payload?.errors?.email?.[0] ?? 'Login failed.';
    throw new Error(message);
  }

  const token = payload.token as string;
  const user = payload.user as AuthUser;

  setAuthState(token, user);

  return user;
}

export async function registerRequest(name: string, email: string, password: string, role: Role = 'client') {
  const response = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ name, email, password, role }),
  });

  const payload = await readJson(response);

  if (!response.ok) {
    const message =
      payload?.message ??
      payload?.errors?.email?.[0] ??
      payload?.errors?.password?.[0] ??
      payload?.errors?.name?.[0] ??
      'Registration failed.';
    throw new Error(message);
  }

  const token = payload.token as string;
  const user = payload.user as AuthUser;

  setAuthState(token, user);

  return user;
}

export async function logoutRequest() {
  const state = getAuthState();

  if (state.token) {
    await fetch(`${API_BASE}/auth/logout`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${state.token}`,
      },
    });
  }

  clearAuthState();
}

export async function meRequest() {
  const state = getAuthState();

  if (!state.token) {
    throw new Error('Missing token');
  }

  const response = await fetch(`${API_BASE}/auth/me`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${state.token}`,
    },
  });

  const payload = await readJson(response);

  if (!response.ok) {
    clearAuthState();
    throw new Error(payload?.message ?? 'Session expired');
  }

  setAuthState(state.token, payload.user as AuthUser);

  return payload.user as AuthUser;
}
