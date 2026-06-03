import { Activity, Brain, Calendar, ClipboardList, HeartPulse, ListChecks, UserCircle2 } from 'lucide-react';
import { Outlet } from 'react-router';
import DashboardLayout from '../../layout/DashboardLayout';
import { getAuthState } from '../auth/auth';
import { hasPermission } from '../auth/permissions';
import type { NavItem } from '../../layout/Sidebar';

export const clientNavItems = [
  { label: 'Home', to: '/client', icon: HeartPulse, end: true },
  { label: 'Book Appointment', to: '/client/intake', icon: ListChecks, permission: 'client.intake.manage' },
  { label: 'Calendar', to: '/client/appointments', icon: Calendar, permission: 'client.appointments.view' },
  { label: 'CBT Care', to: '/client/cbt', icon: Brain, permission: 'client.cbt.view' },
  { label: 'Progress', to: '/client/programs', icon: Activity },
  { label: 'Profile', to: '/client/profile', icon: UserCircle2 },
  { label: 'Membership', to: '/client/membership', icon: ClipboardList, permission: 'client.memberships.manage' },
  { label: 'Activity', to: '/client/activity', icon: Activity, permission: 'client.activity_logs.view' },
];

const clientBottomNavItems: NavItem[] = [
  { label: 'Home', to: '/client', icon: HeartPulse, end: true },
  { label: 'Appointments', to: '/client/appointments', icon: Calendar, permission: 'client.appointments.view' },
  { label: 'CBT', to: '/client/cbt', icon: Brain, permission: 'client.cbt.view' },
  { label: 'Progress', to: '/client/programs', icon: Activity },
];

export function ClientLayout() {
  const user = getAuthState().user;
  const allowedNavItems = clientNavItems.filter((item) => !item.permission || hasPermission(user, item.permission));
  const allowedBottomNavItems = clientBottomNavItems.filter((item) => !item.permission || hasPermission(user, item.permission));

  return (
    <DashboardLayout navItems={allowedNavItems} bottomNavItems={allowedBottomNavItems} title="Client Portal">
      <Outlet />
    </DashboardLayout>
  );
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
