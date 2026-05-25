import { Link, useSearchParams } from 'react-router';
import { ArrowLeft, ArrowRight, BadgeCheck, ClipboardList, HeartHandshake, ShieldCheck } from 'lucide-react';

const ROLE_LABELS: Record<string, string> = {
  'psychologist-counselor': 'Psychologist / Counselor',
  'nutritionist-dietitian': 'Nutritionist / Dietitian',
  physiotherapist: 'Physiotherapist',
  'personal-trainer': 'Personal Trainer',
  'yoga-instructor': 'Yoga Instructor',
  'health-coach': 'Health Coach',
};

const NEXT_STEPS = [
  {
    title: 'Professional profile',
    description: 'Share your introduction, specialties, and preferred service format.',
    icon: ClipboardList,
  },
  {
    title: 'Credentials and compliance',
    description: 'Upload licenses, certifications, and identity details for review.',
    icon: ShieldCheck,
  },
  {
    title: 'Availability and launch',
    description: 'Set your working hours, consultation preferences, and onboarding checklist.',
    icon: BadgeCheck,
  },
];

export default function ProfessionalOnboardingPage() {
  const [searchParams] = useSearchParams();
  const selectedRole = ROLE_LABELS[searchParams.get('role') ?? ''];

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 shadow-sm shadow-indigo-200/70">
              <HeartHandshake size={18} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Aura Wellness Connect</p>
              <p className="text-xs text-slate-500">Professional onboarding</p>
            </div>
          </Link>

          <Link
            to="/careers"
            className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            <ArrowLeft size={16} />
            Back to careers
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-12 lg:px-8 lg:py-16">
        <section className="rounded-[1.75rem] border border-slate-200 bg-[linear-gradient(135deg,_rgba(99,102,241,0.08),_rgba(16,185,129,0.06))] p-8 shadow-sm sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">Professional Onboarding</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-900">Your onboarding workspace is ready</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
            This route is prepared as the placeholder entry point for the professional onboarding flow. The production form can now be connected here without affecting the existing client onboarding journey.
          </p>
          {selectedRole ? (
            <div className="mt-6 inline-flex rounded-full border border-indigo-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm">
              Selected role: <span className="ml-1 font-semibold text-slate-900">{selectedRole}</span>
            </div>
          ) : null}
        </section>

        <section className="mt-8 grid gap-5 md:grid-cols-3">
          {NEXT_STEPS.map((step) => {
            const Icon = step.icon;

            return (
              <article key={step.title} className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                  <Icon size={20} />
                </div>
                <h2 className="mt-4 text-lg font-semibold text-slate-900">{step.title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">{step.description}</p>
              </article>
            );
          })}
        </section>

        <section className="mt-8 rounded-[1.5rem] border border-dashed border-slate-300 bg-white p-6 shadow-sm">
          {/* TODO: Replace this placeholder with the full professional onboarding form and submission workflow. */}
          <h2 className="text-lg font-semibold text-slate-900">Next implementation step</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
            Connect this page to the final multi-step application form, document upload, verification checks, and role-specific review logic.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              to="/careers"
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Review roles again
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Sign In
              <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
