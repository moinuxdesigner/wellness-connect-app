import { mockAppointments } from '../../../data/mockAppointments';
import { mockAdminMetrics, mockUsageMetrics } from '../../../data/mockAnalytics';
import { mockPrograms } from '../../../data/mockPrograms';
import { mockRoles, mockTickets } from '../../../data/mockTickets';
import { mockUsers } from '../../../data/mockUsers';
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

function authHeaders(): HeadersInit {
  const token = getAuthState().token;
  return {
    Accept: 'application/json',
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
  try {
    const data = await fetchAdmin<{ users: UserSummary[] }>('users');
    return data.users;
  } catch {
    return mockUsers;
  }
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
