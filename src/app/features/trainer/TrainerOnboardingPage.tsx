import { useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Edit3,
  Eye,
  FileCheck2,
  Save,
  User,
  X,
} from 'lucide-react';
import { ToneBadge } from '../shared/components/Ui';

type StepStatus = 'pending' | 'completed' | 'needs-correction' | 'verified';
type AppMode = 'draft' | 'view' | 'edit';

interface OnboardingField {
  label: string;
  type: 'text' | 'email' | 'password' | 'date' | 'number' | 'textarea' | 'select' | 'multiselect' | 'file' | 'boolean' | 'rating';
  options?: string[];
  required?: boolean;
}

interface OnboardingStep {
  id: string;
  title: string;
  purpose: string;
  status: StepStatus;
  fields: OnboardingField[];
}

const storageKey = 'wc_trainer_onboarding_draft';
const modeKey = 'wc_trainer_onboarding_mode';
const submittedKey = 'wc_trainer_onboarding_submitted';

const trainerTypes = ['Personal Trainer', 'Yoga Coach', 'Nutrition Coach', 'Physiotherapist', 'Wellness Coach'];
const languages = ['English', 'Hindi', 'Telugu', 'Urdu', 'Tamil', 'Kannada', 'Malayalam', 'Other'];
const idTypes = ['Aadhaar', 'PAN', 'Driving Licence', 'Passport', 'Voter ID'];
const certifications = ['K11 APT Pro', 'ACE', 'ACSM', 'NASM', 'ISSA', "Gold's Gym Fitness Institute", 'Classic Fitness Academy', 'Other'];
const clientTypes = ['Beginners', 'Fat Loss Clients', 'Muscle Gain Clients', 'Women Clients', 'Senior Citizens', 'Posture Correction', 'IT Professionals', 'Obese Clients', 'Athletes', 'Medical Referral Clients'];
const specializations = ['Fat Loss', 'Muscle Gain', 'Strength Training', 'Functional Training', 'Mobility', 'Posture Correction', 'Weight Management', 'Beginner Fitness', "Women's Fitness", 'Senior Citizen Fitness', 'Sports Conditioning', 'Body Recomposition', 'Lifestyle Fitness', 'Corporate Fitness'];
const workTypes = ['Full-time', 'Part-time', 'Freelance', 'Online-only', 'Offline-only', 'Hybrid'];
const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const approvalStatuses = ['Draft', 'Submitted', 'Documents Pending', 'Skill Test Pending', 'Interview Scheduled', 'Approved', 'Rejected', 'Needs Correction'];

const timelineItems = [
  { title: 'Trainer Signup', team: 'Applicant', time: 'Draft started', state: 'done' },
  { title: 'Profile and Documents', team: 'Trainer', time: 'In progress', state: 'done' },
  { title: 'Safety and Skill Review', team: 'Lead Coach', time: 'Pending quiz score', state: 'current' },
  { title: 'Admin Verification', team: 'Admin and Legal', time: 'After submission', state: 'pending' },
  { title: 'Interview / Demo Session', team: 'Lead Coach / Owner', time: 'If shortlisted', state: 'pending' },
  { title: 'Dashboard Activation', team: 'Operations', time: 'After approval', state: 'pending' },
] as const;

const steps: OnboardingStep[] = [
  {
    id: 'profile',
    title: 'Profile',
    purpose: 'Capture trainer identity, contact details, and service provider type.',
    status: 'pending',
    fields: [
      { label: 'Full Name as per ID', type: 'text', required: true },
      { label: 'Mobile Number', type: 'text', required: true },
      { label: 'Email', type: 'email', required: true },
      { label: 'Registering As', type: 'select', options: trainerTypes, required: true },
      { label: 'Profile Photo', type: 'file' },
      { label: 'Date of Birth', type: 'date' },
      { label: 'Gender', type: 'select', options: ['Female', 'Male', 'Non-binary', 'Prefer not to say'] },
      { label: 'Current City', type: 'text' },
      { label: 'Current Address', type: 'textarea' },
      { label: 'Languages Known', type: 'multiselect', options: languages },
    ],
  },
  {
    id: 'verification',
    title: 'Verification',
    purpose: 'Collect ID, masked document details, selfie verification, and emergency contact.',
    status: 'pending',
    fields: [
      { label: 'Government ID Type', type: 'select', options: idTypes, required: true },
      { label: 'Masked ID Number', type: 'text', required: true },
      { label: 'Upload Front Side', type: 'file' },
      { label: 'Upload Back Side', type: 'file' },
      { label: 'Selfie Verification', type: 'file' },
      { label: 'Emergency Contact Name', type: 'text' },
      { label: 'Emergency Contact Number', type: 'text' },
    ],
  },
  {
    id: 'qualification',
    title: 'Qualification',
    purpose: 'Review certifications, education, CPR, and first aid readiness.',
    status: 'pending',
    fields: [
      { label: 'Highest Education', type: 'select', options: ['Diploma', 'Graduate', 'Post Graduate', 'Professional Certification', 'Other'] },
      { label: 'Fitness Certification', type: 'multiselect', options: certifications, required: true },
      { label: 'Certification Institute', type: 'text' },
      { label: 'Certificate Number', type: 'text' },
      { label: 'Certificate Validity', type: 'date' },
      { label: 'Upload Certificate', type: 'file' },
      { label: 'CPR / First Aid Certified?', type: 'boolean' },
      { label: 'Upload First Aid Certificate', type: 'file' },
    ],
  },
  {
    id: 'experience',
    title: 'Experience',
    purpose: 'Evaluate training background, references, and client exposure.',
    status: 'pending',
    fields: [
      { label: 'Total Experience', type: 'select', options: ['0-1 years', '1-3 years', '3-5 years', '5+ years'] },
      { label: 'Previous Gym / Studio Name', type: 'text' },
      { label: 'Previous Role', type: 'text' },
      { label: 'Number of Clients Trained', type: 'number' },
      { label: 'Client Types Handled', type: 'multiselect', options: clientTypes },
      { label: 'Reason for Leaving Previous Role', type: 'textarea' },
      { label: 'Reference Contact 1', type: 'text' },
      { label: 'Reference Contact 2', type: 'text' },
    ],
  },
  {
    id: 'skills',
    title: 'Skills',
    purpose: 'Map specializations, safety knowledge, and practical self-assessment.',
    status: 'pending',
    fields: [
      { label: 'Primary Specialization', type: 'select', options: specializations, required: true },
      { label: 'Secondary Specializations', type: 'multiselect', options: specializations },
      { label: 'Preferred Client Segment', type: 'multiselect', options: clientTypes },
      { label: 'Not Comfortable Handling', type: 'multiselect', options: clientTypes },
      { label: 'Can Handle Premium Clients?', type: 'boolean' },
      { label: 'Comfortable with Documentation?', type: 'boolean' },
      { label: 'Safety Quiz Score', type: 'number' },
      { label: 'Squat Correction', type: 'rating' },
      { label: 'Push-up Regression', type: 'rating' },
      { label: 'Injury Awareness', type: 'rating' },
      { label: 'Demo Video Upload Notes', type: 'textarea' },
    ],
  },
  {
    id: 'availability',
    title: 'Availability',
    purpose: 'Capture work preference, available days, location radius, and compensation expectations.',
    status: 'pending',
    fields: [
      { label: 'Preferred Work Type', type: 'select', options: workTypes },
      { label: 'Available Days', type: 'multiselect', options: weekDays },
      { label: 'Morning Slots', type: 'text' },
      { label: 'Evening Slots', type: 'text' },
      { label: 'Online Training Available?', type: 'boolean' },
      { label: 'Offline Training Available?', type: 'boolean' },
      { label: 'Home Visit Available?', type: 'boolean' },
      { label: 'Preferred Location Radius', type: 'select', options: ['5 km', '10 km', '15 km', '20+ km'] },
      { label: 'Expected Monthly Salary', type: 'number' },
      { label: 'Expected Per Session Fee', type: 'number' },
    ],
  },
  {
    id: 'agreement',
    title: 'Agreement',
    purpose: 'Confirm legal, privacy, payment, SOP, and safety boundaries.',
    status: 'pending',
    fields: [
      { label: 'I agree not to solicit or privately train studio clients.', type: 'boolean', required: true },
      { label: 'I agree not to collect payments directly from clients.', type: 'boolean', required: true },
      { label: 'I agree to follow studio SOP and safety protocol.', type: 'boolean', required: true },
      { label: 'I agree that client data belongs to the studio.', type: 'boolean', required: true },
      { label: 'I agree to maintain confidentiality.', type: 'boolean', required: true },
      { label: 'I understand trainers must not provide counselling, diagnosis, injury treatment, medication advice, or disease-specific advice.', type: 'boolean', required: true },
    ],
  },
  {
    id: 'review',
    title: 'Review',
    purpose: 'Submit the application for admin verification, demo review, interview, and final approval.',
    status: 'pending',
    fields: [
      { label: 'Admin Review Notes', type: 'textarea' },
      { label: 'Lead Coach Practical Test Notes', type: 'textarea' },
      { label: 'Owner Final Approval Notes', type: 'textarea' },
    ],
  },
];

function readJsonState<T>(key: string, fallback: T): T {
  const saved = localStorage.getItem(key);
  if (!saved) return fallback;

  try {
    return JSON.parse(saved) as T;
  } catch {
    return fallback;
  }
}

function fieldKey(stepId: string, label: string) {
  return `${stepId}.${label}`;
}

export default function TrainerOnboardingPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [mode, setMode] = useState<AppMode>(() => (localStorage.getItem(modeKey) as AppMode) || 'draft');
  const [submitted, setSubmitted] = useState(() => localStorage.getItem(submittedKey) === 'true');
  const [showApprovalPath, setShowApprovalPath] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);
  const [draft, setDraft] = useState<Record<string, string | boolean | string[]>>(() => readJsonState(storageKey, {}));
  const step = steps[activeStep];
  const readOnly = mode === 'view';
  const completionCount = useMemo(() => steps.filter((item) => item.fields.some((field) => Boolean(draft[fieldKey(item.id, field.label)]))).length, [draft]);
  const safetyScore = Number(draft[fieldKey('skills', 'Safety Quiz Score')] ?? 0);
  const appStatus = submitted ? 'Under Review' : mode === 'draft' ? 'Draft' : 'In Progress';
  const applicationNo = submitted ? 'TRN-2026-00125' : 'DRAFT-2026-056';

  function updateDraft(key: string, value: string | boolean | string[]) {
    const next = { ...draft, [key]: value };
    setDraft(next);
    localStorage.setItem(storageKey, JSON.stringify(next));
  }

  function saveDraft() {
    localStorage.setItem(storageKey, JSON.stringify(draft));
    localStorage.setItem(modeKey, 'draft');
    setMode('draft');
  }

  function changeMode(nextMode: AppMode) {
    localStorage.setItem(modeKey, nextMode);
    setMode(nextMode);
  }

  function submitApplication() {
    localStorage.setItem(storageKey, JSON.stringify(draft));
    localStorage.setItem(submittedKey, 'true');
    localStorage.setItem(modeKey, 'view');
    setSubmitted(true);
    setMode('view');
    setShowTimeline(true);
  }

  return (
    <div className="-m-4 min-h-[calc(100vh-96px)] bg-slate-50 pb-20 lg:-m-6">
      <header className="border-b border-slate-200 bg-white px-4 py-5 lg:px-10">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-3">
            <button type="button" className="mt-1 rounded-lg p-2 text-slate-500 hover:bg-slate-100" aria-label="Back">
              <ArrowLeft size={18} />
            </button>
            <div>
              <h1 className="text-2xl font-semibold text-slate-950">Trainer Onboarding Application</h1>
              <p className="mt-1 text-sm text-slate-600">Application No: {applicationNo}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <ToneBadge tone={submitted ? 'warning' : 'neutral'}>{appStatus}</ToneBadge>
            <button type="button" onClick={saveDraft} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
              <Save size={16} /> Save as Draft
            </button>
            <button type="button" onClick={() => changeMode('view')} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
              <Eye size={16} /> View
            </button>
            <button type="button" onClick={() => changeMode('edit')} className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-700">
              <Edit3 size={16} /> Edit
            </button>
          </div>
        </div>
      </header>

      <section className="border-b border-slate-200 bg-white px-4 py-4 shadow-sm lg:px-10">
        <div className="overflow-x-auto pb-2">
          <div className="grid min-w-[860px] grid-cols-8 items-start gap-2">
            {steps.map((item, index) => {
              const isActive = index === activeStep;
              const hasData = item.fields.some((field) => Boolean(draft[fieldKey(item.id, field.label)]));

              return (
                <button key={item.id} type="button" onClick={() => setActiveStep(index)} className="group relative flex flex-col items-center gap-2 text-center">
                  {index < steps.length - 1 ? <span className="absolute left-1/2 top-4 h-px w-full bg-slate-200" /> : null}
                  <span className={`relative z-10 flex h-9 w-9 items-center justify-center rounded-full border-2 bg-white text-sm font-semibold ${
                    isActive ? 'border-indigo-600 text-indigo-600 shadow-[0_0_0_4px_rgba(79,70,229,0.12)]' : hasData ? 'border-emerald-500 text-emerald-600' : 'border-slate-300 text-slate-400'
                  }`}>
                    {hasData && !isActive ? <Check size={16} /> : index + 1}
                  </span>
                  <span className={`max-w-28 truncate text-xs font-medium ${isActive ? 'text-indigo-700' : 'text-slate-500'}`}>{item.title}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-5xl px-4 py-8 lg:px-6">
        <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600">Step {activeStep + 1} of {steps.length}</p>
            <h2 className="mt-1 text-xl font-semibold text-slate-950">{step.title}</h2>
            <p className="mt-1 text-sm text-slate-600">{step.purpose}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => setShowApprovalPath(true)} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">Approval Path</button>
            <button type="button" onClick={() => setShowTimeline(true)} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">Status Timeline</button>
          </div>
        </div>

        {step.id === 'profile' ? (
          <ProfileSummary draft={draft} onEdit={() => changeMode('edit')} />
        ) : null}

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-2">
            <User className="text-indigo-600" size={18} />
            <div>
              <h3 className="font-semibold text-slate-950">{step.title} Details</h3>
              <p className="text-sm text-slate-500">Fields can be saved as draft, viewed, and edited.</p>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {step.fields.map((field) => (
              <FieldControl
                key={field.label}
                field={field}
                readOnly={readOnly}
                value={draft[fieldKey(step.id, field.label)]}
                onChange={(value) => updateDraft(fieldKey(step.id, field.label), value)}
              />
            ))}
          </div>
        </section>

        {step.id === 'skills' ? (
          <InfoCard icon={<AlertTriangle size={18} />} title="Safety Requirement">
            Minimum 70% safety quiz score required. Current status: {safetyScore >= 70 ? 'Skill test can proceed.' : 'Needs Training until score reaches 70%.'}
          </InfoCard>
        ) : null}

        {step.id === 'agreement' ? (
          <InfoCard icon={<AlertTriangle size={18} />} title="Boundary Rule">
            Personal trainers must not provide psychological counselling, medical diagnosis, injury treatment, medication advice, or disease-specific advice. Mental health, pain, injury, or medical concerns must be referred through WellnessConnect.
          </InfoCard>
        ) : null}

        {submitted ? (
          <InfoCard icon={<FileCheck2 size={18} />} title="Submission Confirmation">
            Your trainer profile has been submitted successfully. Current Status: Under Review.
          </InfoCard>
        ) : null}
      </main>

      <footer className="fixed inset-x-0 bottom-16 z-30 border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur lg:bottom-0 lg:px-10">
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setActiveStep((current) => Math.max(0, current - 1))}
            disabled={activeStep === 0}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ChevronLeft size={16} /> Previous
          </button>
          {activeStep < steps.length - 1 ? (
            <button
              type="button"
              onClick={() => {
                saveDraft();
                setActiveStep((current) => Math.min(steps.length - 1, current + 1));
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
            >
              Next Step <ChevronRight size={16} />
            </button>
          ) : (
            <button type="button" onClick={submitApplication} className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700">
              Submit for Review <ChevronRight size={16} />
            </button>
          )}
        </div>
      </footer>

      {showApprovalPath ? <ApprovalPathModal onClose={() => setShowApprovalPath(false)} /> : null}
      {showTimeline ? <TimelineModal applicationNo={applicationNo} status={appStatus} onClose={() => setShowTimeline(false)} /> : null}
    </div>
  );
}

function ProfileSummary({ draft, onEdit }: { draft: Record<string, string | boolean | string[]>; onEdit: () => void }) {
  const rows = [
    ['Name', draft[fieldKey('profile', 'Full Name as per ID')]],
    ['Email', draft[fieldKey('profile', 'Email')]],
    ['Mobile', draft[fieldKey('profile', 'Mobile Number')]],
    ['Role Type', draft[fieldKey('profile', 'Registering As')]],
  ];

  return (
    <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="font-semibold text-slate-950">User Profile</h3>
          <p className="text-sm text-slate-500">View and edit trainer profile information.</p>
        </div>
        <button type="button" onClick={onEdit} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
          <Edit3 size={16} /> Edit Profile
        </button>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-4">
        {rows.map(([label, value]) => (
          <div key={label} className="rounded-xl border border-slate-200 px-3 py-2">
            <p className="text-xs text-slate-500">{label}</p>
            <p className="mt-1 truncate text-sm font-medium text-slate-900">{String(value || 'Not added')}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function InfoCard({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start gap-3 text-slate-700">
        <span className="mt-0.5 text-amber-600">{icon}</span>
        <div>
          <h3 className="font-semibold text-slate-950">{title}</h3>
          <p className="mt-1 text-sm text-slate-600">{children}</p>
        </div>
      </div>
    </section>
  );
}

function ApprovalPathModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[70] bg-slate-50">
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-950">Approval Path</h2>
          <p className="text-sm text-slate-600">Trainer applications pass through screening, verification, review, and approval.</p>
        </div>
        <button type="button" onClick={onClose} className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-50" aria-label="Close approval path">
          <X size={18} />
        </button>
      </header>
      <main className="mx-auto max-w-5xl px-5 py-8">
        <div className="grid gap-3 md:grid-cols-4">
          {approvalStatuses.map((status, index) => (
            <div key={status} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-50 text-sm font-semibold text-indigo-700">{index + 1}</span>
              <h3 className="mt-4 font-semibold text-slate-950">{status}</h3>
              <p className="mt-1 text-sm text-slate-500">Checkpoint in the trainer approval workflow.</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

function TimelineModal({ applicationNo, status, onClose }: { applicationNo: string; status: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[70] overflow-y-auto bg-slate-50">
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-5">
        <div className="flex items-start gap-3">
          <button type="button" onClick={onClose} className="mt-1 rounded-lg p-2 text-slate-500 hover:bg-slate-100" aria-label="Back">
            <ArrowLeft size={18} />
          </button>
          <div>
            <h2 className="text-2xl font-semibold text-slate-950">Track Application Status</h2>
            <p className="text-sm text-slate-600">Application ID: {applicationNo}</p>
          </div>
        </div>
        <ToneBadge tone={status === 'Under Review' ? 'warning' : 'neutral'}>{status}</ToneBadge>
      </header>
      <main className="space-y-5 px-5 py-6">
        <section className="rounded-2xl border border-slate-200 bg-white p-6">
          <h3 className="font-semibold text-slate-950">Application Summary</h3>
          <div className="mt-6 grid gap-4 md:grid-cols-4">
            {[
              ['Applicant', 'Trainer Applicant'],
              ['Submitted On', status === 'Under Review' ? '04 May 2026' : 'Not submitted'],
              ['Application Type', 'Personal Trainer'],
              ['Status', status],
            ].map(([label, value]) => (
              <div key={label}>
                <p className="text-xs text-slate-500">{label}</p>
                <p className="mt-1 font-medium text-slate-950">{value}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6">
          <h3 className="font-semibold text-slate-950">Application Status Timeline</h3>
          <p className="mt-1 text-sm text-slate-500">Track progress through screening and approval stages.</p>
          <div className="mt-6 space-y-5">
            {timelineItems.map((item) => (
              <div key={item.title} className="grid grid-cols-[34px_1fr] gap-3">
                <div className="flex flex-col items-center">
                  <span className={`flex h-8 w-8 items-center justify-center rounded-full ${item.state === 'done' ? 'bg-emerald-500 text-white' : item.state === 'current' ? 'bg-blue-600 text-white ring-4 ring-blue-100' : 'bg-slate-200 text-slate-500'}`}>
                    {item.state === 'done' ? <Check size={16} /> : <Clock3 size={16} />}
                  </span>
                  <span className="mt-1 h-full w-px bg-slate-200" />
                </div>
                <div className={`rounded-2xl border p-4 ${item.state === 'current' ? 'border-blue-200 bg-blue-50' : 'border-slate-200 bg-white'}`}>
                  <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div>
                      <h4 className="font-semibold text-slate-950">{item.title}</h4>
                      <p className="text-sm text-slate-500">{item.team}</p>
                    </div>
                    <p className="text-sm text-slate-500">{item.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

function FieldControl({
  field,
  value,
  readOnly,
  onChange,
}: {
  field: OnboardingField;
  value: string | boolean | string[] | undefined;
  readOnly: boolean;
  onChange: (value: string | boolean | string[]) => void;
}) {
  const baseClass = 'mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm disabled:bg-slate-100 disabled:text-slate-500';

  if (field.type === 'textarea') {
    return (
      <label className="text-sm font-medium text-slate-800 md:col-span-2">
        {field.label}{field.required ? <span className="text-rose-500"> *</span> : null}
        <textarea disabled={readOnly} className={`${baseClass} min-h-24`} value={String(value ?? '')} onChange={(event) => onChange(event.target.value)} />
      </label>
    );
  }

  if (field.type === 'select') {
    return (
      <label className="text-sm font-medium text-slate-800">
        {field.label}{field.required ? <span className="text-rose-500"> *</span> : null}
        <select disabled={readOnly} className={`${baseClass} bg-white`} value={String(value ?? '')} onChange={(event) => onChange(event.target.value)} required={field.required}>
          <option value="">Select</option>
          {field.options?.map((option) => <option key={option} value={option}>{option}</option>)}
        </select>
      </label>
    );
  }

  if (field.type === 'multiselect') {
    const selected = Array.isArray(value) ? value : [];
    return (
      <fieldset className="text-sm font-medium text-slate-800 md:col-span-2" disabled={readOnly}>
        <legend>{field.label}{field.required ? <span className="text-rose-500"> *</span> : null}</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {field.options?.map((option) => {
            const checked = selected.includes(option);
            return (
              <label key={option} className={`rounded-full border px-3 py-1.5 text-xs ${checked ? 'border-indigo-200 bg-indigo-50 text-indigo-700' : 'border-slate-200 text-slate-600'} ${readOnly ? 'opacity-70' : 'cursor-pointer'}`}>
                <input className="sr-only" type="checkbox" checked={checked} disabled={readOnly} onChange={() => onChange(checked ? selected.filter((item) => item !== option) : [...selected, option])} />
                {option}
              </label>
            );
          })}
        </div>
      </fieldset>
    );
  }

  if (field.type === 'boolean') {
    return (
      <label className="flex items-start gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-800 md:col-span-2">
        <input className="mt-1" type="checkbox" checked={Boolean(value)} disabled={readOnly} onChange={(event) => onChange(event.target.checked)} required={field.required} />
        <span>{field.label}</span>
      </label>
    );
  }

  if (field.type === 'rating') {
    return (
      <label className="text-sm font-medium text-slate-800">
        {field.label}
        <input disabled={readOnly} className={baseClass} type="range" min="1" max="5" value={String(value ?? '3')} onChange={(event) => onChange(event.target.value)} />
        <span className="text-xs text-slate-500">Rating: {String(value ?? '3')}/5</span>
      </label>
    );
  }

  return (
    <label className="text-sm font-medium text-slate-800">
      {field.label}{field.required ? <span className="text-rose-500"> *</span> : null}
      <input disabled={readOnly} className={baseClass} type={field.type === 'file' ? 'text' : field.type} value={String(value ?? '')} onChange={(event) => onChange(event.target.value)} required={field.required} placeholder={field.type === 'file' ? 'File upload placeholder' : undefined} />
    </label>
  );
}
