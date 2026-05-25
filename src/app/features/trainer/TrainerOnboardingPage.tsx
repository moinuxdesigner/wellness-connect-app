import { useEffect, useId, useMemo, useState } from 'react';
import { Controller, useForm, useWatch, type FieldErrors, type FieldPath } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Camera,
  Check,
  CircleUserRound,
  CreditCard,
  Dumbbell,
  FileBadge2,
  FileCheck2,
  GraduationCap,
  ImagePlus,
  MapPin,
  ShieldCheck,
  Sparkles,
  Upload,
  UserRound,
  Video,
  X,
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { cn } from '../../components/ui/utils';
import {
  findTrainerApplication,
  mergeTrainerOnboardingValues,
  nextActionLabel,
  statusLabel,
  trainerAnimationMap,
  trainerDayOptions,
  trainerExpertiseOptions,
  trainerGenderOptions,
  trainerModeOptions,
  trainerOnboardingDefaultValues,
  trainerOnboardingSchema,
  trainerOnboardingSchemaVersion,
  trainerOnboardingScreens,
  trainerOnboardingStorageKey,
  type TrainerAnimationKey,
  type TrainerApplicationStatus,
  type PersistedTrainerOnboardingState,
  type TrainerApplicationHistoryItem,
  type TrainerOnboardingFormValues,
  type TrainerOnboardingScreen,
  type TrainerOnboardingScreenId,
  type UploadKind,
  type UploadValue,
} from './trainerOnboarding';
import { fetchTrainerApplicationFromApi, submitTrainerApplicationToApi } from './trainerApplicationsApi';

const reviewScreenIndex = trainerOnboardingScreens.findIndex((screen) => screen.id === 'review');
const successScreenIndex = trainerOnboardingScreens.findIndex((screen) => screen.id === 'success');

const animationIcons: Record<TrainerAnimationKey, typeof Sparkles> = {
  personalInfo: UserRound,
  certification: GraduationCap,
  expertise: Dumbbell,
  experience: Sparkles,
  availability: CalendarDays,
  mediaUpload: Camera,
  legal: ShieldCheck,
  review: FileCheck2,
}

function readStoredState() {
  const fallback = {
    values: trainerOnboardingDefaultValues,
    screenIndex: 0,
    submitted: false,
    submittedAt: null as string | null,
    savedAt: null as string | null,
    applicationId: null as string | null,
    applicationStatus: 'draft' as const,
    adminRemarks: '',
    reviewHistory: [] as TrainerApplicationHistoryItem[],
  };

  try {
    const raw = localStorage.getItem(trainerOnboardingStorageKey);
    if (!raw) return fallback;

    const parsed = JSON.parse(raw) as Partial<PersistedTrainerOnboardingState>;
    if (parsed.version !== trainerOnboardingSchemaVersion) return fallback;

    const storedScreenIndex = trainerOnboardingScreens.findIndex((screen) => screen.id === parsed.screenId);
    const existingApplication = findTrainerApplication(parsed.applicationId);
    const existingStatus = existingApplication?.status ?? 'draft';
    const nextScreenIndex = existingStatus === 'needs_resubmission'
      ? reviewScreenIndex
      : storedScreenIndex >= 0
        ? storedScreenIndex
        : 0;

    return {
      values: mergeTrainerOnboardingValues(existingApplication?.values ?? parsed.values),
      screenIndex: nextScreenIndex,
      submitted: Boolean(existingApplication ?? parsed.submitted),
      submittedAt: existingApplication?.submittedAt ?? parsed.submittedAt ?? null,
      savedAt: parsed.savedAt ?? null,
      applicationId: existingApplication?.applicationId ?? parsed.applicationId ?? null,
      applicationStatus: existingStatus,
      adminRemarks: existingApplication?.adminRemarks ?? '',
      reviewHistory: existingApplication?.reviewHistory ?? [],
    };
  } catch {
    return fallback;
  }
}

function findErrorMessage(errors: FieldErrors<TrainerOnboardingFormValues>, path: FieldPath<TrainerOnboardingFormValues>) {
  const value = path.split('.').reduce<unknown>((current, key) => {
    if (!current || typeof current !== 'object') return undefined;
    return (current as Record<string, unknown>)[key];
  }, errors);

  if (value && typeof value === 'object' && 'message' in value && typeof value.message === 'string') {
    return value.message;
  }

  return undefined;
}

function formatBytes(size: number) {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(value: string) {
  if (!value) return 'Not added yet';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
}

function formatSavedTime(value: string | null) {
  if (!value) return 'Draft autosaves on this device';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return 'Draft autosaved';
  return `Draft autosaved at ${parsed.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`;
}

async function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ''));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

async function toUploadValue(file: File, kind: UploadKind, withPreview = false) {
  return {
    id: `${file.name}-${file.size}-${file.lastModified}`,
    kind,
    name: file.name,
    size: file.size,
    type: file.type,
    previewUrl: withPreview || kind === 'image' ? await readFileAsDataUrl(file) : undefined,
  } satisfies UploadValue;
}

export default function TrainerOnboardingPage() {
  const navigate = useNavigate();
  const prefersReducedMotion = useReducedMotion();
  const restoredState = useMemo(readStoredState, []);
  const [screenIndex, setScreenIndex] = useState(restoredState.screenIndex);
  const [direction, setDirection] = useState(1);
  const [submitted, setSubmitted] = useState(restoredState.submitted);
  const [submittedAt, setSubmittedAt] = useState<string | null>(restoredState.submittedAt);
  const [savedAt, setSavedAt] = useState<string | null>(restoredState.savedAt);
  const [applicationId, setApplicationId] = useState<string | null>(restoredState.applicationId);
  const [applicationStatus, setApplicationStatus] = useState(restoredState.applicationStatus);
  const [adminRemarks, setAdminRemarks] = useState(restoredState.adminRemarks);
  const [reviewHistory, setReviewHistory] = useState<TrainerApplicationHistoryItem[]>(restoredState.reviewHistory);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<TrainerOnboardingFormValues>({
    defaultValues: restoredState.values,
    resolver: zodResolver(trainerOnboardingSchema),
    mode: 'onTouched',
  });

  const values = useWatch({ control: form.control });
  const currentScreen = trainerOnboardingScreens[screenIndex];

  useEffect(() => {
    const payload: PersistedTrainerOnboardingState = {
      version: trainerOnboardingSchemaVersion,
      screenId: trainerOnboardingScreens[screenIndex].id,
      values: values ?? trainerOnboardingDefaultValues,
      submitted,
      submittedAt,
      savedAt: new Date().toISOString(),
      applicationId,
    };

    localStorage.setItem(trainerOnboardingStorageKey, JSON.stringify(payload));
    setSavedAt(payload.savedAt);
  }, [applicationId, screenIndex, submitted, submittedAt, values]);

  useEffect(() => {
    let cancelled = false;

    async function syncApplicationState() {
      const currentApplication = await fetchTrainerApplicationFromApi(applicationId);
      if (!currentApplication || cancelled) return;

      setApplicationStatus(currentApplication.status);
      setAdminRemarks(currentApplication.adminRemarks);
      setReviewHistory(currentApplication.reviewHistory);
      setSubmitted(true);
      setSubmittedAt(currentApplication.submittedAt);
    }

    void syncApplicationState();
    const handleSync = () => {
      void syncApplicationState();
    };

    window.addEventListener('focus', handleSync);
    window.addEventListener('storage', handleSync);

    return () => {
      cancelled = true;
      window.removeEventListener('focus', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, [applicationId]);

  async function moveNext() {
    if (currentScreen.id === 'review' && applicationStatus === 'rejected') return;

    if (currentScreen.id === 'review') {
      void form.handleSubmit(submitApplication)();
      return;
    }

    const isValid = currentScreen.fields.length
      ? await form.trigger([...currentScreen.fields], { shouldFocus: true })
      : true;

    if (!isValid) return;

    setDirection(1);
    setScreenIndex((index) => Math.min(index + 1, successScreenIndex));
  }

  function moveBack() {
    if (currentScreen.id === 'success') {
      setDirection(-1);
      setScreenIndex(reviewScreenIndex);
      return;
    }

    if (screenIndex === 0) {
      navigate('/');
      return;
    }

    setDirection(-1);
    setScreenIndex((index) => Math.max(index - 1, 0));
  }

  async function submitApplication(allValues: TrainerOnboardingFormValues) {
    setIsSubmitting(true);
    try {
      const application = await submitTrainerApplicationToApi({
        applicationId,
        values: allValues,
      });

      const payload: PersistedTrainerOnboardingState = {
        version: trainerOnboardingSchemaVersion,
        screenId: 'success',
        values: allValues,
        submitted: true,
        submittedAt: application.submittedAt,
        savedAt: application.updatedAt,
        applicationId: application.applicationId,
      };

      localStorage.setItem(trainerOnboardingStorageKey, JSON.stringify(payload));
      setApplicationId(application.applicationId);
      setApplicationStatus(application.status);
      setAdminRemarks(application.adminRemarks);
      setReviewHistory(application.reviewHistory);
      setSubmitted(true);
      setSubmittedAt(application.submittedAt);
      setSavedAt(application.updatedAt);
      setDirection(1);
      setScreenIndex(successScreenIndex);
    } finally {
      setIsSubmitting(false);
    }
  }

  const reviewSections = useMemo(
    () => [
      {
        title: 'Personal details',
        screenId: 'personalInfo' as const,
        rows: [
          ['Full name', values?.profile.fullName || 'Not added yet'],
          ['Gender', values?.profile.gender || 'Not added yet'],
          ['Date of birth', formatDate(values?.profile.dateOfBirth || '')],
          ['Email', values?.profile.email || 'Not added yet'],
          ['Mobile', values?.profile.mobile || 'Not added yet'],
          ['Location', values?.profile.city && values?.profile.state ? `${values.profile.city}, ${values.profile.state}` : 'Not added yet'],
        ],
      },
      {
        title: 'Profile photo and certification',
        screenId: 'photo' as const,
        rows: [
          ['Profile photo', values?.photo.file?.name || 'Not uploaded yet'],
          ['Certification institute', values?.certification.institute || 'Not added yet'],
          ['Certification type', values?.certification.type || 'Not added yet'],
          ['Certificate file', values?.certification.certificate?.name || 'Not uploaded yet'],
        ],
      },
      {
        title: 'Expertise and experience',
        screenId: 'expertise' as const,
        rows: [
          ['Expertise', values?.expertise.length ? values.expertise.join(', ') : 'Not added yet'],
          ['Years experience', values?.experience.yearsExperience || 'Not added yet'],
          ['Clients trained', values?.experience.clientsTrained || 'Not added yet'],
        ],
      },
      {
        title: 'Showcase and coaching style',
        screenId: 'showcase' as const,
        rows: [
          ['Transformation photos', values?.showcase.transformationPhotos.length ? values.showcase.transformationPhotos.map((item) => item.name).join(', ') : 'Not uploaded yet'],
          ['Videos', values?.showcase.videos.length ? values.showcase.videos.map((item) => item.name).join(', ') : 'Not uploaded yet'],
          ['Training philosophy', values?.training.philosophy || 'Not added yet'],
          ['Introduction video', values?.training.introductionVideo?.name || 'Not uploaded yet'],
        ],
      },
      {
        title: 'Availability and verification',
        screenId: 'availability' as const,
        rows: [
          ['Training modes', values?.availability.modes.length ? values.availability.modes.join(', ') : 'Not added yet'],
          ['Available days', values?.availability.days.length ? values.availability.days.join(', ') : 'Not added yet'],
          ['Pricing plans', values?.availability.pricingPlans || 'Not added yet'],
          ['PAN', values?.identity.pan?.name || 'Not uploaded yet'],
          ['Primary ID', values?.identity.aadhaar?.name || values?.identity.passport?.name || values?.identity.drivingLicense?.name || 'Not uploaded yet'],
          ['Bank name', values?.payout.bankName || 'Not added yet'],
          ['Account number', values?.payout.accountNumber ? `•••• ${values.payout.accountNumber.slice(-4)}` : 'Not added yet'],
          ['IFSC', values?.payout.ifsc || 'Not added yet'],
        ],
      },
    ],
    [values],
  );

  const footerLabel = currentScreen.id === 'review'
    ? applicationStatus === 'needs_resubmission'
      ? 'Resubmit Application'
      : applicationStatus === 'rejected'
        ? 'Application Rejected'
        : currentScreen.buttonLabel
    : currentScreen.buttonLabel;

  return (
    <div className="min-h-screen bg-white text-[var(--ds-text-primary)] lg:bg-[linear-gradient(90deg,_#f8fafc_0%,_#f8fafc_48%,_#ffffff_48%,_#ffffff_100%)]">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 pb-0 pt-4 sm:px-6 lg:px-8 lg:pb-6 lg:pt-6">
        <OnboardingHeader
          isSuccess={currentScreen.id === 'success'}
          onBack={moveBack}
          onClose={() => navigate(submitted ? '/trainer' : '/')}
        />

        <OnboardingLayout
          animation={
            <OnboardingAnimationPlaceholder
              animationKey={currentScreen.animationKey}
              title={currentScreen.title}
              description={trainerAnimationMap[currentScreen.animationKey]}
            />
          }
          content={
            <>
              <div className="flex-1 overflow-y-auto pb-28 lg:pb-10">
                <AnimatePresence custom={direction} initial={false} mode="wait">
                  <motion.section
                    key={currentScreen.id}
                    custom={direction}
                    initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, x: direction > 0 ? 28 : -28 }}
                    animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, x: 0 }}
                    exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, x: direction > 0 ? -20 : 20 }}
                    transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                    className="mx-auto w-full max-w-[520px]"
                  >
                    <QuestionScreen screen={currentScreen}>
                      {renderCurrentScreen({
                        screen: currentScreen,
                        form,
                        values: values ?? trainerOnboardingDefaultValues,
                        reviewSections,
                        applicationStatus,
                        adminRemarks,
                        reviewHistory,
                        submitted,
                        submittedAt,
                        onJumpToScreen: (screenId) => {
                          const nextIndex = trainerOnboardingScreens.findIndex((screen) => screen.id === screenId);
                          if (nextIndex < 0) return;
                          setDirection(-1);
                          setScreenIndex(nextIndex);
                        },
                      })}
                    </QuestionScreen>
                  </motion.section>
                </AnimatePresence>
              </div>

              {currentScreen.id !== 'success' ? (
                <OnboardingFooter
                  label={footerLabel}
                  savedLabel={formatSavedTime(savedAt)}
                  onPrimaryAction={moveNext}
                  loading={isSubmitting}
                  disabled={applicationStatus === 'rejected' && currentScreen.id === 'review'}
                />
              ) : null}
            </>
          }
        />
      </div>
    </div>
  );
}

function renderCurrentScreen({
  screen,
  form,
  values,
  reviewSections,
  applicationStatus,
  adminRemarks,
  reviewHistory,
  submitted,
  submittedAt,
  onJumpToScreen,
}: {
  screen: TrainerOnboardingScreen;
  form: ReturnType<typeof useForm<TrainerOnboardingFormValues>>;
  values: TrainerOnboardingFormValues;
  reviewSections: Array<{ title: string; screenId: TrainerOnboardingScreenId; rows: [string, string][] }>;
  applicationStatus: TrainerApplicationStatus;
  adminRemarks: string;
  reviewHistory: TrainerApplicationHistoryItem[];
  submitted: boolean;
  submittedAt: string | null;
  onJumpToScreen: (screenId: TrainerOnboardingScreenId) => void;
}) {
  const {
    register,
    control,
    setValue,
    clearErrors,
    formState: { errors },
  } = form;

  switch (screen.id) {
    case 'personalInfo':
      return (
        <div className="space-y-5">
          <FormInput
            label="Full name"
            placeholder="Enter your full name"
            inputProps={register('profile.fullName')}
            error={findErrorMessage(errors, 'profile.fullName')}
          />

          <Controller
            control={control}
            name="profile.gender"
            render={({ field }) => (
              <ChoiceCardGroup
                label="Gender"
                value={field.value}
                options={trainerGenderOptions.map((option) => ({ label: option, value: option }))}
                onChange={field.onChange}
                error={findErrorMessage(errors, 'profile.gender')}
              />
            )}
          />
        </div>
      );

    case 'dateOfBirth':
      return (
        <FormInput
          label="Date of birth"
          type="date"
          inputProps={register('profile.dateOfBirth')}
          error={findErrorMessage(errors, 'profile.dateOfBirth')}
        />
      );

    case 'contact':
      return (
        <div className="space-y-5">
          <FormInput
            label="Email"
            type="email"
            placeholder="coach@example.com"
            inputProps={register('profile.email')}
            error={findErrorMessage(errors, 'profile.email')}
          />

          <FormInput
            label="Mobile number"
            type="tel"
            placeholder="+91 98765 43210"
            inputProps={register('profile.mobile')}
            error={findErrorMessage(errors, 'profile.mobile')}
          />
        </div>
      );

    case 'location':
      return (
        <div className="space-y-5">
          <FormInput
            label="City"
            placeholder="Hyderabad"
            inputProps={register('profile.city')}
            error={findErrorMessage(errors, 'profile.city')}
          />

          <FormInput
            label="State"
            placeholder="Telangana"
            inputProps={register('profile.state')}
            error={findErrorMessage(errors, 'profile.state')}
          />
        </div>
      );

    case 'photo':
      return (
        <PhotoCropEditor
          file={values.photo.file}
          cropX={values.photo.cropX}
          cropY={values.photo.cropY}
          zoom={values.photo.zoom}
          error={findErrorMessage(errors, 'photo.file')}
          onSelect={async (file) => {
            const upload = await toUploadValue(file, 'image', true);
            setValue('photo.file', upload, { shouldDirty: true, shouldValidate: true });
            clearErrors('photo.file');
          }}
          onClear={() => setValue('photo.file', null, { shouldDirty: true, shouldValidate: true })}
          onCropXChange={(value) => setValue('photo.cropX', value, { shouldDirty: true })}
          onCropYChange={(value) => setValue('photo.cropY', value, { shouldDirty: true })}
          onZoomChange={(value) => setValue('photo.zoom', value, { shouldDirty: true })}
        />
      );

    case 'certification':
      return (
        <div className="space-y-5">
          <FormInput
            label="Certification institute"
            placeholder="K11 Academy of Fitness Sciences"
            inputProps={register('certification.institute')}
            error={findErrorMessage(errors, 'certification.institute')}
          />

          <FormInput
            label="Certification type"
            placeholder="Personal Trainer Certification"
            inputProps={register('certification.type')}
            error={findErrorMessage(errors, 'certification.type')}
          />

          <SingleUploadField
            label="Certificate file"
            hint="PDF, JPG, or PNG"
            icon={GraduationCap}
            file={values.certification.certificate}
            accept=".pdf,image/*"
            error={findErrorMessage(errors, 'certification.certificate')}
            onSelect={async (file) => {
              const upload = await toUploadValue(file, 'document');
              setValue('certification.certificate', upload, { shouldDirty: true, shouldValidate: true });
              clearErrors('certification.certificate');
            }}
            onClear={() => setValue('certification.certificate', null, { shouldDirty: true, shouldValidate: true })}
          />
        </div>
      );

    case 'expertise':
      return (
        <Controller
          control={control}
          name="expertise"
          render={({ field }) => (
            <ChipSelector
              label="Select expertise"
              options={trainerExpertiseOptions}
              value={field.value}
              onChange={field.onChange}
              error={findErrorMessage(errors, 'expertise')}
            />
          )}
        />
      );

    case 'experience':
      return (
        <div className="space-y-5">
          <FormInput
            label="Years experience"
            type="number"
            placeholder="4"
            inputProps={register('experience.yearsExperience')}
            error={findErrorMessage(errors, 'experience.yearsExperience')}
          />

          <FormInput
            label="Clients trained"
            type="number"
            placeholder="120"
            inputProps={register('experience.clientsTrained')}
            error={findErrorMessage(errors, 'experience.clientsTrained')}
          />
        </div>
      );

    case 'showcase':
      return (
        <div className="space-y-5">
          <MultiUploadField
            label="Transformation photos"
            hint="Upload before and after images or progress snapshots"
            icon={ImagePlus}
            files={values.showcase.transformationPhotos}
            accept="image/*"
            error={findErrorMessage(errors, 'showcase.transformationPhotos')}
            onSelect={async (files) => {
              const nextItems = await Promise.all(files.map((file) => toUploadValue(file, 'image', true)));
              setValue('showcase.transformationPhotos', [...values.showcase.transformationPhotos, ...nextItems], {
                shouldDirty: true,
                shouldValidate: true,
              });
              clearErrors('showcase.transformationPhotos');
            }}
            onRemove={(id) =>
              setValue(
                'showcase.transformationPhotos',
                values.showcase.transformationPhotos.filter((item) => item.id !== id),
                { shouldDirty: true, shouldValidate: true },
              )
            }
          />

          <MultiUploadField
            label="Videos"
            hint="Upload a coaching reel, demo set, or client story"
            icon={Video}
            files={values.showcase.videos}
            accept="video/*"
            error={findErrorMessage(errors, 'showcase.videos')}
            onSelect={async (files) => {
              const nextItems = await Promise.all(files.map((file) => toUploadValue(file, 'video')));
              setValue('showcase.videos', [...values.showcase.videos, ...nextItems], {
                shouldDirty: true,
                shouldValidate: true,
              });
              clearErrors('showcase.videos');
            }}
            onRemove={(id) =>
              setValue(
                'showcase.videos',
                values.showcase.videos.filter((item) => item.id !== id),
                { shouldDirty: true, shouldValidate: true },
              )
            }
          />
        </div>
      );

    case 'training':
      return (
        <div className="space-y-5">
          <FormTextArea
            label="Training philosophy"
            placeholder="Example: I focus on sustainable progress, strong movement fundamentals, and coaching clients in a way that fits their real life."
            textAreaProps={register('training.philosophy')}
            error={findErrorMessage(errors, 'training.philosophy')}
          />

          <SingleUploadField
            label="Introduction video"
            hint="A short self-introduction helps the review team understand your energy and clarity"
            icon={Video}
            file={values.training.introductionVideo}
            accept="video/*"
            error={findErrorMessage(errors, 'training.introductionVideo')}
            onSelect={async (file) => {
              const upload = await toUploadValue(file, 'video');
              setValue('training.introductionVideo', upload, { shouldDirty: true, shouldValidate: true });
              clearErrors('training.introductionVideo');
            }}
            onClear={() => setValue('training.introductionVideo', null, { shouldDirty: true, shouldValidate: true })}
          />
        </div>
      );

    case 'availability':
      return (
        <div className="space-y-5">
          <Controller
            control={control}
            name="availability.modes"
            render={({ field }) => (
              <ChipSelector
                label="Training modes"
                options={trainerModeOptions}
                value={field.value}
                onChange={field.onChange}
                error={findErrorMessage(errors, 'availability.modes')}
              />
            )}
          />

          <Controller
            control={control}
            name="availability.days"
            render={({ field }) => (
              <ChipSelector
                label="Available days"
                options={trainerDayOptions}
                value={field.value}
                onChange={field.onChange}
                error={findErrorMessage(errors, 'availability.days')}
              />
            )}
          />

          <FormTextArea
            label="Pricing plans"
            placeholder="Example: 1:1 studio sessions at INR 1,500, online coaching at INR 8,000 per month, and 12-session starter packages for new clients."
            textAreaProps={register('availability.pricingPlans')}
            error={findErrorMessage(errors, 'availability.pricingPlans')}
          />
        </div>
      );

    case 'identity':
      return (
        <div className="space-y-5">
          <p className="border-l-2 border-slate-300 pl-4 text-sm text-slate-600">
            PAN plus one primary ID is required. You can add the others now if you have them handy.
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            <SingleUploadField
              label="Aadhaar"
              hint="Front image or PDF"
              icon={ShieldCheck}
              file={values.identity.aadhaar}
              accept=".pdf,image/*"
              error={findErrorMessage(errors, 'identity.aadhaar')}
              onSelect={async (file) => {
                const upload = await toUploadValue(file, 'document');
                setValue('identity.aadhaar', upload, { shouldDirty: true, shouldValidate: true });
                clearErrors('identity.aadhaar');
              }}
              onClear={() => setValue('identity.aadhaar', null, { shouldDirty: true, shouldValidate: true })}
            />

            <SingleUploadField
              label="PAN"
              hint="Required for payout activation"
              icon={FileBadge2}
              file={values.identity.pan}
              accept=".pdf,image/*"
              error={findErrorMessage(errors, 'identity.pan')}
              onSelect={async (file) => {
                const upload = await toUploadValue(file, 'document');
                setValue('identity.pan', upload, { shouldDirty: true, shouldValidate: true });
                clearErrors('identity.pan');
              }}
              onClear={() => setValue('identity.pan', null, { shouldDirty: true, shouldValidate: true })}
            />

            <SingleUploadField
              label="Passport"
              hint="Optional alternate primary ID"
              icon={MapPin}
              file={values.identity.passport}
              accept=".pdf,image/*"
              error={undefined}
              onSelect={async (file) => {
                const upload = await toUploadValue(file, 'document');
                setValue('identity.passport', upload, { shouldDirty: true, shouldValidate: true });
              }}
              onClear={() => setValue('identity.passport', null, { shouldDirty: true, shouldValidate: true })}
            />

            <SingleUploadField
              label="Driving License"
              hint="Optional alternate primary ID"
              icon={CreditCard}
              file={values.identity.drivingLicense}
              accept=".pdf,image/*"
              error={undefined}
              onSelect={async (file) => {
                const upload = await toUploadValue(file, 'document');
                setValue('identity.drivingLicense', upload, { shouldDirty: true, shouldValidate: true });
              }}
              onClear={() => setValue('identity.drivingLicense', null, { shouldDirty: true, shouldValidate: true })}
            />
          </div>
        </div>
      );

    case 'payout':
      return (
        <div className="space-y-5">
          <FormInput
            label="Bank name"
            placeholder="HDFC Bank"
            inputProps={register('payout.bankName')}
            error={findErrorMessage(errors, 'payout.bankName')}
          />

          <FormInput
            label="Account number"
            inputMode="numeric"
            placeholder="012345678901"
            inputProps={register('payout.accountNumber')}
            error={findErrorMessage(errors, 'payout.accountNumber')}
          />

          <FormInput
            label="IFSC"
            placeholder="HDFC0001234"
            value={values.payout.ifsc}
            onChange={(event) => setValue('payout.ifsc', event.target.value.toUpperCase(), { shouldDirty: true, shouldValidate: true })}
            error={findErrorMessage(errors, 'payout.ifsc')}
          />
        </div>
      );

    case 'review':
      return (
        <div className="space-y-4">
          {adminRemarks ? (
            <div className={cn(
              'border-l-2 pl-4 text-sm',
              applicationStatus === 'rejected' ? 'border-rose-500 text-rose-700' : 'border-amber-500 text-amber-700',
            )}>
              <p className="font-semibold">{applicationStatus === 'rejected' ? 'Admin rejection note' : 'Admin remarks for resubmission'}</p>
              <p className="mt-1">{adminRemarks}</p>
            </div>
          ) : null}

          {submitted && submittedAt ? (
            <div className="border-l-2 border-emerald-500 pl-4 text-sm text-emerald-800">
              {statusLabel(applicationStatus)} on {formatDate(submittedAt)}. {nextActionLabel(applicationStatus)}.
            </div>
          ) : null}

          {reviewSections.map((section) => (
            <ReviewSectionCard
              key={section.title}
              title={section.title}
              rows={section.rows}
              onEdit={() => onJumpToScreen(section.screenId)}
            />
          ))}

          {reviewHistory.length ? (
            <section className="border-t border-slate-200 pt-4">
              <h3 className="text-base font-semibold text-slate-950">Review history</h3>
              <div className="mt-3 space-y-3">
                {[...reviewHistory].slice().reverse().map((item) => (
                  <div key={item.id} className="border-l-2 border-slate-200 pl-4 text-sm text-slate-600">
                    <p className="font-semibold text-slate-900">{statusLabel(item.action)}</p>
                    <p className="mt-1">{item.note}</p>
                    <p className="mt-1 text-xs text-slate-400">{item.actor} • {formatDate(item.at)}</p>
                  </div>
                ))}
              </div>
            </section>
          ) : null}
        </div>
      );

    case 'success':
      return (
        <div className="space-y-5">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <Check size={28} />
          </div>

          <div className="space-y-3">
            <p className={cn(
              'text-sm font-semibold uppercase tracking-[0.24em]',
              applicationStatus === 'approved' ? 'text-emerald-600' : applicationStatus === 'rejected' ? 'text-rose-600' : applicationStatus === 'needs_resubmission' ? 'text-amber-600' : 'text-emerald-600',
            )}>
              {statusLabel(applicationStatus)}
            </p>
            <h2 className="text-[2rem] font-semibold leading-tight text-slate-950">
              {applicationStatus === 'approved'
                ? 'Your trainer profile has been approved.'
                : applicationStatus === 'needs_resubmission'
                  ? 'Changes are needed before approval.'
                  : applicationStatus === 'rejected'
                    ? 'This application has been rejected.'
                    : 'Your trainer profile is in review.'}
            </h2>
            <p className="text-base leading-relaxed text-slate-600">
              {applicationStatus === 'approved'
                ? 'The admin team has approved your submission. You can continue to your trainer dashboard.'
                : applicationStatus === 'needs_resubmission'
                  ? adminRemarks || 'Please review the remarks from admin, update your submission, and send it back for review.'
                  : applicationStatus === 'rejected'
                    ? adminRemarks || 'The admin team closed this application and it is no longer eligible for approval.'
                    : 'Our team will review your profile, documents, and coaching proof, then reach out with the next step shortly.'}
            </p>
          </div>

          <div className="grid gap-3">
            <Button
              className="h-14 rounded-full bg-[var(--ds-brand)] text-base font-semibold hover:bg-[var(--ds-brand-strong)]"
              onClick={() => {
                if (applicationStatus === 'needs_resubmission') {
                  onJumpToScreen('review');
                  return;
                }
                window.location.assign('/trainer');
              }}
            >
              {applicationStatus === 'approved' ? 'Go to Dashboard' : applicationStatus === 'needs_resubmission' ? 'Open Review' : 'Go to Dashboard'}
            </Button>
            <Button
              variant="outline"
              className="h-14 rounded-full border-slate-300 bg-white text-base font-semibold text-slate-800 hover:bg-slate-50"
              onClick={() => onJumpToScreen('review')}
            >
              {applicationStatus === 'needs_resubmission' ? 'Fix and Resubmit' : 'View Profile'}
            </Button>
          </div>
        </div>
      );
  }
}

function OnboardingLayout({ animation, content }: { animation: React.ReactNode; content: React.ReactNode }) {
  return (
    <div className="flex flex-1 flex-col lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,520px)] lg:gap-12">
      <div className="pb-2 lg:flex lg:min-h-0 lg:items-center lg:pb-0">
        {animation}
      </div>
      <div className="flex min-h-0 flex-1 flex-col">{content}</div>
    </div>
  );
}

function OnboardingHeader({
  isSuccess,
  onBack,
  onClose,
}: {
  isSuccess: boolean;
  onBack: () => void;
  onClose: () => void;
}) {
  return (
    <header className="mb-3 px-0 py-1 lg:mb-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
          aria-label="Go back"
        >
          <ArrowLeft size={18} />
        </button>

        <div className="min-w-0 flex-1 text-center">
          <p className={cn('text-sm font-medium text-slate-500', isSuccess && 'text-emerald-600')}>
            {isSuccess ? 'Application complete' : 'Trainer onboarding'}
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
          aria-label="Close onboarding"
        >
          <X size={18} />
        </button>
      </div>
    </header>
  );
}

function OnboardingAnimationPlaceholder({
  animationKey,
  title,
  description,
}: {
  animationKey: TrainerAnimationKey;
  title: string;
  description: string;
}) {
  const Icon = animationIcons[animationKey];

  return (
    <div className="relative w-full overflow-hidden bg-[linear-gradient(180deg,rgba(47,79,136,0.08),rgba(255,255,255,0))] px-0 pb-4 pt-2 lg:min-h-[640px] lg:px-6 lg:pt-8">
      <div className="flex h-[28vh] min-h-[200px] max-h-[300px] flex-col justify-between lg:h-full lg:min-h-[540px] lg:max-h-none">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--ds-brand)]">
          <Sparkles size={14} />
          Future Lottie slot
        </div>

        <div className="flex flex-col items-center justify-center gap-5 text-center lg:flex-1">
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
            className="relative flex h-28 w-28 items-center justify-center rounded-full bg-slate-50 text-[var(--ds-brand)] sm:h-36 sm:w-36 lg:h-40 lg:w-40"
          >
            <span className="absolute inset-3 rounded-full border border-[var(--ds-border)] border-dashed" />
            <Icon size={44} className="relative z-10 sm:size-12" />
          </motion.div>

          <div className="hidden max-w-md space-y-3 lg:block">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">{description}</p>
            <h2 className="text-2xl font-semibold text-slate-950 sm:text-[2rem]">{title}</h2>
            <p className="text-sm leading-relaxed text-slate-600">
              Animation space is reserved here so we can drop in the future <code className="px-1 text-xs text-slate-700">{trainerAnimationMap[animationKey]}</code> scene without changing layout.
            </p>
          </div>
        </div>

        <div className="hidden grid-cols-3 gap-3 border-t border-slate-100 pt-4 text-left text-xs text-slate-600 lg:grid">
          <MetricTile label="Format" value="Full screen" />
          <MetricTile label="Motion" value="Ready" />
          <MetricTile label="Density" value="Low friction" />
        </div>
      </div>
    </div>
  );
}

function MetricTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-1 py-1">
      <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">{label}</p>
      <p className="mt-1 text-sm font-semibold text-slate-900">{value}</p>
    </div>
  );
}

function QuestionScreen({ screen, children }: { screen: TrainerOnboardingScreen; children: React.ReactNode }) {
  return (
    <div className="px-0 py-3 sm:py-4">
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--ds-brand)]">{screen.eyebrow}</p>
        <h1 className="text-[1.9rem] font-semibold leading-tight text-slate-950 sm:text-[2.2rem]">{screen.title}</h1>
        <p className="text-[15px] leading-7 text-slate-600">{screen.description}</p>
        <p className="text-sm font-medium text-slate-500">{screen.helper}</p>
      </div>

      <div className="mt-6">{children}</div>
    </div>
  );
}

function OnboardingFooter({
  label,
  savedLabel,
  loading,
  disabled,
  onPrimaryAction,
}: {
  label: string;
  savedLabel: string;
  loading: boolean;
  disabled?: boolean;
  onPrimaryAction: () => void;
}) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-20 border-t border-slate-200 bg-white px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-3 lg:static lg:mt-6 lg:px-0 lg:py-4">
      <div className="mx-auto flex w-full max-w-[520px] flex-col items-center gap-3">
        <p className="text-xs font-medium text-slate-500">{savedLabel}</p>
        <Button
          type="button"
          onClick={onPrimaryAction}
          disabled={loading || disabled}
          className="h-14 w-full rounded-full bg-[var(--ds-brand)] text-base font-semibold hover:bg-[var(--ds-brand-strong)]"
        >
          {loading ? 'Submitting...' : <span className="inline-flex items-center gap-2">{label} <ArrowRight size={18} /></span>}
        </Button>
      </div>
    </div>
  );
}

function FormInput({
  label,
  error,
  type = 'text',
  inputMode,
  placeholder,
  inputProps,
  value,
  onChange,
}: {
  label: string;
  error?: string;
  type?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'];
  placeholder?: string;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-semibold text-slate-800">{label}</span>
      <Input
        type={type}
        inputMode={inputMode}
        placeholder={placeholder}
        className={cn(
          'h-14 rounded-xl border-slate-300 bg-white px-4 text-base transition focus-visible:ring-[3px] focus-visible:ring-[rgba(47,79,136,0.12)]',
          error && 'border-rose-300 focus-visible:ring-[rgba(244,63,94,0.12)]',
        )}
        {...inputProps}
        value={value}
        onChange={onChange}
      />
      {error ? <p className="text-sm text-rose-600">{error}</p> : null}
    </label>
  );
}

function FormTextArea({
  label,
  error,
  placeholder,
  textAreaProps,
}: {
  label: string;
  error?: string;
  placeholder?: string;
  textAreaProps?: React.TextareaHTMLAttributes<HTMLTextAreaElement>;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-semibold text-slate-800">{label}</span>
      <Textarea
        placeholder={placeholder}
        className={cn(
          'min-h-36 rounded-xl border-slate-300 bg-white px-4 py-4 text-base leading-7 transition focus-visible:ring-[3px] focus-visible:ring-[rgba(47,79,136,0.12)]',
          error && 'border-rose-300 focus-visible:ring-[rgba(244,63,94,0.12)]',
        )}
        {...textAreaProps}
      />
      {error ? <p className="text-sm text-rose-600">{error}</p> : null}
    </label>
  );
}

function ChoiceCardGroup({
  label,
  options,
  value,
  onChange,
  error,
}: {
  label: string;
  options: Array<{ label: string; value: string }>;
  value?: string;
  onChange: (value: string) => void;
  error?: string;
}) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-semibold text-slate-800">{label}</p>
      <div className="grid gap-3 sm:grid-cols-2">
        {options.map((option) => {
          const active = option.value === value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={cn(
                'flex min-h-14 items-center justify-between rounded-xl border px-4 py-3.5 text-left transition',
                active ? 'border-[var(--ds-brand)] bg-transparent text-[var(--ds-brand)]' : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400',
              )}
            >
              <span className="text-sm font-semibold">{option.label}</span>
              {active ? <Check size={18} /> : null}
            </button>
          );
        })}
      </div>
      {error ? <p className="text-sm text-rose-600">{error}</p> : null}
    </div>
  );
}

function ChipSelector({
  label,
  options,
  value,
  onChange,
  error,
}: {
  label: string;
  options: readonly string[];
  value: string[];
  onChange: (value: string[]) => void;
  error?: string;
}) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-semibold text-slate-800">{label}</p>
      <div className="flex flex-wrap gap-3">
        {options.map((option) => {
          const active = value.includes(option);

          return (
            <button
              key={option}
              type="button"
              onClick={() => onChange(active ? value.filter((item) => item !== option) : [...value, option])}
              className={cn(
                'rounded-full border px-4 py-3 text-sm font-semibold transition',
                active ? 'border-[var(--ds-brand)] bg-transparent text-[var(--ds-brand)]' : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400',
              )}
            >
              {option}
            </button>
          );
        })}
      </div>
      {error ? <p className="text-sm text-rose-600">{error}</p> : null}
    </div>
  );
}

function SingleUploadField({
  label,
  hint,
  file,
  accept,
  error,
  icon: Icon,
  onSelect,
  onClear,
}: {
  label: string;
  hint: string;
  file: UploadValue | null;
  accept: string;
  error?: string;
  icon: typeof Upload;
  onSelect: (file: File) => void | Promise<void>;
  onClear: () => void;
}) {
  const inputId = useId();

  return (
    <div className="space-y-2">
      <input
        id={inputId}
        type="file"
        accept={accept}
        className="sr-only"
        onChange={(event) => {
          const selected = event.target.files?.[0];
          if (selected) void onSelect(selected);
          event.currentTarget.value = '';
        }}
      />

      <label
        htmlFor={inputId}
        className={cn(
          'block cursor-pointer rounded-xl border border-dashed px-4 py-4 transition',
          error ? 'border-rose-300 bg-rose-50/30' : 'border-slate-300 bg-transparent hover:border-slate-400',
        )}
      >
        <div className="flex items-start gap-3">
          <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-[var(--ds-brand)]">
            <Icon size={20} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-semibold text-slate-900">{label}</span>
            <span className="mt-1 block text-sm text-slate-500">{hint}</span>
            {file ? (
              <span className="mt-3 flex flex-wrap items-center gap-2 text-sm text-slate-700">
                <span className="font-medium">{file.name}</span>
                <span className="text-slate-400">{formatBytes(file.size)}</span>
              </span>
            ) : (
              <span className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-[var(--ds-brand)]">
                <Upload size={16} />
                Choose file
              </span>
            )}
          </span>
        </div>
      </label>

      {file ? (
        <button type="button" onClick={onClear} className="text-sm font-medium text-slate-500 hover:text-slate-700">
          Remove file
        </button>
      ) : null}

      {error ? <p className="text-sm text-rose-600">{error}</p> : null}
    </div>
  );
}

function MultiUploadField({
  label,
  hint,
  files,
  accept,
  error,
  icon: Icon,
  onSelect,
  onRemove,
}: {
  label: string;
  hint: string;
  files: UploadValue[];
  accept: string;
  error?: string;
  icon: typeof Upload;
  onSelect: (files: File[]) => void | Promise<void>;
  onRemove: (id: string) => void;
}) {
  const inputId = useId();

  return (
    <div className="space-y-3">
      <input
        id={inputId}
        type="file"
        accept={accept}
        multiple
        className="sr-only"
        onChange={(event) => {
          const selected = event.target.files ? Array.from(event.target.files) : [];
          if (selected.length) void onSelect(selected);
          event.currentTarget.value = '';
        }}
      />

      <label
        htmlFor={inputId}
        className={cn(
          'block cursor-pointer rounded-xl border border-dashed px-4 py-4 transition',
          error ? 'border-rose-300 bg-rose-50/30' : 'border-slate-300 bg-transparent hover:border-slate-400',
        )}
      >
        <div className="flex items-start gap-3">
          <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-[var(--ds-brand)]">
            <Icon size={20} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-semibold text-slate-900">{label}</span>
            <span className="mt-1 block text-sm text-slate-500">{hint}</span>
            <span className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-[var(--ds-brand)]">
              <Upload size={16} />
              Add files
            </span>
          </span>
        </div>
      </label>

      {files.length ? (
        <div className="grid gap-3">
          {files.map((file) => (
            <div key={file.id} className="flex items-center justify-between gap-3 border-b border-slate-200 py-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-900">{file.name}</p>
                <p className="text-sm text-slate-500">{formatBytes(file.size)}</p>
              </div>
              <button type="button" onClick={() => onRemove(file.id)} className="text-sm font-medium text-slate-500 hover:text-slate-700">
                Remove
              </button>
            </div>
          ))}
        </div>
      ) : null}

      {error ? <p className="text-sm text-rose-600">{error}</p> : null}
    </div>
  );
}

function PhotoCropEditor({
  file,
  cropX,
  cropY,
  zoom,
  error,
  onSelect,
  onClear,
  onCropXChange,
  onCropYChange,
  onZoomChange,
}: {
  file: UploadValue | null;
  cropX: number;
  cropY: number;
  zoom: number;
  error?: string;
  onSelect: (file: File) => void | Promise<void>;
  onClear: () => void;
  onCropXChange: (value: number) => void;
  onCropYChange: (value: number) => void;
  onZoomChange: (value: number) => void;
}) {
  const inputId = useId();

  return (
    <div className="space-y-4">
      <input
        id={inputId}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(event) => {
          const selected = event.target.files?.[0];
          if (selected) void onSelect(selected);
          event.currentTarget.value = '';
        }}
      />

      <div className="grid gap-4 lg:grid-cols-[minmax(0,220px)_minmax(0,1fr)]">
        <div className="relative overflow-hidden rounded-xl bg-slate-50 p-3">
          <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-[linear-gradient(145deg,#eef2ff,#dbeafe)]">
            {file?.previewUrl ? (
              <img
                src={file.previewUrl}
                alt="Trainer profile preview"
                className="h-full w-full object-cover transition duration-200"
                style={{ objectPosition: `${cropX}% ${cropY}%`, transform: `scale(${zoom})` }}
              />
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-3 text-center text-slate-500">
                <CircleUserRound size={40} />
                <p className="max-w-[12rem] text-sm">Your portrait preview appears here once you upload it.</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <label
            htmlFor={inputId}
            className={cn(
              'block cursor-pointer rounded-xl border border-dashed px-4 py-4 transition',
              error ? 'border-rose-300 bg-rose-50/30' : 'border-slate-300 bg-transparent hover:border-slate-400',
            )}
          >
            <div className="flex items-start gap-3">
              <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-[var(--ds-brand)]">
                <Camera size={20} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-slate-900">Upload a clear portrait</span>
                <span className="mt-1 block text-sm text-slate-500">A front-facing image with good lighting works best.</span>
                <span className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-[var(--ds-brand)]">
                  <Upload size={16} />
                  {file ? 'Replace photo' : 'Choose photo'}
                </span>
              </span>
            </div>
          </label>

          {file ? (
            <div className="space-y-3 border-t border-slate-200 pt-4">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-900">{file.name}</p>
                  <p className="text-sm text-slate-500">{formatBytes(file.size)}</p>
                </div>
                <button type="button" onClick={onClear} className="text-sm font-medium text-slate-500 hover:text-slate-700">
                  Remove
                </button>
              </div>

              <RangeField label="Horizontal crop" value={cropX} min={0} max={100} step={1} onChange={onCropXChange} />
              <RangeField label="Vertical crop" value={cropY} min={0} max={100} step={1} onChange={onCropYChange} />
              <RangeField label="Zoom" value={zoom} min={1} max={1.8} step={0.05} onChange={onZoomChange} />
            </div>
          ) : null}
        </div>
      </div>

      {error ? <p className="text-sm text-rose-600">{error}</p> : null}
    </div>
  );
}

function RangeField({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block space-y-2">
      <span className="flex items-center justify-between text-sm font-semibold text-slate-800">
        <span>{label}</span>
        <span className="text-slate-500">{value.toFixed(step < 1 ? 2 : 0)}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-2.5 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-[var(--ds-brand)]"
      />
    </label>
  );
}

function ReviewSectionCard({
  title,
  rows,
  onEdit,
}: {
  title: string;
  rows: [string, string][];
  onEdit: () => void;
}) {
  return (
    <section className="border-t border-slate-200 py-4 first:border-t-0 first:pt-0">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-slate-950">{title}</h3>
          <p className="mt-1 text-sm text-slate-500">Tap edit to jump back into that part of the flow.</p>
        </div>
        <button type="button" onClick={onEdit} className="text-sm font-semibold text-[var(--ds-brand)] hover:text-[var(--ds-brand-strong)]">
          Edit
        </button>
      </div>

      <dl className="mt-4 grid gap-3">
        {rows.map(([label, value]) => (
          <div key={label} className="border-b border-slate-100 pb-3 last:border-b-0">
            <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{label}</dt>
            <dd className="mt-1 text-sm leading-6 text-slate-700">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
