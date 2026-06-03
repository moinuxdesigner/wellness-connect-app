import type { ReactNode } from 'react';

export function DSCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <section className={`rounded-2xl border border-[var(--ds-border)] bg-white p-4 shadow-sm dark:bg-slate-900/80 ${className}`}>{children}</section>;
}

export function DSButton({ children, className = '', ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`inline-flex min-h-11 items-center justify-center rounded-xl bg-[var(--ds-brand)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--ds-brand-strong)] disabled:cursor-not-allowed disabled:opacity-60 dark:text-slate-950 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function DSSecondaryButton({ children, className = '', ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`inline-flex min-h-11 items-center justify-center rounded-xl border border-[var(--ds-border)] bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
