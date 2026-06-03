import { useNavigate } from 'react-router';
import {
  Activity,
  Apple,
  ArrowRight,
  BarChart3,
  Brain,
  CalendarDays,
  ClipboardCheck,
  Dumbbell,
  Flame,
  Heart,
  Leaf,
  MapPin,
  MessageCircle,
  ShieldCheck,
  SmilePlus,
  Video,
  type LucideIcon,
} from 'lucide-react';
import { getAuthState } from '../../auth/auth';

type Tone = 'violet' | 'blue' | 'green' | 'orange';

const toneStyles: Record<Tone, {
  dot: string;
  iconWrap: string;
  icon: string;
  tile: string;
  pill: string;
}> = {
  violet: {
    dot: 'bg-violet-600',
    iconWrap: 'bg-violet-50',
    icon: 'text-violet-600',
    tile: 'bg-violet-50 text-violet-700',
    pill: 'bg-violet-50 text-violet-700',
  },
  blue: {
    dot: 'bg-blue-600',
    iconWrap: 'bg-blue-50',
    icon: 'text-blue-600',
    tile: 'bg-blue-50 text-blue-700',
    pill: 'bg-blue-50 text-blue-700',
  },
  green: {
    dot: 'bg-emerald-500',
    iconWrap: 'bg-emerald-50',
    icon: 'text-emerald-600',
    tile: 'bg-emerald-50 text-emerald-700',
    pill: 'bg-emerald-50 text-emerald-700',
  },
  orange: {
    dot: 'bg-amber-500',
    iconWrap: 'bg-orange-50',
    icon: 'text-orange-500',
    tile: 'bg-orange-50 text-orange-700',
    pill: 'bg-orange-50 text-orange-700',
  },
};

const scheduleItems = [
  { time: '6:00 PM', title: 'Personal Training', coach: 'Coach Alex', location: 'In-Person', detail: 'Studio A', status: 'Upcoming', tone: 'violet' as Tone, Icon: Dumbbell, LocationIcon: MapPin },
  { time: '7:30 PM', title: 'Psychology Session', coach: 'Dr. Sarah Malik', location: 'Online', detail: 'Video Call', status: 'Upcoming', tone: 'blue' as Tone, Icon: Brain, LocationIcon: Video },
  { time: '8:30 PM', title: 'Nutrition Follow-up', coach: 'Nutritionist Zara', location: 'Online', detail: 'Video Call', status: 'Confirmed', tone: 'green' as Tone, Icon: Apple, LocationIcon: Video },
  { time: '9:15 PM', title: 'Mindfulness Check-in', coach: 'Coach Rida', location: 'Online', detail: 'Video Call', status: 'Upcoming', tone: 'orange' as Tone, Icon: Activity, LocationIcon: Video },
];

const actions = [
  { label: 'Book Appointment', Icon: CalendarDays, tone: 'violet' as Tone, to: '/client/intake' },
  { label: 'Join Session', Icon: Video, tone: 'blue' as Tone, to: '/client/appointments' },
  { label: 'View Progress', Icon: BarChart3, tone: 'green' as Tone, to: '/client/programs' },
  { label: 'Message Coach', Icon: MessageCircle, tone: 'orange' as Tone, to: '/client/activity' },
];

const recentActivity = [
  { title: 'Completed Personal Training', detail: 'Coach Alex - May 20, 2024', time: '8:00 PM', Icon: Dumbbell, tone: 'violet' as Tone },
  { title: 'Personal Wellness Plan updated', detail: 'Coach Rida - May 19, 2024', time: '5:30 PM', Icon: Leaf, tone: 'green' as Tone },
  { title: 'Message from Dr. Sarah Malik', detail: 'May 19, 2024', time: '2:15 PM', Icon: MessageCircle, tone: 'blue' as Tone },
];

export default function ClientDashboardPage() {
  const user = getAuthState().user;
  const navigate = useNavigate();
  const displayName = user?.name ?? 'Client';

  return (
    <div className="mx-auto w-full max-w-[1500px] space-y-5 pb-6 lg:space-y-6">
      <header className="space-y-1">
        <h1 className="text-[28px] font-semibold leading-tight tracking-tight text-slate-950 sm:text-3xl">
          Welcome, {displayName}!
        </h1>
        <p className="text-base leading-6 text-slate-500 sm:text-lg">Let's build a healthier mind and body.</p>
      </header>

      <section className="grid gap-4 lg:hidden">
        <MetricCard icon={CalendarDays} tone="violet" label="Next Session" value="6:00 PM" badge="Training" />
        <MetricCard icon={ClipboardCheck} tone="blue" label="Tasks Pending" value="3" onClick={() => navigate('/client/tasks')} />
        <DailyCheckInCard />
        <QuickActionsCard onNavigate={navigate} />
      </section>

      <section className="hidden gap-4 sm:grid-cols-2 xl:grid-cols-4 lg:grid">
        <MetricCard icon={CalendarDays} tone="violet" label="Next Session" value="6:00 PM" badge="Training" />
        <MetricCard icon={ClipboardCheck} tone="blue" label="Tasks Pending" value="3" onClick={() => navigate('/client/tasks')} />
        <MetricCard icon={Leaf} tone="green" label="Active Program" value="Personal Wellness Plan" />
        <MetricCard icon={ShieldCheck} tone="orange" label="Membership Status" value="Active" valueClassName="text-emerald-600" />
      </section>

      <section className="hidden gap-5 xl:grid-cols-[minmax(0,1.02fr)_minmax(420px,0.98fr)] lg:grid">
        <div className="space-y-5">
          <Card>
            <div className="flex items-start justify-between gap-4">
              <SectionTitle icon={CalendarDays} title="Schedule Summary" subtitle="Your schedule for today" />
              <button
                type="button"
                onClick={() => navigate('/client/appointments')}
                className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-violet-600 transition hover:text-violet-700"
              >
                View Calendar
                <ArrowRight size={16} />
              </button>
            </div>

            <div className="mt-4 overflow-hidden rounded-lg border border-slate-200/80 bg-white">
              {scheduleItems.map((item, index) => (
                <ScheduleRow key={item.time} item={item} isLast={index === scheduleItems.length - 1} />
              ))}
            </div>

            <button
              type="button"
              onClick={() => navigate('/client/appointments')}
              className="mx-auto mt-4 flex items-center gap-2 text-sm font-semibold text-violet-600 transition hover:text-violet-700"
            >
              See Full Schedule
              <ArrowRight size={16} />
            </button>
          </Card>

          <RecentActivityCard />
        </div>

        <div className="space-y-5">
          <DailyCheckInCard />
          <QuickActionsCard onNavigate={navigate} />
          <ProgressSnapshotCard onNavigate={navigate} />
        </div>
      </section>
    </div>
  );
}

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <section className={`rounded-[14px] border border-slate-200 bg-white p-4 shadow-[0_14px_42px_-34px_rgba(15,23,42,0.34)] sm:p-5 ${className}`}>
      {children}
    </section>
  );
}

function SectionTitle({ icon: Icon, title, subtitle }: { icon: LucideIcon; title: string; subtitle?: string }) {
  return (
    <div className="flex min-w-0 items-start gap-3">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-violet-50 text-violet-600">
        <Icon size={21} />
      </span>
      <div className="min-w-0">
        <h2 className="text-lg font-semibold leading-6 text-slate-950">{title}</h2>
        {subtitle ? <p className="mt-0.5 text-sm text-slate-500">{subtitle}</p> : null}
      </div>
    </div>
  );
}

function MetricCard({
  icon: Icon,
  tone,
  label,
  value,
  badge,
  valueClassName = 'text-slate-950',
  onClick,
}: {
  icon: LucideIcon;
  tone: Tone;
  label: string;
  value: string;
  badge?: string;
  valueClassName?: string;
  onClick?: () => void;
}) {
  const content = (
    <>
      <span className={`grid h-14 w-14 shrink-0 place-items-center rounded-[18px] ${toneStyles[tone].iconWrap} ${toneStyles[tone].icon}`}>
        <Icon size={28} />
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-medium text-slate-500">{label}</span>
        <span className={`mt-1 block truncate text-xl font-semibold leading-tight ${valueClassName}`}>{value}</span>
        {badge ? <span className="mt-1 inline-flex rounded-full bg-violet-100 px-3 py-0.5 text-xs font-semibold text-violet-700">{badge}</span> : null}
      </span>
    </>
  );

  const className = 'flex min-h-[112px] items-center gap-4 rounded-[14px] border border-slate-200 bg-white p-4 text-left shadow-[0_14px_42px_-34px_rgba(15,23,42,0.34)] transition hover:border-slate-300 hover:shadow-[0_18px_46px_-34px_rgba(15,23,42,0.42)]';

  return onClick ? (
    <button type="button" onClick={onClick} className={className}>
      {content}
    </button>
  ) : (
    <article className={className}>{content}</article>
  );
}

function ScheduleRow({ item, isLast }: { item: (typeof scheduleItems)[number]; isLast: boolean }) {
  const Icon = item.Icon;
  const LocationIcon = item.LocationIcon;
  const styles = toneStyles[item.tone];

  return (
    <article className={`grid grid-cols-[82px_20px_minmax(0,1.2fr)_minmax(96px,0.9fr)_auto] items-center gap-3 px-3 py-3 ${isLast ? '' : 'border-b border-slate-100'} max-sm:grid-cols-[72px_18px_minmax(0,1fr)_auto] max-sm:gap-2`}>
      <p className="text-sm font-semibold text-slate-950">{item.time}</p>
      <div className="relative flex justify-center self-stretch">
        <span className={`mt-4 h-2.5 w-2.5 rounded-full ${styles.dot}`} />
        {!isLast ? <span className="absolute left-1/2 top-7 h-[calc(100%+1.5rem)] w-px -translate-x-1/2 bg-slate-200" /> : null}
      </div>
      <div className="flex min-w-0 items-center gap-3">
        <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-[14px] ${styles.iconWrap} ${styles.icon}`}>
          <Icon size={24} />
        </span>
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold leading-5 text-slate-950 max-sm:text-sm">{item.title}</h3>
          <p className="mt-1 truncate text-sm text-slate-500 max-sm:text-xs">{item.coach}</p>
        </div>
      </div>
      <div className="min-w-0 text-sm text-slate-500 max-sm:hidden">
        <p className="flex items-center gap-1.5 font-medium text-slate-600">
          <LocationIcon size={14} />
          {item.location}
        </p>
        <p className="mt-1 pl-5">{item.detail}</p>
      </div>
      <span className={`justify-self-end rounded-full px-3 py-1 text-xs font-semibold ${item.status === 'Confirmed' ? toneStyles.green.pill : toneStyles.violet.pill}`}>
        {item.status}
      </span>
    </article>
  );
}

function DailyCheckInCard() {
  return (
    <Card>
      <SectionTitle icon={Heart} title="Daily Check-in" subtitle="How are you feeling today?" />
      <div className="mt-5 flex items-center justify-between gap-2">
        {['😌', '😐', '😊', '🙂', '😆'].map((emoji) => (
          <button
            key={emoji}
            type="button"
            className={`grid h-12 w-12 place-items-center rounded-full border text-2xl transition hover:-translate-y-0.5 hover:border-violet-300 hover:bg-violet-50 sm:h-14 sm:w-14 ${emoji === '😊' ? 'border-violet-600 bg-white shadow-[0_10px_28px_-20px_rgba(124,58,237,0.85)]' : 'border-slate-200 bg-white'}`}
            aria-label={`Mood ${emoji}`}
          >
            {emoji}
          </button>
        ))}
      </div>
      <div className="mt-5 flex items-center gap-3 rounded-lg bg-violet-50 px-4 py-3 text-sm font-medium text-violet-700">
        <SmilePlus size={18} />
        <span>Small daily updates build long-term progress.</span>
      </div>
    </Card>
  );
}

function QuickActionsCard({ onNavigate }: { onNavigate: (to: string) => void }) {
  return (
    <Card>
      <h2 className="text-lg font-semibold text-slate-950">Quick Actions</h2>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-4">
        {actions.map((action) => {
          const Icon = action.Icon;
          const styles = toneStyles[action.tone];
          return (
            <button
              key={action.label}
              type="button"
              onClick={() => onNavigate(action.to)}
              className={`flex min-h-[76px] items-center justify-center gap-3 rounded-lg px-3 text-sm font-semibold transition hover:-translate-y-0.5 ${styles.tile}`}
            >
              <Icon size={24} />
              <span className="leading-5">{action.label}</span>
            </button>
          );
        })}
      </div>
    </Card>
  );
}

function ProgressSnapshotCard({ onNavigate }: { onNavigate: (to: string) => void }) {
  return (
    <Card>
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold text-slate-950">Wellness Progress Snapshot</h2>
        <button type="button" onClick={() => onNavigate('/client/programs')} className="text-sm font-semibold text-violet-600 transition hover:text-violet-700">
          View Progress
        </button>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <ProgressTile label="Sessions Completed" value="12" detail="This Month" tone="violet" />
        <ProgressTile label="Days Active" value="18" detail="This Month" tone="green" />
        <article className="flex min-h-[104px] items-center justify-between rounded-lg border border-slate-200 p-4">
          <div>
            <p className="text-xs font-medium text-slate-500">Current Streak</p>
            <p className="mt-2 text-2xl font-semibold text-slate-950">7 Days</p>
            <p className="mt-1 text-sm text-slate-500">Keep it up!</p>
          </div>
          <span className="grid h-14 w-14 place-items-center rounded-full bg-orange-50 text-orange-500">
            <Flame size={30} />
          </span>
        </article>
      </div>
    </Card>
  );
}

function ProgressTile({ label, value, detail, tone }: { label: string; value: string; detail: string; tone: 'violet' | 'green' }) {
  const lineColor = tone === 'violet' ? 'text-violet-600' : 'text-emerald-600';
  return (
    <article className="min-h-[104px] rounded-lg border border-slate-200 p-4">
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <div className="mt-2 flex items-end justify-between gap-3">
        <div>
          <p className={`text-2xl font-semibold ${lineColor}`}>{value}</p>
          <p className="mt-1 text-sm text-slate-500">{detail}</p>
        </div>
        <MiniTrend tone={tone} />
      </div>
    </article>
  );
}

function MiniTrend({ tone }: { tone: 'violet' | 'green' }) {
  const stroke = tone === 'violet' ? '#7c3aed' : '#10b981';
  const fill = tone === 'violet' ? '#ede9fe' : '#dcfce7';
  return (
    <svg width="72" height="42" viewBox="0 0 72 42" fill="none" aria-hidden="true">
      <path d="M2 40L16 31L27 24L38 27L49 17L60 14L70 4V40H2Z" fill={fill} />
      <path d="M2 40L16 31L27 24L38 27L49 17L60 14L70 4" stroke={stroke} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function RecentActivityCard() {
  return (
    <Card>
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold text-slate-950">Recent Activity</h2>
        <button type="button" className="text-sm font-semibold text-violet-600 transition hover:text-violet-700">
          View All
        </button>
      </div>
      <div className="mt-4 divide-y divide-slate-100">
        {recentActivity.map((activity) => {
          const Icon = activity.Icon;
          const styles = toneStyles[activity.tone];
          return (
            <article key={activity.title} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
              <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-full ${styles.iconWrap} ${styles.icon}`}>
                <Icon size={22} />
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-sm font-semibold text-slate-950">{activity.title}</h3>
                <p className="mt-0.5 truncate text-sm text-slate-500">{activity.detail}</p>
              </div>
              <p className="shrink-0 text-sm font-medium text-slate-500">{activity.time}</p>
              <ArrowRight size={16} className="shrink-0 text-slate-500" />
            </article>
          );
        })}
      </div>
    </Card>
  );
}
