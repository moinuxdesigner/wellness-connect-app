import { useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Calendar,
  Check,
  CheckCircle2,
  Dumbbell,
  Flame,
  Flag,
  HeartPulse,
  Library,
  MessageCircle,
  Moon,
  SmilePlus,
  Sparkles,
  Target,
  TrendingUp,
  Zap,
} from 'lucide-react';
import {
  getClientProgressRequest,
  type ClientProgressActivity,
  type ClientProgressGoal,
  type ClientProgressMetric,
  type ClientProgressMilestone,
  type ClientProgressPoint,
  type ClientProgressResource,
  type ClientProgressResponse,
} from '../../shared/services/api';

const mockProgressData: ClientProgressResponse = {
  source: 'mock',
  generatedAt: new Date().toISOString(),
  summary: {
    wellnessScore: 78,
    wellnessDelta: 6,
    sessionsCompletedThisMonth: 12,
    sessionsDeltaFromLastMonth: 2,
    currentStreakDays: 7,
    goalsOnTrack: 4,
    totalGoals: 5,
    goalsOnTrackPercent: 80,
  },
  fitness: {
    statusLabel: 'Mock trend: improving steadily',
    currentWeightKg: 72,
    weightDeltaKg: 0.5,
    latestGoalProgressPercent: 82,
    averageGoalProgressPercent: 76,
    points: [69.2, 69.6, 69.3, 70.2, 70.9, 70.1, 70.5, 70.8, 70.8, 71.3, 71.6, 71.2, 72, 71.8, 72.3].map((value, index) => ({
      label: index === 0 ? '8 wks ago' : index === 14 ? 'This week' : '',
      value,
    })),
  },
  mind: {
    statusLabel: 'Mock trend: feeling stable and positive',
    weeklyCheckInsCompleted: 6,
    weeklyCheckInsTotal: 7,
    currentMood: 'Positive',
    trendLabel: 'Improving',
    points: [2.2, 3.3, 2.7, 3.0, 2.3, 2.2, 3.3, 3.6, 2.7, 3.5, 3.3, 3.8, 4.0].map((value, index) => ({
      label: index === 0 ? '8 wks ago' : index === 12 ? 'This week' : '',
      value,
    })),
  },
  goals: [
    { id: 'mock-sleep', label: 'Sleep Routine', value: 80, category: 'mind', status: 'mock' },
    { id: 'mock-stress', label: 'Stress Management', value: 65, category: 'mind', status: 'mock' },
    { id: 'mock-workout', label: 'Workout Consistency', value: 90, category: 'training', status: 'mock' },
    { id: 'mock-mindfulness', label: 'Mindfulness Practice', value: 55, category: 'mind', status: 'mock' },
  ],
  bodyMetrics: [
    { label: 'Weight', value: '72 kg', detail: 'Mock metric', positive: true },
    { label: 'BMI', value: '24.1', detail: 'Mock metric' },
    { label: 'Sleep Avg', value: '7.1 hrs', detail: 'Mock metric' },
    { label: 'Water Intake', value: '2.3 L', detail: 'Mock metric' },
  ],
  milestones: [
    { title: 'Reach 10-session streak', subtitle: '3 sessions to go', value: 70, category: 'streak' },
    { title: 'Complete nutrition review', subtitle: 'Mock milestone', value: 50, category: 'training' },
    { title: 'Mood check-in for 5 days', subtitle: '2 more days to go', value: 60, category: 'mind' },
  ],
  resources: [
    { title: 'Workout Plan', subtitle: 'Mock recommended resource', image: '/images/trainer/live-session/dumbbell-bench-press.jpg', kind: 'training' },
    { title: 'Guided Meditation', subtitle: 'Mock recommended resource', image: '/images/trainer/live-session/plank-hold.jpg', kind: 'mind' },
    { title: 'Nutrition Tips', subtitle: 'Mock recommended resource', image: '/images/trainer/live-session/seated-cable-row.jpg', kind: 'training' },
  ],
  recentActivity: [
    { id: 'mock-1', title: 'Completed Personal Training session', subtitle: 'Mock activity', time: 'Today - 10:30 AM', category: 'training' },
    { id: 'mock-2', title: 'Mood check-in submitted', subtitle: 'Mock activity', time: 'Yesterday - 8:45 PM', category: 'cbt' },
    { id: 'mock-3', title: 'Meditation streak reached 5 days', subtitle: 'Mock activity', time: 'May 14, 2025 - 7:30 AM', category: 'mind' },
    { id: 'mock-4', title: 'Logged nutrition', subtitle: 'Mock activity', time: 'May 13, 2025 - 9:15 PM', category: 'training' },
  ],
};

const loadingProgressData: ClientProgressResponse = {
  source: 'database',
  summary: {
    wellnessScore: 0,
    wellnessDelta: 0,
    sessionsCompletedThisMonth: 0,
    sessionsDeltaFromLastMonth: 0,
    currentStreakDays: 0,
    goalsOnTrack: 0,
    totalGoals: 0,
    goalsOnTrackPercent: 0,
  },
  fitness: {
    statusLabel: 'Loading trainer check-ins',
    currentWeightKg: null,
    weightDeltaKg: null,
    latestGoalProgressPercent: null,
    averageGoalProgressPercent: null,
    points: [],
  },
  mind: {
    statusLabel: 'Loading CBT mood data',
    weeklyCheckInsCompleted: 0,
    weeklyCheckInsTotal: 7,
    currentMood: 'Loading',
    trendLabel: 'Loading',
    points: [],
  },
  goals: [],
  bodyMetrics: [],
  milestones: [],
  resources: [],
  recentActivity: [],
};

export default function ClientProgramsPage() {
  const [progress, setProgress] = useState<ClientProgressResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [fallbackReason, setFallbackReason] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    getClientProgressRequest()
      .then((data) => {
        if (!isMounted) return;
        setProgress(data);
        setFallbackReason(null);
      })
      .catch((error) => {
        if (!isMounted) return;
        setProgress(mockProgressData);
        setFallbackReason(error instanceof Error ? error.message : 'Unable to load live progress data.');
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const data = progress ?? loadingProgressData;
  const isMock = data.source === 'mock';

  return (
    <div className="mx-auto w-full max-w-[1500px] space-y-5 pb-6">
      <header className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-[26px] font-semibold leading-tight text-slate-950">My Progress</h1>
          <p className="mt-1 text-sm font-medium text-slate-500">Monitor your physical and mental well-being.</p>
        </div>
        <DataSourceBadge loading={loading} isMock={isMock} generatedAt={data.generatedAt} reason={fallbackReason} />
      </header>

      <section className="grid gap-4 xl:grid-cols-4">
        <WellnessScoreCard summary={data.summary} points={sparklineFrom(data)} />
        <MetricCard
          icon={<Calendar size={27} />}
          title="Sessions Completed"
          value={String(data.summary.sessionsCompletedThisMonth)}
          detail="This month"
          badge={deltaLabel(data.summary.sessionsDeltaFromLastMonth, 'vs last month')}
          tone="violet"
        />
        <MetricCard icon={<Flame size={28} />} title="Current Streak" value={String(data.summary.currentStreakDays)} valueSuffix="days" badge={data.summary.currentStreakDays > 0 ? 'Keep it going!' : 'Start today'} tone="purple" />
        <MetricCard icon={<Target size={29} />} title="Goals on Track" value={String(data.summary.goalsOnTrack)} valueSuffix={`of ${data.summary.totalGoals}`} badge={`${data.summary.goalsOnTrackPercent}% on track`} tone="blue" />
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <FitnessProgressCard fitness={data.fitness} />
        <MindWellbeingCard mind={data.mind} />
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-[1.18fr_1fr_1fr_1.05fr_1.05fr]">
        <GoalProgressCard goals={data.goals} />
        <BodyMetricsCard metrics={data.bodyMetrics} />
        <MilestonesCard milestones={data.milestones} />
        <ResourcesCard resources={data.resources} />
        <QuickActionsCard />
      </section>

      <RecentActivityCard activities={data.recentActivity} />
    </div>
  );
}

function DataSourceBadge({ loading, isMock, generatedAt, reason }: { loading: boolean; isMock: boolean; generatedAt?: string; reason: string | null }) {
  if (loading) {
    return <span className="inline-flex rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-500">Loading live database data</span>;
  }

  if (isMock) {
    return (
      <div className="max-w-xl rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-800">
        Mock fallback data is showing because live progress data could not be loaded{reason ? `: ${reason}` : '.'}
      </div>
    );
  }

  return (
    <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
      Live database data{generatedAt ? ` - ${new Date(generatedAt).toLocaleString()}` : ''}
    </span>
  );
}

function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <section className={`rounded-[14px] border border-slate-200 bg-white shadow-[0_18px_48px_-36px_rgba(15,23,42,0.38)] ${className}`}>
      {children}
    </section>
  );
}

function CardTitle({
  icon,
  title,
  subtitle,
  action,
}: {
  icon?: ReactNode;
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="flex min-w-0 items-start gap-3">
        {icon ? <span className="mt-0.5 shrink-0 text-violet-600">{icon}</span> : null}
        <div className="min-w-0">
          <h2 className="text-lg font-semibold leading-6 text-slate-950">{title}</h2>
          {subtitle ? <p className="mt-0.5 text-sm font-medium text-slate-500">{subtitle}</p> : null}
        </div>
      </div>
      {action}
    </div>
  );
}

function WellnessScoreCard({ summary, points }: { summary: ClientProgressResponse['summary']; points: number[] }) {
  const score = clamp(summary.wellnessScore, 0, 100);
  const circumference = 276;
  const offset = circumference - (score / 100) * circumference;

  return (
    <Card className="min-h-[140px] p-5">
      <div className="flex h-full items-center gap-5">
        <div className="relative grid h-[94px] w-[94px] shrink-0 place-items-center">
          <svg viewBox="0 0 110 110" className="absolute inset-0 h-full w-full -rotate-90">
            <circle cx="55" cy="55" r="44" fill="none" stroke="#ede9fe" strokeWidth="9" />
            <circle cx="55" cy="55" r="44" fill="none" stroke="#6d3df5" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" strokeWidth="9" />
          </svg>
          <div className="text-center">
            <p className="text-[25px] font-semibold leading-none text-slate-950">{score}</p>
            <p className="mt-1 text-[11px] font-semibold text-slate-500">/100</p>
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h2 className="truncate text-sm font-semibold text-slate-950">Overall Wellness Score</h2>
            <span className="grid h-4 w-4 place-items-center rounded-full border border-slate-300 text-[10px] font-bold text-slate-400">i</span>
          </div>
          <p className={`mt-4 text-sm font-semibold ${summary.wellnessDelta >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
            {summary.wellnessDelta >= 0 ? 'Up' : 'Down'} {Math.abs(summary.wellnessDelta)} points <ArrowUpRight size={14} className="inline" />
          </p>
          <p className="text-sm text-slate-500">this month</p>
          <MiniSparkline points={points} className="mt-3 h-9 w-full" />
        </div>
      </div>
    </Card>
  );
}

function MetricCard({
  icon,
  title,
  value,
  valueSuffix,
  detail,
  badge,
  tone,
}: {
  icon: ReactNode;
  title: string;
  value: string;
  valueSuffix?: string;
  detail?: string;
  badge: string;
  tone: 'violet' | 'purple' | 'blue';
}) {
  const toneClass = tone === 'blue' ? 'bg-blue-50 text-blue-600' : tone === 'purple' ? 'bg-purple-50 text-purple-600' : 'bg-violet-50 text-violet-600';
  return (
    <Card className="min-h-[140px] p-5">
      <div className="flex h-full items-center gap-5">
        <span className={`grid h-14 w-14 shrink-0 place-items-center rounded-full ${toneClass}`}>{icon}</span>
        <div className="min-w-0">
          <h2 className="truncate text-sm font-semibold text-slate-950">{title}</h2>
          <p className="mt-2 text-[30px] font-semibold leading-none text-slate-950">
            {value}
            {valueSuffix ? <span className="ml-1 align-middle text-base font-semibold text-slate-700">{valueSuffix}</span> : null}
          </p>
          {detail ? <p className="mt-1 text-sm text-slate-500">{detail}</p> : null}
          <span className="mt-3 inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
            <TrendingUp size={13} />
            {badge}
          </span>
        </div>
      </div>
    </Card>
  );
}

function FitnessProgressCard({ fitness }: { fitness: ClientProgressResponse['fitness'] }) {
  const latestWeight = fitness.currentWeightKg === null ? 'No data' : `${fitness.currentWeightKg} kg`;
  const weightDelta = fitness.weightDeltaKg === null ? 'Latest trainer check-in' : `${fitness.weightDeltaKg >= 0 ? '+' : ''}${fitness.weightDeltaKg} kg since last check-in`;
  const latestProgress = fitness.latestGoalProgressPercent === null ? 'No data' : `${fitness.latestGoalProgressPercent}%`;

  return (
    <Card className="p-5">
      <CardTitle
        icon={<Dumbbell size={24} />}
        title="Fitness Progress"
        subtitle="Trainer check-in trend from the database"
        action={<StatusPill label={fitness.statusLabel} icon={<TrendingUp size={14} />} />}
      />
      <div className="mt-5 grid gap-5 lg:grid-cols-[170px_minmax(0,1fr)]">
        <div className="space-y-5">
          <StatBlock title="Current Weight" value={latestWeight} detail={weightDelta} positive={fitness.weightDeltaKg !== null} />
          <StatBlock title="Goal Progress" value={latestProgress} detail={fitness.averageGoalProgressPercent === null ? 'No check-ins yet' : `${fitness.averageGoalProgressPercent}% average`} positive={(fitness.averageGoalProgressPercent ?? 0) >= 70} />
          <p className="inline-flex items-center gap-2 text-sm font-semibold text-violet-600"><HeartPulse size={16} />{fitness.points.length ? 'Trainer data connected' : 'Waiting for trainer data'}</p>
        </div>
        <LineChart points={fitness.points} emptyMessage="No trainer weight check-ins have been recorded yet." valueSuffix=" kg" />
      </div>
    </Card>
  );
}

function MindWellbeingCard({ mind }: { mind: ClientProgressResponse['mind'] }) {
  return (
    <Card className="p-5">
      <CardTitle
        icon={<Sparkles size={25} />}
        title="Mind Well-being"
        subtitle="CBT mood trend from submitted exercises"
        action={<StatusPill label={mind.statusLabel} icon={<SmilePlus size={14} />} />}
      />
      <div className="mt-5 grid gap-5 lg:grid-cols-[170px_minmax(0,1fr)]">
        <div className="space-y-4">
          <StatBlock title="Weekly Check-ins" value={String(mind.weeklyCheckInsCompleted)} valueSuffix={`/${mind.weeklyCheckInsTotal}`} detail="completed" />
          <StatBlock title="Current Mood" value={mind.currentMood} />
          <StatBlock title="Trend" value={mind.trendLabel} positive={mind.trendLabel === 'Improving'} />
        </div>
        <MoodChart points={mind.points} />
      </div>
    </Card>
  );
}

function GoalProgressCard({ goals }: { goals: ClientProgressGoal[] }) {
  return (
    <Card className="p-5">
      <CardTitle icon={<Target size={23} />} title="Goal Progress" />
      <div className="mt-5 space-y-4">
        {goals.length ? goals.map((goal) => {
          const Icon = goal.category === 'training' ? Dumbbell : goal.category === 'mind' ? Sparkles : HeartPulse;
          const tone = goal.category === 'training' ? 'text-blue-600' : goal.category === 'mind' ? 'text-violet-600' : 'text-emerald-600';
          return (
            <div key={goal.id} className="grid grid-cols-[minmax(128px,1fr)_minmax(96px,140px)_36px] items-center gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <Icon size={18} className={tone} />
                <span className="truncate text-sm font-medium text-slate-600">{goal.label}</span>
              </div>
              <div className="h-2 rounded-full bg-slate-100">
                <div className="h-2 rounded-full bg-violet-600" style={{ width: `${clamp(goal.value, 0, 100)}%` }} />
              </div>
              <span className="text-right text-sm font-semibold text-slate-700">{goal.value}%</span>
            </div>
          );
        }) : <EmptyState text="No care goals have been created yet." />}
      </div>
      <InlineLink label="View CBT goals" href="/client/cbt/plan" />
    </Card>
  );
}

function BodyMetricsCard({ metrics }: { metrics: ClientProgressMetric[] }) {
  return (
    <Card className="p-5">
      <CardTitle icon={<BarChart3 size={23} />} title="Body Metrics Snapshot" />
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {metrics.length ? metrics.map((metric) => (
          <MiniMetric key={metric.label} label={metric.label} value={metric.value} detail={metric.detail} positive={metric.positive} />
        )) : <div className="sm:col-span-2"><EmptyState text="No body metrics are available from trainer check-ins yet." /></div>}
      </div>
      <InlineLink label="Book a check-in" href="/client/appointments" />
    </Card>
  );
}

function MilestonesCard({ milestones }: { milestones: ClientProgressMilestone[] }) {
  return (
    <Card className="p-5">
      <CardTitle icon={<Flag size={23} />} title="Upcoming Milestones" />
      <div className="mt-5 space-y-4">
        {milestones.length ? milestones.map((milestone) => {
          const Icon = milestone.category === 'training' ? CheckCircle2 : milestone.category === 'mind' ? SmilePlus : Calendar;
          const tone = milestone.category === 'training' ? 'text-emerald-600' : milestone.category === 'mind' ? 'text-amber-600' : 'text-violet-600';
          return (
            <div key={`${milestone.title}-${milestone.subtitle}`} className="flex items-center gap-3">
              <Icon size={20} className={`shrink-0 ${tone}`} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate-950">{milestone.title}</p>
                <p className="text-sm text-slate-500">{milestone.subtitle}</p>
              </div>
              <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700">{milestone.value}%</span>
            </div>
          );
        }) : <EmptyState text="Milestones will appear after goals or check-ins are recorded." />}
      </div>
      <InlineLink label="View appointments" href="/client/appointments" />
    </Card>
  );
}

function ResourcesCard({ resources }: { resources: ClientProgressResource[] }) {
  return (
    <Card className="p-5">
      <CardTitle icon={<Library size={23} />} title="Recommended Resources" />
      <div className="mt-5 space-y-3">
        {resources.length ? resources.map((resource, index) => (
          <a key={`${resource.kind}-${resource.title}-${index}`} href={resource.kind === 'mind' ? '/client/cbt/exercises' : '/client/appointments'} className="flex items-center gap-3 rounded-lg p-1.5 transition hover:bg-slate-50">
            <img src={resource.image} alt="" className="h-12 w-16 shrink-0 rounded-md object-cover" />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-semibold text-slate-950">{resource.title}</span>
              <span className="block truncate text-xs font-medium text-slate-500">{resource.subtitle}</span>
            </span>
            <ArrowRight size={16} className="shrink-0 text-slate-400" />
          </a>
        )) : <EmptyState text="No assigned exercises or scheduled training activities yet." />}
      </div>
      <InlineLink label="Browse CBT care" href="/client/cbt" />
    </Card>
  );
}

function QuickActionsCard() {
  const actions = [
    { label: 'Message Counsellor', Icon: MessageCircle, href: '/client/cbt' },
    { label: 'Book Session', Icon: Calendar, href: '/client/appointments' },
    { label: 'View Reports', Icon: BarChart3, href: '/client/cbt/progress' },
    { label: 'Log Check-in', Icon: CheckCircle2, href: '/client/cbt/exercises' },
  ];
  return (
    <Card className="p-5">
      <CardTitle icon={<Zap size={23} />} title="Quick Actions" />
      <div className="mt-5 space-y-3">
        {actions.map(({ label, Icon, href }) => (
          <a key={label} href={href} className="flex min-h-11 w-full items-center gap-3 rounded-lg bg-violet-50 px-4 text-left text-sm font-semibold text-violet-700 transition hover:bg-violet-100">
            <Icon size={18} />
            {label}
          </a>
        ))}
      </div>
    </Card>
  );
}

function RecentActivityCard({ activities }: { activities: ClientProgressActivity[] }) {
  const toneClass: Record<string, string> = {
    training: 'bg-blue-50 text-blue-600 ring-blue-100',
    cbt: 'bg-violet-50 text-violet-600 ring-violet-100',
    mind: 'bg-violet-50 text-violet-600 ring-violet-100',
    auth: 'bg-emerald-50 text-emerald-600 ring-emerald-100',
    appointment: 'bg-amber-50 text-amber-600 ring-amber-100',
    account: 'bg-emerald-50 text-emerald-600 ring-emerald-100',
  };

  return (
    <Card className="p-5">
      <div className="grid gap-4 xl:grid-cols-[minmax(180px,220px)_minmax(0,1fr)_auto] xl:items-center">
        <CardTitle icon={<HeartPulse size={21} />} title="Recent Activity" />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {activities.length ? activities.slice(0, 4).map((activity) => (
            <article key={activity.id} className="flex min-w-0 items-center gap-3 border-slate-200 xl:border-l xl:pl-5">
              <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-full ring-8 ${toneClass[activity.category ?? 'account'] ?? 'bg-slate-50 text-slate-600 ring-slate-100'}`}>
                <Check size={21} />
              </span>
              <div className="min-w-0">
                <h3 className="truncate text-sm font-semibold text-slate-950">{activity.title}</h3>
                <p className="truncate text-sm text-slate-500">{activity.subtitle}</p>
                <p className="mt-0.5 truncate text-xs font-medium text-slate-400">{activity.time}</p>
              </div>
            </article>
          )) : <div className="md:col-span-2 xl:col-span-4"><EmptyState text="No activity has been recorded yet." /></div>}
        </div>
        <a href="/client/activity" className="inline-flex items-center justify-end gap-2 text-sm font-semibold text-violet-600 transition hover:text-violet-700">
          View all activity
          <ArrowRight size={16} />
        </a>
      </div>
    </Card>
  );
}

function StatusPill({ label, icon }: { label: string; icon: ReactNode }) {
  return (
    <span className="hidden max-w-[260px] items-center gap-2 truncate rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-semibold text-emerald-700 sm:inline-flex">
      {icon}
      <span className="truncate">{label}</span>
    </span>
  );
}

function StatBlock({
  title,
  value,
  valueSuffix,
  detail,
  positive = false,
}: {
  title: string;
  value: string;
  valueSuffix?: string;
  detail?: string;
  positive?: boolean;
}) {
  return (
    <div className="border-b border-slate-200 pb-4 last:border-b-0 last:pb-0">
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <p className="mt-1 text-2xl font-semibold leading-none text-slate-950">
        {value}
        {valueSuffix ? <span className="ml-1 text-base font-semibold text-slate-500">{valueSuffix}</span> : null}
      </p>
      {detail !== undefined ? (
        <p className={`mt-2 text-sm font-semibold ${positive ? 'text-emerald-600' : 'text-slate-500'}`}>
          {positive ? <TrendingUp size={14} className="mr-1 inline" /> : null}
          {detail || 'Improving'}
        </p>
      ) : null}
    </div>
  );
}

function MiniMetric({ label, value, detail, positive = false }: { label: string; value: string; detail: string; positive?: boolean }) {
  return (
    <div className="rounded-lg bg-slate-50 p-4">
      <p className="text-xs font-semibold text-slate-500">{label}</p>
      <p className="mt-2 text-xl font-semibold text-slate-950">{value}</p>
      <p className={`mt-1 text-xs font-semibold ${positive ? 'text-emerald-600' : 'text-slate-500'}`}>{positive ? <TrendingUp size={12} className="mr-1 inline" /> : null}{detail}</p>
    </div>
  );
}

function InlineLink({ label, href }: { label: string; href: string }) {
  return (
    <a href={href} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-violet-600 transition hover:text-violet-700">
      {label}
      <ArrowRight size={15} />
    </a>
  );
}

function EmptyState({ text }: { text: string }) {
  return <p className="rounded-lg bg-slate-50 px-4 py-3 text-sm font-medium text-slate-500">{text}</p>;
}

function LineChart({ points, emptyMessage, valueSuffix = '' }: { points: ClientProgressPoint[]; emptyMessage: string; valueSuffix?: string }) {
  const chart = useChart(points);
  if (!chart) {
    return <div className="grid h-[250px] place-items-center rounded-lg bg-slate-50"><EmptyState text={emptyMessage} /></div>;
  }

  const last = chart.coords[chart.coords.length - 1];
  const callout = `${points[points.length - 1].value}${valueSuffix}`;

  return (
    <div className="min-w-0">
      <svg viewBox={`0 0 ${chart.width} ${chart.height}`} className="h-[250px] w-full overflow-visible">
        <defs>
          <linearGradient id="fitnessArea" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        {chart.ticks.map((tick) => {
          const y = chart.pad + (1 - (tick - chart.min) / (chart.max - chart.min)) * chart.chartHeight;
          return (
            <g key={tick}>
              <text x="0" y={y + 4} className="fill-slate-500 text-[13px] font-medium">{formatTick(tick)}</text>
              <line x1={chart.pad} x2={chart.pad + chart.chartWidth} y1={y} y2={y} stroke="#e2e8f0" strokeDasharray="4 6" />
            </g>
          );
        })}
        <path d={chart.areaPath} fill="url(#fitnessArea)" />
        <path d={chart.path} fill="none" stroke="#6d3df5" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
        {chart.coords.map(([x, y], index) => <circle key={index} cx={x} cy={y} r="4" fill="#6d3df5" stroke="#fff" strokeWidth="2" />)}
        <g>
          <rect x={last[0] - 52} y={last[1] - 58} width="78" height="36" rx="8" fill="#6d3df5" />
          <path d={`M ${last[0] - 4} ${last[1] - 22} L ${last[0] + 9} ${last[1] - 22} L ${last[0] + 9} ${last[1] - 10} Z`} fill="#6d3df5" />
          <text x={last[0] - 13} y={last[1] - 35} textAnchor="middle" className="fill-white text-[13px] font-semibold">{callout}</text>
        </g>
        {chart.labels.map(({ label, x, anchor }) => (
          <text key={`${label}-${x}`} x={x} y={chart.height - 8} textAnchor={anchor} className="fill-slate-500 text-[13px] font-medium">
            {label}
          </text>
        ))}
      </svg>
    </div>
  );
}

function MoodChart({ points }: { points: ClientProgressPoint[] }) {
  const chart = useChart(points, 1, 5);
  if (!chart) {
    return <div className="grid h-[250px] place-items-center rounded-lg bg-slate-50"><EmptyState text="No CBT mood responses have been submitted yet." /></div>;
  }

  const moodLabels = ['Excellent', 'Good', 'Neutral', 'Low', 'Poor'];

  return (
    <div className="min-w-0">
      <svg viewBox={`0 0 ${chart.width} ${chart.height}`} className="h-[250px] w-full overflow-visible">
        <defs>
          <linearGradient id="moodArea" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.03" />
          </linearGradient>
        </defs>
        {moodLabels.map((label, index) => {
          const y = chart.pad + (index / (moodLabels.length - 1)) * chart.chartHeight;
          return (
            <g key={label}>
              <text x="0" y={y + 4} className="fill-slate-500 text-[13px] font-medium">{label}</text>
              <line x1={chart.pad + 72} x2={chart.pad + chart.chartWidth} y1={y} y2={y} stroke="#e2e8f0" strokeDasharray="4 6" />
            </g>
          );
        })}
        <path d={chart.areaPath} fill="url(#moodArea)" transform="translate(72 0) scale(0.88 1)" />
        <path d={chart.path} fill="none" stroke="#6d3df5" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" transform="translate(72 0) scale(0.88 1)" />
        {chart.coords.map(([x, y], index) => <circle key={index} cx={72 + x * 0.88} cy={y} r="4" fill="#6d3df5" stroke="#fff" strokeWidth="2" />)}
        {chart.labels.map(({ label, x, anchor }) => (
          <text key={`${label}-${x}`} x={72 + x * 0.88} y={chart.height - 8} textAnchor={anchor} className="fill-slate-500 text-[13px] font-medium">
            {label}
          </text>
        ))}
      </svg>
    </div>
  );
}

function MiniSparkline({ points, className }: { points: number[]; className?: string }) {
  const safePoints = points.length > 1 ? points : [0, 0];
  const width = 150;
  const height = 45;
  const min = Math.min(...safePoints);
  const max = Math.max(...safePoints);
  const spread = max - min || 1;
  const coords = safePoints.map((point, index) => {
    const x = (index / (safePoints.length - 1)) * width;
    const y = height - 8 - ((point - min) / spread) * (height - 16);
    return [x, y] as const;
  });
  const path = coords.map(([x, y], index) => `${index ? 'L' : 'M'} ${x} ${y}`).join(' ');
  const peak = coords[safePoints.indexOf(max)] ?? coords[coords.length - 1];

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className={className}>
      <path d={path} fill="none" stroke="#6d3df5" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" />
      <circle cx={peak[0]} cy={peak[1]} r="3" fill="#6d3df5" />
    </svg>
  );
}

function useChart(points: ClientProgressPoint[], forcedMin?: number, forcedMax?: number) {
  return useMemo(() => {
    if (points.length < 2) return null;

    const width = 620;
    const height = 230;
    const pad = 28;
    const chartWidth = width - pad * 2;
    const chartHeight = height - 48;
    const values = points.map((point) => point.value);
    const rawMin = forcedMin ?? Math.min(...values);
    const rawMax = forcedMax ?? Math.max(...values);
    const spread = rawMax - rawMin || 1;
    const min = forcedMin ?? Math.floor(rawMin - spread * 0.12);
    const max = forcedMax ?? Math.ceil(rawMax + spread * 0.12);
    const coords = points.map((point, index) => {
      const x = pad + (index / (points.length - 1)) * chartWidth;
      const y = pad + (1 - (point.value - min) / (max - min)) * chartHeight;
      return [x, y] as const;
    });
    const path = coords.map(([x, y], index) => `${index ? 'L' : 'M'} ${x} ${y}`).join(' ');
    const areaPath = `${path} L ${pad + chartWidth} ${pad + chartHeight} L ${pad} ${pad + chartHeight} Z`;
    const ticks = Array.from({ length: 5 }, (_, index) => min + ((max - min) / 4) * index);
    const labelIndexes = Array.from(new Set([0, Math.floor((points.length - 1) * 0.25), Math.floor((points.length - 1) * 0.5), Math.floor((points.length - 1) * 0.75), points.length - 1]));
    const labels = labelIndexes.map((pointIndex) => ({
      label: points[pointIndex].label || (pointIndex === 0 ? 'Start' : pointIndex === points.length - 1 ? 'Latest' : ''),
      x: pad + (pointIndex / (points.length - 1)) * chartWidth,
      anchor: pointIndex === 0 ? 'start' as const : pointIndex === points.length - 1 ? 'end' as const : 'middle' as const,
    })).filter((item) => item.label);

    return { width, height, pad, chartWidth, chartHeight, min, max, coords, path, areaPath, ticks, labels };
  }, [forcedMax, forcedMin, points]);
}

function sparklineFrom(data: ClientProgressResponse) {
  const values = [
    ...data.fitness.points.map((point) => point.value),
    ...data.mind.points.map((point) => point.value * 20),
    ...data.goals.map((goal) => goal.value),
  ];

  return values.length > 1 ? values.slice(-10) : [0, data.summary.wellnessScore];
}

function deltaLabel(value: number, suffix: string) {
  if (value === 0) return `0 ${suffix}`;
  return `${value > 0 ? '+' : ''}${value} ${suffix}`;
}

function formatTick(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}
