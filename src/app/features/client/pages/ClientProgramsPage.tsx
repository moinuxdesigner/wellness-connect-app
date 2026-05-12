import { ClientPageTitle } from '../ClientLayout';
import { ArrowUpRight, BookOpenText, MessageCircle, TrendingUp } from 'lucide-react';

export default function ClientProgramsPage() {
  return (
    <div className="mx-auto max-w-md space-y-4 pb-2">
      <ClientPageTitle title="My Progress" subtitle="Monitor your physical and mental well-being." />
      <section className="space-y-4">
        <article className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-slate-900">Fitness Progress</h3>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700">
              <TrendingUp size={12} />
              +2.5 kg
            </span>
          </div>
          <p className="mt-2 text-2xl font-semibold text-slate-900">72 kg</p>
          <p className="text-sm text-slate-500">Current tracked weight</p>
          <div className="mt-3 h-2 rounded-full bg-slate-100">
            <div className="h-2 w-2/3 rounded-full bg-emerald-500" />
          </div>
          <p className="mt-2 text-xs text-slate-500">Steady improvement over last month.</p>
        </article>
        <article className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm">
          <h3 className="font-semibold text-slate-900">Mind Well-being</h3>
          <p className="mt-2 text-sm text-slate-600">Mood trend and consistency are improving week by week.</p>
          <div className="mt-4 grid grid-cols-5 gap-2">
            {['bg-violet-200', 'bg-violet-300', 'bg-violet-400', 'bg-violet-300', 'bg-violet-500'].map((bar, index) => (
              <div key={index} className="flex items-end justify-center">
                <div className={`w-full rounded-md ${bar}`} style={{ height: `${30 + index * 8}px` }} />
              </div>
            ))}
          </div>
          <p className="mt-2 text-xs text-slate-500">Overall emotional stability is trending upward.</p>
        </article>
      </section>

      <section className="space-y-4">
        <article className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm">
          <h3 className="font-semibold text-slate-900">Resources</h3>
          <div className="mt-3 space-y-2">
            <a className="flex items-center justify-between rounded-xl bg-slate-50 p-3 text-sm text-slate-700 hover:bg-slate-100" href="#">
              Workout Plan
              <ArrowUpRight size={14} />
            </a>
            <a className="flex items-center justify-between rounded-xl bg-slate-50 p-3 text-sm text-slate-700 hover:bg-slate-100" href="#">
              Guided Meditation
              <ArrowUpRight size={14} />
            </a>
            <a className="flex items-center justify-between rounded-xl bg-slate-50 p-3 text-sm text-slate-700 hover:bg-slate-100" href="#">
              Mental Health Tips
              <ArrowUpRight size={14} />
            </a>
          </div>
        </article>
        <article className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm">
          <h3 className="font-semibold text-slate-900">Quick Actions</h3>
          <div className="mt-3 space-y-2">
            <button type="button" className="flex w-full items-center gap-2 rounded-xl bg-indigo-50 p-3 text-sm font-medium text-indigo-700 hover:bg-indigo-100">
              <MessageCircle size={16} />
              Message Counsellor
            </button>
            <button type="button" className="flex w-full items-center gap-2 rounded-xl bg-emerald-50 p-3 text-sm font-medium text-emerald-700 hover:bg-emerald-100">
              <BookOpenText size={16} />
              Open Program Notes
            </button>
          </div>
        </article>
      </section>
    </div>
  );
}
