import { useEffect, useMemo, useState } from 'react';
import { CalendarClock, Video } from 'lucide-react';
import type { ClientAppointment } from '../../shared/services/api';
import {
  cancelAppointmentAdapter,
  listAppointmentsAdapter,
} from '../../shared/services/demoAdapter';
import { ClientPageTitle } from '../ClientLayout';
import { DSCard, DSSecondaryButton } from '../../../../design/components/primitives';

export default function ClientAppointmentsPage() {
  const [appointments, setAppointments] = useState<ClientAppointment[]>([]);
  const [notice, setNotice] = useState('');

  const sortedAppointments = useMemo(() => [...appointments].sort((a, b) => (b.starts_at ?? '').localeCompare(a.starts_at ?? '')), [appointments]);

  async function refresh() {
    setAppointments(await listAppointmentsAdapter());
  }

  useEffect(() => {
    refresh().catch((error) => setNotice(error instanceof Error ? error.message : 'Unable to load appointments'));
  }, []);

  return (
    <div className="mx-auto max-w-md space-y-4 pb-2">
      <ClientPageTitle title="My Schedule" subtitle="View and manage both training and counselling sessions already on your calendar." />

      <DSCard className="rounded-xl border-slate-200/80 p-4">
        <h2 className="text-base font-semibold text-slate-900">Today's Sessions</h2>
        <div className="mt-3 space-y-3">
          {sortedAppointments.length === 0 ? (
            <p className="rounded-xl bg-slate-50 p-3 text-sm text-slate-600">No sessions planned for today.</p>
          ) : (
            sortedAppointments.slice(0, 2).map((a) => (
              <article key={`today-${a.id}`} className="rounded-2xl bg-slate-50 p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold capitalize text-slate-900">{a.service_type} Session</p>
                  <span className="rounded-full bg-indigo-100 px-2 py-1 text-xs font-medium text-indigo-700">{a.status}</span>
                </div>
                <p className="mt-1 flex items-center gap-1 text-xs text-slate-600"><CalendarClock size={14} /> {new Date(a.starts_at).toLocaleString()}</p>
              </article>
            ))
          )}
        </div>
      </DSCard>

      {notice ? <p className="rounded-xl bg-indigo-50 px-3 py-2 text-sm text-indigo-700">{notice}</p> : null}

      <DSCard className="rounded-xl border-slate-200/80 p-4">
        <h2 className="text-base font-semibold text-slate-900">Upcoming and Past Sessions</h2>
        <div className="mt-3 space-y-2">
          {sortedAppointments.length === 0 ? <p className="text-sm text-slate-600">No appointments yet.</p> : sortedAppointments.map((a) => (
            <article key={a.id} className="rounded-2xl border border-slate-200 p-3">
              <p className="text-sm font-semibold capitalize text-slate-900">{a.service_type} - {new Date(a.starts_at).toLocaleString()}</p>
              <p className="text-xs capitalize text-slate-600">status: {a.status}</p>
              <p className="mt-1 flex items-center gap-1 text-xs text-slate-500"><Video size={14} /> Online session</p>
              {a.status !== 'cancelled' ? (
                <DSSecondaryButton
                  className="mt-2"
                  onClick={async () => {
                    await cancelAppointmentAdapter(a.id, 'User requested');
                    await refresh();
                  }}
                  type="button"
                >
                  Cancel
                </DSSecondaryButton>
              ) : null}
            </article>
          ))}
        </div>
      </DSCard>
    </div>
  );
}
