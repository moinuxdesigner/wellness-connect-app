import { useEffect, useMemo, useState } from 'react';
import {
  bookAppointmentRequest,
  cancelAppointmentRequest,
  getClientAppointmentsRequest,
  getPractitionerSlots,
  getRecommendedPractitioners,
  type ClientAppointment,
  type PractitionerItem,
  type SlotItem,
} from '../../shared/services/api';
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
    setAppointments(await getClientAppointmentsRequest());
  }

  useEffect(() => {
    refresh().catch((error) => setNotice(error instanceof Error ? error.message : 'Unable to load appointments'));
    getRecommendedPractitioners(1).then(setPractitioners).catch(() => {
      // quiet fallback
    });
  }, []);

  useEffect(() => {
    if (!selectedPractitioner) return;
    getPractitionerSlots(selectedPractitioner, '2026-05-01', '2026-06-30').then(setSlots).catch(() => {
      setSlots([]);
    });
  }, [selectedPractitioner]);

  return (
    <div className="space-y-4">
      <ClientPageTitle title="My Appointments" subtitle="Book and manage your sessions." />

      <DSCard>
        <h2 className="text-lg font-semibold text-slate-900">Book a session</h2>
        <div className="mt-3 grid gap-3">
          <select className="rounded-xl border border-slate-300 px-3 py-2" value={serviceType} onChange={(e) => setServiceType(e.target.value as 'psychology' | 'training' | 'combined' | 'package')}>
            <option value="psychology">Psychology</option>
            <option value="training">Training</option>
            <option value="combined">Combined</option>
            <option value="package">Package</option>
          </select>
          <select className="rounded-xl border border-slate-300 px-3 py-2" value={selectedPractitioner ?? ''} onChange={(e) => setSelectedPractitioner(Number(e.target.value) || null)}>
            <option value="">Select practitioner</option>
            {practitioners.map((p) => <option key={p.id} value={p.id}>{p.name} ({p.type})</option>)}
          </select>
          <select className="rounded-xl border border-slate-300 px-3 py-2" value={selectedSlot ?? ''} onChange={(e) => setSelectedSlot(Number(e.target.value) || null)}>
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
                await bookAppointmentRequest({ practitioner_id: selectedPractitioner, slot_id: selectedSlot, service_type: serviceType, mode: 'online' });
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
            {loading ? 'Booking...' : 'Book appointment'}
          </DSButton>
        </div>
      </DSCard>

      {notice ? <p className="rounded-lg bg-indigo-50 px-3 py-2 text-sm text-indigo-700">{notice}</p> : null}

      <DSCard>
        <h2 className="text-lg font-semibold text-slate-900">Upcoming and past appointments</h2>
        <div className="mt-3 space-y-2">
          {sortedAppointments.length === 0 ? <p className="text-sm text-slate-600">No appointments yet.</p> : sortedAppointments.map((a) => (
            <article key={a.id} className="rounded-xl border border-slate-200 p-3">
              <p className="text-sm font-semibold text-slate-900">{a.service_type} • {new Date(a.starts_at).toLocaleString()}</p>
              <p className="text-xs capitalize text-slate-600">status: {a.status}</p>
              {a.status !== 'cancelled' ? (
                <DSSecondaryButton
                  className="mt-2"
                  onClick={async () => {
                    await cancelAppointmentRequest(a.id, 'User requested');
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
