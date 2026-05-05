import { Calendar, ClipboardList, HeartPulse, ListChecks, UserCircle } from 'lucide-react';
import { Outlet } from 'react-router';
import DashboardLayout from '../../layout/DashboardLayout';

export const clientNavItems = [
  { label: 'Dashboard', to: '/client', icon: HeartPulse, end: true },
  { label: 'Intake', to: '/client/intake', icon: ListChecks },
  { label: 'My Appointments', to: '/client/appointments', icon: Calendar },
  { label: 'My Programs', to: '/client/programs', icon: ClipboardList },
  { label: 'Profile', to: '/client/profile', icon: UserCircle },
];

export function ClientLayout() {
  return <DashboardLayout navItems={clientNavItems} title="Client Portal"><Outlet /></DashboardLayout>;
}

export function ClientPageTitle({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-5">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
        <p className="mt-1 text-sm text-slate-600">{subtitle}</p>
      </div>
    </div>
  );
}
