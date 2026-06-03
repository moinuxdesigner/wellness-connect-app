import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { AlertTriangle, Brain, ClipboardList, Users } from 'lucide-react';
import { getClientCbtPlans, getPlanCbtProgress, getPlanCbtResponses } from '../../services/cbtApi';
import type { CbtCarePlan, CbtExerciseResponse, CbtProgress } from '../../types/cbt.types';

const demoClientId = 2;

export default function PractitionerCbtDashboard() {
  const [plan, setPlan] = useState<CbtCarePlan | null>(null);
  const [progress, setProgress] = useState<CbtProgress | null>(null);
  const [responses, setResponses] = useState<CbtExerciseResponse[]>([]);

  useEffect(() => {
    void getClientCbtPlans(demoClientId).then(async (plans) => {
      const activePlan = plans[0] ?? null;
      setPlan(activePlan);
      if (activePlan) {
        setProgress(await getPlanCbtProgress(activePlan.id));
        setResponses(await getPlanCbtResponses(activePlan.id));
      }
    });
  }, []);

  return (
    <div className="space-y-5">
      <section className="rounded-3xl border border-violet-100 bg-gradient-to-br from-violet-50 via-white to-indigo-50 p-6">
        <p className="flex items-center gap-2 text-sm font-semibold text-violet-700"><Brain size={17} /> Counsellor CBT Workspace</p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-900">CBT care planning and review</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-600">Create care plans, assign structured CBT exercises, review client submissions, and monitor progress.</p>
      </section>
      <div className="grid gap-4 md:grid-cols-3">
        <Stat icon={<Users size={17} />} label="Active plans" value={plan ? 1 : 0} />
        <Stat icon={<ClipboardList size={17} />} label="Completion" value={`${Math.round(progress?.completionRate ?? 0)}%`} />
        <Stat icon={<AlertTriangle size={17} />} label="Pending reviews" value={progress?.pendingReviews ?? responses.filter((item) => !item.review).length} />
      </div>
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-slate-900">Demo client CBT overview</h2>
            <p className="mt-1 text-sm text-slate-500">{plan?.clientName ?? 'Client User'} · {plan?.title ?? 'No plan yet'}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link to={`/counsellor/cbt/clients/${demoClientId}`} className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">Open client</Link>
            {plan ? <Link to={`/counsellor/cbt/plans/${plan.id}`} className="rounded-lg bg-violet-600 px-3 py-2 text-sm font-semibold text-white hover:bg-violet-700">Manage plan</Link> : null}
          </div>
        </div>
      </section>
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="flex items-center gap-2 text-xs font-semibold text-violet-700">{icon} {label}</p>
      <p className="mt-2 text-2xl font-semibold text-slate-900">{value}</p>
    </div>
  );
}
