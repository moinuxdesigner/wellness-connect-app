import type { ReactNode } from 'react';
import { Link } from 'react-router';
import {
  Activity,
  ArrowLeft,
  Bell,
  CheckCircle2,
  Circle,
  ClipboardPen,
  Dumbbell,
  ExternalLink,
  Flame,
  HeartPulse,
  Maximize,
  MessageSquareMore,
  MoreVertical,
  Pause,
  Play,
  Square,
  Star,
  Target,
  Timer,
  Zap,
} from 'lucide-react';
import { Textarea } from '../../../components/ui/textarea';
import type {
  ClientProfile,
  EnergyOption,
  ExerciseStatus,
  SessionMetric,
  WorkoutExercise,
  WorkoutPlan,
} from '../mockLiveSessionData';

export type SessionControlState = 'ready' | 'running' | 'paused' | 'ended';

function Panel({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <section className={`rounded-2xl border border-slate-200/80 bg-white shadow-[0_2px_14px_rgba(30,41,59,0.045)] ${className}`}>{children}</section>;
}

function PanelHeading({ icon, title, action }: { icon?: ReactNode; title: string; action?: ReactNode }) {
  return (
    <header className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        {icon ? <span className="text-indigo-600">{icon}</span> : null}
        <h2 className="text-base font-semibold text-[#111941]">{title}</h2>
      </div>
      {action}
    </header>
  );
}

export function LiveSessionTopbar({ timer, messageCount, ended }: { timer: string; messageCount: number; ended: boolean }) {
  return (
    <>
      <header className="relative hidden h-[78px] items-center border-b border-indigo-100 bg-white/95 px-8 lg:flex">
        <Link to="/trainer" className="inline-flex items-center gap-3 text-sm font-medium text-slate-600 transition hover:text-indigo-700">
          <ArrowLeft size={19} /> Back to Clients
        </Link>
        <div className="absolute left-1/2 flex -translate-x-1/2 items-center gap-4">
          <h1 className="text-xl font-semibold text-[#111941]">Live Session</h1>
          <span className={`h-3 w-3 rounded-full ${ended ? 'bg-slate-400' : 'bg-emerald-500'}`} />
          <span aria-live="polite" className="font-mono text-2xl font-semibold tracking-wide text-[#111941]">{timer}</span>
        </div>
        <div className="ml-auto flex items-center gap-3 text-[#111941]">
          <HeaderAction label="Messages" badge={messageCount}><MessageSquareMore size={21} /></HeaderAction>
          <HeaderAction label="Notifications"><Bell size={21} /></HeaderAction>
          <span className="mx-1 h-8 border-l border-slate-200" />
          <HeaderAction label="Fullscreen"><Maximize size={20} /></HeaderAction>
          <HeaderAction label="More actions"><MoreVertical size={20} /></HeaderAction>
        </div>
      </header>
      <section className="mx-5 mb-4 rounded-2xl border border-indigo-100 bg-white px-4 py-3 shadow-sm sm:mx-7 lg:hidden">
        <div className="flex items-center justify-between">
          <Link to="/trainer" className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-700"><ArrowLeft size={17} /> Clients</Link>
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#111941]">
            <span className={`h-2.5 w-2.5 rounded-full ${ended ? 'bg-slate-400' : 'bg-emerald-500'}`} /> Live Session
          </span>
          <span aria-live="polite" className="font-mono text-sm font-semibold text-[#111941]">{timer}</span>
        </div>
      </section>
    </>
  );
}

function HeaderAction({ children, label, badge }: { children: ReactNode; label: string; badge?: number }) {
  return (
    <button type="button" aria-label={label} className="relative rounded-lg p-2 transition hover:bg-indigo-50">
      {children}
      {badge ? <span className="absolute right-0 top-0 rounded-full bg-rose-500 px-1.5 text-[10px] font-semibold leading-4 text-white">{badge}</span> : null}
    </button>
  );
}

export function Client360Card({ client }: { client: ClientProfile }) {
  return (
    <Panel className="p-5">
      <PanelHeading
        title="Client 360"
        action={<button type="button" aria-label="Open client profile" className="text-slate-400 transition hover:text-indigo-600"><ExternalLink size={17} /></button>}
      />
      <div className="mt-5 flex items-center gap-4 border-b border-slate-100 pb-5">
        <img src={client.avatarUrl} alt={`${client.name} avatar`} className="h-[76px] w-[76px] rounded-full object-cover" />
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-semibold text-[#111941]">{client.name}</h3>
            <span className="rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">{client.status}</span>
          </div>
          <p className="mt-2 text-sm text-slate-500">{client.age} yrs <span className="mx-1">&bull;</span> {client.gender}</p>
        </div>
      </div>
      <InfoSection icon={<Target size={17} />} title="Goals">
        <div className="space-y-3">
          {client.goals.map((goal) => (
            <p key={goal.id} className="flex items-center gap-3 text-sm text-slate-700">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-50 text-indigo-600"><Dumbbell size={14} /></span>{goal.label}
            </p>
          ))}
        </div>
      </InfoSection>
      <InfoSection icon={<ClipboardPen size={17} />} title="Program">
        <p className="text-sm text-slate-700">{client.program}</p>
      </InfoSection>
      <InfoSection icon={<Activity size={17} />} title="Body Metrics (Latest)">
        <div className="space-y-3">
          {client.bodyMetrics.map((metric) => (
            <div key={metric.id} className="grid grid-cols-[1fr_auto_auto] items-center gap-4 text-sm">
              <span className="text-slate-600">{metric.label}</span>
              <strong className="font-medium text-[#111941]">{metric.value}</strong>
              <span className={metric.tone === 'healthy' ? 'rounded-md bg-emerald-50 px-2 py-1 text-emerald-700' : 'text-emerald-600'}>{metric.change}</span>
            </div>
          ))}
        </div>
      </InfoSection>
      <InfoSection icon={<Star size={17} />} title="Mobility Notes">
        <p className="text-sm leading-6 text-slate-600">{client.mobilityNotes.join(' ')}</p>
      </InfoSection>
      <InfoSection icon={<Activity size={17} />} title="Recent Activity" last>
        <div className="space-y-3">
          {client.recentActivity.map((activity) => (
            <div key={activity.label} className="flex items-center justify-between text-sm">
              <span className="text-slate-600">{activity.label}</span>
              <strong className={activity.tone === 'positive' ? 'font-medium text-emerald-600' : 'font-medium text-indigo-700'}>{activity.value}</strong>
            </div>
          ))}
        </div>
      </InfoSection>
    </Panel>
  );
}

function InfoSection({ icon, title, children, last = false }: { icon: ReactNode; title: string; children: ReactNode; last?: boolean }) {
  return (
    <section className={`py-4 ${last ? '' : 'border-b border-slate-100'}`}>
      <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#111941]">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">{icon}</span>{title}
      </h3>
      <div className="pl-1">{children}</div>
    </section>
  );
}

export function WorkoutPlanCard({
  plan,
  exercises,
  disabled,
  onStatusCycle,
  controls,
}: {
  plan: WorkoutPlan;
  exercises: WorkoutExercise[];
  disabled: boolean;
  onStatusCycle: (id: string) => void;
  controls: ReactNode;
}) {
  return (
    <Panel className="flex h-full flex-col p-4 sm:p-5">
      <PanelHeading title="Today&apos;s Workout Plan" />
      <div className="mt-4 flex items-center gap-3 rounded-xl border border-indigo-100/80 bg-indigo-50/20 px-3 py-3 sm:px-4">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-indigo-50 text-indigo-600"><Activity size={23} /></span>
        <span className="min-w-0 flex-1">
          <strong className="block text-sm font-semibold text-[#111941]">Warm-up</strong>
          <span className="block text-sm text-slate-600">{plan.warmup}</span>
        </span>
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 sm:text-sm"><CheckCircle2 size={17} /> Completed</span>
      </div>
      <h3 className="mt-5 text-sm font-semibold text-[#111941]">Main Workout</h3>
      <div className="mt-3 hidden overflow-hidden rounded-xl border border-slate-200 lg:block">
        <div className="grid grid-cols-[minmax(210px,1fr)_62px_68px_86px_118px] bg-white px-3 py-2.5 text-xs font-medium text-slate-500">
          <span>Exercise</span><span>Sets</span><span>Reps</span><span>Weight</span><span>Status</span>
        </div>
        {exercises.map((exercise) => (
          <WorkoutExerciseRow key={exercise.id} exercise={exercise} disabled={disabled} onStatusCycle={onStatusCycle} />
        ))}
      </div>
      <div className="mt-3 space-y-3 lg:hidden">
        {exercises.map((exercise) => (
          <WorkoutExerciseMobileCard key={exercise.id} exercise={exercise} disabled={disabled} onStatusCycle={onStatusCycle} />
        ))}
      </div>
      <InfoHighlight icon={<Target size={22} />} title="Session Goal" text={plan.sessionGoal} />
      <InfoHighlight icon={<Star size={22} />} title="Session Focus" text={plan.sessionFocus.join('  \u2022  ')} />
      <div className="mt-auto hidden pt-4 lg:block">{controls}</div>
    </Panel>
  );
}

export function WorkoutExerciseRow({ exercise, disabled, onStatusCycle }: { exercise: WorkoutExercise; disabled: boolean; onStatusCycle: (id: string) => void }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onStatusCycle(exercise.id)}
      className="grid w-full grid-cols-[minmax(210px,1fr)_62px_68px_86px_118px] items-center border-t border-slate-100 px-3 py-2 text-left text-sm transition hover:bg-indigo-50/30 disabled:pointer-events-none"
    >
      <span className="flex items-center gap-3 font-medium text-[#111941]">
        <img src={exercise.thumbnailUrl} alt="" className="h-10 w-12 rounded-md object-cover" />{exercise.name}
      </span>
      <span>{exercise.sets}</span><span>{exercise.reps}</span><span>{exercise.weight}</span>
      <ExerciseStatus status={exercise.status} />
    </button>
  );
}

export function WorkoutExerciseMobileCard({ exercise, disabled, onStatusCycle }: { exercise: WorkoutExercise; disabled: boolean; onStatusCycle: (id: string) => void }) {
  return (
    <button type="button" disabled={disabled} onClick={() => onStatusCycle(exercise.id)} className="flex w-full items-center gap-3 rounded-xl border border-slate-100 p-3 text-left transition hover:border-indigo-100 hover:bg-indigo-50/20 disabled:pointer-events-none">
      <img src={exercise.thumbnailUrl} alt="" className="h-14 w-16 rounded-lg object-cover" />
      <span className="min-w-0 flex-1">
        <strong className="block truncate text-sm font-semibold text-[#111941]">{exercise.name}</strong>
        <span className="mt-1 block text-xs text-slate-500">{exercise.sets} sets &bull; {exercise.reps} reps &bull; {exercise.weight}</span>
      </span>
      <ExerciseStatus status={exercise.status} compact />
    </button>
  );
}

function ExerciseStatus({ status, compact = false }: { status: ExerciseStatus; compact?: boolean }) {
  const icon = status === 'Complete'
    ? <CheckCircle2 size={compact ? 18 : 17} className="text-emerald-600" />
    : <Circle size={compact ? 18 : 17} className={status === 'In Progress' ? 'fill-indigo-50 text-indigo-600' : 'text-slate-400'} />;
  return (
    <span className={`inline-flex items-center gap-1.5 ${compact ? '' : 'text-xs font-medium'} ${
      status === 'Complete' ? 'text-emerald-600' : status === 'In Progress' ? 'text-indigo-600' : 'text-slate-500'
    }`}>
      {icon}<span className={compact ? 'sr-only' : ''}>{status}</span>
    </span>
  );
}

function InfoHighlight({ icon, title, text }: { icon: ReactNode; title: string; text: string }) {
  return (
    <div className="mt-4 flex gap-3 rounded-xl border border-indigo-100/70 bg-white p-3.5">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">{icon}</span>
      <span>
        <strong className="block text-sm font-semibold text-[#111941]">{title}</strong>
        <span className="mt-1 block text-sm text-slate-600">{text}</span>
      </span>
    </div>
  );
}

export function QuickNotesCard({ notes, onChange, disabled }: { notes: string; onChange: (value: string) => void; disabled: boolean }) {
  return (
    <Panel className="p-4 sm:p-5">
      <PanelHeading icon={<ClipboardPen size={17} />} title="Quick Notes" />
      <Textarea
        aria-label="Quick notes"
        disabled={disabled}
        value={notes}
        onChange={(event) => onChange(event.target.value)}
        className="mt-4 min-h-[106px] rounded-xl border-indigo-100 bg-indigo-50/30 px-4 py-3 text-sm leading-7 text-[#111941]"
      />
    </Panel>
  );
}

export function CoachObservationsCard({ observations }: { observations: string[] }) {
  return (
    <Panel className="p-4 sm:p-5">
      <PanelHeading icon={<Target size={17} />} title="Coach Observations" />
      <div className="mt-4 space-y-4">
        {observations.map((observation) => (
          <p key={observation} className="flex items-center gap-3 text-sm text-[#111941]">
            <CheckCircle2 size={20} className="shrink-0 fill-emerald-600 text-white" />{observation}
          </p>
        ))}
      </div>
    </Panel>
  );
}

export function EnergyCheckInCard({ options, selectedId, disabled, onSelect }: { options: EnergyOption[]; selectedId: EnergyOption['id']; disabled: boolean; onSelect: (id: EnergyOption['id']) => void }) {
  const colors = {
    rose: 'bg-rose-50 text-rose-500',
    amber: 'bg-amber-50 text-amber-500',
    blue: 'bg-blue-50 text-blue-500',
    green: 'bg-emerald-50 text-emerald-600',
  };
  return (
    <Panel className="p-4 sm:p-5">
      <PanelHeading icon={<Zap size={18} />} title="Energy Check-in" />
      <div className="mt-4 grid grid-cols-4 gap-2">
        {options.map((option) => {
          const selected = option.id === selectedId;
          return (
            <button
              key={option.id}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(option.id)}
              className={`flex min-h-[80px] flex-col items-center justify-center gap-2 rounded-xl border text-xs font-medium transition ${
                selected ? 'border-emerald-500 bg-emerald-50/50 text-[#111941]' : 'border-slate-200 bg-white text-slate-600 hover:border-indigo-200'
              } disabled:pointer-events-none`}
            >
              <span className={`flex h-9 w-9 items-center justify-center rounded-full text-2xl ${colors[option.color]}`}>{option.face}</span>
              {option.label}
            </button>
          );
        })}
      </div>
    </Panel>
  );
}

export function KeyMetricsCard({ metrics }: { metrics: SessionMetric[] }) {
  return (
    <Panel className="p-4 sm:p-5">
      <PanelHeading icon={<Activity size={18} />} title="Key Metrics (Today)" />
      <div className="mt-4 divide-y divide-slate-100">
        {metrics.map((metric) => (
          <div key={metric.id} className="flex items-center justify-between py-3 text-sm">
            <span className="inline-flex items-center gap-3 text-[#111941]"><MetricIcon icon={metric.icon} />{metric.label}</span>
            <strong className="font-medium text-indigo-600">{metric.value}</strong>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function MetricIcon({ icon }: { icon: SessionMetric['icon'] }) {
  if (icon === 'calories') return <Flame size={18} className="text-rose-500" />;
  if (icon === 'heartRate') return <HeartPulse size={18} className="text-rose-500" />;
  if (icon === 'load') return <Dumbbell size={18} className="text-indigo-600" />;
  return <Timer size={18} className="text-indigo-600" />;
}

export function SessionControls({
  status,
  onStart,
  onPause,
  onEnd,
  compact = false,
}: {
  status: SessionControlState;
  onStart: () => void;
  onPause: () => void;
  onEnd: () => void;
  compact?: boolean;
}) {
  const ended = status === 'ended';
  const isRunning = status === 'running';
  return (
    <div className={`grid grid-cols-3 gap-2.5 ${compact ? 'rounded-2xl border border-indigo-100 bg-white p-3 shadow-[0_-5px_20px_rgba(30,41,59,0.08)]' : ''}`}>
      <button
        type="button"
        disabled={ended || isRunning}
        onClick={onStart}
        className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-2 text-sm font-semibold text-white shadow-md shadow-indigo-100 disabled:opacity-60"
      >
        <Play size={16} fill="currentColor" /> {status === 'paused' ? 'Resume' : ended ? 'Ended' : compact ? 'Start' : 'Start Session'}
      </button>
      <button
        type="button"
        disabled={!isRunning}
        onClick={onPause}
        className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-2 text-sm font-semibold text-[#111941] disabled:opacity-55"
      >
        <Pause size={16} fill="currentColor" /> Pause
      </button>
      <button
        type="button"
        disabled={ended}
        onClick={onEnd}
        className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-2 text-sm font-semibold text-rose-500 disabled:opacity-55"
      >
        <Square size={15} fill="currentColor" /> End
      </button>
    </div>
  );
}
