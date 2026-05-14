import type { ReactNode } from 'react';

export function StatCard({ title, value, hint }: { title: string; value: string; hint: string }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm text-slate-500">{title}</p>
      <p className="mt-2 text-2xl font-semibold text-slate-900">{value}</p>
      <p className="mt-1 text-xs text-slate-500">{hint}</p>
    </article>
  );
}

export function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export function ToneBadge({ tone, children }: { tone: 'success' | 'warning' | 'danger' | 'neutral'; children: ReactNode }) {
  const styles = {
    success: 'bg-emerald-50 text-emerald-700',
    warning: 'bg-amber-50 text-amber-700',
    danger: 'bg-rose-50 text-rose-700',
    neutral: 'bg-slate-100 text-slate-700',
  } as const;

  return <span className={`inline-flex shrink-0 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${styles[tone]}`}>{children}</span>;
}
