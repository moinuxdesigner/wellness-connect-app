import { useEffect, useMemo, useState } from 'react';
import { CalendarClock, Video } from 'lucide-react';
import type { ClientAppointment, PractitionerItem, SlotItem } from '../../shared/services/api';
import {
  bookAppointmentAdapter,
  cancelAppointmentAdapter,
  listAppointmentsAdapter,
  listPractitionersAdapter,
  listSlotsAdapter,
} from '../../shared/services/demoAdapter';
import { ClientPageTitle } from '../ClientLayout';
import { DSButton, DSCard, DSSecondaryButton } from '../../../../design/components/primitives';

export default function ClientAppointmentsPage() {
  const [appointments, setAppointments] = useState<ClientAppointment[]>([]);
  const [practitioners, setPractitioners] = useState<PractitionerItem[]>([]);
  const [selectedPractitioner, setSelectedPractitioner] = useState<number | null>(null);
  const [slots, setSlots] = useState<SlotItem[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [serviceType, setServiceType] = useState<'psychology' | 'training' | 'combined' | 'package'>('combined');
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(false);

  const sortedAppointments = useMemo(() => [...appointments].sort((a, b) => (b.starts_at ?? '').localeCompare(a.starts_at ?? '')), [appointments]);

  async function refresh() {
    setAppointments(await listAppointmentsAdapter());
  }

  useEffect(() => {
    refresh().catch((error) => setNotice(error instanceof Error ? error.message : 'Unable to load appointments'));
    listPractitionersAdapter().then(setPractitioners).catch(() => {
      // quiet fallback
    });
  }, []);

  useEffect(() => {
    if (!selectedPractitioner) return;
    listSlotsAdapter(selectedPractitioner).then(setSlots).catch(() => {
      setSlots([]);
    });
  }, [selectedPractitioner]);

  return (
    <div className="mx-auto max-w-md space-y-4 pb-2">
      <ClientPageTitle title="My Schedule" subtitle="View and manage both training and counselling sessions." />

      <DSCard className="rounded-[26px] border-slate-200/80 p-4">
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

      <DSCard className="rounded-[26px] border-slate-200/80 p-4">
        <h2 className="text-base font-semibold text-slate-900">Book New Session</h2>
        <div className="mt-3 grid gap-3">
          <select className="rounded-xl border border-slate-300 bg-slate-50 px-3 py-2" value={serviceType} onChange={(e) => setServiceType(e.target.value as 'psychology' | 'training' | 'combined' | 'package')}>
            <option value="psychology">Psychology</option>
            <option value="training">Training</option>
            <option value="combined">Combined</option>
            <option value="package">Package</option>
          </select>
          <select className="rounded-xl border border-slate-300 bg-slate-50 px-3 py-2" value={selectedPractitioner ?? ''} onChange={(e) => setSelectedPractitioner(Number(e.target.value) || null)}>
            <option value="">Select practitioner</option>
            {practitioners.map((p) => <option key={p.id} value={p.id}>{p.name} ({p.type})</option>)}
          </select>
          <select className="rounded-xl border border-slate-300 bg-slate-50 px-3 py-2" value={selectedSlot ?? ''} onChange={(e) => setSelectedSlot(Number(e.target.value) || null)}>
            <option value="">Select slot</option>
            {slots.map((s) => <option key={s.id} value={s.id}>{new Date(s.starts_at).toLocaleString()}</option>)}
          </select>
          <DSButton
            disabled={loading || !selectedPractitioner || !selectedSlot}
            onClick={async () => {
              if (!selectedPractitioner || !selectedSlot) return;
              setLoading(true);
              setNotice('');
              try {
                await bookAppointmentAdapter({ practitioner_id: selectedPractitioner, slot_id: selectedSlot, service_type: serviceType, mode: 'online' });
                await refresh();
                setNotice('Appointment booked successfully.');
              } catch (error) {
                setNotice(error instanceof Error ? error.message : 'Booking failed');
              } finally {
                setLoading(false);
              }
            }}
            type="button"
          >
            {loading ? 'Booking...' : 'Book new session'}
          </DSButton>
        </div>
      </DSCard>

      {notice ? <p className="rounded-xl bg-indigo-50 px-3 py-2 text-sm text-indigo-700">{notice}</p> : null}

      <DSCard className="rounded-[26px] border-slate-200/80 p-4">
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
