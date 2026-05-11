import { useEffect, useMemo, useReducer, useState } from 'react';
import { ArrowLeft, ArrowRight, Brain, Check, Dumbbell, HeartHandshake, Info, Package2, UserRound } from 'lucide-react';
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
import { Calendar } from '../../../components/ui/calendar';

type ServiceType = 'psychology' | 'training' | 'combined' | 'package';
type Step = 1 | 2 | 3 | 4 | 5 | 6;
type ConcernOption = { value: string; label: string };
type PickerMode = 'single' | 'psychologist' | 'trainer';
type SlotPickerMode = 'single' | 'psychologist' | 'trainer';
type PractitionerWithAvatar = PractitionerItem & { avatarUrl: string };
type DisplaySlot = { id: number; starts_at: string; source: 'api' | 'generated' };

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
const mockPractitioners: PractitionerItem[] = [
  { id: 9101, name: 'Dr. Aisha Sharma', type: 'counsellor', specialties: ['anxiety', 'burnout', 'stress'] },
  { id: 9102, name: 'Dr. Neha Kapoor', type: 'counsellor', specialties: ['sleep', 'relationships', 'mood'] },
  { id: 9103, name: 'Dr. Rahul Mehta', type: 'counsellor', specialties: ['stress', 'emotional resilience', 'focus'] },
  { id: 9104, name: 'Dr. Kavya Iyer', type: 'counsellor', specialties: ['mindfulness', 'work stress', 'self-esteem'] },
  { id: 9201, name: 'Coach Arjun Singh', type: 'trainer', specialties: ['fat loss', 'strength', 'mobility'] },
  { id: 9202, name: 'Coach Priya Nair', type: 'trainer', specialties: ['posture', 'core', 'toning'] },
  { id: 9203, name: 'Coach Vikram Das', type: 'trainer', specialties: ['conditioning', 'athletic fitness', 'endurance'] },
  { id: 9204, name: 'Coach Rohan Patel', type: 'trainer', specialties: ['weight loss', 'functional training', 'flexibility'] },
];

const psychologistImages = [
  'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1594824804732-ca8db7d7311b?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=300&q=80',
];

const trainerImages = [
  'https://images.unsplash.com/photo-1567013127542-490d757e6349?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1579758629938-03607ccdbaba?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=300&q=80',
];

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

function toLocalDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function fromLocalDateKey(value: string) {
  const [year, month, day] = value.split('-').map(Number);
  if (!year || !month || !day) return undefined;
  return new Date(year, month - 1, day);
}

function dateKey(value?: string) {
  return value ? toLocalDateKey(new Date(value)) : '';
}

function practitionerLabel(type: PractitionerItem['type']) {
  if (type === 'trainer') return 'Fitness trainer';
  if (type === 'counsellor') return 'Psychologist';
  return 'Coach';
}

function withAvatar(practitioner: PractitionerItem): PractitionerWithAvatar {
  const imageSet = practitioner.type === 'trainer' ? trainerImages : psychologistImages;
  const avatarUrl = imageSet[Math.abs(practitioner.id) % imageSet.length];
  return { ...practitioner, avatarUrl };
}

function ensureMinCards(primary: PractitionerItem[], fallback: PractitionerItem[], minCards = 4): PractitionerItem[] {
  const seen = new Set<number>();
  const merged: PractitionerItem[] = [];

  for (const item of [...primary, ...fallback]) {
    if (seen.has(item.id)) continue;
    seen.add(item.id);
    merged.push(item);
    if (merged.length >= minCards) break;
  }

  return merged;
}

function generateFallbackSlots(date: string): DisplaySlot[] {
  if (!date) return [];
  const slots = ['09:00', '10:30', '12:00', '15:00', '17:30'];
  return slots.map((time, index) => ({
    id: -1 * (index + 1),
    starts_at: `${date}T${time}:00`,
    source: 'generated',
  }));
}

function getPreviousStep(step: Step, isCombined: boolean): Step | null {
  if (step <= 1) return null;
  if (!isCombined && step === 3) return 2;
  if (!isCombined && step === 2) return 1;
  if (isCombined && step === 5) return 4;
  if (isCombined && step === 4) return 3;
  if (isCombined && step === 3) return 2;
  if (step === 2) return 1;
  return null;
}

export default function ClientIntakeFlowPage() {
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(reducer, initialState);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState('');
  const [pickerMode, setPickerMode] = useState<PickerMode | null>(null);
  const [slotPickerMode, setSlotPickerMode] = useState<SlotPickerMode | null>(null);
  const [practitioners, setPractitioners] = useState<PractitionerItem[]>([]);
  const [slots, setSlots] = useState<SlotItem[]>([]);
  const [psychologistSlots, setPsychologistSlots] = useState<SlotItem[]>([]);
  const [trainerSlots, setTrainerSlots] = useState<SlotItem[]>([]);
  const [singleDate, setSingleDate] = useState<string>(toLocalDateKey(new Date()));
  const [psychologistDate, setPsychologistDate] = useState<string>(toLocalDateKey(new Date()));
  const [trainerDate, setTrainerDate] = useState<string>(toLocalDateKey(new Date()));
  const [pendingSlotId, setPendingSlotId] = useState<number | null>(null);
  const [generatedSingleSlot, setGeneratedSingleSlot] = useState<string | null>(null);
  const [generatedPsychologistSlot, setGeneratedPsychologistSlot] = useState<string | null>(null);
  const [generatedTrainerSlot, setGeneratedTrainerSlot] = useState<string | null>(null);
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
  const mobileTotalSteps = isCombined ? 5 : 3;
  const mobileCurrentStep = !isCombined && state.step > 3 ? 3 : Math.min(state.step, mobileTotalSteps);
  const previousStep = getPreviousStep(state.step, isCombined);

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

  const displayPractitioners = useMemo<PractitionerWithAvatar[]>(() => {
    const fallback = pickerMode === 'trainer'
      ? mockPractitioners.filter((p) => p.type === 'trainer')
      : pickerMode === 'psychologist'
        ? mockPractitioners.filter((p) => p.type === 'counsellor')
        : mockPractitioners;

    const source = ensureMinCards(pickerPractitioners, fallback, 4);
    return source.map(withAvatar);
  }, [pickerMode, pickerPractitioners]);

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
      const isDemoSelection = state.selectedPractitionerId >= 9000 || state.selectedSlotId < 0;
      if (isDemoSelection) {
        dispatch({ type: 'SET_FIELD', payload: { status: 'booked' } });
        dispatch({ type: 'SET_STEP', payload: 6 });
        setNotice('Demo slot selected successfully.');
        return;
      }
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
      const isDemoSelection =
        state.selectedPsychologistId >= 9000 ||
        state.selectedTrainerId >= 9000 ||
        state.selectedPsychologistSlotId < 0 ||
        state.selectedTrainerSlotId < 0;
      if (isDemoSelection) {
        dispatch({ type: 'SET_FIELD', payload: { status: 'booked' } });
        dispatch({ type: 'SET_STEP', payload: 6 });
        setNotice('Demo slots selected successfully.');
        return;
      }
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

  function openSlotPicker(mode: SlotPickerMode) {
    const modeSlots = mode === 'psychologist' ? psychologistSlots : mode === 'trainer' ? trainerSlots : slots;
    const availableKeys = [...new Set(modeSlots.map((slot) => dateKey(slot.starts_at)).filter(Boolean))].sort();
    const firstDate = availableKeys[0];
    const current = mode === 'psychologist' ? psychologistDate : mode === 'trainer' ? trainerDate : singleDate;
    const nextDate = availableKeys.includes(current) ? current : (firstDate ?? current);

    if (mode === 'psychologist') setPsychologistDate(nextDate);
    if (mode === 'trainer') setTrainerDate(nextDate);
    if (mode === 'single') setSingleDate(nextDate);
    const existingSelection =
      mode === 'psychologist' ? state.selectedPsychologistSlotId : mode === 'trainer' ? state.selectedTrainerSlotId : state.selectedSlotId;
    setPendingSlotId(existingSelection);
    setSlotPickerMode(mode);
  }

  const activeDate = slotPickerMode === 'psychologist' ? psychologistDate : slotPickerMode === 'trainer' ? trainerDate : singleDate;
  const activeSlots = slotPickerMode === 'psychologist' ? psychologistSlots : slotPickerMode === 'trainer' ? trainerSlots : slots;
  const activeAvailableDateKeys = useMemo(
    () => [...new Set(activeSlots.map((slot) => dateKey(slot.starts_at)).filter(Boolean))].sort(),
    [activeSlots],
  );
  const activeDateSlots = activeSlots.filter((slot) => dateKey(slot.starts_at) === activeDate);
  const displayDateSlots: DisplaySlot[] = activeDateSlots.length
    ? activeDateSlots.map((slot) => ({ id: slot.id, starts_at: slot.starts_at, source: 'api' }))
    : generateFallbackSlots(activeDate);

  function selectedSlotLabel(mode: SlotPickerMode) {
    const targetId = mode === 'psychologist' ? state.selectedPsychologistSlotId : mode === 'trainer' ? state.selectedTrainerSlotId : state.selectedSlotId;
    const targetSlot = (mode === 'psychologist' ? psychologistSlots : mode === 'trainer' ? trainerSlots : slots).find((slot) => slot.id === targetId);
    if (targetSlot) return formatDateTime(targetSlot.starts_at);
    if (mode === 'psychologist' && generatedPsychologistSlot) return formatDateTime(generatedPsychologistSlot);
    if (mode === 'trainer' && generatedTrainerSlot) return formatDateTime(generatedTrainerSlot);
    if (mode === 'single' && generatedSingleSlot) return formatDateTime(generatedSingleSlot);
    return 'Select time slot';
  }

  function selectSlotAndClose(slotId: number) {
    const selectedDisplaySlot = displayDateSlots.find((slot) => slot.id === slotId);
    if (slotPickerMode === 'psychologist') {
      dispatch({ type: 'SET_FIELD', payload: { selectedPsychologistSlotId: slotId } });
      setGeneratedPsychologistSlot(selectedDisplaySlot?.source === 'generated' ? selectedDisplaySlot.starts_at : null);
    } else if (slotPickerMode === 'trainer') {
      dispatch({ type: 'SET_FIELD', payload: { selectedTrainerSlotId: slotId } });
      setGeneratedTrainerSlot(selectedDisplaySlot?.source === 'generated' ? selectedDisplaySlot.starts_at : null);
    } else {
      dispatch({ type: 'SET_FIELD', payload: { selectedSlotId: slotId } });
      setGeneratedSingleSlot(selectedDisplaySlot?.source === 'generated' ? selectedDisplaySlot.starts_at : null);
    }
    setSlotPickerMode(null);
    setPendingSlotId(null);
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

  function renderStepActions({
    onNext,
    nextLabel,
    nextDisabled = false,
    onBack,
    desktopBackLabel = 'Back',
  }: {
    onNext: () => void | Promise<void>;
    nextLabel: string;
    nextDisabled?: boolean;
    onBack?: () => void;
    desktopBackLabel?: string;
  }) {
    return (
      <>
        <div className="hidden justify-between gap-2 sm:flex">
          {onBack ? <DSSecondaryButton onClick={onBack}>{desktopBackLabel}</DSSecondaryButton> : <span />}
          <DSButton onClick={onNext} disabled={nextDisabled}>{nextLabel}</DSButton>
        </div>
        <div className="grid grid-cols-[48px_1fr] gap-2 sm:hidden">
          <button
            type="button"
            aria-label="Go back"
            onClick={onBack}
            disabled={!onBack}
            className="inline-flex h-12 items-center justify-center rounded-xl border border-slate-300 bg-white text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ArrowLeft size={18} />
          </button>
          <DSButton onClick={onNext} disabled={nextDisabled} className="h-12 w-full">{nextLabel}</DSButton>
        </div>
      </>
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
      <DSCard className="space-y-4 rounded-[28px] border-slate-200/80 p-4 sm:p-6">
        <div className="hidden sm:block">
          <IntakeStepper current={stepperCurrent} steps={stepperSteps} />
        </div>
        <div className="rounded-xl bg-slate-50 px-3 py-2 text-xs font-medium text-slate-600 sm:hidden">
          Step {mobileCurrentStep} of {mobileTotalSteps}
        </div>

        {state.step === 1 ? (
          <>
            <MobileSectionTitle title="Select the support you need" subtitle="Choose your main service type to continue." />
            <div className="grid gap-3 sm:grid-cols-2">
              {([
                { key: 'psychology', label: 'Psychology Support', icon: Brain, description: 'Counselling for stress, anxiety, low mood, burnout, relationships, and emotional wellbeing.' },
                { key: 'training', label: 'Personal Training', icon: Dumbbell, description: 'Goal-based coaching for fat loss, strength, mobility, fitness, and healthy routines.' },
                { key: 'combined', label: 'Combined Wellness', icon: HeartHandshake, description: 'A blended mind + body plan with counselling and personal training support.' },
                { key: 'package', label: 'Wellness Packages', icon: Package2, description: 'Structured packages with bundled sessions and guided progress plans.' },
              ] as const).map(({ key, label, icon: Icon, description }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => dispatch({ type: 'SET_SERVICE', payload: key })}
                  className={`rounded-2xl border p-4 text-left transition ${state.serviceType === key ? 'border-[var(--ds-brand)] bg-indigo-50/60 shadow-[inset_0_0_0_1px_var(--ds-brand)]' : 'border-[var(--ds-border)] bg-white hover:bg-slate-50'}`}
                >
                  <div className="flex items-start gap-3">
                    <span className={`grid h-10 w-10 place-items-center rounded-full ${state.serviceType === key ? 'bg-indigo-100 text-[var(--ds-brand)]' : 'bg-slate-100 text-slate-500'}`}>
                      <Icon size={18} />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold text-slate-900">{label}</span>
                      <span className="mt-1 block text-xs leading-5 text-slate-600">{description}</span>
                    </span>
                  </div>
                </button>
              ))}
            </div>
            <div className="rounded-2xl bg-slate-100 p-4 text-sm text-slate-700">
              <p className="mb-2 flex items-center gap-2 font-semibold text-slate-900"><Info size={16} /> How this works</p>
              <ul className="space-y-1 text-xs leading-5 text-slate-600">
                <li>Answer tailored intake questions.</li>
                <li>Get the right practitioner or package.</li>
                <li>Book your first session.</li>
              </ul>
            </div>
            {renderStepActions({
              onNext: onContinueFromService,
              nextLabel: loading ? 'Starting...' : 'Next',
              nextDisabled: loading,
              onBack: () => navigate('/client'),
              desktopBackLabel: 'Back to Dashboard',
            })}
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
            {renderStepActions({
              onNext: onContinueFromIntake,
              nextLabel: loading ? 'Submitting...' : 'Next',
              nextDisabled: loading,
              onBack: () => dispatch({ type: 'SET_STEP', payload: 1 }),
            })}
          </>
        ) : null}

        {state.step === 3 && isCombined ? (
          <>
            <MobileSectionTitle title="Select Psychologist" subtitle="Choose a psychologist and select your session time." />
            {renderPractitionerButton('psychologist', selectedPsychologist, 'Select Psychologist', 'Open psychologist list')}
            {selectedPsychologist ? <p className="text-xs text-slate-600">Specialties: {selectedPsychologist.specialties.join(', ')}</p> : null}
            <button
              type="button"
              onClick={() => openSlotPicker('psychologist')}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-left text-slate-700 transition hover:bg-slate-50"
            >
              {selectedSlotLabel('psychologist')}
            </button>
            {renderStepActions({
              onNext: () => dispatch({ type: 'SET_STEP', payload: 4 }),
              nextLabel: 'Next',
              nextDisabled: !state.selectedPsychologistId || !state.selectedPsychologistSlotId,
              onBack: () => dispatch({ type: 'SET_STEP', payload: 2 }),
            })}
          </>
        ) : null}

        {state.step === 4 && isCombined ? (
          <>
            <MobileSectionTitle title="Select Fitness Trainer" subtitle="Choose a trainer and select your session time." />
            {renderPractitionerButton('trainer', selectedTrainer, 'Select Fitness Trainer', 'Open trainer list')}
            {selectedTrainer ? <p className="text-xs text-slate-600">Specialties: {selectedTrainer.specialties.join(', ')}</p> : null}
            <button
              type="button"
              onClick={() => openSlotPicker('trainer')}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-left text-slate-700 transition hover:bg-slate-50"
            >
              {selectedSlotLabel('trainer')}
            </button>
            {renderStepActions({
              onNext: () => dispatch({ type: 'SET_STEP', payload: 5 }),
              nextLabel: 'Next',
              nextDisabled: !state.selectedTrainerId || !state.selectedTrainerSlotId,
              onBack: () => dispatch({ type: 'SET_STEP', payload: 3 }),
            })}
          </>
        ) : null}

        {state.step === 5 && isCombined ? (
          <>
            <MobileSectionTitle title="Review" subtitle="Confirm both appointment schedules before reserving slots." />
            <div className="grid gap-3 sm:grid-cols-2">
              {renderAppointmentSummary('Psychologist appointment', selectedPsychologist, selectedPsychologistSlot)}
              {renderAppointmentSummary('Fitness trainer appointment', selectedTrainer, selectedTrainerSlot)}
            </div>
            {renderStepActions({
              onNext: onReserveCombinedSlots,
              nextLabel: loading ? 'Reserving...' : 'Reserve Slot',
              nextDisabled: loading,
              onBack: () => dispatch({ type: 'SET_STEP', payload: 4 }),
            })}
          </>
        ) : null}

        {state.step === 3 && !isCombined ? (
          <>
            <MobileSectionTitle title="Schedule your first session" subtitle="Pick practitioner and time slot." />
            {renderPractitionerButton('single', selectedPractitioner, 'Select practitioner', 'Choose from recommended matches')}
            {selectedPractitioner ? <p className="text-xs text-slate-600">Specialties: {selectedPractitioner.specialties.join(', ')}</p> : null}
            <button
              type="button"
              onClick={() => openSlotPicker('single')}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-left text-slate-700 transition hover:bg-slate-50"
            >
              {selectedSlotLabel('single')}
            </button>
            {renderStepActions({
              onNext: onReserveSingleSlot,
              nextLabel: loading ? 'Reserving...' : 'Reserve Slot',
              nextDisabled: loading || !state.selectedSlotId || !state.selectedPractitionerId,
              onBack: () => dispatch({ type: 'SET_STEP', payload: 2 }),
            })}
          </>
        ) : null}

        {state.step > 1 && previousStep ? (
          <div className="pt-1 sm:hidden">
            <button
              type="button"
              onClick={() => dispatch({ type: 'SET_STEP', payload: previousStep })}
              className="inline-flex items-center gap-1 text-xs font-medium text-slate-500"
            >
              <ArrowLeft size={14} />
              Previous step
            </button>
          </div>
        ) : null}

        <Dialog open={pickerMode !== null} onOpenChange={(open) => setPickerMode(open ? pickerMode : null)}>
          <DialogContent className="left-0 top-0 h-dvh max-h-dvh w-screen max-w-none translate-x-0 translate-y-0 overflow-y-auto rounded-none border-0 bg-white p-4 sm:max-w-none sm:p-6">
            <DialogHeader className="max-w-3xl">
              <DialogTitle>{pickerMode === 'trainer' ? 'Select Fitness Trainer' : pickerMode === 'psychologist' ? 'Select Psychologist' : 'Select practitioner'}</DialogTitle>
              <DialogDescription>
                {pickerMode === 'trainer' ? 'Choose a trainer for your fitness session.' : pickerMode === 'psychologist' ? 'Choose a psychologist for your counselling session.' : 'Choose a practitioner from your recommended matches.'}
              </DialogDescription>
            </DialogHeader>
            <div className="mx-auto w-full max-w-3xl pb-6">
              <div className="grid max-h-[calc(100dvh-170px)] gap-3 overflow-y-auto pr-1">
              {displayPractitioners.length ? displayPractitioners.map((practitioner) => {
                const selected = practitioner.id === state.selectedPractitionerId || practitioner.id === state.selectedPsychologistId || practitioner.id === state.selectedTrainerId;

                return (
                  <button
                    key={practitioner.id}
                    type="button"
                    onClick={() => selectPractitioner(practitioner)}
                    className={`flex items-start justify-between gap-3 rounded-2xl border px-4 py-4 text-left transition ${selected ? 'border-[var(--ds-brand)] bg-indigo-50/70' : 'border-slate-200 bg-white hover:bg-slate-50'}`}
                  >
                    <span className="flex min-w-0 items-start gap-3">
                      <img src={practitioner.avatarUrl} alt={`${practitioner.name} profile`} className="h-14 w-14 shrink-0 rounded-full object-cover ring-1 ring-slate-200" />
                      <span className="min-w-0">
                        <span className="block text-base font-semibold text-slate-900">{practitioner.name}</span>
                        <span className="mt-0.5 block text-sm text-slate-500">{practitionerLabel(practitioner.type)}</span>
                        {practitioner.specialties.length ? <span className="mt-2 block text-sm text-slate-600">{practitioner.specialties.join(', ')}</span> : null}
                      </span>
                    </span>
                    {selected ? <Check className="h-5 w-5 shrink-0 text-[var(--ds-brand)]" aria-hidden="true" /> : null}
                  </button>
                );
              }) : (
                <p className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">No practitioners are available for this selection yet.</p>
              )}
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={slotPickerMode !== null} onOpenChange={(open) => setSlotPickerMode(open ? slotPickerMode : null)}>
          <DialogContent className="left-0 top-0 h-dvh max-h-dvh w-screen max-w-none translate-x-0 translate-y-0 overflow-y-auto rounded-none border-0 bg-white p-4 sm:max-w-none sm:p-6">
            <DialogHeader className="max-w-3xl">
              <DialogTitle>Select Time Slot</DialogTitle>
              <DialogDescription>Choose a date and then select an available time slot.</DialogDescription>
            </DialogHeader>
            <div className="mx-auto w-full max-w-3xl space-y-4 pb-6">
              <div className="rounded-2xl border border-slate-200 bg-white p-2">
                <Calendar
                  mode="single"
                  selected={activeDate ? fromLocalDateKey(activeDate) : undefined}
                  modifiers={{
                    hasSlots: (date) => activeAvailableDateKeys.includes(toLocalDateKey(date)),
                  }}
                  modifiersClassNames={{
                    hasSlots: 'font-semibold text-[var(--ds-brand)]',
                  }}
                  onSelect={(date) => {
                    const key = date ? toLocalDateKey(date) : '';
                    if (slotPickerMode === 'psychologist') setPsychologistDate(key);
                    else if (slotPickerMode === 'trainer') setTrainerDate(key);
                    else setSingleDate(key);
                  }}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-slate-900">Available slots</p>
                  {activeDate ? <span className="rounded-full bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700">{new Date(activeDate).toLocaleDateString()}</span> : null}
                </div>
                <div className="flex flex-wrap gap-2">
                  {displayDateSlots.map((slot) => {
                    const selected = pendingSlotId === slot.id;
                    return (
                      <button
                        key={slot.id}
                        type="button"
                        onClick={() => setPendingSlotId(slot.id)}
                        className={`rounded-full border px-3 py-2 text-sm transition ${
                          selected
                            ? 'border-[var(--ds-brand)] bg-indigo-50 text-[var(--ds-brand)]'
                            : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {new Date(slot.starts_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </button>
                    );
                  })}
                </div>
                {!activeDateSlots.length ? (
                  <div className="space-y-2">
                    <p className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-600">
                      Showing generated time chips for this date.
                    </p>
                    {activeAvailableDateKeys[0] ? (
                      <button
                        type="button"
                        onClick={() => {
                          if (slotPickerMode === 'psychologist') setPsychologistDate(activeAvailableDateKeys[0]);
                          else if (slotPickerMode === 'trainer') setTrainerDate(activeAvailableDateKeys[0]);
                          else setSingleDate(activeAvailableDateKeys[0]);
                        }}
                        className="text-xs font-medium text-[var(--ds-brand)]"
                      >
                        Jump to next available date
                      </button>
                    ) : null}
                  </div>
                ) : null}
                <div className="pt-1">
                  <DSButton
                    type="button"
                    className="w-full"
                    disabled={!pendingSlotId}
                    onClick={() => {
                      if (pendingSlotId) selectSlotAndClose(pendingSlotId);
                    }}
                  >
                    Select
                  </DSButton>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {notice ? <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-700">{notice}</p> : null}
      </DSCard>
    </div>
  );
}
