import { mockAppointments } from '../../../data/mockAppointments';
import type { AppointmentSummary, DashboardMetric, ProgramSummary, Role, TicketSummary, UserSummary } from '../../types';
import { getAuthState } from '../../auth/auth';

const API_BASE = import.meta.env.VITE_API_URL ?? '/api/v1';

type RoleDistributionItem = {
  role: Role;
  users: number;
  status: 'healthy' | 'attention' | 'needs-review';
};

type AdminOverview = {
  analytics: DashboardMetric[];
  usage_metrics: DashboardMetric[];
  role_distribution: RoleDistributionItem[];
  recent_escalations: TicketSummary[];
};

export type RoleChangeAudit = {
  id: string;
  actorName: string;
  actorEmail: string;
  targetUserId: string;
  targetName: string;
  targetEmail: string;
  previousRole: Role;
  newRole: Role;
  reason: string;
  changedAt: string | null;
};

export type PermissionItem = {
  key: string;
  module: string;
  label: string;
  action: string;
  sortOrder: number;
  configurable: boolean;
  available: boolean;
};

export type PermissionChangeAudit = {
  id: string;
  actorName: string;
  actorEmail: string;
  targetRole: Role;
  reason: string;
  addedPermissions: string[];
  removedPermissions: string[];
  changedAt: string | null;
};

export type PermissionMatrixResponse = {
  roles: Role[];
  permissions: PermissionItem[];
  grants: Partial<Record<Role, string[]>>;
  audits: PermissionChangeAudit[];
};

function authHeaders(token = getAuthState().token, withJson = false): HeadersInit {
  return {
    Accept: 'application/json',
    ...(withJson ? { 'Content-Type': 'application/json' } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function readJson(response: Response) {
  const contentType = response.headers.get('content-type') ?? '';
  if (contentType.includes('application/json')) return response.json();
  return null;
}

async function fetchAdmin<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE}/admin/${path}`, {
    method: 'GET',
    headers: authHeaders(),
  });

  const data = await readJson(response);
  if (!response.ok) {
    throw new Error(String(data?.message ?? 'Unable to fetch admin data'));
  }

  return data as T;
}

export async function getAdminOverview() {
  return fetchAdmin<AdminOverview>('overview');
}

export async function getAdminUsers() {
  const data = await fetchAdmin<{ users: UserSummary[] }>('users');
  return data.users;
}

export async function adminResetUserPassword(user: UserSummary) {
  if (!/^\d+$/.test(String(user.id))) {
    throw new Error('Password reset is available only for registered database users.');
  }

  const token = getAuthState().token;
  if (!token) throw new Error('Missing admin session token.');

  const response = await fetch(`${API_BASE}/admin/users/${user.id}/reset-password`, {
    method: 'POST',
    headers: authHeaders(token, true),
    body: JSON.stringify({}),
  });

  const data = await readJson(response);
  if (!response.ok) {
    throw new Error(String(data?.message ?? 'Unable to reset password in database.'));
  }

  return String(data?.message ?? `Password reset for ${user.email}. New password: password123`);
}

export async function getAdminRoleChanges() {
  const data = await fetchAdmin<{ roleChanges: RoleChangeAudit[] }>('role-changes');
  return data.roleChanges;
}

export async function adminUpdateUserRole(userId: string, role: Role, reason: string) {
  const token = getAuthState().token;
  if (!token) throw new Error('Missing admin session token.');

  const response = await fetch(`${API_BASE}/admin/users/${userId}/role`, {
    method: 'PATCH',
    headers: authHeaders(token, true),
    body: JSON.stringify({ role, reason }),
  });

  const data = await readJson(response);
  if (!response.ok) {
    throw new Error(String(data?.message ?? 'Unable to update user role.'));
  }

  return data as { message: string; user: UserSummary; roleChange: RoleChangeAudit };
}

export async function getAdminPermissionMatrix() {
  return fetchAdmin<PermissionMatrixResponse>('permissions');
}

export async function adminUpdatePermissions(role: Role, permissions: string[], reason: string) {
  const token = getAuthState().token;
  if (!token) throw new Error('Missing admin session token.');

  const response = await fetch(`${API_BASE}/admin/permissions/${role}`, {
    method: 'PUT',
    headers: authHeaders(token, true),
    body: JSON.stringify({ permissions, reason }),
  });
  const data = await readJson(response);
  if (!response.ok) throw new Error(String(data?.message ?? 'Unable to update permissions.'));
  return data as { message: string; role: Role; permissions: string[]; audit: PermissionChangeAudit };
}

export async function getAdminPrograms() {
  const data = await fetchAdmin<{ programs: ProgramSummary[] }>('programs');
  return data.programs;
}

export async function getAdminEscalations() {
  const data = await fetchAdmin<{ tickets: TicketSummary[] }>('escalations');
  return data.tickets;
}

export async function getAdminActivities() {
  try {
    const data = await fetchAdmin<{ activities: AppointmentSummary[] }>('activities');
    return data.activities;
  } catch {
    return mockAppointments;
  }
}
