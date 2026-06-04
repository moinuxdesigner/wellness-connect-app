import { useEffect, useState, type ReactNode } from 'react';
import { Link } from 'react-router';
import { AlertTriangle, Brain, ClipboardList, Users } from 'lucide-react';
import { getPractitionerCbtDashboard } from '../../services/cbtApi';
import type { PractitionerCbtDashboardResponse } from '../../types/cbt.types';

export default function PractitionerCbtDashboard() {
  const [dashboard, setDashboard] = useState<PractitionerCbtDashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    getPractitionerCbtDashboard()
      .then((data) => {
        if (isMounted) setDashboard(data);
      })
      .catch((requestError: unknown) => {
        if (!isMounted) return;
        setError(requestError instanceof Error ? requestError.message : 'Unable to load CBT dashboard.');
        setDashboard(null);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const stats = dashboard?.stats;
  const plans = dashboard?.plans ?? [];

  return (
    <div className="space-y-5">
      <section className="rounded-3xl border border-violet-100 bg-gradient-to-br from-violet-50 via-white to-indigo-50 p-6">
        <p className="flex items-center gap-2 text-sm font-semibold text-violet-700"><Brain size={17} /> Counsellor CBT Workspace</p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-900">CBT care planning and review</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-600">Create care plans, assign structured CBT exercises, review client submissions, and monitor progress.</p>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        <Stat icon={<Users size={17} />} label="Active plans" value={loading ? '...' : stats?.activePlans ?? 0} />
        <Stat icon={<ClipboardList size={17} />} label="Completion" value={loading ? '...' : `${Math.round(stats?.completionRate ?? 0)}%`} />
        <Stat icon={<AlertTriangle size={17} />} label="Pending reviews" value={loading ? '...' : stats?.pendingReviews ?? 0} />
      </div>

      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-base font-semibold text-slate-900">Client CBT overview</h2>
        <div className="mt-4 space-y-3">
          {loading ? <p className="text-sm text-slate-500">Loading CBT plans...</p> : null}
          {!loading && !plans.length && !error ? (
            <p className="rounded-xl border border-dashed border-slate-300 px-4 py-5 text-sm text-slate-500">
              No CBT care plans found for this counsellor yet.
            </p>
          ) : null}
          {plans.map((plan) => (
            <article key={plan.id} className="rounded-xl border border-slate-200 px-4 py-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-semibold text-slate-900">{plan.clientName ?? 'Client'}</h3>
                    <Badge tone={plan.status === 'active' ? 'success' : 'neutral'}>{labelFromValue(plan.status)}</Badge>
                    <Badge tone={riskTone(plan.riskLevel)}>{labelFromValue(plan.riskLevel)} risk</Badge>
                  </div>
                  <p className="mt-1 text-sm text-slate-500">{plan.title}</p>
                  <p className="mt-2 text-xs text-slate-500">
                    {Math.round(plan.completionRate)}% complete - {plan.pendingReviews} pending reviews - {plan.exerciseCount} exercises
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link to={`/counsellor/cbt/clients/${plan.clientId}`} className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">Open client</Link>
                  <Link to={`/counsellor/cbt/plans/${plan.id}`} className="rounded-lg bg-violet-600 px-3 py-2 text-sm font-semibold text-white hover:bg-violet-700">Manage plan</Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function Stat({ icon, label, value }: { icon: ReactNode; label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="flex items-center gap-2 text-xs font-semibold text-violet-700">{icon} {label}</p>
      <p className="mt-2 text-2xl font-semibold text-slate-900">{value}</p>
    </div>
  );
}

function Badge({ tone, children }: { tone: 'success' | 'warning' | 'danger' | 'neutral'; children: ReactNode }) {
  const styles = {
    success: 'bg-emerald-50 text-emerald-700',
    warning: 'bg-amber-50 text-amber-700',
    danger: 'bg-rose-50 text-rose-700',
    neutral: 'bg-slate-100 text-slate-600',
  } as const;

  return <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${styles[tone]}`}>{children}</span>;
}

function riskTone(riskLevel: string): 'success' | 'warning' | 'danger' {
  if (riskLevel === 'high') return 'danger';
  if (riskLevel === 'medium') return 'warning';
  return 'success';
}

function labelFromValue(value: string) {
  return value.replace(/_/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
}
