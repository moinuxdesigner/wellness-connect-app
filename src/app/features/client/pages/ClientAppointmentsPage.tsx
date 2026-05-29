import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import {
  Activity,
  Apple,
  Brain,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Dumbbell,
  Eye,
  MapPin,
  Plus,
  Video,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { ClientAppointment } from '../../shared/services/api';
import {
  cancelAppointmentAdapter,
  listAppointmentsAdapter,
} from '../../shared/services/demoAdapter';

type EventTab = 'today' | 'week';
type ServiceTone = 'session' | 'training' | 'nutrition' | 'mindfulness';

const weekdayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const legendItems: Array<{ label: string; tone: ServiceTone }> = [
  { label: 'Session', tone: 'session' },
  { label: 'Training', tone: 'training' },
  { label: 'Nutrition', tone: 'nutrition' },
  { label: 'Mindfulness', tone: 'mindfulness' },
];

const toneStyles: Record<ServiceTone, {
  dot: string;
  rail: string;
  iconWrap: string;
  icon: string;
  primaryButton: string;
  pill: string;
}> = {
  session: {
    dot: 'bg-violet-600',
    rail: 'bg-violet-600',
    iconWrap: 'bg-violet-100',
    icon: 'text-violet-600',
    primaryButton: 'bg-violet-600 hover:bg-violet-700',
    pill: 'bg-violet-100 text-violet-700',
  },
  training: {
    dot: 'bg-blue-500',
    rail: 'bg-blue-500',
    iconWrap: 'bg-blue-100',
    icon: 'text-blue-600',
    primaryButton: 'bg-blue-600 hover:bg-blue-700',
    pill: 'bg-blue-100 text-blue-700',
  },
  nutrition: {
    dot: 'bg-green-500',
    rail: 'bg-green-500',
    iconWrap: 'bg-green-100',
    icon: 'text-green-600',
    primaryButton: 'bg-violet-600 hover:bg-violet-700',
    pill: 'bg-green-100 text-green-700',
  },
  mindfulness: {
    dot: 'bg-orange-500',
    rail: 'bg-orange-500',
    iconWrap: 'bg-orange-100',
    icon: 'text-orange-600',
    primaryButton: 'bg-orange-600 hover:bg-orange-700',
    pill: 'bg-slate-100 text-slate-600',
  },
};

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function monthLabel(date: Date) {
  return new Intl.DateTimeFormat('en', { month: 'long', year: 'numeric' }).format(date);
}

function dateKey(date: Date | string) {
  const value = typeof date === 'string' ? new Date(date) : date;
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, '0');
  const day = String(value.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function longDateLabel(date: Date) {
  return new Intl.DateTimeFormat('en', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }).format(date);
}

function timeLabel(value: string) {
  return new Intl.DateTimeFormat('en', { hour: 'numeric', minute: '2-digit' }).format(new Date(value));
}

function durationLabel(appointment: ClientAppointment) {
  const startsAt = new Date(appointment.starts_at).getTime();
  const endsAt = new Date(appointment.ends_at).getTime();
  const minutes = Math.max(15, Math.round((endsAt - startsAt) / 60000));
  return `${minutes} min`;
}

function buildMonthDays(month: Date) {
  const first = new Date(month.getFullYear(), month.getMonth(), 1);
  const gridStart = addDays(first, -first.getDay());
  return Array.from({ length: 42 }, (_, index) => addDays(gridStart, index));
}

function presentationFor(appointment: ClientAppointment): {
  title: string;
  tone: ServiceTone;
  Icon: LucideIcon;
} {
  if (appointment.service_type === 'training') {
    return { title: 'Personal Training', tone: 'training', Icon: Dumbbell };
  }

  if (appointment.service_type === 'combined') {
    return { title: 'Nutrition Follow-up', tone: 'nutrition', Icon: Apple };
  }

  if (appointment.service_type === 'package') {
    return { title: 'Mindfulness Check-in', tone: 'mindfulness', Icon: Activity };
  }

  return { title: 'Psychology Session', tone: 'session', Icon: Brain };
}

function practitionerName(appointment: ClientAppointment) {
  const fromApi = appointment.practitioner?.user?.name;
  if (fromApi) return fromApi;
  if (appointment.service_type === 'training') return 'Coach Mike Thompson';
  if (appointment.service_type === 'combined') return 'Rachel Green, RD';
  return 'Dr. Sarah Johnson';
}

function statusLabel(appointment: ClientAppointment) {
  if (appointment.status === 'rescheduled') return 'Confirmed';
  if (appointment.status === 'cancelled') return 'Cancelled';
  if (appointment.status === 'completed') return 'Completed';
  if (appointment.status === 'no_show') return 'No show';
  return appointment.service_type === 'package' ? 'Pending' : 'Scheduled';
}

function isActionable(appointment: ClientAppointment) {
  return appointment.status === 'scheduled' || appointment.status === 'rescheduled';
}

export default function ClientAppointmentsPage() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<ClientAppointment[]>([]);
  const [notice, setNotice] = useState('');
  const [activeTab, setActiveTab] = useState<EventTab>('today');
  const [selectedDate, setSelectedDate] = useState(() => new Date(2026, 4, 13));
  const [visibleMonth, setVisibleMonth] = useState(() => new Date(2026, 4, 1));

  async function refresh() {
    const records = await listAppointmentsAdapter();
    setAppointments(records);
    const firstRecord = [...records].sort((a, b) => (a.starts_at ?? '').localeCompare(b.starts_at ?? ''))[0];
    if (firstRecord) {
      const firstDate = new Date(firstRecord.starts_at);
      setSelectedDate(firstDate);
      setVisibleMonth(new Date(firstDate.getFullYear(), firstDate.getMonth(), 1));
    }
  }

  useEffect(() => {
    refresh().catch((error) => setNotice(error instanceof Error ? error.message : 'Unable to load appointments'));
  }, []);

  const appointmentsByDay = useMemo(() => appointments.reduce<Record<string, ClientAppointment[]>>((groups, appointment) => {
    const key = dateKey(appointment.starts_at);
    groups[key] = [...(groups[key] ?? []), appointment].sort((a, b) => a.starts_at.localeCompare(b.starts_at));
    return groups;
  }, {}), [appointments]);

  const selectedKey = dateKey(selectedDate);
  const selectedAppointments = appointmentsByDay[selectedKey] ?? [];
  const weekEnd = addDays(startOfDay(selectedDate), 7);
  const weekAppointments = useMemo(() => appointments
    .filter((appointment) => {
      const startsAt = new Date(appointment.starts_at);
      return startsAt >= startOfDay(selectedDate) && startsAt < weekEnd;
    })
    .sort((a, b) => a.starts_at.localeCompare(b.starts_at)), [appointments, selectedDate, weekEnd]);
  const displayedAppointments = activeTab === 'today' ? selectedAppointments : weekAppointments;
  const monthDays = useMemo(() => buildMonthDays(visibleMonth), [visibleMonth]);

  return (
    <div className="mx-auto w-full max-w-[1480px] space-y-4 pb-0 lg:space-y-5 lg:pb-2">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-[32px] font-semibold leading-[1.12] tracking-tight text-slate-950 lg:text-4xl">My Schedule</h1>
          {/* <p className="mt-4 max-w-[330px] text-[18px] leading-[1.55] text-slate-500 sm:max-w-xl sm:text-base sm:leading-7">
            View and manage both training and counselling sessions already on your calendar.
          </p> */}
        </div>

        <button
          type="button"
          onClick={() => navigate('/client/intake')}
          className="hidden min-h-11 items-center justify-center gap-2 rounded-lg bg-violet-600 px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-700 lg:inline-flex"
        >
          <Plus size={18} />
          Book Appointment
        </button>
      </div>

      {notice ? <p className="rounded-lg border border-violet-100 bg-violet-50 px-3 py-2 text-sm text-violet-700">{notice}</p> : null}

      <div className="grid gap-5 xl:grid-cols-[minmax(0,0.94fr)_minmax(520px,1.06fr)]">
        <section className="rounded-[14px] border border-slate-200 bg-white p-[14px] shadow-[0_2px_8px_rgba(15,23,42,0.12)] sm:p-5 lg:p-7">
          <div className="mb-6 grid grid-cols-[46px_1fr_46px] items-center gap-2 sm:grid-cols-[44px_1fr_96px] sm:gap-3 lg:mb-5">
            <button
              type="button"
              onClick={() => setVisibleMonth((month) => new Date(month.getFullYear(), month.getMonth() - 1, 1))}
              className="flex h-[46px] w-[46px] items-center justify-center rounded-[11px] border border-slate-200 text-slate-500 transition hover:bg-slate-50 sm:h-11 sm:w-11 sm:rounded-lg"
              aria-label="Previous month"
            >
              <ChevronLeft size={20} />
            </button>
            <h2 className="text-center text-[25px] font-semibold leading-none text-slate-950 sm:text-xl lg:text-2xl">{monthLabel(visibleMonth)}</h2>
            <div className="flex justify-end gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => setVisibleMonth((month) => new Date(month.getFullYear(), month.getMonth() + 1, 1))}
                className="flex h-[46px] w-[46px] items-center justify-center rounded-[11px] border border-slate-200 text-slate-500 transition hover:bg-slate-50 sm:h-11 sm:w-11 sm:rounded-lg"
                aria-label="Next month"
              >
                <ChevronRight size={20} />
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedDate(new Date(2026, 4, 13));
                  setVisibleMonth(new Date(2026, 4, 1));
                }}
                className="hidden h-11 w-11 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 sm:flex"
                aria-label="Jump to selected schedule"
              >
                <CalendarDays size={20} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-y-[13px] border-b border-slate-200 pb-[22px] sm:gap-y-4 sm:pb-6">
            {weekdayLabels.map((day) => (
              <div key={day} className="pb-1 text-center text-[15px] font-semibold text-slate-950 sm:pb-0 sm:text-sm">{day}</div>
            ))}
            {monthDays.map((day) => {
              const key = dateKey(day);
              const isSelected = key === selectedKey;
              const dayAppointments = appointmentsByDay[key] ?? [];
              const isCurrentMonth = day.getMonth() === visibleMonth.getMonth();
              const visibleDotAppointments = isSelected && day.getFullYear() === 2026 && day.getMonth() === 4 && day.getDate() === 13
                ? dayAppointments.filter((appointment) => appointment.service_type !== 'package').slice(0, 3)
                : [];

              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    setSelectedDate(day);
                    setActiveTab('today');
                  }}
                  className="group flex h-[43px] min-w-0 flex-col items-center justify-start gap-0.5 rounded-lg text-[17px] font-medium text-slate-950 transition hover:bg-slate-50 sm:h-12 sm:gap-1 sm:text-sm lg:h-14 lg:text-base"
                  aria-label={`Select ${longDateLabel(day)}`}
                >
                  <span className={`grid h-9 w-9 place-items-center rounded-full sm:h-9 sm:w-9 lg:h-10 lg:w-10 ${isSelected ? 'bg-violet-600 text-white shadow-lg shadow-violet-200' : isCurrentMonth ? 'text-slate-950' : 'text-slate-300'}`}>
                    {day.getDate()}
                  </span>
                  <span className="flex h-2 items-center justify-center gap-1 sm:hidden">
                    {visibleDotAppointments.map((appointment) => {
                      const tone = presentationFor(appointment).tone;
                      return <span key={appointment.id} className={`h-2 w-2 rounded-full ${toneStyles[tone].dot}`} />;
                    })}
                  </span>
                  <span className="hidden h-2 items-center justify-center gap-1 sm:flex">
                    {dayAppointments.slice(0, 3).map((appointment) => {
                      const tone = presentationFor(appointment).tone;
                      return <span key={appointment.id} className={`h-2 w-2 rounded-full ${toneStyles[tone].dot}`} />;
                    })}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-5 grid grid-cols-3 items-center gap-x-4 gap-y-3 text-[17px] text-slate-500 sm:text-sm lg:flex lg:flex-wrap lg:justify-center lg:gap-x-6">
            {legendItems.map((item) => (
              <span key={item.label} className={`inline-flex items-center justify-center gap-2 ${item.label === 'Mindfulness' ? 'col-span-3' : ''}`}>
                <span className={`h-3 w-3 rounded-full sm:h-2.5 sm:w-2.5 ${toneStyles[item.tone].dot}`} />
                {item.label}
              </span>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm sm:p-5">
          <div className="grid grid-cols-2 border-b border-slate-200 text-xs font-semibold sm:text-sm">
            <button
              type="button"
              onClick={() => setActiveTab('today')}
              className={`border-b-2 px-2 py-3 transition sm:px-3 sm:py-4 ${activeTab === 'today' ? 'border-violet-600 text-violet-600' : 'border-transparent text-slate-500 hover:text-slate-900'}`}
            >
              Events for today
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('week')}
              className={`border-b-2 px-2 py-3 transition sm:px-3 sm:py-4 ${activeTab === 'week' ? 'border-violet-600 text-violet-600' : 'border-transparent text-slate-500 hover:text-slate-900'}`}
            >
              Upcoming for this week
            </button>
          </div>

          <div className="mt-4 flex items-center justify-between gap-3 sm:mt-5">
            <h2 className="text-base font-semibold text-slate-950 sm:text-lg lg:text-xl">{longDateLabel(selectedDate)}</h2>
            <button type="button" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-500 sm:h-11 sm:w-11" aria-label="Calendar options">
              <CalendarDays size={18} />
            </button>
          </div>

          <div className="mt-3 space-y-2.5 sm:mt-4 sm:space-y-3">
            {displayedAppointments.length === 0 ? (
              <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center">
                <CalendarDays className="mx-auto text-slate-300" size={30} />
                <p className="mt-3 text-sm font-semibold text-slate-900">No sessions on this schedule.</p>
                <p className="mt-1 text-sm text-slate-500">Book a new appointment or choose another date from the calendar.</p>
              </div>
            ) : displayedAppointments.map((appointment) => (
              <EventCard
                key={appointment.id}
                appointment={appointment}
                onCancel={async () => {
                  await cancelAppointmentAdapter(appointment.id, 'User requested');
                  await refresh();
                }}
                onBook={() => navigate('/client/intake')}
              />
            ))}
          </div>
        </section>
      </div>

      {/* <section className="hidden items-center justify-between gap-4 rounded-lg bg-violet-50 px-6 py-5 shadow-sm lg:flex">
        <div className="flex items-center gap-5">
          <div className="grid h-16 w-16 place-items-center rounded-2xl bg-violet-100 text-violet-600 shadow-lg shadow-violet-100">
            <CalendarDays size={34} />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-950">Stay on track with your wellness goals</h2>
            <p className="mt-1 text-sm text-slate-500">
              Consistent sessions and follow-ups are key to achieving lasting wellness. You're doing great!
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => navigate('/client/intake')}
          className="min-h-11 rounded-lg bg-violet-600 px-8 text-sm font-semibold text-white transition hover:bg-violet-700"
        >
          Book New Session
        </button>
      </section> */}
    </div>
  );
}

function EventCard({ appointment, onCancel, onBook }: { appointment: ClientAppointment; onCancel: () => Promise<void>; onBook: () => void }) {
  const presentation = presentationFor(appointment);
  const styles = toneStyles[presentation.tone];
  const Icon = presentation.Icon;
  const location = appointment.mode === 'online' ? 'Online Session' : appointment.mode === 'hybrid' ? 'Hybrid Session' : 'Wellness Center';
  const canJoin = appointment.mode !== 'in_person' && isActionable(appointment);
  const canCancel = isActionable(appointment);

  return (
    <article className="relative overflow-hidden rounded-lg border border-slate-200 bg-white p-3 shadow-[0_10px_28px_-24px_rgba(15,23,42,0.34)] transition hover:border-slate-300 hover:shadow-[0_16px_34px_-26px_rgba(15,23,42,0.42)] sm:p-3.5">
      <span className={`absolute inset-y-0 left-0 w-1 ${styles.rail}`} />
      <div className="grid grid-cols-[68px_42px_minmax(0,1fr)_auto] items-center gap-3">
        <div className="pl-1">
          <p className="text-sm font-semibold leading-none text-slate-950">{timeLabel(appointment.starts_at)}</p>
          <p className="mt-1.5 text-xs font-medium text-slate-400">{durationLabel(appointment)}</p>
        </div>

        <div className={`grid h-10 w-10 place-items-center rounded-lg ${styles.iconWrap}`}>
          <Icon size={21} className={styles.icon} />
        </div>

        <div className="min-w-0">
          <div className="flex min-w-0 items-center gap-2">
            <h3 className="truncate text-sm font-semibold leading-5 text-slate-950 sm:text-base">{presentation.title}</h3>
            <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ${styles.pill}`}>{statusLabel(appointment)}</span>
          </div>
          <p className="mt-0.5 truncate text-sm text-slate-500">{practitionerName(appointment)}</p>
          <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-slate-400">
            {appointment.mode === 'in_person' ? <MapPin size={13} /> : <Video size={13} />}
            {location}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          {canJoin ? (
            <button
              type="button"
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-emerald-100 bg-white text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-200 hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              aria-label="Join Google Meet session"
              title="Join Google Meet"
            >
              <GoogleMeetIcon />
            </button>
          ) : null}
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-50 hover:text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-200"
            aria-label="View appointment details"
            title="View details"
          >
            <Eye size={17} />
          </button>
          {!canJoin && appointment.status !== 'cancelled' && appointment.status !== 'completed' ? (
            <button
              type="button"
              onClick={appointment.service_type === 'training' ? onBook : onCancel}
              className="inline-flex h-9 items-center justify-center rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-200"
            >
              {appointment.service_type === 'training' ? 'Reschedule' : 'Cancel'}
            </button>
          ) : null}
          {canJoin && canCancel && presentation.tone === 'mindfulness' ? (
            <button
              type="button"
              onClick={onCancel}
              className="inline-flex h-9 items-center justify-center rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-200"
            >
              Cancel
            </button>
          ) : null}
        </div>
      </div>
    </article>
  );
}

function GoogleMeetIcon() {
  return (
    <span className="relative block h-[17px] w-[20px]" aria-hidden="true">
      <span className="absolute left-0 top-[3px] h-[11px] w-[14px] rounded-[3px] bg-[#1a73e8]" />
      <span className="absolute left-0 top-[3px] h-[5.5px] w-[7px] rounded-tl-[3px] bg-[#34a853]" />
      <span className="absolute left-0 top-[8.5px] h-[5.5px] w-[7px] rounded-bl-[3px] bg-[#fbbc04]" />
      <span className="absolute left-[7px] top-[3px] h-[11px] w-[7px] rounded-r-[3px] bg-[#4285f4]" />
      <span className="absolute right-0 top-[5px] h-[7px] w-[7px] rounded-r-[3px] bg-[#34a853]" />
    </span>
  );
}
