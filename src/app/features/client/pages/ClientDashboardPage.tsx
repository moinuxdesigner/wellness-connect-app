import { ClientPageTitle } from '../ClientLayout';
import { getAuthState } from '../../auth/auth';

export default function ClientDashboardPage() {
  const user = getAuthState().user;

  return (
    <div className="space-y-6">
      <ClientPageTitle
        title={`Welcome, ${user?.name ?? 'Client'}`}
        subtitle="Track your wellness journey across mind, body, and lifestyle in one place."
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-sm text-slate-500">Upcoming Appointments</p><p className="mt-2 text-3xl font-semibold text-slate-900">3</p></article>
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-sm text-slate-500">Programs Assigned</p><p className="mt-2 text-3xl font-semibold text-slate-900">5</p></article>
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-sm text-slate-500">Mood Check-ins</p><p className="mt-2 text-3xl font-semibold text-slate-900">14</p></article>
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-sm text-slate-500">Plan Status</p><p className="mt-2 text-3xl font-semibold text-emerald-600">Active</p></article>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Profile Snapshot</h2>
        <div className="mt-4 grid gap-3 text-sm text-slate-700 md:grid-cols-2">
          <p><span className="font-medium text-slate-900">Email:</span> {user?.email ?? '-'}</p>
          <p><span className="font-medium text-slate-900">Phone:</span> {user?.phone ?? '-'}</p>
          <p><span className="font-medium text-slate-900">Wellness goal:</span> {user?.primary_goal ?? user?.wellness_goal ?? '-'}</p>
          <p><span className="font-medium text-slate-900">Consent:</span> {user?.consent_to_terms ? 'Accepted' : 'Not accepted'}</p>
        </div>
      </section>
    </div>
  );
}
