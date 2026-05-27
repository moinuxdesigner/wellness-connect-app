import {
  Activity,
  CalendarDays,
  ChevronRight,
  CircleAlert,
  ClipboardList,
  Clock3,
  Dumbbell,
  Flame,
  MessageCircle,
  ShieldCheck,
  Target,
  TrendingDown,
  UserRoundPlus,
  UsersRound,
} from 'lucide-react';
import { Link } from 'react-router';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type {
  ActivityDisplay,
  AlertDisplay,
  CompactFocusDisplay,
  CompactPriorityActionDisplay,
  DashboardStatDisplay,
  PerformanceStatDisplay,
  ScheduleRowDisplay,
} from '../trainerDashboardViewModel';
import { avatarForName, type TrainerRenewalDisplay } from '../mockTrainerDashboardData';
import type { ReactNode } from 'react';

const toneStyles = {
  purple: { circle: 'bg-indigo-50 text-indigo-600', value: 'text-indigo-700' },
  green: { circle: 'bg-emerald-50 text-emerald-600', value: 'text-emerald-600' },
  orange: { circle: 'bg-orange-50 text-orange-500', value: 'text-orange-500' },
};

function MetricIcon({ icon, size = 23 }: { icon: DashboardStatDisplay['icon'] | PerformanceStatDisplay['icon']; size?: number }) {
  if (icon === 'calendar') return <CalendarDays size={size} />;
  if (icon === 'users') return <UsersRound size={size} />;
  if (icon === 'clipboard') return <ClipboardList size={size} />;
  if (icon === 'clock') return <Clock3 size={size} />;
  if (icon === 'flame') return <Flame size={size} />;
  return <ShieldCheck size={size} />;
}

function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <section className={`rounded-2xl border border-slate-200/80 bg-white shadow-[0_2px_14px_rgba(30,41,59,0.045)] ${className}`}>{children}</section>;
}

export function StatCard({ stat }: { stat: DashboardStatDisplay }) {
  const colors = toneStyles[stat.tone];
  return (
    <Card className="group flex min-h-[122px] items-center gap-5 p-5 transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(76,84,232,0.1)]">
      <span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full ${colors.circle}`}>
        <MetricIcon icon={stat.icon} />
      </span>
      <div className="min-w-0">
        <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
          <span>{stat.title}</span>
          <CircleAlert size={14} className="text-slate-300" />
        </div>
        <p className={`mt-1 text-[2rem] font-semibold leading-none ${colors.value}`}>{stat.value}</p>
        <p className={`mt-2 text-xs ${stat.positive ? 'text-emerald-600' : 'text-slate-500'}`}>{stat.supportingText}</p>
      </div>
    </Card>
  );
}

export function TodayScheduleCard({ rows }: { rows: ScheduleRowDisplay[] }) {
  return (
    <Card>
      <header className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
        <h2 className="text-lg font-semibold text-slate-900">Today&apos;s Schedule</h2>
        <button type="button" disabled className="inline-flex items-center gap-2 rounded-lg border border-indigo-100 bg-white px-3 py-2 text-xs font-medium text-indigo-600 opacity-70">
          <CalendarDays size={15} /> View Calendar
        </button>
      </header>
      {rows.length ? (
        <div className="overflow-hidden">
          <table className="w-full table-fixed text-left text-sm">
            <thead className="text-xs text-slate-500">
              <tr className="border-b border-slate-100">
                <th className="w-[16%] px-5 py-3 font-medium">Time</th>
                <th className="w-[28%] px-3 py-3 font-medium">Client</th>
                <th className="w-[25%] px-3 py-3 font-medium">Session Type</th>
                <th className="w-[17%] px-3 py-3 font-medium">Location</th>
                <th className="px-3 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-b border-slate-100/80 transition hover:bg-indigo-50/30">
                  <td className="px-5 py-2.5 text-slate-500">{row.time}</td>
                  <td className="px-3 py-2.5">
                    <span className="flex items-center gap-2 font-medium text-slate-800">
                      <img src={row.avatarUrl} alt="" className="h-6 w-6 rounded-full object-cover" />
                      {row.clientName}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-slate-600">{row.sessionType}</td>
                  <td className="px-3 py-2.5 text-slate-600">{row.location}</td>
                  <td className="px-3 py-2.5">
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                      row.statusTone === 'success' ? 'bg-emerald-50 text-emerald-700' : row.statusTone === 'warning' ? 'bg-orange-50 text-orange-600' : 'bg-slate-100 text-slate-600'
                    }`}>{row.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="px-5 py-12 text-center text-sm text-slate-500">No sessions or follow-ups scheduled today.</p>
      )}
      <div className="border-t border-slate-100 px-5 py-4">
        <span className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600">View full schedule <ChevronRight size={16} /></span>
      </div>
    </Card>
  );
}

function AlertIcon({ alert }: { alert: AlertDisplay }) {
  if (alert.kind === 'pain_injury') return <Activity size={18} />;
  if (alert.kind === 'low_adherence') return <TrendingDown size={18} />;
  return <Clock3 size={18} />;
}

export function ClientAlertsCard({ alerts }: { alerts: AlertDisplay[] }) {
  return (
    <Card className="px-5 py-4">
      <CardTitle title="Client Alerts" />
      {alerts.length ? (
        <div className="mt-2 divide-y divide-slate-100">
          {alerts.map((alert) => (
            <article key={alert.id} className="flex gap-3 py-3">
              <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                alert.tone === 'danger' ? 'bg-rose-50 text-rose-500' : alert.tone === 'warning' ? 'bg-orange-50 text-orange-500' : 'bg-indigo-50 text-indigo-600'
              }`}><AlertIcon alert={alert} /></span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-semibold text-slate-800">{alert.label}</p>
                  <p className="text-xs text-slate-400">{alert.timeLabel}</p>
                </div>
                <p className="mt-1 truncate text-xs text-slate-500">{alert.summary}</p>
              </div>
            </article>
          ))}
        </div>
      ) : <p className="py-7 text-center text-sm text-slate-500">No open client alerts.</p>}
    </Card>
  );
}

export function RecentActivityCard({ activities }: { activities: ActivityDisplay[] }) {
  return (
    <Card className="px-5 py-4">
      <CardTitle title="Recent Activity" />
      {activities.length ? (
        <div className="mt-3 space-y-3">
          {activities.map((activity) => (
            <article key={activity.id} className="flex items-center gap-3">
              <img src={activity.avatarUrl} alt="" className="h-7 w-7 rounded-full object-cover" />
              <p className="min-w-0 flex-1 truncate text-xs text-slate-600">{activity.summary}</p>
              <time className="text-xs text-slate-400">{activity.timeLabel}</time>
            </article>
          ))}
        </div>
      ) : <p className="py-7 text-center text-sm text-slate-500">No recent activity recorded.</p>}
    </Card>
  );
}

export function UpcomingRenewalsCard({ renewals }: { renewals: TrainerRenewalDisplay[] }) {
  return (
    <Card className="px-5 pt-4">
      <CardTitle title="Upcoming Renewals" />
      <div className="mt-3 space-y-3">
        {renewals.map((renewal) => (
          <article key={renewal.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-2 text-xs sm:grid-cols-[minmax(0,1.2fr)_92px_70px_76px]">
            <span className="flex items-center gap-2">
              <img src={avatarForName(renewal.clientName)} alt="" className="h-8 w-8 rounded-full object-cover" />
              <span>
                <strong className="block font-medium text-slate-800">{renewal.clientName}</strong>
                <span className="text-slate-500">{renewal.planName}</span>
              </span>
            </span>
            <span className="sm:block">
              <strong className="block font-medium text-slate-700">{renewal.renewalDate}</strong>
              <span className="text-slate-500">{renewal.dueLabel}</span>
            </span>
            <span className="font-medium text-slate-700">{renewal.price}</span>
            <span className={`rounded-md px-2 py-1 text-center font-medium ${renewal.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-orange-50 text-orange-600'}`}>
              {renewal.status}
            </span>
          </article>
        ))}
      </div>
      <div className="-mx-5 mt-4 border-t border-slate-100 px-5 py-4">
        <span className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600">View all renewals <ChevronRight size={16} /></span>
      </div>
    </Card>
  );
}

export function WeeklyPerformanceCard({ stats, chart }: { stats: PerformanceStatDisplay[]; chart: Array<{ label: string; sessions: number }> }) {
  return (
    <Card className="px-5 py-4">
      <h2 className="text-lg font-semibold text-slate-900">This Week&apos;s Performance</h2>
      <div className="mt-3 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="flex min-w-0 items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/60 px-3 py-2.5">
            <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${toneStyles[stat.tone].circle}`}>
              <MetricIcon icon={stat.icon} size={19} />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-[11px] text-slate-600">{stat.label}</span>
              <strong className="block text-lg font-semibold leading-tight text-slate-900">{stat.value}</strong>
              <span className="block truncate text-[10px] text-emerald-600">{stat.trend}</span>
            </span>
          </div>
        ))}
      </div>
      <div className="mt-3 h-[156px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chart} margin={{ top: 12, right: 16, bottom: 0, left: -20 }}>
            <CartesianGrid stroke="#eef2ff" strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 11 }} dy={7} />
            <YAxis tickLine={false} axisLine={false} allowDecimals={false} tick={{ fill: '#64748b', fontSize: 11 }} />
            <Tooltip formatter={(value) => [`${value} Sessions`, 'Completed']} contentStyle={{ borderRadius: 10, borderColor: '#e0e7ff', fontSize: 12 }} />
            <Line type="monotone" dataKey="sessions" stroke="#4f46e5" strokeWidth={2.5} dot={{ fill: '#4f46e5', r: 4 }} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

export function CompactFocusCard({ focus }: { focus: CompactFocusDisplay }) {
  return (
    <Card className="overflow-hidden border-0 bg-gradient-to-br from-[#111b30] via-[#0d1729] to-[#07111e] px-4 py-4 text-white shadow-[0_14px_30px_rgba(15,23,42,0.14)] sm:px-6 sm:py-5">
      <div className="flex items-center gap-3 sm:gap-5">
        <div className="min-w-0 flex-1">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1.5 text-xs text-slate-300">
            <Target size={14} /> Today&apos;s Focus
          </span>
          <p className="mt-3 text-[1.08rem] font-semibold tracking-tight min-[370px]:text-lg sm:text-2xl">
            {focus.sessions} Sessions <span className="text-slate-400">&bull;</span> {focus.followUps} Follow-ups
          </p>
          <p className="mt-2 text-xs leading-5 text-slate-300 sm:text-sm">{focus.message}</p>
        </div>
        <div className="shrink-0 text-center">
          <div
            className="flex h-[72px] w-[72px] items-center justify-center rounded-full p-[7px] sm:h-[86px] sm:w-[86px] sm:p-[8px]"
            style={{ background: `conic-gradient(#7148ff ${focus.dailyGoalPercent}%, rgba(255,255,255,0.14) ${focus.dailyGoalPercent}% 100%)` }}
          >
            <div className="flex h-full w-full items-center justify-center rounded-full bg-[#10192b] text-lg font-semibold sm:text-xl">{focus.dailyGoalPercent}%</div>
          </div>
          <p className="mt-1.5 text-[11px] text-slate-200">Daily Goal</p>
        </div>
      </div>
    </Card>
  );
}

export function CompactScheduleCard({ rows }: { rows: ScheduleRowDisplay[] }) {
  return (
    <section>
      <CompactSectionTitle title="Today&apos;s Schedule" action="View All" />
      <Card className="mt-2.5 overflow-hidden px-4 sm:px-5">
        {rows.length ? rows.map((row) => (
          <Link
            key={row.id}
            to={`/trainer/schedule/${encodeURIComponent(row.id)}`}
            className="flex items-center gap-3 border-b border-slate-100 py-3.5 transition last:border-b-0 hover:bg-indigo-50/40"
          >
            <span className="w-[68px] shrink-0 text-xs font-medium text-slate-600 sm:w-[100px] sm:text-sm">{row.time}</span>
            <img src={row.avatarUrl} alt="" className="h-10 w-10 shrink-0 rounded-full object-cover sm:h-12 sm:w-12" />
            <span className="min-w-0 flex-1">
              <strong className="block truncate text-sm font-semibold text-[#101842] sm:text-base">{row.clientName}</strong>
              <span className="mt-1 block truncate text-sm text-slate-600">{row.sessionType}</span>
            </span>
            <span className={`hidden rounded-xl px-3 py-2 text-xs font-medium min-[380px]:inline-flex ${
              row.statusTone === 'success' ? 'bg-indigo-50 text-indigo-600' : row.statusTone === 'warning' ? 'bg-orange-50 text-orange-600' : 'bg-slate-100 text-slate-600'
            }`}>{row.status}</span>
            <ChevronRight size={19} className="shrink-0 text-slate-400" />
          </Link>
        )) : (
          <div className="flex min-h-[104px] flex-col items-center justify-center gap-2 py-5 text-center">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-50 text-indigo-500"><CalendarDays size={18} /></span>
            <p className="text-sm font-medium text-slate-700">Your schedule is clear today</p>
            <p className="text-xs text-slate-500">No sessions or follow-ups scheduled.</p>
          </div>
        )}
      </Card>
    </section>
  );
}

function CompactActionIcon({ action }: { action: CompactPriorityActionDisplay }) {
  if (action.icon === 'programs') return <ClipboardList size={25} />;
  if (action.icon === 'messages') return <MessageCircle size={25} />;
  if (action.icon === 'client') return <UserRoundPlus size={25} />;
  return <CalendarDays size={25} />;
}

export function CompactPriorityActionsCard({ actions }: { actions: CompactPriorityActionDisplay[] }) {
  const tones = {
    orange: 'bg-orange-50 text-orange-500',
    green: 'bg-emerald-50 text-emerald-600',
    purple: 'bg-violet-50 text-violet-600',
    blue: 'bg-blue-50 text-blue-600',
  };
  const statusTones = {
    orange: 'text-orange-500',
    green: 'text-emerald-600',
    purple: 'text-violet-600',
    blue: 'text-blue-600',
  };

  return (
    <section>
      <CompactSectionTitle title="Priority Actions" />
      <div className="mt-2.5 grid grid-cols-2 gap-2.5 sm:gap-4">
        {actions.map((action) => {
          const body = (
            <>
              <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full sm:h-12 sm:w-12 ${tones[action.tone]}`}><CompactActionIcon action={action} /></span>
              <span className="min-w-0 flex-1">
                <strong className="block text-lg font-semibold leading-none text-[#101842] sm:text-xl">{action.value}</strong>
                <span className="mt-1 block text-xs text-slate-600 sm:text-sm">{action.label}</span>
                <span className={`block text-xs font-medium sm:text-sm ${statusTones[action.tone]}`}>{action.supportingText}</span>
              </span>
              <ChevronRight size={16} className="hidden text-slate-400 min-[365px]:block" />
            </>
          );
          const classes = 'flex min-h-[92px] items-center gap-2.5 rounded-2xl border border-slate-100 bg-white p-3 shadow-[0_2px_14px_rgba(30,41,59,0.045)] transition hover:border-indigo-100 hover:shadow-md sm:min-h-[110px] sm:gap-3 sm:p-4';
          return action.to ? <Link key={action.id} to={action.to} className={classes}>{body}</Link> : <div key={action.id} className={classes}>{body}</div>;
        })}
      </div>
    </section>
  );
}

export function CompactAlertsCard({ alerts }: { alerts: AlertDisplay[] }) {
  return (
    <section>
      <CompactSectionTitle title="Client Alerts" action="View All" />
      <div className="mt-2.5 space-y-3">
        {alerts.length ? alerts.map((alert) => (
          <Link
            key={alert.id}
            to={`/trainer/alerts/${alert.id}`}
            className="flex items-center gap-3 rounded-2xl border border-orange-100 bg-gradient-to-r from-orange-50 to-rose-50/60 p-4 transition hover:border-orange-200"
          >
            <img src={avatarForName(alert.clientName)} alt="" className="h-12 w-12 rounded-full object-cover" />
            <span className="min-w-0 flex-1">
              <strong className="block truncate text-sm font-semibold text-[#101842]">{alert.clientName}</strong>
              <span className="mt-1 block truncate text-sm text-slate-600">{alert.summary}</span>
            </span>
            <span className="hidden text-xs font-semibold text-orange-600 sm:block">{alert.label}</span>
            <ChevronRight size={19} className="text-slate-400" />
          </Link>
        )) : (
          <Card className="flex min-h-[86px] items-center gap-3 border-emerald-100 bg-emerald-50/40 px-4 py-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100/70 text-emerald-600"><ShieldCheck size={20} /></span>
            <span>
              <strong className="block text-sm font-semibold text-[#101842]">No alerts requiring attention</strong>
              <span className="mt-0.5 block text-xs text-slate-500">Your clients have no open priority alerts.</span>
            </span>
          </Card>
        )}
      </div>
    </section>
  );
}

function CompactSectionTitle({ title, action }: { title: string; action?: string }) {
  return (
    <header className="flex items-center justify-between">
      <h2 className="text-lg font-semibold tracking-tight text-[#101842] sm:text-xl">{title}</h2>
      {action ? <span className="text-sm font-semibold text-indigo-600">{action}</span> : null}
    </header>
  );
}

function CardTitle({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-base font-semibold text-slate-900">{title}</h2>
      <span className="text-xs font-medium text-indigo-600">View all</span>
    </div>
  );
}
