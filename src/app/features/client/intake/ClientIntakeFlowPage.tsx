import { useEffect, useMemo, useReducer, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  CalendarDays,
  Check,
  ChevronDown,
  Globe2,
  Headphones,
  Heart,
  LockKeyhole,
  Monitor,
  RotateCcw,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  UserCheck,
  UserRound,
  X,
} from 'lucide-react';
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
import { MobileSectionTitle } from '../../../../design/patterns/intake';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../../../components/ui/dialog';
import { getClientMemberships, type ClientMembership } from '../../shared/services/membershipApi';

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

function formatDateParam(value: Date) {
  const localDate = new Date(value.getTime() - value.getTimezoneOffset() * 60_000);
  return localDate.toISOString().slice(0, 10);
}

function upcomingSlotWindow() {
  const from = new Date();
  const to = new Date();
  to.setDate(from.getDate() + 30);

  return {
    from: formatDateParam(from),
    to: formatDateParam(to),
  };
}

function practitionerLabel(type: PractitionerItem['type'] | string | undefined) {
  if (type === 'trainer') return 'Fitness trainer';
  if (type === 'counsellor') return 'Psychologist';
  return 'Coach';
}

function practitionerProfileMeta(practitioner: PractitionerItem | undefined) {
  if (!practitioner) {
    return {
      description: 'Supports your wellness goals with personalized care.',
      experience: '6+ years exp.',
      languages: ['English'],
      modes: ['Online'],
      price: '₹1,200',
      reviews: 80,
    };
  }

  if (practitioner.type === 'trainer') {
    return {
      description: 'Builds sustainable routines with strength, mobility, and habit coaching.',
      experience: '6+ years exp.',
      languages: ['English', 'Hindi'],
      modes: ['Online', 'In-person'],
      price: '₹1,200',
      reviews: 96,
    };
  }

  if (practitioner.type === 'coach') {
    return {
      description: 'Helps you build sustainable habits and improve everyday resilience.',
      experience: '6+ years exp.',
      languages: ['English', 'Hindi'],
      modes: ['Online'],
      price: '₹1,200',
      reviews: 96,
    };
  }

  return {
    description: 'Specializes in anxiety, burnout and stress management using evidence-based therapies.',
    experience: '8+ years exp.',
    languages: ['English', 'Hindi'],
    modes: ['Online', 'In-person'],
    price: '₹1,500',
    reviews: 128,
  };
}

function practitionerAvatarGradient(type: PractitionerItem['type'] | string | undefined, index: number) {
  const gradients = {
    counsellor: ['from-rose-100 via-slate-50 to-indigo-100', 'from-violet-100 via-white to-emerald-100'],
    trainer: ['from-amber-100 via-white to-sky-100', 'from-emerald-100 via-white to-indigo-100'],
    coach: ['from-sky-100 via-white to-purple-100', 'from-lime-100 via-white to-teal-100'],
  };
  const palette = type && type in gradients ? gradients[type as keyof typeof gradients] : gradients.coach;

  return palette[index % palette.length];
}

function formatNextAvailability(slot: SlotItem | undefined) {
  if (!slot) return 'No slots available';

  const date = new Date(slot.starts_at);
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  const sameDay = (a: Date, b: Date) => a.toDateString() === b.toDateString();
  const dayLabel = sameDay(date, today) ? 'Today' : sameDay(date, tomorrow) ? 'Tomorrow' : date.toLocaleDateString(undefined, { weekday: 'short' });

  return `${dayLabel} ${date.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}`;
}

function compactSpecialtyLabel(value: string) {
  return value.replace(/_/g, ' ');
}

function practitionerInitials(name: string | null | undefined) {
  const initials = String(name ?? 'WC Practitioner')
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2);

  return initials || 'WC';
}

function numericRating(value: PractitionerItem['rating']) {
  const rating = Number(value);

  return Number.isFinite(rating) ? rating : 4.8;
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
  const [pickerSlots, setPickerSlots] = useState<Record<number, SlotItem[]>>({});
  const [practitionerSearch, setPractitionerSearch] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState('');
  const [modeFilter, setModeFilter] = useState('');
  const [languageFilter, setLanguageFilter] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('');
  const [savedPractitionerIds, setSavedPractitionerIds] = useState<number[]>([]);
  const [confirmation, setConfirmation] = useState<{ state: string; message?: string } | null>(null);
  const [memberships, setMemberships] = useState<ClientMembership[]>([]);
  const [useCredits, setUseCredits] = useState(false);
  const [selectedMembershipId, setSelectedMembershipId] = useState<number | null>(null);

  const selectedPractitioner = useMemo(() => practitioners.find((p) => p.id === state.selectedPractitionerId), [practitioners, state.selectedPractitionerId]);
  const selectedPsychologist = useMemo(() => practitioners.find((p) => p.id === state.selectedPsychologistId), [practitioners, state.selectedPsychologistId]);
  const selectedTrainer = useMemo(() => practitioners.find((p) => p.id === state.selectedTrainerId), [practitioners, state.selectedTrainerId]);
  const selectedSlot = useMemo(() => slots.find((slot) => slot.id === state.selectedSlotId), [slots, state.selectedSlotId]);
  const selectedPsychologistSlot = useMemo(() => psychologistSlots.find((slot) => slot.id === state.selectedPsychologistSlotId), [psychologistSlots, state.selectedPsychologistSlotId]);
  const selectedTrainerSlot = useMemo(() => trainerSlots.find((slot) => slot.id === state.selectedTrainerSlotId), [trainerSlots, state.selectedTrainerSlotId]);
  const concernChoices = getConcernOptions(state.serviceType);
  const isCombined = state.serviceType === 'combined';
  const totalSteps = isCombined ? 5 : 3;
  const currentStep = Math.min(state.step, totalSteps);
  const activeMemberships = memberships.filter((membership) => membership.status === 'active');

  useEffect(() => {
    getClientMemberships()
      .then((data) => {
        const active = data.filter((membership) => membership.status === 'active');
        setMemberships(data);
        setSelectedMembershipId(active[0]?.id ?? null);
      })
      .catch(() => setMemberships([]));
  }, []);

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

  const filteredPickerPractitioners = useMemo(() => {
    if (!pickerMode) return [];

    const query = practitionerSearch.trim().toLowerCase();

    return pickerPractitioners.filter((practitioner) => {
      const meta = practitionerProfileMeta(practitioner);
      const searchable = [
        practitioner.name ?? '',
        practitionerLabel(practitioner.type),
        meta.description,
        meta.languages.join(' '),
        meta.modes.join(' '),
        ...(practitioner.specialties ?? []),
      ].join(' ').toLowerCase();
      const slotsForPractitioner = pickerSlots[practitioner.id] ?? [];

      if (query && !searchable.includes(query)) return false;
      if (specialtyFilter && !(practitioner.specialties ?? []).includes(specialtyFilter)) return false;
      if (modeFilter && !meta.modes.includes(modeFilter)) return false;
      if (languageFilter && !meta.languages.includes(languageFilter)) return false;
      if (availabilityFilter === 'available' && !slotsForPractitioner.length) return false;

      return true;
    });
  }, [availabilityFilter, languageFilter, modeFilter, pickerMode, pickerPractitioners, pickerSlots, practitionerSearch, specialtyFilter]);

  const availableSpecialties = useMemo(() => {
    if (!pickerMode) return [];

    return Array.from(new Set(pickerPractitioners.flatMap((practitioner) => practitioner.specialties ?? []))).sort();
  }, [pickerMode, pickerPractitioners]);

  const availableLanguages = useMemo(() => {
    if (!pickerMode) return [];

    return Array.from(new Set(pickerPractitioners.flatMap((practitioner) => practitionerProfileMeta(practitioner).languages))).sort();
  }, [pickerMode, pickerPractitioners]);

  useEffect(() => {
    if (state.step < 3 || !state.flowId) return;
    getRecommendedPractitioners(state.flowId).then(setPractitioners).catch(() => {
      setNotice('Unable to load practitioners.');
    });
  }, [state.step, state.flowId]);

  useEffect(() => {
    if (!state.selectedPractitionerId) return;
    const window = upcomingSlotWindow();
    getPractitionerSlots(state.selectedPractitionerId, window.from, window.to).then((items) => {
      setSlots(items);
      if (state.selectedSlotId && !items.some((slot) => slot.id === state.selectedSlotId)) {
        dispatch({ type: 'SET_FIELD', payload: { selectedSlotId: null } });
      }
    }).catch(() => {
      setSlots([]);
      dispatch({ type: 'SET_FIELD', payload: { selectedSlotId: null } });
    });
  }, [state.selectedPractitionerId, state.selectedSlotId]);

  useEffect(() => {
    if (!state.selectedPsychologistId) return;
    const window = upcomingSlotWindow();
    getPractitionerSlots(state.selectedPsychologistId, window.from, window.to).then((items) => {
      setPsychologistSlots(items);
      if (state.selectedPsychologistSlotId && !items.some((slot) => slot.id === state.selectedPsychologistSlotId)) {
        dispatch({ type: 'SET_FIELD', payload: { selectedPsychologistSlotId: null } });
      }
    }).catch(() => {
      setPsychologistSlots([]);
      dispatch({ type: 'SET_FIELD', payload: { selectedPsychologistSlotId: null } });
    });
  }, [state.selectedPsychologistId, state.selectedPsychologistSlotId]);

  useEffect(() => {
    if (!state.selectedTrainerId) return;
    const window = upcomingSlotWindow();
    getPractitionerSlots(state.selectedTrainerId, window.from, window.to).then((items) => {
      setTrainerSlots(items);
      if (state.selectedTrainerSlotId && !items.some((slot) => slot.id === state.selectedTrainerSlotId)) {
        dispatch({ type: 'SET_FIELD', payload: { selectedTrainerSlotId: null } });
      }
    }).catch(() => {
      setTrainerSlots([]);
      dispatch({ type: 'SET_FIELD', payload: { selectedTrainerSlotId: null } });
    });
  }, [state.selectedTrainerId, state.selectedTrainerSlotId]);

  useEffect(() => {
    if (!pickerMode || !pickerPractitioners.length) return;

    let cancelled = false;
    const window = upcomingSlotWindow();

    Promise.all(
      pickerPractitioners.map((practitioner) => (
        getPractitionerSlots(practitioner.id, window.from, window.to)
          .then((items) => [practitioner.id, items] as const)
          .catch(() => [practitioner.id, []] as const)
      ))
    ).then((entries) => {
      if (!cancelled) {
        setPickerSlots(Object.fromEntries(entries));
      }
    });

    return () => {
      cancelled = true;
    };
  }, [pickerMode, pickerPractitioners]);

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
        use_membership_credits: useCredits,
        membership_subscription_id: useCredits ? selectedMembershipId ?? undefined : undefined,
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

  function clearPractitionerFilters() {
    setPractitionerSearch('');
    setSpecialtyFilter('');
    setModeFilter('');
    setLanguageFilter('');
    setAvailabilityFilter('');
  }

  function toggleSavedPractitioner(practitionerId: number) {
    setSavedPractitionerIds((current) => (
      current.includes(practitionerId)
        ? current.filter((id) => id !== practitionerId)
        : [...current, practitionerId]
    ));
  }

  function renderFilterSelect(label: string, value: string, onChange: (value: string) => void, options: string[]) {
    return (
      <label className="relative min-w-36">
        <span className="sr-only">{label}</span>
        <select
          className="h-12 w-full appearance-none rounded-xl border border-indigo-100 bg-white px-4 pr-10 text-sm font-semibold text-slate-900 shadow-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
          value={value}
          onChange={(event) => onChange(event.target.value)}
        >
          <option value="">{label}</option>
          {options.map((option) => <option key={option} value={option}>{compactSpecialtyLabel(option)}</option>)}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-700" aria-hidden="true" />
      </label>
    );
  }

  function renderPractitionerPickerCard(practitioner: PractitionerItem, index: number) {
    const meta = practitionerProfileMeta(practitioner);
    const nextSlot = pickerSlots[practitioner.id]?.[0];
    const selected = practitioner.id === state.selectedPractitionerId || practitioner.id === state.selectedPsychologistId || practitioner.id === state.selectedTrainerId;
    const saved = savedPractitionerIds.includes(practitioner.id);
    const rating = numericRating(practitioner.rating);
    const match = Math.max(86, Math.round(rating * 20) - (index * 2));
    const name = practitioner.name ?? 'Wellness Practitioner';
    const specialties = practitioner.specialties ?? [];

    return (
      <article
        key={practitioner.id}
        className={`relative grid gap-5 rounded-2xl border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-lg lg:grid-cols-[1fr_250px_210px] ${
          selected ? 'border-indigo-300 ring-4 ring-indigo-100' : 'border-slate-200'
        }`}
      >
        {index === 0 ? (
          <div className="absolute -top-3 left-6 inline-flex items-center gap-1 rounded-lg bg-indigo-600 px-3 py-1 text-xs font-semibold text-white shadow-md">
            <Star className="h-3.5 w-3.5 fill-amber-300 text-amber-300" aria-hidden="true" />
            Recommended for you
          </div>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-[132px_1fr]">
          <div className={`flex aspect-square h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br ${practitionerAvatarGradient(practitioner.type, index)} shadow-inner`}>
            <span className="grid h-24 w-24 place-items-center rounded-full bg-white/70 text-3xl font-bold text-indigo-700 shadow-sm">
              {practitionerInitials(name)}
            </span>
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-xl font-bold text-slate-950">{name}</h3>
              <BadgeCheck className="h-5 w-5 fill-indigo-600 text-white" aria-hidden="true" />
            </div>
            <p className="mt-1 text-sm font-medium text-slate-600">{practitionerLabel(practitioner.type)}</p>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-700">{meta.description}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {specialties.slice(0, 5).map((specialty) => (
                <span key={specialty} className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold capitalize text-indigo-700">
                  {compactSpecialtyLabel(specialty)}
                </span>
              ))}
            </div>
            <div className="mt-5 flex flex-wrap gap-x-7 gap-y-2 text-sm font-medium text-slate-600">
              <span className="inline-flex items-center gap-2"><BriefcaseBusiness className="h-4 w-4" aria-hidden="true" />{meta.experience}</span>
              <span className="inline-flex items-center gap-2"><Globe2 className="h-4 w-4" aria-hidden="true" />{meta.languages.join(', ')}</span>
              <span className="inline-flex items-center gap-2"><Monitor className="h-4 w-4" aria-hidden="true" />{meta.modes.join(' • ')}</span>
            </div>
          </div>
        </div>

        <div className="grid content-center gap-4 border-slate-200 lg:border-l lg:pl-6">
          <div className="w-fit justify-self-start rounded-full bg-emerald-50 px-3 py-1 text-sm font-bold text-emerald-700 lg:justify-self-end">{match}% match</div>
          <div className="rounded-xl border border-emerald-100 bg-gradient-to-r from-emerald-50 to-white px-4 py-3">
            <p className="flex items-center gap-2 text-xs font-semibold text-emerald-700"><CalendarDays className="h-4 w-4" aria-hidden="true" />Next available</p>
            <p className="mt-1 text-sm font-bold text-emerald-800">{formatNextAvailability(nextSlot)}</p>
          </div>
          <p className="flex items-center gap-2 text-sm text-slate-700"><Star className="h-4 w-4 fill-amber-400 text-amber-400" aria-hidden="true" />{rating.toFixed(1)} ({meta.reviews} reviews)</p>
          <p className="text-lg font-extrabold text-slate-950">{meta.price}<span className="text-sm font-semibold text-slate-600"> / session</span></p>
        </div>

        <div className="grid content-center gap-3 border-slate-200 lg:border-l lg:pl-6">
          <button
            type="button"
            onClick={() => selectPractitioner(practitioner)}
            className="h-12 rounded-xl bg-indigo-600 px-4 text-sm font-bold text-white shadow-md shadow-indigo-200 transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-100"
          >
            {selected ? 'Selected' : 'Select Practitioner'}
          </button>
          <button
            type="button"
            className="h-12 rounded-xl border border-indigo-300 bg-white px-4 text-sm font-bold text-indigo-700 transition hover:bg-indigo-50 focus:outline-none focus:ring-4 focus:ring-indigo-100"
          >
            View Profile
          </button>
          <button
            type="button"
            onClick={() => toggleSavedPractitioner(practitioner.id)}
            className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-bold text-indigo-700 transition hover:bg-indigo-50"
          >
            <Heart className={`h-4 w-4 ${saved ? 'fill-indigo-600' : ''}`} aria-hidden="true" />
            {saved ? 'Saved' : 'Save'}
          </button>
        </div>
      </article>
    );
  }

  function renderPractitionerButton(mode: PickerMode, practitioner: PractitionerItem | undefined, title: string, hint: string) {
    return (
      <button
        type="button"
        onClick={() => setPickerMode(mode)}
        className="flex min-h-14 w-full items-center justify-between gap-3 rounded-xl border border-slate-300 bg-white px-3 py-2 text-left transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800"
      >
        <span>
          <span className="block text-sm font-semibold text-slate-800">{practitioner ? practitioner.name : title}</span>
          <span className="block text-xs capitalize text-slate-500">{practitioner ? practitionerLabel(practitioner.type) : hint}</span>
        </span>
        <UserRound className="h-5 w-5 text-slate-500" aria-hidden="true" />
      </button>
    );
  }

  function renderSlotSelect(slotsForPractitioner: SlotItem[], selectedId: number | null, onSelect: (slotId: number | null) => void, practitionerSelected: boolean) {
    const hasSlots = slotsForPractitioner.length > 0;

    return (
      <div className="grid gap-2">
        <select
          className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:disabled:bg-slate-800"
          value={selectedId ?? ''}
          onChange={(event) => onSelect(Number(event.target.value) || null)}
          disabled={!practitionerSelected || !hasSlots}
        >
          <option value="">{!practitionerSelected ? 'Select practitioner first' : hasSlots ? 'Select time slot' : 'No upcoming slots available'}</option>
          {slotsForPractitioner.map((slot) => <option key={slot.id} value={slot.id}>{formatDateTime(slot.starts_at)}</option>)}
        </select>
        {practitionerSelected && !hasSlots ? (
          <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-medium text-amber-700 dark:border-amber-400/30 dark:bg-amber-400/10 dark:text-amber-200">
            No upcoming slots available for this practitioner.
          </p>
        ) : null}
      </div>
    );
  }

  function renderAppointmentSummary(title: string, practitioner: PractitionerItem | undefined, slot: SlotItem | undefined) {
    return (
      <DSCard className="space-y-1 bg-slate-50 shadow-none dark:bg-slate-900">
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
      <div className="fixed inset-0 z-50 overflow-y-auto bg-white px-4 py-6 dark:bg-slate-950 sm:px-8">
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
    <div className="client-intake-flow mx-auto w-full max-w-lg pb-20">
      <div className="mb-7 flex items-center justify-between">
        {state.step > 1 ? (
          <button
            type="button"
            onClick={() => dispatch({ type: 'SET_STEP', payload: (state.step - 1) as Step })}
            className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
          >
            <ArrowLeft size={15} /> Back
          </button>
        ) : (
          <button
            type="button"
            onClick={() => navigate('/client')}
            className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
          >
            <ArrowLeft size={15} /> Dashboard
          </button>
        )}

        <div className="flex items-center gap-1.5" aria-label={`Step ${currentStep} of ${totalSteps}`}>
          {Array.from({ length: totalSteps }, (_, index) => {
            const item = index + 1;
            return (
              <span
                key={item}
                className={`h-2 rounded-full transition-all duration-300 ${
                  item === currentStep ? 'w-6 bg-indigo-600' : item < currentStep ? 'w-2 bg-indigo-300' : 'w-2 bg-slate-200'
                }`}
              />
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => navigate('/client')}
          className="rounded-lg px-2 py-1.5 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
        >
          Close
        </button>
      </div>

      <div className="space-y-6">
        {state.step === 1 ? (
          <>
            <MobileSectionTitle title="Select the support you need" subtitle="Choose your main service type to continue." />
            <div className="grid gap-3 sm:grid-cols-2">
              {(['psychology', 'training', 'combined', 'package'] as ServiceType[]).map((service) => (
                <button
                  key={service}
                  type="button"
                  onClick={() => dispatch({ type: 'SET_SERVICE', payload: service })}
                  className={`rounded-xl border-2 px-4 py-4 text-left text-sm capitalize transition ${
                    state.serviceType === service
                      ? 'border-[var(--ds-brand)] bg-indigo-50 text-[var(--ds-brand)]'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <span className="block font-semibold">{service}</span>
                  <span className="mt-1 block text-xs normal-case text-slate-500">
                    {service === 'combined' ? 'Counselling and fitness together' : service === 'package' ? 'A guided wellness package' : service === 'psychology' ? 'Mental wellness support' : 'Fitness and habit support'}
                  </span>
                </button>
              ))}
            </div>
            <DSButton className="w-full gap-2" onClick={onContinueFromService} disabled={loading}>
              {loading ? 'Starting...' : <>Continue <ArrowRight size={16} /></>}
            </DSButton>
          </>
        ) : null}

        {state.step === 2 ? (
          <>
            <MobileSectionTitle title="Intake questions" subtitle="Answer briefly so we can match the right support." />
            <label className="grid gap-1.5 text-sm font-medium text-slate-700">What brings you here today?
              <select className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100" value={state.concern} onChange={(e) => dispatch({ type: 'SET_FIELD', payload: { concern: e.target.value } })}>
                {concernChoices.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
              </select>
            </label>
            <label className="grid gap-1.5 text-sm font-medium text-slate-700">How long?
              <select className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100" value={state.duration} onChange={(e) => dispatch({ type: 'SET_FIELD', payload: { duration: e.target.value } })}>
                <option value="lt_2_weeks">Less than 2 weeks</option>
                <option value="2_8_weeks">2-8 weeks</option>
                <option value="2_6_months">2-6 months</option>
                <option value="gt_6_months">More than 6 months</option>
              </select>
            </label>
            <label className="grid gap-1.5 text-sm font-medium text-slate-700">What would success look like?
              <textarea
                className="min-h-24 rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500"
                value={state.outcome}
                onChange={(e) => dispatch({ type: 'SET_FIELD', payload: { outcome: e.target.value } })}
                placeholder="Example: I want to feel calmer, sleep better, build a consistent fitness routine, and know which first steps to follow each week."
              />
            </label>
            <div className="flex gap-2">
              <DSSecondaryButton className="flex-1" onClick={() => dispatch({ type: 'SET_STEP', payload: 1 })}>Back</DSSecondaryButton>
              <DSButton className="flex-1 gap-2" onClick={onContinueFromIntake} disabled={loading}>{loading ? 'Submitting...' : <>Continue <ArrowRight size={16} /></>}</DSButton>
            </div>
          </>
        ) : null}

        {state.step === 3 && isCombined ? (
          <>
            <MobileSectionTitle title="Select Psychologist" subtitle="Choose a psychologist and select your session time." />
            {renderPractitionerButton('psychologist', selectedPsychologist, 'Select Psychologist', 'Open psychologist list')}
            {selectedPsychologist ? <p className="text-xs text-slate-600">Specialties: {selectedPsychologist.specialties.join(', ')}</p> : null}
            {renderSlotSelect(psychologistSlots, state.selectedPsychologistSlotId, (slotId) => dispatch({ type: 'SET_FIELD', payload: { selectedPsychologistSlotId: slotId } }), Boolean(state.selectedPsychologistId))}
            <div className="flex gap-2"><DSSecondaryButton className="flex-1" onClick={() => dispatch({ type: 'SET_STEP', payload: 2 })}>Back</DSSecondaryButton><DSButton className="flex-1 gap-2" onClick={() => dispatch({ type: 'SET_STEP', payload: 4 })} disabled={!state.selectedPsychologistId || !state.selectedPsychologistSlotId}>Continue <ArrowRight size={16} /></DSButton></div>
          </>
        ) : null}

        {state.step === 4 && isCombined ? (
          <>
            <MobileSectionTitle title="Select Fitness Trainer" subtitle="Choose a trainer and select your session time." />
            {renderPractitionerButton('trainer', selectedTrainer, 'Select Fitness Trainer', 'Open trainer list')}
            {selectedTrainer ? <p className="text-xs text-slate-600">Specialties: {selectedTrainer.specialties.join(', ')}</p> : null}
            {renderSlotSelect(trainerSlots, state.selectedTrainerSlotId, (slotId) => dispatch({ type: 'SET_FIELD', payload: { selectedTrainerSlotId: slotId } }), Boolean(state.selectedTrainerId))}
            <div className="flex gap-2"><DSSecondaryButton className="flex-1" onClick={() => dispatch({ type: 'SET_STEP', payload: 3 })}>Back</DSSecondaryButton><DSButton className="flex-1 gap-2" onClick={() => dispatch({ type: 'SET_STEP', payload: 5 })} disabled={!state.selectedTrainerId || !state.selectedTrainerSlotId}>Review <ArrowRight size={16} /></DSButton></div>
          </>
        ) : null}

        {state.step === 5 && isCombined ? (
          <>
            <MobileSectionTitle title="Review" subtitle="Confirm both appointment schedules before reserving slots." />
            <div className="grid gap-3 sm:grid-cols-2">
              {renderAppointmentSummary('Psychologist appointment', selectedPsychologist, selectedPsychologistSlot)}
              {renderAppointmentSummary('Fitness trainer appointment', selectedTrainer, selectedTrainerSlot)}
            </div>
            <div className="flex gap-2"><DSSecondaryButton className="flex-1" onClick={() => dispatch({ type: 'SET_STEP', payload: 4 })}>Back</DSSecondaryButton><DSButton className="flex-1" onClick={onReserveCombinedSlots} disabled={loading}>{loading ? 'Reserving...' : 'Reserve Slots'}</DSButton></div>
          </>
        ) : null}

        {state.step === 3 && !isCombined ? (
          <>
            <MobileSectionTitle title="Schedule your first session" subtitle="Pick practitioner and time slot." />
            {renderPractitionerButton('single', selectedPractitioner, 'Select practitioner', 'Choose from recommended matches')}
            {selectedPractitioner ? <p className="text-xs text-slate-600">Specialties: {selectedPractitioner.specialties.join(', ')}</p> : null}
            {renderSlotSelect(slots, state.selectedSlotId, (slotId) => dispatch({ type: 'SET_FIELD', payload: { selectedSlotId: slotId } }), Boolean(state.selectedPractitionerId))}
            {state.serviceType !== 'package' && activeMemberships.length ? (
              <label className="rounded-xl border border-indigo-100 bg-indigo-50 p-3 text-sm text-slate-700">
                <span className="flex items-center gap-2 font-medium">
                  <input type="checkbox" checked={useCredits} onChange={(event) => setUseCredits(event.target.checked)} className="h-4 w-4 accent-indigo-600" />
                  Use membership credits
                </span>
                {useCredits ? (
                  <select value={selectedMembershipId ?? ''} onChange={(event) => setSelectedMembershipId(Number(event.target.value))} className="mt-3 w-full rounded-lg border border-indigo-200 bg-white p-2 text-slate-900 dark:border-indigo-500/40 dark:bg-slate-900 dark:text-slate-100">
                    {activeMemberships.map((membership) => <option key={membership.id} value={membership.id}>{membership.planName} - counselling {membership.credits.counselling}, training {membership.credits.training}</option>)}
                  </select>
                ) : null}
              </label>
            ) : null}
            <div className="flex gap-2"><DSSecondaryButton className="flex-1" onClick={() => dispatch({ type: 'SET_STEP', payload: 2 })}>Back</DSSecondaryButton><DSButton className="flex-1" onClick={onReserveSingleSlot} disabled={loading || !state.selectedSlotId || !state.selectedPractitionerId}>{loading ? 'Reserving...' : 'Reserve Slot'}</DSButton></div>
          </>
        ) : null}

        <Dialog open={pickerMode !== null} onOpenChange={(open) => setPickerMode(open ? pickerMode : null)}>
          <DialogContent className="left-0 top-0 h-dvh max-h-dvh w-screen max-w-none translate-x-0 translate-y-0 overflow-y-auto rounded-none border-0 bg-[#fbfaff] p-0 text-slate-950 sm:max-w-none">
            <div className="relative min-h-dvh overflow-hidden px-4 py-6 sm:px-8 lg:px-12">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_65%_0%,rgba(124,58,237,0.16),transparent_38%),linear-gradient(180deg,rgba(238,234,255,0.72),rgba(255,255,255,0))]" />
              <div className="pointer-events-none absolute right-0 top-12 h-28 w-1/2 rounded-bl-[100%] bg-white/60" />

              <div className="relative mx-auto max-w-[1780px]">
                <DialogHeader className="mb-8 space-y-4 pr-16 text-left">
                  <div className="flex items-center gap-3">
                    <span className="grid h-8 w-8 place-items-center rounded-lg bg-indigo-600 text-white shadow-md shadow-indigo-100">
                      <Heart className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <span className="text-xl font-extrabold tracking-tight text-slate-950">WellnessConnect</span>
                  </div>
                  <div>
                    <DialogTitle className="text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl">
                      {pickerMode === 'trainer' ? 'Select fitness trainer' : pickerMode === 'psychologist' ? 'Select psychologist' : 'Select practitioner'}
                    </DialogTitle>
                    <DialogDescription className="mt-3 text-lg font-medium text-slate-600">
                      {pickerMode === 'trainer' ? 'Choose a trainer for your fitness session.' : pickerMode === 'psychologist' ? 'Choose a psychologist from your recommended matches.' : 'Choose a practitioner from your recommended matches.'}
                    </DialogDescription>
                  </div>
                </DialogHeader>

                <button
                  type="button"
                  onClick={() => setPickerMode(null)}
                  className="absolute right-0 top-0 grid h-12 w-12 place-items-center rounded-full bg-white text-slate-950 shadow-sm transition hover:bg-indigo-50 focus:outline-none focus:ring-4 focus:ring-indigo-100"
                  aria-label="Close practitioner selector"
                >
                  <X className="h-6 w-6" aria-hidden="true" />
                </button>

                <div className="mb-6 flex flex-wrap items-center gap-3">
                  <label className="relative min-w-72 flex-1 lg:max-w-[520px]">
                    <span className="sr-only">Search practitioners</span>
                    <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" aria-hidden="true" />
                    <input
                      value={practitionerSearch}
                      onChange={(event) => setPractitionerSearch(event.target.value)}
                      placeholder="Search by name, specialty, or keyword"
                      className="h-12 w-full rounded-xl border border-indigo-100 bg-white pl-12 pr-4 text-sm font-semibold text-slate-900 shadow-sm outline-none transition placeholder:text-slate-500 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                    />
                  </label>
                  {renderFilterSelect('Specialty', specialtyFilter, setSpecialtyFilter, availableSpecialties)}
                  {renderFilterSelect('Session Mode', modeFilter, setModeFilter, ['Online', 'In-person'])}
                  {renderFilterSelect('Language', languageFilter, setLanguageFilter, availableLanguages)}
                  {renderFilterSelect('Availability', availabilityFilter, setAvailabilityFilter, ['available'])}
                  <button
                    type="button"
                    onClick={clearPractitionerFilters}
                    className="inline-flex h-12 items-center gap-2 rounded-xl px-3 text-sm font-bold text-indigo-700 transition hover:bg-indigo-50"
                  >
                    <RotateCcw className="h-4 w-4" aria-hidden="true" />
                    Clear filters
                  </button>
                </div>

                <div className="grid gap-8 xl:grid-cols-[1fr_310px]">
                  <div className="grid gap-4">
                    {filteredPickerPractitioners.length ? filteredPickerPractitioners.map(renderPractitionerPickerCard) : (
                      <div className="rounded-2xl border border-slate-200 bg-white px-6 py-10 text-center shadow-sm">
                        <p className="text-lg font-bold text-slate-950">No practitioners match these filters.</p>
                        <p className="mt-2 text-sm text-slate-600">Clear filters or try a broader search term.</p>
                      </div>
                    )}
                  </div>

                  <aside className="h-fit rounded-2xl border border-indigo-100 bg-white/80 p-6 shadow-sm backdrop-blur xl:sticky xl:top-6">
                    <div className="grid justify-items-center border-b border-slate-100 pb-6 text-center">
                      <div className="grid h-24 w-24 place-items-center rounded-3xl bg-indigo-50">
                        <Sparkles className="h-12 w-12 text-indigo-600" aria-hidden="true" />
                      </div>
                    </div>
                    <div className="mt-6">
                      <h3 className="text-lg font-extrabold text-slate-950">Personalized recommendations</h3>
                      <p className="mt-3 text-sm leading-6 text-slate-600">
                        These recommendations are based on your intake responses, goals, and preferences.
                      </p>
                    </div>
                    <div className="mt-8 grid gap-7">
                      <div className="grid grid-cols-[48px_1fr] gap-4">
                        <span className="grid h-12 w-12 place-items-center rounded-full bg-indigo-50 text-indigo-700"><ShieldCheck className="h-6 w-6" aria-hidden="true" /></span>
                        <div>
                          <p className="font-bold text-slate-950">Verified professionals</p>
                          <p className="mt-1 text-sm leading-6 text-slate-600">All practitioners are background-checked and verified.</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-[48px_1fr] gap-4">
                        <span className="grid h-12 w-12 place-items-center rounded-full bg-indigo-50 text-indigo-700"><LockKeyhole className="h-6 w-6" aria-hidden="true" /></span>
                        <div>
                          <p className="font-bold text-slate-950">Your privacy matters</p>
                          <p className="mt-1 text-sm leading-6 text-slate-600">Your information is secure and confidential.</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-[48px_1fr] gap-4">
                        <span className="grid h-12 w-12 place-items-center rounded-full bg-indigo-50 text-indigo-700"><UserCheck className="h-6 w-6" aria-hidden="true" /></span>
                        <div>
                          <p className="font-bold text-slate-950">You're in control</p>
                          <p className="mt-1 text-sm leading-6 text-slate-600">You can change your selection anytime.</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-8 border-t border-slate-100 pt-6">
                      <div className="grid grid-cols-[40px_1fr] gap-3">
                        <span className="grid h-10 w-10 place-items-center rounded-full bg-indigo-50 text-indigo-700"><Headphones className="h-5 w-5" aria-hidden="true" /></span>
                        <div>
                          <p className="font-bold text-slate-950">Need help choosing?</p>
                          <button type="button" className="mt-1 text-sm font-bold text-indigo-700">Chat with our care team</button>
                        </div>
                      </div>
                    </div>
                  </aside>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {notice ? <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-700">{notice}</p> : null}
      </div>
    </div>
  );
}
