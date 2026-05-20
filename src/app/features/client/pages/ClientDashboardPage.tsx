import { ClientPageTitle } from '../ClientLayout';
import { getAuthState } from '../../auth/auth';
import { SmilePlus } from 'lucide-react';
import { useNavigate } from 'react-router';

export default function ClientDashboardPage() {
  const user = getAuthState().user;
  const navigate = useNavigate();

  return (
    <div className="mx-auto w-full max-w-7xl space-y-4 pb-2">
      <ClientPageTitle
        title={`Welcome, ${user?.name ?? 'Client'}!`}
        subtitle="Let's build a healthier mind and body."
      />

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
          <h2 className="text-base font-semibold text-slate-900">Today's Overview</h2>
          <div className="mt-3 space-y-2.5">
            <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3">
              <div>
                <p className="text-xs text-slate-500">Next session</p>
                <p className="text-sm font-semibold text-slate-900">6:00 PM</p>
              </div>
              <span className="rounded-full bg-indigo-100 px-2 py-1 text-xs font-semibold text-indigo-700">Training</span>
            </div>
            <button
              type="button"
              onClick={() => navigate('/client/tasks')}
              className="flex w-full items-center justify-between rounded-xl bg-slate-50 p-3 text-left transition hover:bg-indigo-50"
            >
              <p className="text-sm text-slate-600">Tasks pending</p>
              <p className="text-sm font-semibold text-slate-900">3</p>
            </button>
          </div>
        </article>

        <article className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
          <h2 className="text-base font-semibold text-slate-900">Daily Check-in</h2>
          <p className="mt-1 text-sm text-slate-600">How are you feeling today?</p>
          <div className="mt-3 flex items-center justify-between gap-2">
            {['😔', '😕', '😐', '🙂', '😄'].map((emoji) => (
              <button key={emoji} type="button" className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-xl transition hover:bg-indigo-50">
                {emoji}
              </button>
            ))}
          </div>
          <div className="mt-4 rounded-xl bg-indigo-50 p-3 text-sm text-indigo-700">
            <div className="flex items-center gap-2">
              <SmilePlus size={16} />
              <span>Small daily updates build long-term progress.</span>
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}
