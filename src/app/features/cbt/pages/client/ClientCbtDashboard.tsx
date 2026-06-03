import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { Brain, ClipboardCheck, LineChart, Sparkles } from 'lucide-react';
import { CbtPlanCard } from '../../components/CbtPlanCard';
import { ExerciseCard } from '../../components/ExerciseCard';
import { ProgressChart } from '../../components/ProgressChart';
import { getMyCbtExercises, getMyCbtPlan, getMyCbtProgress } from '../../services/cbtApi';
import type { CbtCarePlan, CbtExerciseInstance, CbtProgress } from '../../types/cbt.types';

export default function ClientCbtDashboard() {
  const [plan, setPlan] = useState<CbtCarePlan | null>(null);
  const [exercises, setExercises] = useState<CbtExerciseInstance[]>([]);
  const [progress, setProgress] = useState<CbtProgress | null>(null);

  useEffect(() => {
    void Promise.all([getMyCbtPlan(), getMyCbtExercises(), getMyCbtProgress()]).then(([planData, exerciseData, progressData]) => {
      setPlan(planData);
      setExercises(exerciseData);
      setProgress(progressData);
    });
  }, []);

  const nextExercise = exercises.find((item) => item.status === 'pending' || item.status === 'in_progress') ?? exercises[0];

  return (
    <div className="mx-auto w-full max-w-6xl space-y-5">
      <section className="rounded-3xl border border-violet-100 bg-gradient-to-br from-violet-50 via-white to-indigo-50 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="flex items-center gap-2 text-sm font-semibold text-violet-700"><Brain size={17} /> CBT Companion</p>
            <h1 className="mt-2 text-2xl font-semibold text-slate-900">Today&apos;s therapeutic practice</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">Use your care plan to complete assigned practices, review counsellor feedback, and track progress over time.</p>
          </div>
          <Link to="/client/cbt/exercises" className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700"><ClipboardCheck size={16} /> My exercises</Link>
        </div>
      </section>

      {plan ? <CbtPlanCard plan={plan} /> : null}

      <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-base font-semibold text-slate-900">Next practice</h2>
            <Link to="/client/cbt/plan" className="text-sm font-semibold text-violet-700">View plan</Link>
          </div>
          {nextExercise ? <ExerciseCard instance={nextExercise} to={`/client/cbt/exercises/${nextExercise.id}`} /> : <EmptyState text="No CBT exercises assigned yet." />}
        </div>
        <ProgressChart progress={progress} />
      </div>

      <section className="rounded-2xl border border-indigo-100 bg-indigo-50 p-4 text-sm text-indigo-900">
        <p className="flex items-center gap-2 font-semibold"><Sparkles size={16} /> Crisis support is not replaced by this tool.</p>
        <p className="mt-1">If you feel at immediate risk, contact local emergency services or your trusted support contact.</p>
      </section>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-5 text-sm text-slate-500">{text}</div>;
}
