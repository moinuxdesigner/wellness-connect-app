import { useEffect, useMemo, useReducer, useState } from 'react';
import { useNavigate } from 'react-router';
import {
  bookAppointmentRequest,
  createIntakeFlow,
  getIntakeConfirmation,
  getPractitionerSlots,
  getRecommendedPractitioners,
  saveIntakeAnswers,
  submitIntakeFlow,
  type PractitionerItem,
  type SlotItem,
} from '../../shared/services/api';
import { DSButton, DSCard, DSSecondaryButton } from '../../../../design/components/primitives';
import { IntakeStepper, MobileSectionTitle } from '../../../../design/patterns/intake';

type ServiceType = 'psychology' | 'training' | 'combined' | 'package';
type Step = 1 | 2 | 3 | 4;

interface State {
  step: Step;
  flowId: number | null;
  serviceType: ServiceType;
  concern: string;
  duration: string;
  symptoms: string[];
  outcome: string;
  selectedPractitionerId: number | null;
  selectedSlotId: number | null;
  status: 'draft' | 'under_review' | 'booked' | 'auto_bookable';
}

type Action =
  | { type: 'SET_SERVICE'; payload: ServiceType }
  | { type: 'SET_STEP'; payload: Step }
  | { type: 'SET_FLOW'; payload: number }
  | { type: 'SET_FIELD'; payload: Partial<State> };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_SERVICE':
      return { ...state, serviceType: action.payload };
    case 'SET_STEP':
      return { ...state, step: action.payload };
    case 'SET_FLOW':
      return { ...state, flowId: action.payload };
    case 'SET_FIELD':
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

const initialState: State = {
  step: 1,
  flowId: null,
  serviceType: 'combined',
  concern: 'stress_management',
  duration: '2_6_months',
  symptoms: ['worry', 'sleep_difficulty'],
  outcome: '',
  selectedPractitionerId: null,
  selectedSlotId: null,
  status: 'draft',
};

export default function ClientIntakeFlowPage() {
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(reducer, initialState);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState('');
  const [practitioners, setPractitioners] = useState<PractitionerItem[]>([]);
  const [slots, setSlots] = useState<SlotItem[]>([]);
  const [confirmation, setConfirmation] = useState<{ state: string; message?: string; session?: { date_time?: string; practitioner_name?: string; mode?: string } } | null>(null);

  const selectedPractitioner = useMemo(() => practitioners.find((p) => p.id === state.selectedPractitionerId), [practitioners, state.selectedPractitionerId]);

  useEffect(() => {
    if (state.step !== 3 || !state.flowId) return;
    getRecommendedPractitioners(state.flowId).then(setPractitioners).catch(() => {
      setNotice('Unable to load practitioners.');
    });
  }, [state.step, state.flowId]);

  useEffect(() => {
    if (!state.selectedPractitionerId) return;
    getPractitionerSlots(state.selectedPractitionerId, '2026-05-01', '2026-07-31').then(setSlots).catch(() => {
      setSlots([]);
    });
  }, [state.selectedPractitionerId]);

  async function onContinueFromService() {
    setLoading(true);
    setNotice('');
    try {
      const created = await createIntakeFlow(state.serviceType);
      dispatch({ type: 'SET_FLOW', payload: created.intake_flow_id });
      dispatch({ type: 'SET_STEP', payload: 2 });
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Unable to start intake.');
    } finally {
      setLoading(false);
    }
  }

  async function onContinueFromIntake() {
    if (!state.flowId) return;
    setLoading(true);
    setNotice('');
    try {
      await saveIntakeAnswers(state.flowId, [
        { section_key: state.serviceType, question_key: `${state.serviceType}.concern`, answer_type: 'single', answer_json: state.concern },
        { section_key: state.serviceType, question_key: `${state.serviceType}.duration`, answer_type: 'single', answer_json: state.duration },
        { section_key: state.serviceType, question_key: `${state.serviceType}.symptoms`, answer_type: 'multi', answer_json: state.symptoms },
        { section_key: state.serviceType, question_key: `${state.serviceType}.outcome`, answer_type: 'text', answer_json: state.outcome },
      ]);

      const decision = await submitIntakeFlow(state.flowId);

      if (decision.status === 'under_review') {
        dispatch({ type: 'SET_FIELD', payload: { status: 'under_review' } });
        const data = await getIntakeConfirmation(state.flowId);
        setConfirmation(data);
        dispatch({ type: 'SET_STEP', payload: 4 });
      } else {
        dispatch({ type: 'SET_FIELD', payload: { status: 'auto_bookable' } });
        dispatch({ type: 'SET_STEP', payload: 3 });
      }
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Unable to submit intake.');
    } finally {
      setLoading(false);
    }
  }

  async function onConfirmBooking() {
    if (!state.flowId || !state.selectedPractitionerId || !state.selectedSlotId) return;
    setLoading(true);
    setNotice('');

    try {
      await bookAppointmentRequest({
        intake_flow_id: state.flowId,
        practitioner_id: state.selectedPractitionerId,
        slot_id: state.selectedSlotId,
        service_type: state.serviceType,
        mode: 'online',
      });
      const data = await getIntakeConfirmation(state.flowId);
      setConfirmation(data);
      dispatch({ type: 'SET_FIELD', payload: { status: 'booked' } });
      dispatch({ type: 'SET_STEP', payload: 4 });
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Unable to confirm booking.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-4 pb-20">
      <DSCard className="space-y-4">
        <IntakeStepper current={state.step} />

        {state.step === 1 ? (
          <>
            <MobileSectionTitle title="Select the support you need" subtitle="Choose your main service type to continue." />
            <div className="grid gap-2 sm:grid-cols-2">
              {(['psychology', 'training', 'combined', 'package'] as ServiceType[]).map((service) => (
                <button
                  key={service}
                  type="button"
                  onClick={() => dispatch({ type: 'SET_SERVICE', payload: service })}
                  className={`rounded-xl border px-3 py-3 text-left text-sm capitalize ${state.serviceType === service ? 'border-[var(--ds-brand)] bg-indigo-50 text-[var(--ds-brand)]' : 'border-[var(--ds-border)] bg-white text-slate-700'}`}
                >
                  {service}
                </button>
              ))}
            </div>
            <div className="flex justify-end"><DSButton onClick={onContinueFromService} disabled={loading}>{loading ? 'Starting...' : 'Continue'}</DSButton></div>
          </>
        ) : null}

        {state.step === 2 ? (
          <>
            <MobileSectionTitle title="Intake questions" subtitle="Answer briefly so we can match the right support." />
            <label className="grid gap-1 text-sm font-medium text-slate-700">What brings you here today?
              <select className="rounded-xl border border-slate-300 px-3 py-2" value={state.concern} onChange={(e) => dispatch({ type: 'SET_FIELD', payload: { concern: e.target.value } })}>
                <option value="stress_management">Stress management</option>
                <option value="anxiety">Anxiety</option>
                <option value="sleep">Sleep</option>
                <option value="fitness">Fitness conditioning</option>
              </select>
            </label>
            <label className="grid gap-1 text-sm font-medium text-slate-700">How long?
              <select className="rounded-xl border border-slate-300 px-3 py-2" value={state.duration} onChange={(e) => dispatch({ type: 'SET_FIELD', payload: { duration: e.target.value } })}>
                <option value="lt_2_weeks">Less than 2 weeks</option>
                <option value="2_8_weeks">2-8 weeks</option>
                <option value="2_6_months">2-6 months</option>
                <option value="gt_6_months">More than 6 months</option>
              </select>
            </label>
            <label className="grid gap-1 text-sm font-medium text-slate-700">What would success look like?
              <textarea className="min-h-24 rounded-xl border border-slate-300 px-3 py-2" value={state.outcome} onChange={(e) => dispatch({ type: 'SET_FIELD', payload: { outcome: e.target.value } })} />
            </label>
            <div className="flex justify-between gap-2"><DSSecondaryButton onClick={() => dispatch({ type: 'SET_STEP', payload: 1 })}>Back</DSSecondaryButton><DSButton onClick={onContinueFromIntake} disabled={loading}>{loading ? 'Submitting...' : 'Continue'}</DSButton></div>
          </>
        ) : null}

        {state.step === 3 ? (
          <>
            <MobileSectionTitle title="Schedule your first session" subtitle="Pick practitioner and time slot." />
            <select className="rounded-xl border border-slate-300 px-3 py-2" value={state.selectedPractitionerId ?? ''} onChange={(e) => dispatch({ type: 'SET_FIELD', payload: { selectedPractitionerId: Number(e.target.value) || null, selectedSlotId: null } })}>
              <option value="">Select practitioner</option>
              {practitioners.map((p) => <option key={p.id} value={p.id}>{p.name} ({p.type})</option>)}
            </select>
            {selectedPractitioner ? <p className="text-xs text-slate-600">Specialties: {selectedPractitioner.specialties.join(', ')}</p> : null}
            <select className="rounded-xl border border-slate-300 px-3 py-2" value={state.selectedSlotId ?? ''} onChange={(e) => dispatch({ type: 'SET_FIELD', payload: { selectedSlotId: Number(e.target.value) || null } })}>
              <option value="">Select time slot</option>
              {slots.map((s) => <option key={s.id} value={s.id}>{new Date(s.starts_at).toLocaleString()}</option>)}
            </select>
            <div className="flex justify-between gap-2"><DSSecondaryButton onClick={() => dispatch({ type: 'SET_STEP', payload: 2 })}>Back</DSSecondaryButton><DSButton onClick={onConfirmBooking} disabled={loading || !state.selectedSlotId || !state.selectedPractitionerId}>{loading ? 'Confirming...' : 'Confirm booking'}</DSButton></div>
          </>
        ) : null}

        {state.step === 4 ? (
          <>
            <MobileSectionTitle title={confirmation?.state === 'under_review' ? 'Application under review' : 'Session confirmed'} subtitle={confirmation?.state === 'under_review' ? confirmation?.message : 'Your first session is scheduled successfully.'} />
            {confirmation?.session ? (
              <DSCard className="bg-emerald-50">
                <p className="text-sm text-slate-800"><strong>Date & time:</strong> {confirmation.session.date_time ?? '-'}</p>
                <p className="text-sm text-slate-800"><strong>Practitioner:</strong> {confirmation.session.practitioner_name ?? '-'}</p>
                <p className="text-sm text-slate-800"><strong>Mode:</strong> {confirmation.session.mode ?? '-'}</p>
              </DSCard>
            ) : null}
            <div className="flex justify-end"><DSButton onClick={() => navigate('/client')}>Return to dashboard</DSButton></div>
          </>
        ) : null}

        {notice ? <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-700">{notice}</p> : null}
      </DSCard>
    </div>
  );
}
