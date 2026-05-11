import { Activity, BookOpenText, Calendar, HeartPulse, ListChecks } from 'lucide-react';
import { Outlet } from 'react-router';
import DashboardLayout from '../../layout/DashboardLayout';

export const clientNavItems = [
  { label: 'Home', to: '/client', icon: HeartPulse, end: true },
  { label: 'Services', to: '/client/intake', icon: ListChecks },
  { label: 'Calendar', to: '/client/appointments', icon: Calendar },
  { label: 'Progress', to: '/client/programs', icon: Activity },
  { label: 'Resources', to: '/client/profile', icon: BookOpenText },
];

export function ClientLayout() {
  return <DashboardLayout navItems={clientNavItems} title="Client Portal"><Outlet /></DashboardLayout>;
}

export function ClientPageTitle({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-3">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-slate-900">{title}</h1>
        <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
      </div>
    </div>
  );
}
