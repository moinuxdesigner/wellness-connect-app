import { getAuthState } from '../auth/auth';
import type { AppNotification } from '../notifications/notificationsApi';

const API_BASE = import.meta.env.VITE_API_URL ?? '/api/v1';

export type TrainerClient = { id: number; name: string; email: string; eligibleForPlan: boolean; avatarUrl?: string | null; avatar_url?: string | null };
export type TrainerActivity = { id: number; title: string; activityType: string; scheduledFor: string; status: 'scheduled' | 'completed' | 'missed' | 'modified' | 'cancelled'; notes?: string | null };
export type TrainerPlan = {
  id: number;
  clientUserId: number;
  clientName: string;
  clientEmail: string;
  clientAvatarUrl?: string | null;
  goalTitle: string;
  goalDescription?: string | null;
  startsOn: string;
  targetDate?: string | null;
  status: 'active' | 'completed' | 'paused' | 'archived';
  weeklyAdherence: number | null;
  latestProgress: number | null;
  activities: TrainerActivity[];
};
export type TrainerCheckIn = {
  id: number;
  planId: number;
  planTitle: string;
  clientName: string;
  clientAvatarUrl?: string | null;
  checkedInOn: string;
  weightKg: number | null;
  goalProgressPercent: number;
  notes?: string | null;
  painReported: boolean;
  painSeverity?: 'mild' | 'moderate' | 'severe' | null;
  painNotes?: string | null;
};
export type TrainerScheduleItem = {
  id: string;
  sourceId: number;
  type: 'session' | 'call' | 'follow_up';
  title: string;
  clientName?: string | null;
  clientAvatarUrl?: string | null;
  startsAt: string;
  endsAt: string;
  status: string;
  locationMode?: 'online' | 'in_person' | 'hybrid' | null;
  notes?: string | null;
};
export type TrainerAlert = {
  id: number;
  type: 'pain_injury' | 'low_adherence' | 'follow_up_due';
  priority: 'high' | 'medium' | 'low';
  status: 'open' | 'acknowledged' | 'scheduled_follow_up' | 'escalated' | 'resolved';
  summary: string;
  clientName?: string | null;
  clientAvatarUrl?: string | null;
  dueAt?: string | null;
};
export type TrainerNotification = AppNotification;
export type ProgressReviewLanding = { clientId: number | null };
export type ProgressReviewClient = {
  id: number;
  name: string;
  email: string;
  status: string;
  age: number | null;
  gender: string | null;
  avatarUrl?: string | null;
  avatar_url?: string | null;
};
export type ProgressOverview = {
  overallProgressPercent: number;
  overallTrendPercent: number;
  weightChangeKg: number | null;
  attendanceCompleted: number;
  attendanceTotal: number;
  workoutAdherencePercent: number | null;
  workoutAdherenceTrendPercent: number;
};
export type ProgressTrendPoint = {
  label: string;
  date: string;
  performanceScore: number | null;
};
export type BodyMetricWeight = {
  start: number | null;
  current: number | null;
  change: number | null;
};
export type CompletedWorkoutPoint = {
  label: string;
  count: number;
};
export type ProgressReviewPayload = {
  client: ProgressReviewClient;
  overview: ProgressOverview;
  progressTrend: ProgressTrendPoint[];
  bodyMetrics: { weight: BodyMetricWeight };
  completedWorkouts: CompletedWorkoutPoint[];
  activePlan: { id: number; goalTitle: string; status: TrainerPlan['status'] } | null;
  notificationUnreadCount: number;
};
export type MessageAttachment = {
  name: string;
  type: string;
  sizeBytes: number;
};
export type ProgressThreadMessage = {
  id: number;
  body: string;
  createdAt: string;
  sender: { id: number; name: string; role: string; avatarUrl?: string | null; avatar_url?: string | null };
  attachment: MessageAttachment | null;
};
export type TrainerNextAction = {
  id: string;
  kind: 'review_high_risk' | 'complete_follow_up' | 'resolve_low_adherence' | 'log_check_in' | 'create_plan';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  count?: number;
  to: '/trainer' | '/trainer/plans' | '/trainer/check-ins';
  ctaLabel: string;
};
export type TrainerDashboard = {
  snapshot: { todaySessions: number; upcomingSessions: number; activeClients: number; pendingFollowUps: number; highPriorityAlerts: number; highRiskClients: number; lowAdherenceClients: number };
  nextActions: TrainerNextAction[];
  dailySchedule: TrainerScheduleItem[];
  notifications: { unreadCount: number; items: TrainerNotification[] };
  priorityQueue: TrainerAlert[];
  analytics: {
    labels: string[];
    attendance: { completed: number[]; missed: number[] };
    adherence: Array<number | null>;
    goalProgress: Array<number | null>;
    weightSeries: Array<{ clientId: number; clientName: string; points: Array<{ date: string; weightKg: number }> }>;
    weeklyPerformance: {
      completedSessions: { current: number; previous: number };
      averageAdherence: { current: number | null; previous: number | null };
      clientHours: { current: number; previous: number };
    };
  };
};

function headers(withJson = false): HeadersInit {
  const token = getAuthState().token;
  if (!token) throw new Error('Missing trainer session token.');
  return { Accept: 'application/json', Authorization: `Bearer ${token}`, ...(withJson ? { 'Content-Type': 'application/json' } : {}) };
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}/trainer/${path}`, { ...options, headers: options?.headers ?? headers(Boolean(options?.body)) });
  const data = await response.json();
  if (!response.ok) throw new Error(String(data?.message ?? 'Unable to complete trainer workspace request.'));
  return data as T;
}

export async function getTrainerDashboard() { return request<TrainerDashboard>('dashboard'); }
export async function getTrainerClients() { return (await request<{ clients: TrainerClient[] }>('clients')).clients; }
export async function getTrainerProgressReviewLanding() { return request<ProgressReviewLanding>('progress-review'); }
export async function getTrainerProgressReview(clientId: number) { return request<ProgressReviewPayload>(`clients/${clientId}/progress-review`); }
export async function getTrainerProgressMessages(clientId: number) { return (await request<{ threadId: number | null; messages: ProgressThreadMessage[] }>(`clients/${clientId}/messages`)); }
export async function sendTrainerProgressMessage(clientId: number, payload: { body?: string; attachment?: MessageAttachment | null }) {
  return (await request<{ threadMessage: ProgressThreadMessage }>(`clients/${clientId}/messages`, {
    method: 'POST',
    headers: headers(true),
    body: JSON.stringify({
      body: payload.body ?? '',
      attachment: payload.attachment ?? undefined,
    }),
  })).threadMessage;
}
export async function getTrainerPlans() { return (await request<{ plans: TrainerPlan[] }>('plans')).plans; }
export async function createTrainerPlan(payload: { clientUserId: number; goalTitle: string; goalDescription?: string; startsOn: string; targetDate?: string }) {
  return (await request<{ plan: TrainerPlan }>('plans', { method: 'POST', headers: headers(true), body: JSON.stringify(payload) })).plan;
}
export async function updateTrainerPlan(id: number, payload: Partial<{ goalTitle: string; goalDescription: string; targetDate: string | null; status: TrainerPlan['status'] }>) {
  return (await request<{ plan: TrainerPlan }>(`plans/${id}`, { method: 'PUT', headers: headers(true), body: JSON.stringify(payload) })).plan;
}
export async function createTrainerActivity(planId: number, payload: { title: string; activityType?: string; scheduledFor: string; notes?: string }) {
  return (await request<{ activity: TrainerActivity }>(`plans/${planId}/activities`, { method: 'POST', headers: headers(true), body: JSON.stringify(payload) })).activity;
}
export async function updateTrainerActivity(id: number, payload: { status: TrainerActivity['status']; notes?: string }) {
  return (await request<{ activity: TrainerActivity }>(`activities/${id}`, { method: 'PATCH', headers: headers(true), body: JSON.stringify(payload) })).activity;
}
export async function getTrainerCheckIns() { return (await request<{ checkIns: TrainerCheckIn[] }>('check-ins')).checkIns; }
export async function createTrainerCheckIn(payload: {
  planId: number; checkedInOn: string; weightKg?: number; goalProgressPercent: number; notes?: string; painReported: boolean;
  painSeverity?: 'mild' | 'moderate' | 'severe'; painNotes?: string; activityUpdates?: Array<{ id: number; status: TrainerActivity['status'] }>;
}) {
  return (await request<{ checkIn: TrainerCheckIn }>('check-ins', { method: 'POST', headers: headers(true), body: JSON.stringify(payload) })).checkIn;
}
export async function createTrainerTask(payload: { clientUserId?: number; planId?: number; alertId?: number; type: 'call' | 'follow_up'; title: string; startsAt: string; endsAt: string; notes?: string }) {
  return (await request<{ task: TrainerScheduleItem }>('tasks', { method: 'POST', headers: headers(true), body: JSON.stringify(payload) })).task;
}
export async function updateTrainerTask(id: number, payload: { status?: 'scheduled' | 'completed' | 'cancelled'; startsAt?: string; endsAt?: string; notes?: string }) {
  return (await request<{ task: TrainerScheduleItem }>(`tasks/${id}`, { method: 'PATCH', headers: headers(true), body: JSON.stringify(payload) })).task;
}
export async function updateTrainerAlert(id: number, action: 'acknowledge' | 'resolve' | 'escalate', note?: string) {
  return (await request<{ alert: TrainerAlert }>(`alerts/${id}`, { method: 'PATCH', headers: headers(true), body: JSON.stringify({ action, note }) })).alert;
}
export async function updateTrainerNotification(id: number, read: boolean) {
  return (await request<{ notification: TrainerNotification }>(`notifications/${id}`, { method: 'PATCH', headers: headers(true), body: JSON.stringify({ read }) })).notification;
}
