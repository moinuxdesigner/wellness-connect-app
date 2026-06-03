import { useEffect, useState } from 'react';
import { CbtPlanCard } from '../../components/CbtPlanCard';
import { AssignedExerciseCard } from '../../components/ExerciseCard';
import { getMyCbtPlan } from '../../services/cbtApi';
import type { CbtCarePlan } from '../../types/cbt.types';

export default function MyCbtPlan() {
  const [plan, setPlan] = useState<CbtCarePlan | null>(null);

  useEffect(() => {
    void getMyCbtPlan().then(setPlan);
  }, []);

  if (!plan) return <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-500">No active CBT plan yet.</div>;

  return (
    <div className="mx-auto w-full max-w-6xl space-y-5">
      <CbtPlanCard plan={plan} />
      <section className="grid gap-4 lg:grid-cols-2">
        {plan.exercises.map((exercise) => <AssignedExerciseCard key={exercise.id} exercise={exercise} />)}
      </section>
    </div>
  );
}
