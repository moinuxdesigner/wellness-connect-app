import type { CbtProgress } from '../types/cbt.types';

export function ProgressChart({ progress }: { progress: CbtProgress | null }) {
  if (!progress) {
    return <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-5 text-sm text-slate-500">Progress appears after exercises are completed.</div>;
  }

  const width = Math.min(100, Math.max(0, progress.completionRate));

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-slate-900">Progress</h2>
          <p className="mt-1 text-sm text-slate-500">{progress.completedInstances} of {progress.totalInstances} practices completed</p>
        </div>
        <span className="text-2xl font-semibold text-violet-700">{Math.round(progress.completionRate)}%</span>
      </div>
      <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100">
        <div className="h-full rounded-full bg-violet-600" style={{ width: `${width}%` }} />
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <Metric label="Before" value={progress.averageAnxietyBefore ?? '-'} />
        <Metric label="After" value={progress.averageAnxietyAfter ?? '-'} />
        <Metric label="Improvement" value={progress.improvementScore ?? '-'} />
      </div>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl bg-violet-50 p-3">
      <p className="text-xs font-semibold text-violet-700">{label}</p>
      <p className="mt-1 text-lg font-semibold text-slate-900">{value}</p>
    </div>
  );
}
