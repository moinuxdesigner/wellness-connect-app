import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import { AssignedExerciseCard } from '../../components/ExerciseCard';
import { ProgressChart } from '../../components/ProgressChart';
import { getCbtPlan, getPlanCbtProgress } from '../../services/cbtApi';
import type { CbtCarePlan, CbtProgress } from '../../types/cbt.types';

export default function CbtProgressReport() {
  const planId = Number(useParams().planId ?? 1);
  const [plan, setPlan] = useState<CbtCarePlan | null>(null);
  const [progress, setProgress] = useState<CbtProgress | null>(null);

  useEffect(() => {
    void Promise.all([getCbtPlan(planId), getPlanCbtProgress(planId)]).then(([planData, progressData]) => {
      setPlan(planData);
      setProgress(progressData);
    });
  }, [planId]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">{plan?.title ?? 'CBT Plan'}</h1>
          <p className="mt-1 text-sm text-slate-500">Plan exercises, progress, and response reviews.</p>
        </div>
        <div className="flex gap-2">
          <Link to={`/counsellor/cbt/plans/${planId}/assign`} className="rounded-lg bg-violet-600 px-3 py-2 text-sm font-semibold text-white">Assign exercise</Link>
          <Link to={`/counsellor/cbt/plans/${planId}/reviews`} className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700">Reviews</Link>
        </div>
      </div>
      <ProgressChart progress={progress} />
      <div className="grid gap-4 lg:grid-cols-2">
        {plan?.exercises.map((exercise) => <AssignedExerciseCard key={exercise.id} exercise={exercise} />)}
      </div>
    </div>
  );
}
