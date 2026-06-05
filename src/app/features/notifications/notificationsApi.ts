import { getAuthState } from '../auth/auth';
import { getRoleHomePath } from '../auth/roleRedirects';
import type { Role } from '../../types';

const API_BASE = import.meta.env.VITE_API_URL ?? '/api/v1';
export const NOTIFICATION_UNREAD_COUNT_CHANGED = 'wc:notification-unread-count-changed';

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

export type NotificationMarkAllReadResponse = {
  message: string;
  updatedCount: number;
  unreadCount: number;
};

export type CounsellorNotificationCategory = 'sessions' | 'clients' | 'cbt_care' | 'urgent' | 'system';
export type CounsellorNotificationPriority = 'critical' | 'high' | 'medium' | 'low';

export type CounsellorNotificationSummary = {
  unread: number;
  clientActivity: number;
  todaysReminders: number;
  urgentAlerts: number;
};

export type CounsellorNotificationItem = {
  id: string;
  source: string;
  notificationId: number | null;
  category: CounsellorNotificationCategory;
  priority: CounsellorNotificationPriority;
  title: string;
  message: string;
  clientName: string | null;
  clientId: number | null;
  relatedId: number | string | null;
  read: boolean;
  createdAt: string | null;
  actionLabel: string;
  actionRoute: string | null;
};

export type CounsellorNotificationsResponse = {
  summary: CounsellorNotificationSummary;
  items: CounsellorNotificationItem[];
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

export async function getCounsellorNotifications() {
  return request<CounsellorNotificationsResponse>('counsellor/notifications');
}

export async function markAllNotificationsRead() {
  return request<NotificationMarkAllReadResponse>('notifications/mark-all-read', {
    method: 'PATCH',
    headers: headers(),
  });
}

export async function updateNotification(id: number, read: boolean) {
  return (await request<{ notification: AppNotification }>(`notifications/${id}`, {
    method: 'PATCH',
    headers: headers(true),
    body: JSON.stringify({ read }),
  })).notification;
}

export function notifyUnreadCountChanged() {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new Event(NOTIFICATION_UNREAD_COUNT_CHANGED));
}
