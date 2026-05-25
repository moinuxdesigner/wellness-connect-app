import { useState } from 'react';
import { Link } from 'react-router';
import {
  Activity,
  Apple,
  ArrowRight,
  Brain,
  Dumbbell,
  HeartHandshake,
  HeartPulse,
  Leaf,
  Menu,
  ShieldCheck,
  Sparkles,
  Users,
  X,
} from 'lucide-react';

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Careers', to: '/careers' },
  { label: 'Pricing', to: '/pricing' },
];

const ROLE_CARDS = [
  {
    title: 'Psychologist / Counselor',
    description: 'Help clients improve emotional wellbeing through ethical, structured care.',
    role: 'psychologist-counselor',
    icon: Brain,
    accent: 'bg-indigo-50 text-indigo-600 ring-indigo-100',
  },
  {
    title: 'Nutritionist / Dietitian',
    description: 'Guide clients with practical nutrition plans for lifestyle, weight, and wellness goals.',
    role: 'nutritionist-dietitian',
    icon: Apple,
    accent: 'bg-emerald-50 text-emerald-600 ring-emerald-100',
  },
  {
    title: 'Physiotherapist',
    description: 'Support recovery, mobility, pain relief, and preventive physical care.',
    role: 'physiotherapist',
    icon: Activity,
    accent: 'bg-sky-50 text-sky-600 ring-sky-100',
  },
  {
    title: 'Personal Trainer',
    description: 'Help clients build strength, fitness, discipline, and healthy routines.',
    role: 'personal-trainer',
    icon: Dumbbell,
    accent: 'bg-amber-50 text-amber-600 ring-amber-100',
  },
  {
    title: 'Yoga Instructor',
    description: 'Offer mindful movement, flexibility, breathing, and stress-management sessions.',
    role: 'yoga-instructor',
    icon: Leaf,
    accent: 'bg-teal-50 text-teal-600 ring-teal-100',
  },
  {
    title: 'Health Coach',
    description: 'Motivate clients with habit-building, lifestyle support, and wellness accountability.',
    role: 'health-coach',
    icon: HeartPulse,
    accent: 'bg-rose-50 text-rose-600 ring-rose-100',
  },
];

const PLATFORM_BENEFITS = [
  'Flexible schedules across online and in-person care',
  'A collaborative network built around whole-person wellness',
  'Structured workflows for onboarding, sessions, and care continuity',
];

export default function CareersPage() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 shadow-sm shadow-indigo-200/70">
              <HeartHandshake size={18} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold leading-none text-slate-900">Aura Wellness Connect</p>
              <p className="mt-1 text-xs text-slate-500">Holistic care network</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className={`text-sm font-medium transition-colors hover:text-indigo-600 ${
                  link.label === 'Careers' ? 'text-indigo-600' : 'text-slate-600'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <Link
              to="/login"
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Sign In
            </Link>
            <Link
              to="/get-started"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Client Get Started
            </Link>
          </div>

          <button
            type="button"
            aria-label="Toggle menu"
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 lg:hidden"
            onClick={() => setMobileOpen((value) => !value)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {mobileOpen && (
          <div className="border-t border-slate-200 bg-white px-4 pb-5 lg:hidden">
            <nav className="flex flex-col gap-1 pt-3" aria-label="Mobile primary">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={`rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-slate-50 ${
                    link.label === 'Careers' ? 'text-indigo-600' : 'text-slate-700'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="mt-3 grid gap-2 border-t border-slate-100 pt-4">
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="rounded-lg border border-slate-200 px-4 py-2.5 text-center text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Sign In
              </Link>
              <Link
                to="/get-started"
                onClick={() => setMobileOpen(false)}
                className="rounded-lg bg-indigo-600 px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-indigo-700"
              >
                Client Get Started
              </Link>
            </div>
          </div>
        )}
      </header>

      <main>
        <section className="relative overflow-hidden border-b border-slate-200 bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.16),_transparent_42%),linear-gradient(180deg,_#ffffff_0%,_#f8fafc_100%)]">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)] lg:px-8 lg:py-20">
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-indigo-700 shadow-sm">
                <Sparkles size={14} />
                Join Our Network
              </span>
              <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
                Work with Aura Wellness Connect
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                Join a growing wellness platform where psychologists, nutritionists, physiotherapists,
                personal trainers, yoga instructors, and health coaches collaborate to deliver holistic care.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/professional-onboarding"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Start Professional Onboarding
                  <ArrowRight size={16} />
                </Link>
                <Link
                  to="/pricing"
                  className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Explore the Platform
                </Link>
              </div>
            </div>

            <aside className="rounded-[1.5rem] border border-white/70 bg-white/85 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                  <Users size={20} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Care built in collaboration</p>
                  <p className="mt-1 text-sm text-slate-500">Role-based support for modern wellness teams</p>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {PLATFORM_BENEFITS.map((benefit) => (
                  <div key={benefit} className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-3">
                    <ShieldCheck size={16} className="mt-0.5 shrink-0 text-indigo-600" />
                    <p className="text-sm leading-6 text-slate-600">{benefit}</p>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-12 lg:px-8 lg:py-16">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">Open Roles</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">Choose the role that fits your practice</h2>
            <p className="mt-3 text-base leading-7 text-slate-600">
              Each pathway is designed for professionals who want to contribute calm, credible, and coordinated care.
            </p>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {ROLE_CARDS.map((role) => {
              const Icon = role.icon;

              return (
                <article
                  key={role.title}
                  className="group flex h-full flex-col rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(15,23,42,0.08)]"
                >
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ring-1 ${role.accent}`}>
                    <Icon size={22} />
                  </div>
                  <h3 className="mt-5 text-xl font-semibold text-slate-900">{role.title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">{role.description}</p>

                  <Link
                    to={`/professional-onboarding?role=${role.role}`}
                    className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Get Started
                    <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </article>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
