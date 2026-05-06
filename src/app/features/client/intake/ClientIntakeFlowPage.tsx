import { useEffect, useMemo, useReducer, useState } from 'react';
import { Check, UserRound } from 'lucide-react';
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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../../../components/ui/dialog';

type ServiceType = 'psychology' | 'training' | 'combined' | 'package';
type Step = 1 | 2 | 3 | 4 | 5 | 6;
type ConcernOption = { value: string; label: string };
type PickerMode = 'single' | 'psychologist' | 'trainer';

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
  selectedPsychologistId: number | null;
  selectedPsychologistSlotId: number | null;
  selectedTrainerId: number | null;
  selectedTrainerSlotId: number | null;
  status: 'draft' | 'under_review' | 'booked' | 'auto_bookable';
}

type Action =
  | { type: 'SET_SERVICE'; payload: ServiceType }
  | { type: 'SET_STEP'; payload: Step }
  | { type: 'SET_FLOW'; payload: number }
  | { type: 'SET_FIELD'; payload: Partial<State> };

const concernOptions: Record<ServiceType, ConcernOption[]> = {
  psychology: [
    { value: 'stress_management', label: 'Stress management' },
    { value: 'anxiety', label: 'Anxiety' },
    { value: 'sleep', label: 'Sleep' },
    { value: 'relationship_support', label: 'Relationship support' },
  ],
  training: [
    { value: 'fitness_conditioning', label: 'Fitness conditioning' },
    { value: 'strength_mobility', label: 'Strength and mobility' },
    { value: 'weight_management', label: 'Weight management' },
    { value: 'healthy_routine', label: 'Healthy routine building' },
  ],
  combined: [
    { value: 'stress_and_fitness', label: 'Stress support with fitness routine' },
    { value: 'anxiety_and_movement', label: 'Anxiety support with movement plan' },
    { value: 'sleep_energy_fitness', label: 'Sleep, energy, and fitness reset' },
    { value: 'weight_and_confidence', label: 'Weight management and confidence' },
    { value: 'mind_body_balance', label: 'Mind-body wellness plan' },
  ],
  package: [
    { value: 'complete_wellness_package', label: 'Complete wellness package' },
    { value: 'counselling_package', label: 'Counselling package' },
    { value: 'fitness_package', label: 'Fitness package' },
    { value: 'lifestyle_package', label: 'Lifestyle package' },
  ],
};

const defaultSteps = ['Service', 'Intake', 'Schedule', 'Confirm'];
const combinedSteps = ['Service', 'Intake', 'Psychologist', 'Trainer', 'Review', 'Confirm'];

function getConcernOptions(serviceType: ServiceType) {
  return concernOptions[serviceType];
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_SERVICE':
      return {
        ...state,
        serviceType: action.payload,
        concern: getConcernOptions(action.payload)[0].value,
        selectedPractitionerId: null,
        selectedSlotId: null,
        selectedPsychologistId: null,
        selectedPsychologistSlotId: null,
        selectedTrainerId: null,
        selectedTrainerSlotId: null,
      };
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
  concern: getConcernOptions('combined')[0].value,
  duration: '2_6_months',
  symptoms: ['worry', 'sleep_difficulty'],
  outcome: '',
  selectedPractitionerId: null,
  selectedSlotId: null,
  selectedPsychologistId: null,
  selectedPsychologistSlotId: null,
  selectedTrainerId: null,
  selectedTrainerSlotId: null,
  status: 'draft',
};

function formatDateTime(value?: string) {
  return value ? new Date(value).toLocaleString() : '-';
}

function practitionerLabel(type: PractitionerItem['type']) {
  if (type === 'trainer') return 'Fitness trainer';
  if (type === 'counsellor') return 'Psychologist';
  return 'Coach';
}

export default function ClientIntakeFlowPage() {
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(reducer, initialState);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState('');
  const [pickerMode, setPickerMode] = useState<PickerMode | null>(null);
  const [practitioners, setPractitioners] = useState<PractitionerItem[]>([]);
  const [slots, setSlots] = useState<SlotItem[]>([]);
  const [psychologistSlots, setPsychologistSlots] = useState<SlotItem[]>([]);
  const [trainerSlots, setTrainerSlots] = useState<SlotItem[]>([]);
  const [confirmation, setConfirmation] = useState<{ state: string; message?: string } | null>(null);

  const selectedPractitioner = useMemo(() => practitioners.find((p) => p.id === state.selectedPractitionerId), [practitioners, state.selectedPractitionerId]);
  const selectedPsychologist = useMemo(() => practitioners.find((p) => p.id === state.selectedPsychologistId), [practitioners, state.selectedPsychologistId]);
  const selectedTrainer = useMemo(() => practitioners.find((p) => p.id === state.selectedTrainerId), [practitioners, state.selectedTrainerId]);
  const selectedSlot = useMemo(() => slots.find((slot) => slot.id === state.selectedSlotId), [slots, state.selectedSlotId]);
  const selectedPsychologistSlot = useMemo(() => psychologistSlots.find((slot) => slot.id === state.selectedPsychologistSlotId), [psychologistSlots, state.selectedPsychologistSlotId]);
  const selectedTrainerSlot = useMemo(() => trainerSlots.find((slot) => slot.id === state.selectedTrainerSlotId), [trainerSlots, state.selectedTrainerSlotId]);
  const concernChoices = getConcernOptions(state.serviceType);
  const isCombined = state.serviceType === 'combined';
  const stepperSteps = isCombined ? combinedSteps : defaultSteps;
  const stepperCurrent = isCombined ? state.step : Math.min(state.step, 4);

  const singlePractitioners = useMemo(() => {
    if (state.serviceType === 'training') return practitioners.filter((p) => ['trainer', 'coach'].includes(p.type));
    if (state.serviceType === 'psychology') return practitioners.filter((p) => ['counsellor', 'coach'].includes(p.type));
    return practitioners;
  }, [practitioners, state.serviceType]);

  const pickerPractitioners = useMemo(() => {
    if (pickerMode === 'psychologist') return practitioners.filter((p) => p.type === 'counsellor');
    if (pickerMode === 'trainer') return practitioners.filter((p) => p.type === 'trainer');
    return singlePractitioners;
  }, [pickerMode, practitioners, singlePractitioners]);

  useEffect(() => {
    if (state.step < 3 || !state.flowId) return;
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

  useEffect(() => {
    if (!state.selectedPsychologistId) return;
    getPractitionerSlots(state.selectedPsychologistId, '2026-05-01', '2026-07-31').then(setPsychologistSlots).catch(() => {
      setPsychologistSlots([]);
    });
  }, [state.selectedPsychologistId]);

  useEffect(() => {
    if (!state.selectedTrainerId) return;
    getPractitionerSlots(state.selectedTrainerId, '2026-05-01', '2026-07-31').then(setTrainerSlots).catch(() => {
      setTrainerSlots([]);
    });
  }, [state.selectedTrainerId]);

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
        dispatch({ type: 'SET_STEP', payload: 6 });
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

  async function onReserveSingleSlot() {
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
      dispatch({ type: 'SET_FIELD', payload: { status: 'booked' } });
      dispatch({ type: 'SET_STEP', payload: 6 });
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Unable to reserve slot.');
    } finally {
      setLoading(false);
    }
  }

  async function onReserveCombinedSlots() {
    if (!state.flowId || !state.selectedPsychologistId || !state.selectedPsychologistSlotId || !state.selectedTrainerId || !state.selectedTrainerSlotId) return;
    setLoading(true);
    setNotice('');

    try {
      await bookAppointmentRequest({
        intake_flow_id: state.flowId,
        practitioner_id: state.selectedPsychologistId,
        slot_id: state.selectedPsychologistSlotId,
        service_type: 'psychology',
        mode: 'online',
      });
      await bookAppointmentRequest({
        intake_flow_id: state.flowId,
        practitioner_id: state.selectedTrainerId,
        slot_id: state.selectedTrainerSlotId,
        service_type: 'training',
        mode: 'online',
      });
      dispatch({ type: 'SET_FIELD', payload: { status: 'booked' } });
      dispatch({ type: 'SET_STEP', payload: 6 });
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Unable to reserve both slots.');
    } finally {
      setLoading(false);
    }
  }

  function selectPractitioner(practitioner: PractitionerItem) {
    if (pickerMode === 'psychologist') {
      dispatch({ type: 'SET_FIELD', payload: { selectedPsychologistId: practitioner.id, selectedPsychologistSlotId: null } });
      setPsychologistSlots([]);
    } else if (pickerMode === 'trainer') {
      dispatch({ type: 'SET_FIELD', payload: { selectedTrainerId: practitioner.id, selectedTrainerSlotId: null } });
      setTrainerSlots([]);
    } else {
      dispatch({ type: 'SET_FIELD', payload: { selectedPractitionerId: practitioner.id, selectedSlotId: null } });
      setSlots([]);
    }

    setPickerMode(null);
  }

  function renderPractitionerButton(mode: PickerMode, practitioner: PractitionerItem | undefined, title: string, hint: string) {
    return (
      <button
        type="button"
        onClick={() => setPickerMode(mode)}
        className="flex min-h-14 w-full items-center justify-between gap-3 rounded-xl border border-slate-300 bg-white px-3 py-2 text-left transition hover:bg-slate-50"
      >
        <span>
          <span className="block text-sm font-semibold text-slate-800">{practitioner ? practitioner.name : title}</span>
          <span className="block text-xs capitalize text-slate-500">{practitioner ? practitionerLabel(practitioner.type) : hint}</span>
        </span>
        <UserRound className="h-5 w-5 text-slate-500" aria-hidden="true" />
      </button>
    );
  }

  function renderSlotSelect(slotsForPractitioner: SlotItem[], selectedId: number | null, onSelect: (slotId: number | null) => void) {
    return (
      <select className="rounded-xl border border-slate-300 px-3 py-2" value={selectedId ?? ''} onChange={(event) => onSelect(Number(event.target.value) || null)}>
        <option value="">Select time slot</option>
        {slotsForPractitioner.map((slot) => <option key={slot.id} value={slot.id}>{formatDateTime(slot.starts_at)}</option>)}
      </select>
    );
  }

  function renderAppointmentSummary(title: string, practitioner: PractitionerItem | undefined, slot: SlotItem | undefined) {
    return (
      <DSCard className="space-y-1 bg-slate-50 shadow-none">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{title}</p>
        <p className="text-sm font-semibold text-slate-900">{practitioner?.name ?? '-'}</p>
        <p className="text-sm capitalize text-slate-600">{practitioner ? practitionerLabel(practitioner.type) : '-'}</p>
        <p className="text-sm text-slate-700">{formatDateTime(slot?.starts_at)}</p>
        <p className="text-sm text-slate-600">Mode: Online</p>
      </DSCard>
    );
  }

  if (state.step === 6) {
    const underReview = confirmation?.state === 'under_review';

    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-white px-4 py-6 sm:px-8">
        <div className="mx-auto flex min-h-full max-w-3xl flex-col justify-center gap-5">
          <div>
            <p className="text-sm font-semibold text-[var(--ds-brand)]">{underReview ? 'Review started' : 'Slots reserved'}</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-950">{underReview ? 'Application under review' : 'Your appointments are confirmed'}</h1>
            <p className="mt-2 text-sm text-slate-600">
              {underReview ? confirmation?.message ?? 'Our coordinator will review your intake and contact you with next steps.' : 'Here are the details for your first sessions.'}
            </p>
          </div>

          {!underReview && isCombined ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {renderAppointmentSummary('Psychologist appointment', selectedPsychologist, selectedPsychologistSlot)}
              {renderAppointmentSummary('Fitness trainer appointment', selectedTrainer, selectedTrainerSlot)}
            </div>
          ) : null}

          {!underReview && !isCombined ? renderAppointmentSummary('Appointment', selectedPractitioner, selectedSlot) : null}

          <div className="flex justify-end">
            <DSButton onClick={() => navigate('/client')}>Return to dashboard</DSButton>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-4 pb-20">
      <DSCard className="space-y-4">
        <IntakeStepper current={stepperCurrent} steps={stepperSteps} />

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
                {concernChoices.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
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
              <textarea
                className="min-h-24 rounded-xl border border-slate-300 px-3 py-2"
                value={state.outcome}
                onChange={(e) => dispatch({ type: 'SET_FIELD', payload: { outcome: e.target.value } })}
                placeholder="Example: I want to feel calmer, sleep better, build a consistent fitness routine, and know which first steps to follow each week."
              />
            </label>
            <div className="flex justify-between gap-2"><DSSecondaryButton onClick={() => dispatch({ type: 'SET_STEP', payload: 1 })}>Back</DSSecondaryButton><DSButton onClick={onContinueFromIntake} disabled={loading}>{loading ? 'Submitting...' : 'Continue'}</DSButton></div>
          </>
        ) : null}

        {state.step === 3 && isCombined ? (
          <>
            <MobileSectionTitle title="Select Psychologist" subtitle="Choose a psychologist and select your session time." />
            {renderPractitionerButton('psychologist', selectedPsychologist, 'Select Psychologist', 'Open psychologist list')}
            {selectedPsychologist ? <p className="text-xs text-slate-600">Specialties: {selectedPsychologist.specialties.join(', ')}</p> : null}
            {renderSlotSelect(psychologistSlots, state.selectedPsychologistSlotId, (slotId) => dispatch({ type: 'SET_FIELD', payload: { selectedPsychologistSlotId: slotId } }))}
            <div className="flex justify-between gap-2"><DSSecondaryButton onClick={() => dispatch({ type: 'SET_STEP', payload: 2 })}>Back</DSSecondaryButton><DSButton onClick={() => dispatch({ type: 'SET_STEP', payload: 4 })} disabled={!state.selectedPsychologistId || !state.selectedPsychologistSlotId}>Continue</DSButton></div>
          </>
        ) : null}

        {state.step === 4 && isCombined ? (
          <>
            <MobileSectionTitle title="Select Fitness Trainer" subtitle="Choose a trainer and select your session time." />
            {renderPractitionerButton('trainer', selectedTrainer, 'Select Fitness Trainer', 'Open trainer list')}
            {selectedTrainer ? <p className="text-xs text-slate-600">Specialties: {selectedTrainer.specialties.join(', ')}</p> : null}
            {renderSlotSelect(trainerSlots, state.selectedTrainerSlotId, (slotId) => dispatch({ type: 'SET_FIELD', payload: { selectedTrainerSlotId: slotId } }))}
            <div className="flex justify-between gap-2"><DSSecondaryButton onClick={() => dispatch({ type: 'SET_STEP', payload: 3 })}>Back</DSSecondaryButton><DSButton onClick={() => dispatch({ type: 'SET_STEP', payload: 5 })} disabled={!state.selectedTrainerId || !state.selectedTrainerSlotId}>Review</DSButton></div>
          </>
        ) : null}

        {state.step === 5 && isCombined ? (
          <>
            <MobileSectionTitle title="Review" subtitle="Confirm both appointment schedules before reserving slots." />
            <div className="grid gap-3 sm:grid-cols-2">
              {renderAppointmentSummary('Psychologist appointment', selectedPsychologist, selectedPsychologistSlot)}
              {renderAppointmentSummary('Fitness trainer appointment', selectedTrainer, selectedTrainerSlot)}
            </div>
            <div className="flex justify-between gap-2"><DSSecondaryButton onClick={() => dispatch({ type: 'SET_STEP', payload: 4 })}>Back</DSSecondaryButton><DSButton onClick={onReserveCombinedSlots} disabled={loading}>{loading ? 'Reserving...' : 'Reserve Slot'}</DSButton></div>
          </>
        ) : null}

        {state.step === 3 && !isCombined ? (
          <>
            <MobileSectionTitle title="Schedule your first session" subtitle="Pick practitioner and time slot." />
            {renderPractitionerButton('single', selectedPractitioner, 'Select practitioner', 'Choose from recommended matches')}
            {selectedPractitioner ? <p className="text-xs text-slate-600">Specialties: {selectedPractitioner.specialties.join(', ')}</p> : null}
            {renderSlotSelect(slots, state.selectedSlotId, (slotId) => dispatch({ type: 'SET_FIELD', payload: { selectedSlotId: slotId } }))}
            <div className="flex justify-between gap-2"><DSSecondaryButton onClick={() => dispatch({ type: 'SET_STEP', payload: 2 })}>Back</DSSecondaryButton><DSButton onClick={onReserveSingleSlot} disabled={loading || !state.selectedSlotId || !state.selectedPractitionerId}>{loading ? 'Reserving...' : 'Reserve Slot'}</DSButton></div>
          </>
        ) : null}

        <Dialog open={pickerMode !== null} onOpenChange={(open) => setPickerMode(open ? pickerMode : null)}>
          <DialogContent className="left-0 top-0 h-dvh max-h-dvh w-screen max-w-none translate-x-0 translate-y-0 overflow-y-auto rounded-none border-0 bg-white p-4 sm:max-w-none sm:p-6">
            <DialogHeader className="max-w-3xl">
              <DialogTitle>{pickerMode === 'trainer' ? 'Select Fitness Trainer' : pickerMode === 'psychologist' ? 'Select Psychologist' : 'Select practitioner'}</DialogTitle>
              <DialogDescription>
                {pickerMode === 'trainer' ? 'Choose a trainer for your fitness session.' : pickerMode === 'psychologist' ? 'Choose a psychologist for your counselling session.' : 'Choose a practitioner from your recommended matches.'}
              </DialogDescription>
            </DialogHeader>
            <div className="mx-auto grid w-full max-w-3xl gap-3 pb-6">
              {pickerPractitioners.length ? pickerPractitioners.map((practitioner) => {
                const selected = practitioner.id === state.selectedPractitionerId || practitioner.id === state.selectedPsychologistId || practitioner.id === state.selectedTrainerId;

                return (
                  <button
                    key={practitioner.id}
                    type="button"
                    onClick={() => selectPractitioner(practitioner)}
                    className={`flex items-start justify-between gap-3 rounded-xl border px-4 py-3 text-left transition ${selected ? 'border-[var(--ds-brand)] bg-indigo-50' : 'border-slate-200 bg-white hover:bg-slate-50'}`}
                  >
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold text-slate-900">{practitioner.name}</span>
                      <span className="mt-0.5 block text-xs text-slate-500">{practitionerLabel(practitioner.type)}</span>
                      {practitioner.specialties.length ? <span className="mt-2 block text-xs text-slate-600">{practitioner.specialties.join(', ')}</span> : null}
                    </span>
                    {selected ? <Check className="h-5 w-5 shrink-0 text-[var(--ds-brand)]" aria-hidden="true" /> : null}
                  </button>
                );
              }) : (
                <p className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">No practitioners are available for this selection yet.</p>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {notice ? <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-700">{notice}</p> : null}
      </DSCard>
    </div>
  );
}
