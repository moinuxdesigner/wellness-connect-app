import { useState } from 'react';
import { Link } from 'react-router';
import {
  Brain,
  Dumbbell,
  HeartHandshake,
  ShieldCheck,
  Star,
  Users,
  CalendarCheck,
  ClipboardList,
  ArrowRight,
  CheckCircle2,
  Menu,
  X,
} from 'lucide-react';

/* ─── Static content ────────────────────────────────────────────────── */
const NAV_LINKS = [
  { label: 'Services', href: '#services' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'Pricing', href: '/pricing' },
];

const STATS = [
  { value: '2,400+', label: 'Active Clients' },
  { value: '120+', label: 'Certified Professionals' },
  { value: '98%', label: 'Satisfaction Rate' },
  { value: '15+', label: 'Specialisations' },
];

const SERVICES = [
  {
    icon: Brain,
    title: 'Psychology & Counselling',
    desc: 'Licensed therapists and counsellors for mental health support, CBT, and trauma-informed care.',
    iconBg: 'bg-indigo-50',
    iconColor: 'text-indigo-600',
  },
  {
    icon: Dumbbell,
    title: 'Fitness & Training',
    desc: 'Certified personal trainers building customised workout plans and tracking your progress.',
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
  },
  {
    icon: HeartHandshake,
    title: 'Life & Wellness Coaching',
    desc: 'Goal-oriented coaching for career, relationships, stress management, and lifestyle balance.',
    iconBg: 'bg-rose-50',
    iconColor: 'text-rose-600',
  },
  {
    icon: ShieldCheck,
    title: 'Holistic Health Packages',
    desc: 'Bundled programmes combining psychology, fitness, and coaching for complete wellbeing.',
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-600',
  },
];

const HOW_IT_WORKS = [
  {
    step: '01',
    icon: ClipboardList,
    title: 'Complete Your Intake',
    desc: 'Answer a short wellness questionnaire so we can understand your goals and match you with the right professional.',
  },
  {
    step: '02',
    icon: Users,
    title: 'Get Matched',
    desc: 'Our triage system recommends the best-fit practitioners based on your needs, availability, and preferences.',
  },
  {
    step: '03',
    icon: CalendarCheck,
    title: 'Book & Begin',
    desc: 'Schedule your first session online or in-person and start your personalised wellness journey.',
  },
];

const TESTIMONIALS = [
  {
    name: 'Priya Sharma',
    role: 'Client — Counselling',
    quote:
      'WellnessConnect made it incredibly easy to find a therapist who truly understood my needs. The intake process was seamless.',
    rating: 5,
    initials: 'PS',
    avatarBg: 'bg-indigo-100 text-indigo-700',
  },
  {
    name: 'Rahul Menon',
    role: 'Client — Fitness',
    quote:
      'My trainer built a plan that actually fits my schedule. The progress tracking keeps me accountable every week.',
    rating: 5,
    initials: 'RM',
    avatarBg: 'bg-emerald-100 text-emerald-700',
  },
  {
    name: 'Ananya Iyer',
    role: 'Client — Wellness Package',
    quote:
      'The combined psychology and coaching package transformed how I handle stress. I feel more in control than ever.',
    rating: 5,
    initials: 'AI',
    avatarBg: 'bg-rose-100 text-rose-700',
  },
];

/* ─── Component ─────────────────────────────────────────────────────── */
export default function LandingPage() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>

      {/* ══ NAVBAR ══════════════════════════════════════════════════ */}
      <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 lg:px-8">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
              <HeartHandshake size={16} className="text-white" />
            </div>
            <span className="text-[17px] font-semibold text-slate-900">
              Wellness<span className="text-indigo-600">Connect</span>
            </span>
          </Link>

          {/* Desktop nav links */}
          <nav className="hidden items-center gap-7 lg:flex">
            {NAV_LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="text-sm font-medium text-slate-600 transition-colors hover:text-indigo-600"
              >
                {l.label}
              </a>
            ))}
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden items-center gap-3 lg:flex">
            <Link
              to="/login"
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            aria-label="Toggle menu"
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile drawer */}
        {mobileOpen && (
          <div className="border-t border-slate-100 bg-white px-4 pb-5 lg:hidden">
            <nav className="flex flex-col gap-1 pt-3">
              {NAV_LINKS.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  {l.label}
                </a>
              ))}
            </nav>
            <div className="mt-3 flex flex-col gap-2 border-t border-slate-100 pt-4">
              <Link
                to="/login"
                className="rounded-lg border border-slate-200 px-4 py-2.5 text-center text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="rounded-lg bg-indigo-600 px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-indigo-700"
              >
                Get Started
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* ══ HERO ════════════════════════════════════════════════════ */}
      <section className="bg-gradient-to-br from-slate-50 via-indigo-50/40 to-white">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 lg:grid-cols-2 lg:items-center lg:px-8 lg:py-24">

          {/* Left — copy */}
          <div className="order-2 lg:order-1">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-indigo-600">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
              Integrated Wellness Platform
            </span>

            <h1 className="mt-4 text-4xl font-bold leading-[1.15] text-slate-900 lg:text-5xl">
              Integrated care for{' '}
              <span className="text-indigo-600">mind, body,</span>{' '}
              and lifestyle.
            </h1>

            <p className="mt-5 text-lg leading-relaxed text-slate-600">
              A role-based wellness workspace connecting clients with licensed
              counsellors, certified trainers, and life coaches — all in one
              platform.
            </p>

            {/* Feature bullets */}
            <ul className="mt-6 space-y-2.5">
              {[
                'Smart intake & triage matching',
                'Online & in-person sessions',
                'Progress tracking & reporting',
              ].map((f) => (
                <li key={f} className="flex items-center gap-2.5 text-sm text-slate-700">
                  <CheckCircle2 size={16} className="shrink-0 text-indigo-500" />
                  {f}
                </li>
              ))}
            </ul>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700"
              >
                Start Your Journey
                <ArrowRight size={15} />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
              >
                Sign In
              </Link>
            </div>

            <p className="mt-5 text-xs text-slate-400">
              Trusted by 2,400+ clients · HIPAA-compliant · Secure &amp; confidential
            </p>
          </div>

          {/* Right — hero image */}
          <div className="order-1 lg:order-2">
            <img
              src="/exercise-couple.png"
              alt="Couple exercising together — fitness and wellness"
              className="h-auto w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* ══ STATS BAR ═══════════════════════════════════════════════ */}
      <section className="border-y border-slate-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
          <dl className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <dt className="text-3xl font-bold text-indigo-600">{s.value}</dt>
                <dd className="mt-1 text-sm text-slate-500">{s.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ══ SERVICES ════════════════════════════════════════════════ */}
      <section id="services" className="bg-slate-50/70 py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-indigo-600">
              Our Services
            </span>
            <h2 className="mt-2 text-3xl font-bold text-slate-900 lg:text-4xl">
              Everything you need for complete wellbeing
            </h2>
            <p className="mt-4 text-base text-slate-600">
              From mental health support to physical fitness and life coaching —
              we bring it all together under one roof.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {SERVICES.map((s) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.title}
                  className="group rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div
                    className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${s.iconBg} ${s.iconColor}`}
                  >
                    <Icon size={22} />
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-slate-900">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500">
                    {s.desc}
                  </p>
                  <div className="mt-4 flex items-center gap-1 text-xs font-medium text-indigo-600 opacity-0 transition-opacity group-hover:opacity-100">
                    Learn more <ArrowRight size={12} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══ HOW IT WORKS ════════════════════════════════════════════ */}
      <section id="how-it-works" className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-indigo-600">
              How It Works
            </span>
            <h2 className="mt-2 text-3xl font-bold text-slate-900 lg:text-4xl">
              Start your wellness journey in 3 steps
            </h2>
          </div>

          <div className="mt-12 grid gap-10 lg:grid-cols-3">
            {HOW_IT_WORKS.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.step} className="flex flex-col items-start">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-600 shadow-md shadow-indigo-200">
                      <Icon size={20} className="text-white" />
                    </div>
                    <span className="text-5xl font-bold text-slate-100 select-none">
                      {item.step}
                    </span>
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-slate-900">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-8 py-3.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700"
            >
              Get Started Today
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* ══ TESTIMONIALS ════════════════════════════════════════════ */}
      <section id="testimonials" className="bg-slate-50/70 py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-indigo-600">
              Testimonials
            </span>
            <h2 className="mt-2 text-3xl font-bold text-slate-900 lg:text-4xl">
              What our clients say
            </h2>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.name}
                className="flex flex-col rounded-2xl border border-slate-100 bg-white p-6 shadow-sm"
              >
                <div className="flex gap-0.5">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-slate-600">
                  "{t.quote}"
                </blockquote>
                <div className="mt-5 flex items-center gap-3 border-t border-slate-50 pt-4">
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${t.avatarBg}`}
                  >
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{t.name}</p>
                    <p className="text-xs text-slate-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CTA BANNER ══════════════════════════════════════════════ */}
      <section className="bg-indigo-600 py-16">
        <div className="mx-auto max-w-4xl px-4 text-center lg:px-8">
          <h2 className="text-3xl font-bold text-white lg:text-4xl">
            Ready to take the first step?
          </h2>
          <p className="mt-4 text-base text-indigo-200">
            Join thousands of clients who have transformed their wellbeing with
            WellnessConnect.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              to="/signup"
              className="rounded-xl bg-white px-8 py-3.5 text-sm font-semibold text-indigo-600 shadow-sm transition-colors hover:bg-indigo-50"
            >
              Create Free Account
            </Link>
            <Link
              to="/login"
              className="rounded-xl border border-indigo-400 px-8 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* ══ FOOTER ══════════════════════════════════════════════════ */}
      <footer className="border-t border-slate-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600">
                <HeartHandshake size={13} className="text-white" />
              </div>
              <span className="text-sm font-semibold text-slate-900">
                Wellness<span className="text-indigo-600">Connect</span>
              </span>
            </div>
            <p className="text-xs text-slate-400">
              © {new Date().getFullYear()} WellnessConnect. All rights reserved.
            </p>
            <div className="flex gap-5 text-xs text-slate-400">
              <a href="#" className="hover:text-slate-600">Privacy</a>
              <a href="#" className="hover:text-slate-600">Terms</a>
              <a href="#" className="hover:text-slate-600">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
