import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Link } from 'react-router';
import * as echarts from 'echarts';
import { Bell, CalendarDays, Check, ClipboardPlus, ShieldAlert, UsersRound } from 'lucide-react';
import { Panel, StatCard, ToneBadge } from '../shared/components/Ui';
import { notificationCategoryLabel, updateNotification } from '../notifications/notificationsApi';
import {
  createTrainerTask,
  getTrainerDashboard,
  updateTrainerAlert,
  updateTrainerTask,
  type TrainerAlert,
  type TrainerDashboard,
  type TrainerNextAction,
} from './trainerWorkspaceApi';

function alertTone(priority: TrainerAlert['priority']): 'danger' | 'warning' | 'success' {
  return priority === 'high' ? 'danger' : priority === 'medium' ? 'warning' : 'success';
}

function alertCategory(alert: TrainerAlert): { label: string; tone: 'danger' | 'warning' | 'success'; iconClassName: string } {
  if (alert.type === 'pain_injury') {
    return { label: 'Injury escalation', tone: 'danger', iconClassName: 'text-rose-600' };
  }
  if (alert.type === 'low_adherence') {
    return { label: 'Low adherence', tone: 'warning', iconClassName: 'text-amber-600' };
  }
  return { label: 'Regular follow-up', tone: 'success', iconClassName: 'text-emerald-600' };
}

function nextActionTone(priority: TrainerNextAction['priority']): 'danger' | 'warning' | 'success' {
  if (priority === 'high') return 'danger';
  if (priority === 'medium') return 'warning';
  return 'success';
}

function percentLineOption(input: {
  labels: string[];
  name: string;
  data: Array<number | null>;
  color: string;
}): echarts.EChartsOption {
  return {
    tooltip: { trigger: 'axis' },
    legend: { bottom: 0, textStyle: { color: '#475569' } },
    grid: { left: 20, right: 16, top: 18, bottom: 40, containLabel: true },
    xAxis: { type: 'category', data: input.labels, axisLabel: { color: '#64748b' } },
    yAxis: {
      type: 'value',
      min: 0,
      max: 100,
      axisLabel: { color: '#64748b', formatter: '{value}%' },
      splitLine: { lineStyle: { color: '#e2e8f0' } },
    },
    series: [
      {
        name: input.name,
        type: 'line',
        smooth: true,
        data: input.data,
        lineStyle: { color: input.color, width: 3 },
        itemStyle: { color: input.color },
      },
    ],
  };
}

function attendanceOption(dashboard: TrainerDashboard): echarts.EChartsOption {
  return {
    tooltip: { trigger: 'axis' },
    legend: { bottom: 0 },
    grid: { left: 20, right: 16, top: 18, bottom: 40, containLabel: true },
    xAxis: { type: 'category', data: dashboard.analytics.labels },
    yAxis: { type: 'value', minInterval: 1, splitLine: { lineStyle: { color: '#e2e8f0' } } },
    series: [
      { name: 'Completed', type: 'bar', data: dashboard.analytics.attendance.completed, itemStyle: { color: '#10b981', borderRadius: 5 } },
      { name: 'Missed', type: 'bar', data: dashboard.analytics.attendance.missed, itemStyle: { color: '#ef4444', borderRadius: 5 } },
    ],
  };
}

function weightTrendsOption(dashboard: TrainerDashboard): echarts.EChartsOption | null {
  const labels = Array.from(
    new Set(dashboard.analytics.weightSeries.flatMap((series) => series.points.map((point) => point.date))),
  ).sort();

  if (!labels.length) {
    return null;
  }

  return {
    tooltip: { trigger: 'axis' },
    legend: { bottom: 0, textStyle: { color: '#475569' } },
    grid: { left: 20, right: 16, top: 18, bottom: 40, containLabel: true },
    xAxis: { type: 'category', data: labels, axisLabel: { color: '#64748b' } },
    yAxis: { type: 'value', axisLabel: { color: '#64748b', formatter: '{value} kg' }, splitLine: { lineStyle: { color: '#e2e8f0' } } },
    series: dashboard.analytics.weightSeries.map((series, index) => {
      const color = ['#7c3aed', '#2563eb', '#f97316', '#059669', '#e11d48'][index % 5];
      const pointsByDate = new Map(series.points.map((point) => [point.date, point.weightKg]));
      return {
        name: series.clientName,
        type: 'line',
        smooth: true,
        connectNulls: false,
        data: labels.map((label) => pointsByDate.get(label) ?? null),
        lineStyle: { color, width: 3 },
        itemStyle: { color },
      };
    }),
  };
}

export default function TrainerDashboardPage() {
  const [dashboard, setDashboard] = useState<TrainerDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState('');
  const [showTask, setShowTask] = useState(false);
  const [task, setTask] = useState({ title: '', type: 'follow_up' as 'call' | 'follow_up', startsAt: '', endsAt: '' });
  const notifications = dashboard
    ? [...dashboard.notifications.items].sort((left, right) => {
        if (left.read !== right.read) {
          return Number(left.read) - Number(right.read);
        }
        return new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime();
      })
    : [];
  const weightOption = dashboard ? weightTrendsOption(dashboard) : null;

  async function refresh() {
    setLoading(true);
    try {
      setDashboard(await getTrainerDashboard());
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Unable to load trainer dashboard.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void refresh(); }, []);

  async function actOnAlert(alert: TrainerAlert, action: 'acknowledge' | 'resolve' | 'escalate') {
    try {
      await updateTrainerAlert(alert.id, action, action === 'escalate' ? 'Trainer requested administrator review of a training safety concern.' : undefined);
      setNotice(action === 'escalate' ? 'Safety alert escalated for administrator review.' : 'Priority item updated.');
      await refresh();
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Unable to update priority item.');
    }
  }

  async function scheduleFollowUp(alert: TrainerAlert) {
    const startsAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const endsAt = new Date(startsAt.getTime() + 30 * 60 * 1000);
    await createTrainerTask({ alertId: alert.id, type: 'follow_up', title: `Follow up: ${alert.clientName ?? 'client'}`, startsAt: startsAt.toISOString(), endsAt: endsAt.toISOString() });
    setNotice('Follow-up added to tomorrow\'s schedule.');
    await refresh();
  }

  async function saveTask(event: FormEvent) {
    event.preventDefault();
    try {
      await createTrainerTask({ ...task, startsAt: new Date(task.startsAt).toISOString(), endsAt: new Date(task.endsAt).toISOString() });
      setTask({ title: '', type: 'follow_up', startsAt: '', endsAt: '' });
      setShowTask(false);
      setNotice('Task added to schedule.');
      await refresh();
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Unable to create schedule task.');
    }
  }

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs font-semibold uppercase text-indigo-600">Trainer Workspace</p>
        <h1 className="mt-1 text-2xl font-semibold text-slate-900">Today&apos;s Coaching Desk</h1>
        <p className="mt-1 text-sm text-slate-600">Sessions, follow-ups, progress, and safety concerns.</p>
      </header>
      {notice ? <p className="rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-sm text-indigo-700">{notice}</p> : null}

      <section className="space-y-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Client Snapshot</p>
          <p className="mt-1 text-sm text-slate-600">A quick view of the clients and coaching actions that need attention.</p>
        </div>
        {loading || !dashboard ? (
          <>
            <div className="grid gap-4 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => <div key={index} className="h-28 animate-pulse rounded-xl bg-slate-100" />)}
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {Array.from({ length: 2 }).map((_, index) => <div key={index} className="h-20 animate-pulse rounded-xl bg-slate-100" />)}
            </div>
          </>
        ) : (
          <>
            <div className="grid gap-4 lg:grid-cols-3">
              <StatCard title="Upcoming sessions" value={`${dashboard.snapshot.upcomingSessions}`} hint="Booked ahead" />
              <StatCard title="High-risk clients" value={`${dashboard.snapshot.highRiskClients}`} hint="Open high-priority concerns" />
              <StatCard title="Low adherence clients" value={`${dashboard.snapshot.lowAdherenceClients}`} hint="Below 70% this week" />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <article className="rounded-xl border border-slate-200 bg-white p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Today&apos;s sessions</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">{dashboard.snapshot.todaySessions}</p>
                <p className="mt-1 text-sm text-slate-500">Scheduled training today</p>
              </article>
              <article className="rounded-xl border border-slate-200 bg-white p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Active clients</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">{dashboard.snapshot.activeClients}</p>
                <p className="mt-1 text-sm text-slate-500">Clients with plans or sessions</p>
              </article>
            </div>
          </>
        )}
      </section>

      <Panel title="Next Actions">
        {dashboard?.nextActions.length ? (
          <div className="grid gap-3 lg:grid-cols-3">
            {dashboard.nextActions.map((action) => (
              <article key={action.id} className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{action.title}</p>
                    <p className="mt-1 text-sm text-slate-600">{action.description}</p>
                  </div>
                  <ToneBadge tone={nextActionTone(action.priority)}>{action.priority}</ToneBadge>
                </div>
                {action.count ? <p className="mt-3 text-2xl font-semibold text-slate-900">{action.count}</p> : null}
                <Link to={action.to} className="mt-4 inline-flex rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white">
                  {action.ctaLabel}
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5">
            <p className="text-sm text-slate-600">No urgent trainer actions right now. You can still jump into the core workflows below.</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link to="/trainer/plans" className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700">Go to Plans</Link>
              <Link to="/trainer/check-ins" className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700">Go to Check-ins</Link>
            </div>
          </div>
        )}
      </Panel>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Panel title="Daily Schedule">
          <div className="mb-4 flex justify-end">
            <button type="button" onClick={() => setShowTask((open) => !open)} className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white">
              <ClipboardPlus size={16} /> Add task
            </button>
          </div>
          {showTask ? (
            <form onSubmit={saveTask} className="mb-4 grid gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:grid-cols-2">
              <input required value={task.title} onChange={(e) => setTask({ ...task, title: e.target.value })} placeholder="Task title" className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm" />
              <select value={task.type} onChange={(e) => setTask({ ...task, type: e.target.value as 'call' | 'follow_up' })} className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm">
                <option value="follow_up">Follow-up</option>
                <option value="call">Call</option>
              </select>
              <input required type="datetime-local" value={task.startsAt} onChange={(e) => setTask({ ...task, startsAt: e.target.value })} className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm" />
              <input required type="datetime-local" value={task.endsAt} onChange={(e) => setTask({ ...task, endsAt: e.target.value })} className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm" />
              <button type="submit" className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white">Schedule</button>
            </form>
          ) : null}
          <div className="space-y-3">
            {dashboard?.dailySchedule.length ? dashboard.dailySchedule.map((item) => (
              <article key={item.id} className="flex flex-col gap-3 rounded-xl border border-slate-200 p-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                  <CalendarDays size={17} className="mt-0.5 text-indigo-600" />
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                    <p className="text-xs text-slate-500">{item.clientName ?? 'Internal task'} | {new Date(item.startsAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <ToneBadge tone={item.status === 'completed' ? 'success' : item.status === 'no_show' ? 'danger' : 'neutral'}>{item.status}</ToneBadge>
                  {item.type !== 'session' && item.status === 'scheduled' ? (
                    <button type="button" onClick={async () => { await updateTrainerTask(item.sourceId, { status: 'completed' }); await refresh(); }} className="rounded-lg border border-slate-200 px-2 py-1 text-xs font-medium">Complete</button>
                  ) : null}
                </div>
              </article>
            )) : <p className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">No sessions or follow-ups scheduled today.</p>}
          </div>
        </Panel>

        <Panel title="Priority Queue">
          <div className="space-y-3">
            {dashboard?.priorityQueue.length ? dashboard.priorityQueue.map((alert) => (
              <PriorityQueueCard
                key={alert.id}
                alert={alert}
                onAcknowledge={() => void actOnAlert(alert, 'acknowledge')}
                onEscalate={() => void actOnAlert(alert, 'escalate')}
                onResolve={() => void actOnAlert(alert, 'resolve')}
                onSchedule={() => void scheduleFollowUp(alert)}
              />
            )) : <p className="rounded-xl bg-emerald-50 p-5 text-sm text-emerald-700">No open priority items.</p>}
          </div>
        </Panel>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <Panel title="Progress Analytics">
          {dashboard ? (
            <div className="grid gap-5 lg:grid-cols-2">
              <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <h3 className="mb-3 text-sm font-semibold text-slate-900">Attendance</h3>
                <Chart option={attendanceOption(dashboard)} height={255} />
              </article>
              <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <h3 className="mb-3 text-sm font-semibold text-slate-900">Adherence over time</h3>
                <Chart option={percentLineOption({ labels: dashboard.analytics.labels, name: 'Adherence', data: dashboard.analytics.adherence, color: '#059669' })} height={255} />
              </article>
              <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <h3 className="mb-3 text-sm font-semibold text-slate-900">Goal achievement</h3>
                <Chart option={percentLineOption({ labels: dashboard.analytics.labels, name: 'Goal achievement', data: dashboard.analytics.goalProgress, color: '#2563eb' })} height={255} />
              </article>
              <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <h3 className="mb-3 text-sm font-semibold text-slate-900">Weight trends</h3>
                {weightOption ? <Chart option={weightOption} height={255} /> : <p className="flex h-[255px] items-center justify-center text-sm text-slate-500">No recorded weights yet.</p>}
              </article>
            </div>
          ) : (
            <div className="grid gap-5 lg:grid-cols-2">
              {Array.from({ length: 4 }).map((_, index) => <div key={index} className="h-80 animate-pulse rounded-xl bg-slate-100" />)}
            </div>
          )}
        </Panel>

        <Panel title="Notifications Center">
          <p className="mb-3 inline-flex items-center gap-2 text-sm text-slate-500"><Bell size={15} /> {dashboard?.notifications.unreadCount ?? 0} unread</p>
          <div className="space-y-2">
            {notifications.length ? notifications.map((notification) => (
              <button
                key={notification.id}
                type="button"
                onClick={async () => { await updateNotification(notification.id, !notification.read); await refresh(); }}
                className={`w-full rounded-xl border p-3 text-left text-sm ${notification.read ? 'border-slate-200 bg-white text-slate-600' : 'border-indigo-100 bg-indigo-50 text-slate-900'}`}
              >
                <span className="flex items-start justify-between gap-2">
                  <span>
                    <span className="block text-xs font-semibold uppercase tracking-wide text-slate-500">{notificationCategoryLabel(notification.type)}</span>
                    <span className="mt-1 block">{notification.message}</span>
                    <span className="mt-2 block text-xs text-slate-400">{new Date(notification.createdAt).toLocaleString()}</span>
                  </span>
                  {!notification.read ? <UsersRound size={14} className="mt-0.5 shrink-0 text-indigo-600" /> : <Check size={14} className="mt-0.5 shrink-0 text-emerald-600" />}
                </span>
              </button>
            )) : <p className="text-sm text-slate-500">No trainer notifications.</p>}
          </div>
        </Panel>
      </section>
    </div>
  );
}

function PriorityQueueCard({ alert, onAcknowledge, onEscalate, onResolve, onSchedule }: {
  alert: TrainerAlert;
  onAcknowledge: () => void;
  onEscalate: () => void;
  onResolve: () => void;
  onSchedule: () => void;
}) {
  const category = alertCategory(alert);

  return (
    <article className="rounded-xl border border-slate-200 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2">
          <ShieldAlert size={17} className={category.iconClassName} />
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <ToneBadge tone={category.tone}>{category.label}</ToneBadge>
              <ToneBadge tone={alertTone(alert.priority)}>{alert.priority} priority</ToneBadge>
            </div>
            <p className="mt-2 text-sm font-semibold text-slate-900">{alert.clientName ?? 'Client follow-up'}</p>
            <p className="mt-1 text-sm text-slate-600">{alert.summary}</p>
          </div>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {alert.status === 'open' ? <button type="button" onClick={onAcknowledge} className="rounded-lg border px-2.5 py-1.5 text-xs font-medium">Acknowledge</button> : null}
        <button type="button" onClick={onSchedule} className="rounded-lg border px-2.5 py-1.5 text-xs font-medium">Schedule follow-up</button>
        {alert.type === 'pain_injury' && alert.status !== 'escalated' ? <button type="button" onClick={onEscalate} className="rounded-lg border border-rose-200 px-2.5 py-1.5 text-xs font-medium text-rose-700">Escalate</button> : null}
        <button type="button" onClick={onResolve} className="rounded-lg border px-2.5 py-1.5 text-xs font-medium">Resolve</button>
      </div>
    </article>
  );
}

function Chart({ option, height }: { option: echarts.EChartsOption; height: number }) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    const chart = echarts.init(ref.current);
    chart.setOption(option);
    const observer = new ResizeObserver(() => chart.resize());
    observer.observe(ref.current);
    return () => {
      observer.disconnect();
      chart.dispose();
    };
  }, [option]);

  return <div ref={ref} style={{ height, width: '100%' }} />;
}
