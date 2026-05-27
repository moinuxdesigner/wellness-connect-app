import { useEffect, useState, type ReactNode } from 'react';
import { ArrowLeft, CalendarDays, CircleAlert, Clock3, MapPin } from 'lucide-react';
import { Link, useParams } from 'react-router';
import { avatarForName } from './mockTrainerDashboardData';
import { buildAlertDisplay, buildScheduleRowDisplay } from './trainerDashboardViewModel';
import { getTrainerDashboard, type TrainerAlert, type TrainerScheduleItem } from './trainerWorkspaceApi';

type DetailKind = 'schedule' | 'alert';

export default function TrainerDashboardDetailPage({ kind }: { kind: DetailKind }) {
  const { itemId, alertId } = useParams();
  const recordId = kind === 'schedule' ? itemId : alertId;
  const [record, setRecord] = useState<TrainerScheduleItem | TrainerAlert | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    void getTrainerDashboard()
      .then((dashboard) => {
        if (!mounted) return;
        const found = kind === 'schedule'
          ? dashboard.dailySchedule.find((item) => item.id === recordId)
          : dashboard.priorityQueue.find((alert) => String(alert.id) === recordId);
        setRecord(found ?? null);
        setError('');
      })
      .catch((reason) => {
        if (!mounted) return;
        setError(reason instanceof Error ? reason.message : 'Unable to load this dashboard item right now.');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [kind, recordId]);

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <Link to="/trainer" className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-700 transition hover:text-indigo-800">
        <ArrowLeft size={17} /> Back to dashboard
      </Link>
      {loading ? <div className="h-72 animate-pulse rounded-3xl bg-slate-100" /> : null}
      {error ? <p className="rounded-2xl border border-rose-100 bg-rose-50 px-5 py-4 text-sm text-rose-700">{error}</p> : null}
      {!loading && !error && !record ? (
        <section className="rounded-3xl border border-dashed border-slate-200 bg-white px-6 py-12 text-center">
          <p className="text-sm text-slate-500">This dashboard item is no longer available.</p>
        </section>
      ) : null}
      {!loading && !error && record ? (
        kind === 'schedule'
          ? <ScheduleDetail item={record as TrainerScheduleItem} />
          : <AlertDetail alert={record as TrainerAlert} />
      ) : null}
    </div>
  );
}

function ScheduleDetail({ item }: { item: TrainerScheduleItem }) {
  const display = buildScheduleRowDisplay(item);
  const endsAt = new Date(item.endsAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <section className="overflow-hidden rounded-3xl border border-indigo-100 bg-white shadow-[0_10px_30px_rgba(30,41,59,0.05)]">
      <div className="bg-gradient-to-br from-indigo-50 to-white px-6 py-7">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-indigo-600">Schedule Details</p>
        <div className="mt-5 flex items-center gap-4">
          <img src={display.avatarUrl} alt="" className="h-16 w-16 rounded-full object-cover" />
          <div className="min-w-0">
            <h1 className="truncate text-2xl font-semibold text-[#101842]">{display.clientName}</h1>
            <p className="mt-1 text-sm text-slate-600">{display.sessionType}</p>
          </div>
        </div>
      </div>
      <dl className="space-y-4 px-6 py-6 text-sm">
        <DetailRow icon={<CalendarDays size={18} />} label="Status" value={display.status} />
        <DetailRow icon={<Clock3 size={18} />} label="Time" value={`${display.time} - ${endsAt}`} />
        <DetailRow icon={<MapPin size={18} />} label="Location" value={display.location} />
        {item.notes ? <DetailRow icon={<CircleAlert size={18} />} label="Notes" value={item.notes} /> : null}
      </dl>
    </section>
  );
}

function AlertDetail({ alert }: { alert: TrainerAlert }) {
  const display = buildAlertDisplay(alert);
  return (
    <section className="overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-[0_10px_30px_rgba(30,41,59,0.05)]">
      <div className="bg-gradient-to-br from-orange-50 to-rose-50/50 px-6 py-7">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-orange-600">Client Alert</p>
        <div className="mt-5 flex items-center gap-4">
          <img src={avatarForName(display.clientName)} alt="" className="h-16 w-16 rounded-full object-cover" />
          <div className="min-w-0">
            <h1 className="truncate text-2xl font-semibold text-[#101842]">{display.clientName}</h1>
            <p className="mt-1 text-sm font-medium text-orange-600">{display.label}</p>
          </div>
        </div>
      </div>
      <dl className="space-y-4 px-6 py-6 text-sm">
        <DetailRow icon={<CircleAlert size={18} />} label="Alert" value={alert.summary} />
        <DetailRow icon={<Clock3 size={18} />} label="Due" value={display.timeLabel} />
        <DetailRow icon={<CalendarDays size={18} />} label="Status" value={alert.status.replaceAll('_', ' ')} />
      </dl>
    </section>
  );
}

function DetailRow({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="flex gap-3 rounded-2xl bg-slate-50 px-4 py-3">
      <span className="mt-0.5 text-indigo-600">{icon}</span>
      <div>
        <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</dt>
        <dd className="mt-1 capitalize text-slate-700">{value}</dd>
      </div>
    </div>
  );
}
