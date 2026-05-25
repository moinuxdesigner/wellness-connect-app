import { clearAuthState, getAuthState, setAuthState, type AuthUser } from '../../auth/auth';
import { findDemoAuthUser, upsertDemoAuthUser } from '../../auth/demoAuthDirectory';

const API_BASE = import.meta.env.VITE_API_URL ?? '/api/v1';

export interface ClientAppointment {
  id: number;
  client_user_id: number;
  practitioner_id: number;
  intake_flow_id?: number | null;
  service_type: 'psychology' | 'training' | 'combined' | 'package';
  mode: 'online' | 'in_person' | 'hybrid';
  starts_at: string;
  ends_at: string;
  status: 'scheduled' | 'rescheduled' | 'cancelled' | 'completed' | 'no_show';
  cancel_reason?: string | null;
  reschedule_count: number;
}

export interface IntakeFlow {
  id: number;
  service_type: 'psychology' | 'training' | 'combined' | 'package';
  current_step: 'service' | 'intake' | 'schedule' | 'confirm';
  status: 'draft' | 'submitted' | 'under_review' | 'auto_bookable' | 'booked' | 'closed';
  risk_level?: 'low' | 'medium' | 'high' | null;
}

export interface PractitionerItem {
  id: number;
  name: string;
  type: 'counsellor' | 'trainer' | 'coach';
  rating?: number;
  specialties: string[];
}

export interface SlotItem {
  id: number;
  starts_at: string;
  ends_at: string;
  slot_status: 'open' | 'held' | 'booked' | 'blocked';
}

async function readJson(response: Response) {
  const contentType = response.headers.get('content-type') ?? '';
  if (contentType.includes('application/json')) {
    return response.json();
  }
  return null;
}

function authHeaders(token: string, withJson = false): HeadersInit {
  return {
    ...(withJson ? { 'Content-Type': 'application/json' } : {}),
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

function getToken() {
  const token = getAuthState().token;
  if (!token) throw new Error('Missing token');
  return token;
}

function mergeUserProfile(user: AuthUser, profile?: { primary_goal?: AuthUser['primary_goal'] | null } | null): AuthUser {
  return {
    ...user,
    primary_goal: profile?.primary_goal ?? user.primary_goal ?? null,
    wellness_goal: profile?.primary_goal ?? user.wellness_goal ?? null,
  };
}

export async function registerRequest(payload: {
  name: string;
  email: string;
  password: string;
  role?: string;
  phone?: string;
  primary_goal?: 'fitness' | 'mental_health' | 'both';
  consent_to_terms?: boolean;
}) {
  let response: Response;

  try {
    response = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch {
    const demoUser: AuthUser = {
      id: Date.now(),
      name: payload.name,
      email: payload.email,
      role: 'client',
      status: 'active',
      primary_goal: payload.primary_goal ?? null,
      wellness_goal: payload.primary_goal ?? null,
      consent_to_terms: payload.consent_to_terms,
      phone: payload.phone ?? null,
    };

    upsertDemoAuthUser({
      id: demoUser.id,
      name: demoUser.name,
      email: demoUser.email,
      role: demoUser.role,
      status: 'active',
    }, payload.password);
    setAuthState(`demo-token-${demoUser.id}`, demoUser);
    return demoUser;
  }

  const data = await readJson(response);
  if (!response.ok) throw new Error(String(data?.message ?? 'Registration failed'));
  const mergedUser = mergeUserProfile(data.user as AuthUser, data.profile);
  upsertDemoAuthUser({
    id: mergedUser.id,
    name: mergedUser.name,
    email: mergedUser.email,
    role: mergedUser.role,
    status: mergedUser.status ?? 'active',
  }, payload.password);
  setAuthState(data.token as string, mergedUser);
  return mergedUser;
}

export async function loginRequest(email: string, password: string) {
  let response: Response;

  try {
    response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ email, password }),
    });
  } catch (error) {
    const demoUser = findDemoAuthUser(email, password);
    if (demoUser) {
      setAuthState(`demo-token-${demoUser.id}`, demoUser);
      return demoUser;
    }

    throw error instanceof Error ? error : new Error('Login failed');
  }

  const data = await readJson(response);
  if (!response.ok) throw new Error(String(data?.message ?? 'Login failed'));

  const mergedUser = mergeUserProfile(data.user as AuthUser, data.profile);
  upsertDemoAuthUser({
    id: mergedUser.id,
    name: mergedUser.name,
    email: mergedUser.email,
    role: mergedUser.role,
    status: mergedUser.status ?? 'active',
  }, password);
  setAuthState(data.token as string, mergedUser);
  return mergedUser;
}

export async function forgotPasswordRequest(email: string) {
  const response = await fetch(`${API_BASE}/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ email }),
  });
  const data = await readJson(response);
  if (!response.ok) throw new Error(String(data?.message ?? 'Unable to send password reset link'));
  return String(data?.message ?? 'Password reset link sent to your email.');
}

export async function resetPasswordRequest(payload: { email: string; token: string; password: string; password_confirmation: string }) {
  const response = await fetch(`${API_BASE}/auth/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await readJson(response);
  if (!response.ok) throw new Error(String(data?.message ?? 'Unable to reset password'));
  return String(data?.message ?? 'Password reset successful.');
}

export async function changePasswordRequest(payload: { current_password: string; password: string; password_confirmation: string }) {
  const token = getToken();
  const response = await fetch(`${API_BASE}/auth/change-password`, {
    method: 'POST',
    headers: authHeaders(token, true),
    body: JSON.stringify(payload),
  });
  const data = await readJson(response);
  if (!response.ok) throw new Error(String(data?.message ?? 'Unable to change password'));

  if (typeof data?.token === 'string' && data.user) {
    const mergedUser = mergeUserProfile(data.user as AuthUser, data.profile);
    setAuthState(data.token, mergedUser);
  }

  return String(data?.message ?? 'Password updated successfully.');
}

export async function meRequest() {
  const token = getToken();
  const response = await fetch(`${API_BASE}/auth/me`, { headers: authHeaders(token) });
  const data = await readJson(response);
  if (!response.ok) {
    clearAuthState();
    throw new Error('Session expired');
  }
  const mergedUser = mergeUserProfile(data.user as AuthUser, data.profile);
  setAuthState(token, mergedUser);
  return mergedUser;
}

export async function logoutRequest() {
  const token = getAuthState().token;
  if (token) {
    await fetch(`${API_BASE}/auth/logout`, { method: 'POST', headers: authHeaders(token) });
  }
  clearAuthState();
}

export async function updateProfileRequest(payload: { name: string; phone?: string; primary_goal?: 'fitness' | 'mental_health' | 'both'; timezone?: string; preferred_language?: string; consent_to_terms: boolean }) {
  const token = getToken();
  const response = await fetch(`${API_BASE}/client/profile`, {
    method: 'PUT',
    headers: authHeaders(token, true),
    body: JSON.stringify(payload),
  });
  const data = await readJson(response);
  if (!response.ok) throw new Error(String(data?.message ?? 'Profile update failed'));
  setAuthState(token, mergeUserProfile(data.user as AuthUser, data.profile));
  return data;
}

export async function createIntakeFlow(service_type: 'psychology' | 'training' | 'combined' | 'package') {
  const token = getToken();
  const response = await fetch(`${API_BASE}/intake-flows`, {
    method: 'POST',
    headers: authHeaders(token, true),
    body: JSON.stringify({ service_type }),
  });
  const data = await readJson(response);
  if (!response.ok) throw new Error(String(data?.message ?? 'Unable to create intake flow'));
  return data as { intake_flow_id: number; service_type: string; current_step: string; status: string };
}

export async function getIntakeFlow(flowId: number) {
  const token = getToken();
  const response = await fetch(`${API_BASE}/intake-flows/${flowId}`, { headers: authHeaders(token) });
  const data = await readJson(response);
  if (!response.ok) throw new Error(String(data?.message ?? 'Unable to fetch intake flow'));
  return data as IntakeFlow & { answers: { question_key: string; answer_json: unknown }[] };
}

export async function saveIntakeAnswers(flowId: number, answers: { section_key: string; question_key: string; answer_type: string; answer_json: unknown }[]) {
  const token = getToken();
  const response = await fetch(`${API_BASE}/intake-flows/${flowId}/intake`, {
    method: 'PUT',
    headers: authHeaders(token, true),
    body: JSON.stringify({ answers }),
  });
  const data = await readJson(response);
  if (!response.ok) throw new Error(String(data?.message ?? 'Unable to save intake answers'));
  return data;
}

export async function submitIntakeFlow(flowId: number) {
  const token = getToken();
  const response = await fetch(`${API_BASE}/intake-flows/${flowId}/submit`, { method: 'POST', headers: authHeaders(token) });
  const data = await readJson(response);
  if (!response.ok) throw new Error(String(data?.message ?? 'Unable to submit intake flow'));
  return data as { id: number; status: IntakeFlow['status']; current_step: IntakeFlow['current_step']; review_eta_hours?: number | null };
}

export async function getRecommendedPractitioners(flowId: number) {
  const token = getToken();
  const response = await fetch(`${API_BASE}/intake-flows/${flowId}/recommended-practitioners`, { headers: authHeaders(token) });
  const data = await readJson(response);
  if (!response.ok) throw new Error(String(data?.message ?? 'Unable to fetch practitioners'));
  return (data.practitioners ?? []) as PractitionerItem[];
}

export async function getPractitionerSlots(practitionerId: number, from?: string, to?: string) {
  const token = getToken();
  const params = new URLSearchParams();
  if (from) params.set('from', from);
  if (to) params.set('to', to);
  const response = await fetch(`${API_BASE}/practitioners/${practitionerId}/slots?${params.toString()}`, { headers: authHeaders(token) });
  const data = await readJson(response);
  if (!response.ok) throw new Error(String(data?.message ?? 'Unable to fetch slots'));
  return (data.slots ?? []) as SlotItem[];
}

export async function bookAppointmentRequest(payload: { intake_flow_id?: number; practitioner_id: number; slot_id: number; service_type: 'psychology' | 'training' | 'combined' | 'package'; mode: 'online' | 'in_person' | 'hybrid' }) {
  const token = getToken();
  const response = await fetch(`${API_BASE}/appointments`, {
    method: 'POST',
    headers: authHeaders(token, true),
    body: JSON.stringify(payload),
  });
  const data = await readJson(response);
  if (!response.ok) throw new Error(String(data?.message ?? 'Unable to book appointment'));
  return data.appointment as ClientAppointment;
}

export async function getClientAppointmentsRequest() {
  const token = getToken();
  const response = await fetch(`${API_BASE}/client/appointments`, { headers: authHeaders(token) });
  const data = await readJson(response);
  if (!response.ok) throw new Error(String(data?.message ?? 'Unable to fetch appointments'));
  return (data.appointments ?? []) as ClientAppointment[];
}

export async function rescheduleAppointmentRequest(id: number, slot_id: number) {
  const token = getToken();
  const response = await fetch(`${API_BASE}/appointments/${id}/reschedule`, {
    method: 'PUT',
    headers: authHeaders(token, true),
    body: JSON.stringify({ slot_id }),
  });
  const data = await readJson(response);
  if (!response.ok) throw new Error(String(data?.message ?? 'Unable to reschedule appointment'));
  return data.appointment as ClientAppointment;
}

export async function cancelAppointmentRequest(id: number, reason?: string) {
  const token = getToken();
  const response = await fetch(`${API_BASE}/appointments/${id}/cancel`, {
    method: 'POST',
    headers: authHeaders(token, true),
    body: JSON.stringify({ reason }),
  });
  const data = await readJson(response);
  if (!response.ok) throw new Error(String(data?.message ?? 'Unable to cancel appointment'));
  return data.appointment as ClientAppointment;
}

export async function getIntakeConfirmation(flowId: number) {
  const token = getToken();
  const response = await fetch(`${API_BASE}/intake-flows/${flowId}/confirmation`, { headers: authHeaders(token) });
  const data = await readJson(response);
  if (!response.ok) throw new Error(String(data?.message ?? 'Unable to fetch confirmation'));
  return data;
}
