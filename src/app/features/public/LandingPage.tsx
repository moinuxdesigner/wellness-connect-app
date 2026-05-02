import { Link } from 'react-router';

const heroImage = 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1400&q=80';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 lg:grid-cols-2 lg:items-center lg:px-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">Wellness Platform</p>
          <h1 className="mt-3 text-4xl font-bold text-slate-900 lg:text-5xl">Integrated care for mind, body, and lifestyle.</h1>
          <p className="mt-5 text-lg text-slate-600">A role-based wellness workspace for clients, professionals, operations teams, and admins.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/login" className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700">Login Demo</Link>
            <Link to="/pricing" className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-white">View Pricing</Link>
          </div>
        </div>
        <img className="h-[420px] w-full rounded-3xl object-cover shadow-lg" src={heroImage} alt="Wellness coaching session" />
      </section>
    </div>
  );
}
