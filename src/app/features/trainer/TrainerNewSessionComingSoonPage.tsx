import { ArrowLeft, CalendarPlus } from 'lucide-react';
import { Link } from 'react-router';

export default function TrainerNewSessionComingSoonPage() {
  return (
    <div className="flex min-h-[calc(100vh-206px)] items-center justify-center lg:min-h-[calc(100vh-126px)]">
      <section className="w-full max-w-xl rounded-3xl border border-indigo-100 bg-white px-6 py-10 text-center shadow-[0_18px_50px_rgba(76,84,232,0.09)] sm:px-10 sm:py-12">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
          <CalendarPlus size={30} />
        </span>
        <p className="mt-7 text-xs font-semibold uppercase tracking-[0.28em] text-indigo-600">New Session</p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[#101842] sm:text-3xl">Coming Soon...</h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">Session creation will be available here once the scheduling workflow is ready.</p>
        <Link to="/trainer" className="mt-8 inline-flex items-center gap-2 rounded-xl border border-indigo-100 bg-white px-5 py-3 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-50">
          <ArrowLeft size={17} /> Back to dashboard
        </Link>
      </section>
    </div>
  );
}
