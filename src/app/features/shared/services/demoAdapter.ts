import {
  bookAppointmentRequest,
  cancelAppointmentRequest,
  getClientAppointmentsRequest,
  getPractitionerSlots,
  getRecommendedPractitioners,
  type ClientAppointment,
  type PractitionerItem,
  type SlotItem,
} from './api';
import { isDemoModeEnabled } from '../../demo/demoMode';

const demoPractitioners: PractitionerItem[] = [
  { id: 9101, name: 'Dr. Aisha Sharma', type: 'counsellor', specialties: ['stress', 'anxiety'] },
  { id: 9201, name: 'Coach Arjun Singh', type: 'trainer', specialties: ['strength', 'mobility'] },
];

const demoSlots: SlotItem[] = [
  { id: 501, starts_at: '2026-05-13T09:00:00', ends_at: '2026-05-13T09:45:00', slot_status: 'open' },
  { id: 502, starts_at: '2026-05-13T17:00:00', ends_at: '2026-05-13T17:45:00', slot_status: 'open' },
];

let demoAppointments: ClientAppointment[] = [
  {
    id: 7001,
    client_user_id: 101,
    practitioner_id: 9101,
    intake_flow_id: 1,
    service_type: 'psychology',
    mode: 'online',
    starts_at: '2026-05-13T09:00:00',
    ends_at: '2026-05-13T09:45:00',
    status: 'scheduled',
    reschedule_count: 0,
  },
];

export async function listAppointmentsAdapter() {
  if (isDemoModeEnabled()) return demoAppointments;
  try {
    return await getClientAppointmentsRequest();
  } catch {
    return demoAppointments;
  }
}

export async function listPractitionersAdapter() {
  if (isDemoModeEnabled()) return demoPractitioners;
  try {
    return await getRecommendedPractitioners(1);
  } catch {
    return demoPractitioners;
  }
}

export async function listSlotsAdapter(practitionerId: number) {
  if (isDemoModeEnabled()) return demoSlots;
  try {
    const slots = await getPractitionerSlots(practitionerId, '2026-05-01', '2026-06-30');
    return slots.length ? slots : demoSlots;
  } catch {
    return demoSlots;
  }
}

export async function bookAppointmentAdapter(payload: { practitioner_id: number; slot_id: number; service_type: 'psychology' | 'training' | 'combined' | 'package'; mode: 'online' | 'in_person' | 'hybrid' }) {
  if (isDemoModeEnabled()) {
    const slot = demoSlots.find((item) => item.id === payload.slot_id) ?? demoSlots[0];
    const appointment: ClientAppointment = {
      id: Date.now(),
      client_user_id: 101,
      practitioner_id: payload.practitioner_id,
      intake_flow_id: 1,
      service_type: payload.service_type,
      mode: payload.mode,
      starts_at: slot.starts_at,
      ends_at: slot.ends_at,
      status: 'scheduled',
      reschedule_count: 0,
    };
    demoAppointments = [appointment, ...demoAppointments];
    return appointment;
  }

  return bookAppointmentRequest(payload);
}

export async function cancelAppointmentAdapter(id: number, reason?: string) {
  if (isDemoModeEnabled()) {
    demoAppointments = demoAppointments.map((item) => (item.id === id ? { ...item, status: 'cancelled', cancel_reason: reason ?? null } : item));
    return demoAppointments.find((item) => item.id === id) ?? demoAppointments[0];
  }

  return cancelAppointmentRequest(id, reason);
}
