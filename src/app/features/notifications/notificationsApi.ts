import { getAuthState } from '../auth/auth';
import { getRoleHomePath } from '../auth/roleRedirects';
import type { Role } from '../../types';

const API_BASE = import.meta.env.VITE_API_URL ?? '/api/v1';

export type AppNotification = {
  id: number;
  type: string;
  message: string;
  read: boolean;
  createdAt: string;
  meta: Record<string, unknown>;
};

export type NotificationsResponse = {
  unreadCount: number;
  items: AppNotification[];
};

function headers(withJson = false): HeadersInit {
  const token = getAuthState().token;
  if (!token) throw new Error('Missing authenticated session token.');
  return {
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
    ...(withJson ? { 'Content-Type': 'application/json' } : {}),
  };
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}/${path}`, {
    ...options,
    headers: options?.headers ?? headers(Boolean(options?.body)),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(String(data?.message ?? 'Unable to complete notification request.'));
  }
  return data as T;
}

function titleCaseWords(value: string): string {
  return value
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(' ');
}

export function notificationCategoryLabel(type: string): string {
  switch (type) {
    case 'trainer_missed_workout':
      return 'Missed workout';
    case 'trainer_pain_alert':
      return 'Pain alert';
    case 'trainer_low_adherence':
      return 'Low adherence';
    case 'trainer_follow_up_due':
      return 'Regular follow-up';
    case 'trainer_new_client':
      return 'New client';
    case 'escalation':
      return 'Escalation';
    case 'workflow_sla_breach':
      return 'SLA breach';
    case 'appointment_no_show':
      return 'Appointment no-show';
    default:
      return titleCaseWords(type.replace(/[_-]+/g, ' '));
  }
}

export function getRoleNotificationsPath(role: Role): string {
  return `${getRoleHomePath(role)}/notifications`;
}

export async function getNotifications() {
  return request<NotificationsResponse>('notifications');
}

export async function updateNotification(id: number, read: boolean) {
  return (await request<{ notification: AppNotification }>(`notifications/${id}`, {
    method: 'PATCH',
    headers: headers(true),
    body: JSON.stringify({ read }),
  })).notification;
}
