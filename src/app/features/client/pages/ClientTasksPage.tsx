import { CheckCircle2, Circle, Clock3 } from 'lucide-react';
import { ClientPageTitle } from '../ClientLayout';

const pendingTasks = [
  { id: 'T-101', title: 'Complete morning mood check-in', due: 'Today, 6:00 PM', priority: 'High' },
  { id: 'T-102', title: 'Upload post-workout notes', due: 'Tomorrow, 9:00 AM', priority: 'Medium' },
  { id: 'T-103', title: 'Review counsellor guidance', due: 'Tomorrow, 7:00 PM', priority: 'Low' },
];

export default function ClientTasksPage() {
  return (
    <div className="mx-auto w-full max-w-5xl space-y-4 pb-2">
      <ClientPageTitle title="Pending Tasks" subtitle="Track and complete your upcoming wellness actions." />

      <section className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
        <div className="space-y-3">
          {pendingTasks.map((task) => (
            <article key={task.id} className="rounded-xl border border-slate-200 bg-slate-50/70 p-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{task.title}</p>
                  <p className="mt-1 inline-flex items-center gap-1 text-xs text-slate-500">
                    <Clock3 size={13} /> {task.due}
                  </p>
                </div>
                <span className="rounded-full bg-indigo-100 px-2 py-1 text-xs font-semibold text-indigo-700">{task.priority}</span>
              </div>
              <div className="mt-3 flex items-center gap-2 text-xs text-slate-600">
                <Circle size={14} /> Mark as complete
              </div>
            </article>
          ))}
        </div>

        <div className="mt-4 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">
          <p className="inline-flex items-center gap-2"><CheckCircle2 size={15} /> Completing these tasks helps your care team personalize support.</p>
        </div>
      </section>
    </div>
  );
}
