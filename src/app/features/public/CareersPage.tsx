import { Link } from 'react-router';
import { ArrowRight, Briefcase, HeartHandshake, Menu, ShieldCheck, Sparkles, Users, X } from 'lucide-react';
import { useState } from 'react';

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Careers', to: '/careers' },
  { label: 'Pricing', to: '/pricing' },
];

const CAREER_ROLES = [
  'Psychologists',
  'Psychiatrists',
  'Personal Trainers',
  'Wellness Coaches',
  'Physiotherapists',
  'Dieticians and Nutritionists',
];

const BENEFITS = [
  'Flexible online and in-person schedules',
  'Steady flow of pre-qualified client referrals',
  'Secure appointment, documentation, and communication tools',
  'Collaborative multidisciplinary care environment',
];

export default function CareersPage() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 lg:px-8">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
              <HeartHandshake size={16} className="text-white" />
            </div>
            <span className="text-[17px] font-semibold text-slate-900">
              Wellness<span className="text-indigo-600">Connect</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-7 lg:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className={`text-sm font-medium transition-colors hover:text-indigo-600 ${link.label === 'Careers' ? 'text-indigo-600' : 'text-slate-600'}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <Link
              to="/signup"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700"
            >
              Join Now
            </Link>
          </div>

          <button
            type="button"
            aria-label="Toggle menu"
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
            onClick={() => setMobileOpen((value) => !value)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {mobileOpen && (
          <div className="border-t border-slate-100 bg-white px-4 pb-5 lg:hidden">
            <nav className="flex flex-col gap-1 pt-3">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={`rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-slate-50 ${link.label === 'Careers' ? 'text-indigo-600' : 'text-slate-700'}`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>

      <main className="mx-auto max-w-7xl px-4 py-12 lg:px-8 lg:py-16">
        <section className="rounded-3xl bg-gradient-to-br from-indigo-600 to-blue-700 px-6 py-10 text-white shadow-lg lg:px-10">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-widest">
              <Briefcase size={14} />
              Careers at WellnessConnect
            </span>
            <h1 className="mt-4 text-3xl font-bold leading-tight lg:text-5xl">
              Join our network of trusted wellness professionals
            </h1>
            <p className="mt-4 text-indigo-100">
              We are building a multidisciplinary care platform and inviting passionate professionals to serve clients across mental, physical, and lifestyle wellbeing.
            </p>
          </div>
        </section>

        <section className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {CAREER_ROLES.map((role) => (
            <article key={role} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <Users size={18} />
              </div>
              <h2 className="mt-4 text-lg font-semibold text-slate-900">{role}</h2>
              <p className="mt-2 text-sm text-slate-600">
                Support client outcomes with evidence-based practice, empathy, and consistent follow-through.
              </p>
            </article>
          ))}
        </section>

        <section className="mt-12 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-slate-900">Why join us</h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-700">
              {BENEFITS.map((benefit) => (
                <li key={benefit} className="flex items-start gap-2.5">
                  <ShieldCheck size={16} className="mt-0.5 shrink-0 text-emerald-600" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-slate-900">Application process</h3>
            <ol className="mt-4 space-y-3 text-sm text-slate-700">
              <li className="flex items-start gap-2.5"><Sparkles size={16} className="mt-0.5 shrink-0 text-indigo-600" />Share your profile and credentials</li>
              <li className="flex items-start gap-2.5"><Sparkles size={16} className="mt-0.5 shrink-0 text-indigo-600" />Complete verification and compliance checks</li>
              <li className="flex items-start gap-2.5"><Sparkles size={16} className="mt-0.5 shrink-0 text-indigo-600" />Get onboarded and start accepting clients</li>
            </ol>
            <div className="mt-6">
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
              >
                Apply to Join
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
