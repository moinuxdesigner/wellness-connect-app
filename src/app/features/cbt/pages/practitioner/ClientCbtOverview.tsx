import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import { CbtPlanCard } from '../../components/CbtPlanCard';
import { ProgressChart } from '../../components/ProgressChart';
import { getClientCbtPlans, getPlanCbtProgress } from '../../services/cbtApi';
import type { CbtCarePlan, CbtProgress } from '../../types/cbt.types';

export default function ClientCbtOverview() {
  const clientId = Number(useParams().clientId ?? 2);
  const [plans, setPlans] = useState<CbtCarePlan[]>([]);
  const [progress, setProgress] = useState<CbtProgress | null>(null);

  useEffect(() => {
    void getClientCbtPlans(clientId).then(async (items) => {
      setPlans(items);
      if (items[0]) setProgress(await getPlanCbtProgress(items[0].id));
    });
  }, [clientId]);

  const activePlan = plans[0];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Client CBT Overview</h1>
          <p className="mt-1 text-sm text-slate-500">Client #{clientId} care plan, progress, and review context.</p>
        </div>
        <Link to={`/counsellor/cbt/clients/${clientId}/create-plan`} className="rounded-lg bg-violet-600 px-3 py-2 text-sm font-semibold text-white hover:bg-violet-700">Create plan</Link>
      </div>
      {activePlan ? <CbtPlanCard plan={activePlan} /> : <Empty text="No CBT plan for this client yet." />}
      <ProgressChart progress={progress} />
      <div className="grid gap-3 md:grid-cols-2">
        {plans.map((plan) => <Link key={plan.id} to={`/counsellor/cbt/plans/${plan.id}`} className="rounded-2xl border border-slate-200 bg-white p-4 text-sm font-semibold text-slate-800 shadow-sm hover:border-violet-200">Manage {plan.title}</Link>)}
      </div>
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-5 text-sm text-slate-500">{text}</div>;
}
