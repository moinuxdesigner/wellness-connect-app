import type { ActivityLogEntry } from '../../types';
import type { TrainerAlert, TrainerDashboard, TrainerScheduleItem } from './trainerWorkspaceApi';
import {
  mockCaloriesTracked,
  mockCompactFocus,
  mockCompactPriorityItems,
  mockUpcomingRenewals,
  type TrainerRenewalDisplay,
} from './mockTrainerDashboardData';

export type DashboardStatTone = 'purple' | 'green' | 'orange';
export type DashboardStatIcon = 'calendar' | 'users' | 'clipboard' | 'shield';

export type DashboardStatDisplay = {
  title: string;
  value: string;
  supportingText: string;
  positive?: boolean;
  tone: DashboardStatTone;
  icon: DashboardStatIcon;
};

export type ScheduleRowDisplay = {
  id: string;
  time: string;
  clientName: string;
  avatarUrl?: string | null;
  sessionType: string;
  location: string;
  status: string;
  statusTone: 'success' | 'warning' | 'neutral';
};

export type AlertDisplay = {
  id: number;
  label: string;
  clientName: string;
  summary: string;
  timeLabel: string;
  tone: 'danger' | 'warning' | 'purple';
  kind: TrainerAlert['type'];
};

export type ActivityDisplay = {
  id: number;
  summary: string;
  timeLabel: string;
  avatarUrl?: string | null;
};

export type PerformanceStatDisplay = {
  label: string;
  value: string;
  trend: string;
  tone: DashboardStatTone;
  icon: DashboardStatIcon | 'clock' | 'flame';
};

export type CompactFocusDisplay = {
  sessions: number;
  followUps: number;
  dailyGoalPercent: number;
  message: string;
};

export type CompactPriorityActionDisplay = {
  id: string;
  value: string;
  label: string;
  supportingText: string;
  tone: 'orange' | 'green' | 'purple' | 'blue';
  icon: 'follow_up' | 'programs' | 'messages' | 'client';
  to?: '/trainer/plans' | '/trainer/check-ins' | '/trainer/notifications';
};

export type TrainerDashboardViewModel = {
  stats: DashboardStatDisplay[];
  schedule: ScheduleRowDisplay[];
  alerts: AlertDisplay[];
  activities: ActivityDisplay[];
  renewals: TrainerRenewalDisplay[];
  performance: PerformanceStatDisplay[];
  chart: Array<{ label: string; sessions: number }>;
  compact: {
    focus: CompactFocusDisplay;
    priorityActions: CompactPriorityActionDisplay[];
  };
};

export function coachGreetingName(name?: string | null): string {
  const trimmed = name?.trim() ?? '';
  if (!trimmed || /\b(onboarding|trainer|test|demo)\b/i.test(trimmed)) return 'Coach';
  if (/^coach\b/i.test(trimmed)) {
    const firstName = trimmed.split(/\s+/)[1];
    return firstName ? `Coach ${firstName}` : 'Coach';
  }
  return `Coach ${trimmed.split(/\s+/)[0]}`;
}

function relativeTime(value?: string | null): string {
  if (!value) return 'Recently';
  const difference = Date.now() - new Date(value).getTime();
  if (!Number.isFinite(difference) || difference < 0) return 'Recently';
  const hours = Math.max(1, Math.round(difference / (60 * 60 * 1000)));
  return hours < 24 ? `${hours}h ago` : `${Math.round(hours / 24)}d ago`;
}

function percentTrend(current: number | null, previous: number | null): string {
  if (current === null || previous === null) return 'Live this week';
  if (previous === 0) return current > 0 ? 'New this week' : 'No change';
  const change = Math.round(((current - previous) / previous) * 100);
  return `${change >= 0 ? '\u2191' : '\u2193'} ${Math.abs(change)}% vs last week`;
}

function statusDisplay(status: string): { label: string; tone: ScheduleRowDisplay['statusTone'] } {
  if (status === 'scheduled' || status === 'rescheduled') return { label: 'Confirmed', tone: 'success' };
  if (status === 'completed') return { label: 'Completed', tone: 'success' };
  if (status === 'no_show' || status === 'cancelled') return { label: status === 'no_show' ? 'Missed' : 'Cancelled', tone: 'warning' };
  return { label: status, tone: 'neutral' };
}

function locationLabel(item: TrainerScheduleItem): string {
  if (item.type !== 'session') return 'Task';
  if (item.locationMode === 'online') return 'Online';
  if (item.locationMode === 'in_person') return 'In-person';
  if (item.locationMode === 'hybrid') return 'Hybrid';
  return 'Not set';
}

function alertLabel(type: TrainerAlert['type']): string {
  if (type === 'pain_injury') return 'Safety Alert';
  if (type === 'low_adherence') return 'Low Adherence';
  return 'Check-in Due';
}

export function buildScheduleRowDisplay(item: TrainerScheduleItem): ScheduleRowDisplay {
  const status = statusDisplay(item.status);
  return {
    id: item.id,
    time: new Date(item.startsAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    clientName: item.clientName ?? 'Internal task',
    avatarUrl: item.clientAvatarUrl,
    sessionType: item.type === 'session' ? item.title : item.type === 'call' ? 'Client Call' : 'Follow-up',
    location: locationLabel(item),
    status: status.label,
    statusTone: status.tone,
  };
}

export function buildAlertDisplay(alert: TrainerAlert): AlertDisplay {
  return {
    id: alert.id,
    label: alertLabel(alert.type),
    clientName: alert.clientName ?? 'Client',
    summary: alert.summary,
    timeLabel: relativeTime(alert.dueAt),
    tone: alert.priority === 'high' ? 'danger' : alert.priority === 'medium' ? 'warning' : 'purple',
    kind: alert.type,
  };
}

export function buildTrainerDashboardViewModel(dashboard: TrainerDashboard, activityEntries: ActivityLogEntry[]): TrainerDashboardViewModel {
  const weekly = dashboard.analytics.weeklyPerformance;
  const adherence = weekly.averageAdherence.current;

  return {
    stats: [
      { title: "Today's Sessions", value: String(dashboard.snapshot.todaySessions), supportingText: 'Scheduled today', tone: 'purple', icon: 'calendar' },
      { title: 'Active Clients', value: String(dashboard.snapshot.activeClients), supportingText: 'Active roster', tone: 'green', icon: 'users' },
      { title: 'Pending Follow-ups', value: String(dashboard.snapshot.pendingFollowUps), supportingText: 'Due today', tone: 'orange', icon: 'clipboard' },
      { title: 'Adherence Rate', value: adherence === null ? '--' : `${adherence}%`, supportingText: percentTrend(adherence, weekly.averageAdherence.previous), positive: adherence !== null && (weekly.averageAdherence.previous === null || adherence >= weekly.averageAdherence.previous), tone: 'green', icon: 'shield' },
    ],
    schedule: dashboard.dailySchedule.map(buildScheduleRowDisplay),
    alerts: dashboard.priorityQueue.slice(0, 3).map(buildAlertDisplay),
    activities: activityEntries.slice(0, 4).map((activity) => ({
      id: activity.id,
      summary: activity.summary,
      timeLabel: relativeTime(activity.occurredAt),
      avatarUrl: activity.target?.avatarUrl ?? activity.actor?.avatarUrl,
    })),
    renewals: mockUpcomingRenewals,
    performance: [
      { label: 'Sessions Completed', value: String(weekly.completedSessions.current), trend: percentTrend(weekly.completedSessions.current, weekly.completedSessions.previous), tone: 'purple', icon: 'calendar' },
      { label: 'Avg. Adherence', value: adherence === null ? '--' : `${adherence}%`, trend: percentTrend(adherence, weekly.averageAdherence.previous), tone: 'green', icon: 'shield' },
      { label: 'Total Client Hours', value: String(weekly.clientHours.current), trend: percentTrend(weekly.clientHours.current, weekly.clientHours.previous), tone: 'orange', icon: 'clock' },
      { label: 'Calories Tracked', value: mockCaloriesTracked.value, trend: `\u2191 ${mockCaloriesTracked.trend}`, tone: 'purple', icon: 'flame' },
    ],
    chart: dashboard.analytics.labels.map((label, index) => ({ label, sessions: dashboard.analytics.attendance.completed[index] ?? 0 })),
    compact: {
      focus: {
        sessions: dashboard.snapshot.todaySessions,
        followUps: dashboard.snapshot.pendingFollowUps,
        dailyGoalPercent: mockCompactFocus.dailyGoalPercent,
        message: mockCompactFocus.message,
      },
      priorityActions: [
        {
          id: 'follow-ups',
          value: String(dashboard.snapshot.pendingFollowUps),
          label: 'Follow-ups',
          supportingText: 'Pending',
          tone: 'orange',
          icon: 'follow_up',
          to: '/trainer/check-ins',
        },
        ...mockCompactPriorityItems,
      ],
    },
  };
}
