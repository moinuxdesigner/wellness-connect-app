import type { ReactNode } from 'react';

export function IntakeStepper({ current }: { current: 1 | 2 | 3 | 4 }) {
  const steps = ['Service', 'Intake', 'Schedule', 'Confirm'];

  return (
    <div className="grid grid-cols-4 gap-2 text-center text-xs font-medium text-slate-600">
      {steps.map((step, index) => {
        const number = index + 1;
        const active = number <= current;
        return (
          <div key={step} className="flex flex-col items-center gap-1">
            <span className={`grid h-8 w-8 place-items-center rounded-full text-sm ${active ? 'bg-[var(--ds-brand)] text-white' : 'border border-[var(--ds-border)] bg-white text-slate-500'}`}>{number}</span>
            <span>{step}</span>
          </div>
        );
      })}
    </div>
  );
}

export function MobileSectionTitle({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: ReactNode }) {
  return (
    <div className="mb-4 flex items-start justify-between gap-3">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
        {subtitle ? <p className="mt-1 text-sm text-slate-600">{subtitle}</p> : null}
      </div>
      {actions}
    </div>
  );
}
