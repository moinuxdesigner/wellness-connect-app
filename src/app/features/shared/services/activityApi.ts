import { getAuthState } from '../../auth/auth';
import type { ActivityLogActorOption, ActivityLogEntry, ActivityLogPagination, ActivityLogSummary, Role } from '../../../types';

const API_BASE = import.meta.env.VITE_API_URL ?? '/api/v1';

type ActivityLogResponse = {
  entries: ActivityLogEntry[];
  pagination: ActivityLogPagination;
  availableCategories: string[];
  availableActors: ActivityLogActorOption[];
  summary: ActivityLogSummary;
};

export type ActivityLogFilters = {
  category?: string;
  subjectType?: string;
  query?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  pageSize?: number;
  role?: Role;
  actorUserId?: string;
  targetRole?: Role;
};

function authHeaders(): HeadersInit {
  const token = getAuthState().token;

  return {
    Accept: 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

function buildQuery(filters: ActivityLogFilters) {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value === undefined || value === '' || value === null) return;
    params.set(key, String(value));
  });

  const query = params.toString();
  return query ? `?${query}` : '';
}

async function readJson(response: Response) {
  const contentType = response.headers.get('content-type') ?? '';
  if (contentType.includes('application/json')) return response.json();
  return null;
}

export async function getActivityLogs(filters: ActivityLogFilters = {}): Promise<ActivityLogResponse> {
  const response = await fetch(`${API_BASE}/activity-logs${buildQuery(filters)}`, {
    method: 'GET',
    headers: authHeaders(),
  });

  const data = await readJson(response);
  if (!response.ok) {
    throw new Error(String(data?.message ?? 'Unable to load activity logs.'));
  }

  return {
    entries: (data?.entries ?? []) as ActivityLogEntry[],
    pagination: (data?.pagination ?? {
      page: 1,
      pageSize: 20,
      total: 0,
      totalPages: 1,
    }) as ActivityLogPagination,
    availableCategories: (data?.availableCategories ?? []) as string[],
    availableActors: (data?.availableActors ?? []) as ActivityLogActorOption[],
    summary: (data?.summary ?? {
      totalActivities: 0,
      todayActivities: 0,
      admins: 0,
      usersAffected: 0,
      criticalActions: 0,
    }) as ActivityLogSummary,
  };
}
