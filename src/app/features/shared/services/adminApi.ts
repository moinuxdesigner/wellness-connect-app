import { mockAppointments } from '../../../data/mockAppointments';
import { mockAdminMetrics, mockUsageMetrics } from '../../../data/mockAnalytics';
import { mockPrograms } from '../../../data/mockPrograms';
import { mockRoles, mockTickets } from '../../../data/mockTickets';
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

const fallbackOverview: AdminOverview = {
  analytics: mockAdminMetrics,
  usage_metrics: mockUsageMetrics,
  role_distribution: mockRoles.map((item) => ({
    role: item.role,
    users: item.users,
    status: item.status,
  })),
  recent_escalations: mockTickets,
};

export async function getAdminOverview() {
  try {
    return await fetchAdmin<AdminOverview>('overview');
  } catch {
    return fallbackOverview;
  }
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

export async function getAdminPrograms() {
  try {
    const data = await fetchAdmin<{ programs: ProgramSummary[] }>('programs');
    return data.programs;
  } catch {
    return mockPrograms;
  }
}

export async function getAdminEscalations() {
  try {
    const data = await fetchAdmin<{ tickets: TicketSummary[] }>('escalations');
    return data.tickets;
  } catch {
    return mockTickets;
  }
}

export async function getAdminActivities() {
  try {
    const data = await fetchAdmin<{ activities: AppointmentSummary[] }>('activities');
    return data.activities;
  } catch {
    return mockAppointments;
  }
}
