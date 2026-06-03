import { Clock3, FileText } from 'lucide-react';
import { Link } from 'react-router';
import type { CbtExerciseInstance, CbtPlanExercise } from '../types/cbt.types';

function statusClasses(status: string) {
  if (status === 'reviewed' || status === 'completed') return 'bg-emerald-100 text-emerald-700';
  if (status === 'in_progress') return 'bg-amber-100 text-amber-700';
  if (status === 'missed') return 'bg-rose-100 text-rose-700';
  return 'bg-violet-100 text-violet-700';
}

export function ExerciseCard({ instance, to }: { instance: CbtExerciseInstance; to?: string }) {
  const title = instance.template?.title ?? instance.planExercise?.title ?? 'CBT Exercise';
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="flex items-center gap-2 text-sm font-semibold text-slate-900"><FileText size={15} /> {title}</p>
          <p className="mt-2 flex items-center gap-1 text-xs text-slate-500"><Clock3 size={13} /> Due {instance.dueAt ? new Date(instance.dueAt).toLocaleString() : instance.scheduledDate}</p>
        </div>
        <span className={`rounded-full px-2 py-1 text-xs font-semibold ${statusClasses(instance.status)}`}>{instance.status.replace('_', ' ')}</span>
      </div>
      {instance.response?.review?.feedbackToClient ? (
        <p className="mt-3 rounded-xl bg-violet-50 px-3 py-2 text-sm text-violet-800">{instance.response.review.feedbackToClient}</p>
      ) : null}
      {to ? <Link to={to} className="mt-4 inline-flex rounded-lg bg-violet-600 px-3 py-2 text-sm font-semibold text-white hover:bg-violet-700">Open exercise</Link> : null}
    </article>
  );
}

export function AssignedExerciseCard({ exercise }: { exercise: CbtPlanExercise }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-900">{exercise.title}</p>
          <p className="mt-1 text-xs text-slate-500">{exercise.frequency} practice, priority {exercise.priority}</p>
        </div>
        <span className={`rounded-full px-2 py-1 text-xs font-semibold ${statusClasses(exercise.status)}`}>{exercise.status}</span>
      </div>
      <p className="mt-3 text-sm text-slate-600">{exercise.instructions}</p>
    </article>
  );
}
