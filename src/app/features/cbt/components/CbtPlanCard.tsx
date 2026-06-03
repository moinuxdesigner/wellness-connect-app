import { CalendarDays, Target } from 'lucide-react';
import type { CbtCarePlan } from '../types/cbt.types';
import { RiskAlertBadge } from './RiskAlertBadge';

export function CbtPlanCard({ plan }: { plan: CbtCarePlan }) {
  return (
    <article className="rounded-2xl border border-violet-100 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-violet-600">CBT Care Plan</p>
          <h2 className="mt-1 text-lg font-semibold text-slate-900">{plan.title}</h2>
          <p className="mt-2 max-w-2xl text-sm text-slate-600">{plan.description}</p>
        </div>
        <RiskAlertBadge level={plan.riskLevel} />
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl bg-violet-50 p-3">
          <p className="flex items-center gap-2 text-xs font-semibold text-violet-700"><Target size={14} /> Primary goal</p>
          <p className="mt-1 text-sm text-slate-700">{plan.primaryGoal ?? 'Goal to be set'}</p>
        </div>
        <div className="rounded-xl bg-slate-50 p-3">
          <p className="flex items-center gap-2 text-xs font-semibold text-slate-600"><CalendarDays size={14} /> Plan window</p>
          <p className="mt-1 text-sm text-slate-700">{plan.startDate ?? 'Today'} to {plan.endDate ?? 'ongoing'}</p>
        </div>
        <div className="rounded-xl bg-indigo-50 p-3">
          <p className="text-xs font-semibold text-indigo-700">Review rhythm</p>
          <p className="mt-1 text-sm capitalize text-slate-700">{plan.reviewFrequency ?? 'weekly'}</p>
        </div>
      </div>
    </article>
  );
}
