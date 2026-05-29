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

const fitnessPoints = [69.2, 69.6, 69.3, 70.2, 70.9, 70.1, 70.5, 70.8, 70.8, 71.3, 71.6, 71.2, 72, 71.8, 72.3];
const moodPoints = [2.2, 3.3, 2.7, 3.0, 2.3, 2.2, 3.3, 3.6, 2.7, 3.5, 3.3, 3.8, 4.0];

const goals = [
  { label: 'Sleep Routine', value: 80, Icon: Moon, tone: 'text-violet-600' },
  { label: 'Stress Management', value: 65, Icon: Sparkles, tone: 'text-purple-600' },
  { label: 'Workout Consistency', value: 90, Icon: Dumbbell, tone: 'text-blue-600' },
  { label: 'Mindfulness Practice', value: 55, Icon: HeartPulse, tone: 'text-emerald-600' },
];

const resources = [
  {
    title: 'Workout Plan',
    subtitle: 'Personalized exercises for you',
    image: '/images/trainer/live-session/dumbbell-bench-press.jpg',
  },
  {
    title: 'Guided Meditation',
    subtitle: 'Relax and recharge your mind',
    image: '/images/trainer/live-session/plank-hold.jpg',
  },
  {
    title: 'Nutrition Tips',
    subtitle: 'Healthy eating made simple',
    image: '/images/trainer/live-session/seated-cable-row.jpg',
  },
];

const milestones = [
  { title: 'Reach 10-session streak', subtitle: '3 sessions to go', value: 70, Icon: Calendar, tone: 'text-violet-600' },
  { title: 'Complete nutrition review', subtitle: 'Book your review', value: 50, Icon: CheckCircle2, tone: 'text-emerald-600' },
  { title: 'Mood check-in for 5 days', subtitle: '2 more days to go', value: 60, Icon: SmilePlus, tone: 'text-amber-600' },
];

const recentActivity = [
  { title: 'Completed Personal Training session', subtitle: 'Full body strength workout', time: 'Today - 10:30 AM', Icon: Check, tone: 'emerald' },
  { title: 'Mood check-in submitted', subtitle: 'Feeling positive and motivated', time: 'Yesterday - 8:45 PM', Icon: SmilePlus, tone: 'violet' },
  { title: 'Meditation streak reached 5 days', subtitle: 'Great consistency!', time: 'May 14, 2025 - 7:30 AM', Icon: Sparkles, tone: 'blue' },
  { title: 'Logged nutrition', subtitle: 'Daily meals and water intake', time: 'May 13, 2025 - 9:15 PM', Icon: Flame, tone: 'amber' },
];

export default function ClientProgramsPage() {
  return (
    <div className="mx-auto w-full max-w-[1500px] space-y-5 pb-6">
      <header>
        <h1 className="text-[26px] font-semibold leading-tight text-slate-950">My Progress</h1>
        <p className="mt-1 text-sm font-medium text-slate-500">Monitor your physical and mental well-being.</p>
      </header>

      <section className="grid gap-4 xl:grid-cols-4">
        <WellnessScoreCard />
        <MetricCard icon={<Calendar size={27} />} title="Sessions Completed" value="12" detail="This month" badge="2 vs last month" tone="violet" />
        <MetricCard icon={<Flame size={28} />} title="Current Streak" value="7" valueSuffix="days" badge="Keep it going!" tone="purple" />
        <MetricCard icon={<Target size={29} />} title="Goals on Track" value="4" valueSuffix="of 5" badge="80% on track" tone="blue" />
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <FitnessProgressCard />
        <MindWellbeingCard />
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-[1.18fr_1fr_1fr_1.05fr_1.05fr]">
        <GoalProgressCard />
        <BodyMetricsCard />
        <MilestonesCard />
        <ResourcesCard />
        <QuickActionsCard />
      </section>

      <RecentActivityCard />
    </div>
  );
}

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
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
  icon?: React.ReactNode;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
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

function WellnessScoreCard() {
  return (
    <Card className="min-h-[140px] p-5">
      <div className="flex h-full items-center gap-5">
        <div className="relative grid h-[94px] w-[94px] shrink-0 place-items-center">
          <svg viewBox="0 0 110 110" className="absolute inset-0 h-full w-full -rotate-90">
            <circle cx="55" cy="55" r="44" fill="none" stroke="#ede9fe" strokeWidth="9" />
            <circle cx="55" cy="55" r="44" fill="none" stroke="#6d3df5" strokeDasharray="276" strokeDashoffset="61" strokeLinecap="round" strokeWidth="9" />
          </svg>
          <div className="text-center">
            <p className="text-[25px] font-semibold leading-none text-slate-950">78</p>
            <p className="mt-1 text-[11px] font-semibold text-slate-500">/100</p>
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h2 className="truncate text-sm font-semibold text-slate-950">Overall Wellness Score</h2>
            <span className="grid h-4 w-4 place-items-center rounded-full border border-slate-300 text-[10px] font-bold text-slate-400">i</span>
          </div>
          <p className="mt-4 text-sm font-semibold text-emerald-600">Up 6 points <ArrowUpRight size={14} className="inline" /></p>
          <p className="text-sm text-slate-500">this month</p>
          <MiniSparkline className="mt-3 h-9 w-full" />
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
  icon: React.ReactNode;
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

function FitnessProgressCard() {
  return (
    <Card className="p-5">
      <CardTitle
        icon={<Dumbbell size={24} />}
        title="Fitness Progress"
        subtitle="Weight and stamina trend over the last 8 weeks"
        action={<StatusPill label="Improving steadily" icon={<TrendingUp size={14} />} />}
      />
      <div className="mt-5 grid gap-5 lg:grid-cols-[170px_minmax(0,1fr)]">
        <div className="space-y-5">
          <StatBlock title="Current Weight" value="72 kg" detail="2.5 kg muscle gain" positive />
          <StatBlock title="Body Fat Trend" value="21.3%" detail="2.1% improving" positive />
          <p className="inline-flex items-center gap-2 text-sm font-semibold text-violet-600"><HeartPulse size={16} />Consistent progress!</p>
        </div>
        <LineChart points={fitnessPoints} min={68} max={74} labels={['8 wks ago', '6 wks ago', '4 wks ago', '2 wks ago', 'This week']} callout="72 kg" />
      </div>
    </Card>
  );
}

function MindWellbeingCard() {
  return (
    <Card className="p-5">
      <CardTitle
        icon={<Sparkles size={25} />}
        title="Mind Well-being"
        subtitle="Mood and emotional wellness trend"
        action={<StatusPill label="Feeling stable and positive" icon={<SmilePlus size={14} />} />}
      />
      <div className="mt-5 grid gap-5 lg:grid-cols-[170px_minmax(0,1fr)]">
        <div className="space-y-4">
          <StatBlock title="Weekly Check-ins" value="6" valueSuffix="/7" detail="completed" />
          <StatBlock title="Current Mood" value="Positive" />
          <StatBlock title="Trend" value="Improving" detail="" positive />
        </div>
        <MoodChart />
      </div>
    </Card>
  );
}

function GoalProgressCard() {
  return (
    <Card className="p-5">
      <CardTitle icon={<Target size={23} />} title="Goal Progress" />
      <div className="mt-5 space-y-4">
        {goals.map(({ label, value, Icon, tone }) => (
          <div key={label} className="grid grid-cols-[minmax(128px,1fr)_minmax(96px,140px)_36px] items-center gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <Icon size={18} className={tone} />
              <span className="truncate text-sm font-medium text-slate-600">{label}</span>
            </div>
            <div className="h-2 rounded-full bg-slate-100">
              <div className="h-2 rounded-full bg-violet-600" style={{ width: `${value}%` }} />
            </div>
            <span className="text-right text-sm font-semibold text-slate-700">{value}%</span>
          </div>
        ))}
      </div>
      <InlineLink label="View all goals" />
    </Card>
  );
}

function BodyMetricsCard() {
  return (
    <Card className="p-5">
      <CardTitle icon={<BarChart3 size={23} />} title="Body Metrics Snapshot" />
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <MiniMetric label="Weight" value="72 kg" detail="2.5 kg" positive />
        <MiniMetric label="BMI" value="24.1" detail="Healthy" />
        <MiniMetric label="Sleep Avg" value="7.1 hrs" detail="Good" />
        <MiniMetric label="Water Intake" value="2.3 L" detail="Good" />
      </div>
      <InlineLink label="View full metrics" />
    </Card>
  );
}

function MilestonesCard() {
  return (
    <Card className="p-5">
      <CardTitle icon={<Flag size={23} />} title="Upcoming Milestones" />
      <div className="mt-5 space-y-4">
        {milestones.map(({ title, subtitle, value, Icon, tone }) => (
          <div key={title} className="flex items-center gap-3">
            <Icon size={20} className={`shrink-0 ${tone}`} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-950">{title}</p>
              <p className="text-sm text-slate-500">{subtitle}</p>
            </div>
            <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700">{value}%</span>
          </div>
        ))}
      </div>
      <InlineLink label="View all milestones" />
    </Card>
  );
}

function ResourcesCard() {
  return (
    <Card className="p-5">
      <CardTitle icon={<Library size={23} />} title="Recommended Resources" />
      <div className="mt-5 space-y-3">
        {resources.map((resource) => (
          <a key={resource.title} href="#" className="flex items-center gap-3 rounded-lg p-1.5 transition hover:bg-slate-50">
            <img src={resource.image} alt="" className="h-12 w-16 shrink-0 rounded-md object-cover" />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-semibold text-slate-950">{resource.title}</span>
              <span className="block truncate text-xs font-medium text-slate-500">{resource.subtitle}</span>
            </span>
            <ArrowRight size={16} className="shrink-0 text-slate-400" />
          </a>
        ))}
      </div>
      <InlineLink label="Browse all resources" />
    </Card>
  );
}

function QuickActionsCard() {
  const actions = [
    { label: 'Message Counsellor', Icon: MessageCircle },
    { label: 'Book Session', Icon: Calendar },
    { label: 'View Reports', Icon: BarChart3 },
    { label: 'Log Check-in', Icon: CheckCircle2 },
  ];
  return (
    <Card className="p-5">
      <CardTitle icon={<Zap size={23} />} title="Quick Actions" />
      <div className="mt-5 space-y-3">
        {actions.map(({ label, Icon }) => (
          <button key={label} type="button" className="flex min-h-11 w-full items-center gap-3 rounded-lg bg-violet-50 px-4 text-left text-sm font-semibold text-violet-700 transition hover:bg-violet-100">
            <Icon size={18} />
            {label}
          </button>
        ))}
      </div>
    </Card>
  );
}

function RecentActivityCard() {
  const toneClass: Record<string, string> = {
    emerald: 'bg-emerald-50 text-emerald-600 ring-emerald-100',
    violet: 'bg-violet-50 text-violet-600 ring-violet-100',
    blue: 'bg-blue-50 text-blue-600 ring-blue-100',
    amber: 'bg-amber-50 text-amber-600 ring-amber-100',
  };

  return (
    <Card className="p-5">
      <div className="grid gap-4 xl:grid-cols-[minmax(180px,220px)_minmax(0,1fr)_auto] xl:items-center">
        <CardTitle icon={<HeartPulse size={21} />} title="Recent Activity" />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {recentActivity.map(({ title, subtitle, time, Icon, tone }) => (
            <article key={title} className="flex min-w-0 items-center gap-3 border-slate-200 xl:border-l xl:pl-5">
              <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-full ring-8 ${toneClass[tone]}`}>
                <Icon size={21} />
              </span>
              <div className="min-w-0">
                <h3 className="truncate text-sm font-semibold text-slate-950">{title}</h3>
                <p className="truncate text-sm text-slate-500">{subtitle}</p>
                <p className="mt-0.5 truncate text-xs font-medium text-slate-400">{time}</p>
              </div>
            </article>
          ))}
        </div>
        <a href="/client/activity" className="inline-flex items-center justify-end gap-2 text-sm font-semibold text-violet-600 transition hover:text-violet-700">
          View all activity
          <ArrowRight size={16} />
        </a>
      </div>
    </Card>
  );
}

function StatusPill({ label, icon }: { label: string; icon: React.ReactNode }) {
  return (
    <span className="hidden items-center gap-2 rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-semibold text-emerald-700 sm:inline-flex">
      {icon}
      {label}
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
      <p className="mt-1 text-xs font-semibold text-emerald-600">{positive ? <TrendingUp size={12} className="mr-1 inline" /> : null}{detail}</p>
    </div>
  );
}

function InlineLink({ label }: { label: string }) {
  return (
    <a href="#" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-violet-600 transition hover:text-violet-700">
      {label}
      <ArrowRight size={15} />
    </a>
  );
}

function LineChart({ points, min, max, labels, callout }: { points: number[]; min: number; max: number; labels: string[]; callout: string }) {
  const width = 620;
  const height = 230;
  const pad = 28;
  const chartWidth = width - pad * 2;
  const chartHeight = height - 48;
  const coords = points.map((point, index) => {
    const x = pad + (index / (points.length - 1)) * chartWidth;
    const y = pad + (1 - (point - min) / (max - min)) * chartHeight;
    return [x, y] as const;
  });
  const path = coords.map(([x, y], index) => `${index ? 'L' : 'M'} ${x} ${y}`).join(' ');
  const areaPath = `${path} L ${pad + chartWidth} ${pad + chartHeight} L ${pad} ${pad + chartHeight} Z`;
  const last = coords[coords.length - 1];

  return (
    <div className="min-w-0">
      <svg viewBox={`0 0 ${width} ${height}`} className="h-[250px] w-full overflow-visible">
        <defs>
          <linearGradient id="fitnessArea" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        {[68, 69, 70, 71, 72, 73, 74].map((tick) => {
          const y = pad + (1 - (tick - min) / (max - min)) * chartHeight;
          return (
            <g key={tick}>
              <text x="0" y={y + 4} className="fill-slate-500 text-[13px] font-medium">{tick}</text>
              <line x1={pad} x2={pad + chartWidth} y1={y} y2={y} stroke="#e2e8f0" strokeDasharray="4 6" />
            </g>
          );
        })}
        <path d={areaPath} fill="url(#fitnessArea)" />
        <path d={path} fill="none" stroke="#6d3df5" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
        {coords.map(([x, y], index) => <circle key={index} cx={x} cy={y} r="4" fill="#6d3df5" stroke="#fff" strokeWidth="2" />)}
        <g>
          <rect x={last[0] - 48} y={last[1] - 58} width="70" height="36" rx="8" fill="#6d3df5" />
          <path d={`M ${last[0] - 4} ${last[1] - 22} L ${last[0] + 9} ${last[1] - 22} L ${last[0] + 9} ${last[1] - 10} Z`} fill="#6d3df5" />
          <text x={last[0] - 13} y={last[1] - 35} textAnchor="middle" className="fill-white text-[13px] font-semibold">{callout}</text>
        </g>
        {labels.map((label, index) => (
          <text key={label} x={pad + (index / (labels.length - 1)) * chartWidth} y={height - 8} textAnchor={index === 0 ? 'start' : index === labels.length - 1 ? 'end' : 'middle'} className="fill-slate-500 text-[13px] font-medium">
            {label}
          </text>
        ))}
      </svg>
    </div>
  );
}

function MoodChart() {
  const width = 620;
  const height = 230;
  const pad = 28;
  const labels = ['Excellent', 'Good', 'Neutral', 'Low', 'Poor'];
  const chartWidth = width - pad * 2;
  const chartHeight = height - 48;
  const coords = moodPoints.map((point, index) => {
    const x = pad + (index / (moodPoints.length - 1)) * chartWidth;
    const y = pad + (1 - (point - 1) / 4) * chartHeight;
    return [x, y] as const;
  });
  const path = coords.map(([x, y], index) => `${index ? 'L' : 'M'} ${x} ${y}`).join(' ');
  const areaPath = `${path} L ${pad + chartWidth} ${pad + chartHeight} L ${pad} ${pad + chartHeight} Z`;

  return (
    <div className="min-w-0">
      <svg viewBox={`0 0 ${width} ${height}`} className="h-[250px] w-full overflow-visible">
        <defs>
          <linearGradient id="moodArea" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.03" />
          </linearGradient>
        </defs>
        {labels.map((label, index) => {
          const y = pad + (index / (labels.length - 1)) * chartHeight;
          return (
            <g key={label}>
              <text x="0" y={y + 4} className="fill-slate-500 text-[13px] font-medium">{label}</text>
              <line x1={pad + 72} x2={pad + chartWidth} y1={y} y2={y} stroke="#e2e8f0" strokeDasharray="4 6" />
            </g>
          );
        })}
        <path d={areaPath} fill="url(#moodArea)" transform="translate(72 0) scale(0.88 1)" />
        <path d={path} fill="none" stroke="#6d3df5" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" transform="translate(72 0) scale(0.88 1)" />
        {coords.map(([x, y], index) => <circle key={index} cx={72 + x * 0.88} cy={y} r="4" fill="#6d3df5" stroke="#fff" strokeWidth="2" />)}
        {['8 wks ago', '6 wks ago', '4 wks ago', '2 wks ago', 'This week'].map((label, index, all) => (
          <text key={label} x={pad + 72 + (index / (all.length - 1)) * (chartWidth * 0.88)} y={height - 8} textAnchor={index === 0 ? 'start' : index === all.length - 1 ? 'end' : 'middle'} className="fill-slate-500 text-[13px] font-medium">
            {label}
          </text>
        ))}
      </svg>
    </div>
  );
}

function MiniSparkline({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 150 45" className={className}>
      <path d="M3 36 L22 24 L36 30 L52 17 L66 21 L85 5 L102 28 L120 24 L137 37 L149 23" fill="none" stroke="#6d3df5" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" />
      <circle cx="85" cy="5" r="3" fill="#6d3df5" />
    </svg>
  );
}
