import { mockAppointments } from '../../../data/mockAppointments';
import { mockAdminMetrics, mockUsageMetrics } from '../../../data/mockAnalytics';
import { mockPrograms } from '../../../data/mockPrograms';
import { mockRoles, mockTickets } from '../../../data/mockTickets';
import { mockUsers } from '../../../data/mockUsers';
import type { AppointmentSummary, DashboardMetric, ProgramSummary, Role, TicketSummary, UserSummary } from '../../types';
import { getAuthState } from '../../auth/auth';
import { resetDemoUserPassword } from '../../auth/demoAuthDirectory';
import { fetchAdminTrainerApplicationsFromApi } from '../../trainer/trainerApplicationsApi';
import type { TrainerApplicationRecord } from '../../trainer/trainerOnboarding';

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

function trainerUserStatus(status: TrainerApplicationRecord['status']): UserSummary['status'] {
  if (status === 'approved') return 'active';
  if (status === 'rejected') return 'suspended';
  return 'pending';
}

function mergeTrainerApplicationUsers(users: UserSummary[], trainerApplications: TrainerApplicationRecord[]) {
  if (!trainerApplications.length) return users;

  const applicationsByEmail = new Map(
    trainerApplications.map((application) => [application.applicantEmail.trim().toLowerCase(), application]),
  );

  const mergedUsers = users.map((user) => {
    const matchingApplication = applicationsByEmail.get(user.email.trim().toLowerCase());
    if (!matchingApplication || user.role !== 'trainer') return user;

    applicationsByEmail.delete(user.email.trim().toLowerCase());

    return {
      ...user,
      name: matchingApplication.applicantName,
      email: matchingApplication.applicantEmail,
      role: 'trainer' as const,
      status: trainerUserStatus(matchingApplication.status),
      joinedAt: matchingApplication.submittedAt.slice(0, 10),
    } satisfies UserSummary;
  });

  const derivedUsers = Array.from(applicationsByEmail.values()).map((application) => ({
    id: application.applicationId,
    name: application.applicantName,
    email: application.applicantEmail,
    role: 'trainer' as const,
    status: trainerUserStatus(application.status),
    joinedAt: application.submittedAt.slice(0, 10),
  }) satisfies UserSummary);

  return [...derivedUsers, ...mergedUsers];
}

export async function getAdminOverview() {
  try {
    return await fetchAdmin<AdminOverview>('overview');
  } catch {
    return fallbackOverview;
  }
}

export async function getAdminUsers() {
  try {
    const [data, trainerApplications] = await Promise.all([
      fetchAdmin<{ users: UserSummary[] }>('users'),
      fetchAdminTrainerApplicationsFromApi(),
    ]);
    return mergeTrainerApplicationUsers(data.users, trainerApplications);
  } catch {
    const trainerApplications = await fetchAdminTrainerApplicationsFromApi();
    return mergeTrainerApplicationUsers(mockUsers, trainerApplications);
  }
}

export async function adminResetUserPassword(user: UserSummary) {
  const isDatabaseUser = /^\d+$/.test(String(user.id));

  if (isDatabaseUser) {
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

    resetDemoUserPassword(user, 'password123');
    return String(data?.message ?? `Password reset for ${user.email}. New password: password123`);
  }

  resetDemoUserPassword(user, 'password123');
  return `Password reset locally for ${user.email}. This record is not in the database yet, so no server-side password was changed.`;
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
