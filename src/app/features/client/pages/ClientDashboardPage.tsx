import { ClientPageTitle } from '../ClientLayout';
import { getAuthState } from '../../auth/auth';
import { DSButton } from '../../../../design/components/primitives';
import { Bell, Brain, Dumbbell, SmilePlus } from 'lucide-react';

export default function ClientDashboardPage() {
  const user = getAuthState().user;

  return (
    <div className="mx-auto max-w-md space-y-4 pb-2">
      <ClientPageTitle
        title={`Welcome, ${user?.name ?? 'Client'}!`}
        subtitle="Let's build a healthier mind and body."
      />

      <section className="rounded-[26px] border border-slate-200/80 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-900">What brings you here today?</h2>
          <Bell size={16} className="text-slate-400" />
        </div>
        <div className="mt-3 space-y-3">
          <article className="rounded-2xl bg-emerald-50/80 p-3.5">
            <div className="mb-2 inline-flex rounded-xl bg-white p-2 text-emerald-600"><Dumbbell size={16} /></div>
            <h3 className="font-semibold text-slate-900">Personal Training</h3>
            <p className="mt-1 text-sm text-slate-600">Build strength and improve fitness with guided plans.</p>
          </article>
          <article className="rounded-2xl bg-violet-50/80 p-3.5">
            <div className="mb-2 inline-flex rounded-xl bg-white p-2 text-violet-600"><Brain size={16} /></div>
            <h3 className="font-semibold text-slate-900">Counselling</h3>
            <p className="mt-1 text-sm text-slate-600">Improve well-being and manage stress with support.</p>
          </article>
        </div>
        <DSButton className="mt-3 w-full rounded-xl">Continue</DSButton>
      </section>

      <section className="space-y-4">
        <article className="rounded-[26px] border border-slate-200/80 bg-white p-4 shadow-sm">
          <h2 className="text-base font-semibold text-slate-900">Today's Overview</h2>
          <div className="mt-3 space-y-2.5">
            <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3">
              <div>
                <p className="text-xs text-slate-500">Next session</p>
                <p className="text-sm font-semibold text-slate-900">6:00 PM</p>
              </div>
              <span className="rounded-full bg-indigo-100 px-2 py-1 text-xs font-semibold text-indigo-700">Training</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3">
              <p className="text-sm text-slate-600">Tasks pending</p>
              <p className="text-sm font-semibold text-slate-900">3</p>
            </div>
          </div>
        </article>

        <article className="rounded-[26px] border border-slate-200/80 bg-white p-4 shadow-sm">
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

      <section className="rounded-[26px] border border-slate-200/80 bg-white p-4 shadow-sm">
        <h2 className="text-base font-semibold text-slate-900">Profile Snapshot</h2>
        <div className="mt-3 grid gap-2.5 text-sm text-slate-700">
          <p><span className="font-medium text-slate-900">Email:</span> {user?.email ?? '-'}</p>
          <p><span className="font-medium text-slate-900">Phone:</span> {user?.phone ?? '-'}</p>
          <p><span className="font-medium text-slate-900">Wellness goal:</span> {user?.primary_goal ?? user?.wellness_goal ?? '-'}</p>
          <p><span className="font-medium text-slate-900">Consent:</span> {user?.consent_to_terms ? 'Accepted' : 'Not accepted'}</p>
        </div>
      </section>      
    </div>
  );
}
