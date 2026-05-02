import type { ReactNode } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-emerald-50 px-4 py-10">
      <div className="mx-auto max-w-md">{children}</div>
    </div>
  );
}
