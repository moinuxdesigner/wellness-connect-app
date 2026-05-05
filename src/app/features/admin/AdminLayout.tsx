import { Link, Outlet } from 'react-router';
import {
  Activity,
  BadgeIndianRupee,
  BarChart3,
  BookOpen,
  ClipboardList,
  Gauge,
  LayoutPanelTop,
  ListChecks,
  Lock,
  ShieldAlert,
  ShieldCheck,
  UserRoundCheck,
  UserCheck,
  UserCog,
  Users,
} from 'lucide-react';
import DashboardLayout from '../../layout/DashboardLayout';

export const adminNavItems = [
  { label: 'Dashboard', to: '/admin', icon: LayoutPanelTop, end: true },
  { label: 'User Management', to: '/admin/users', icon: Users },
  { label: 'Role Management', to: '/admin/roles', icon: UserCog },
  { label: 'Permission Matrix', to: '/admin/permissions', icon: Lock },
  { label: 'Professional Approvals', to: '/admin/approvals', icon: UserCheck },
  { label: 'Trainer Applications', to: '/admin/trainer-applications', icon: UserRoundCheck },
  { label: 'Workflow Configuration', to: '/admin/workflows', icon: ListChecks },
  { label: 'Revenue Reports', to: '/admin/revenue', icon: BadgeIndianRupee },
  { label: 'Usage Metrics', to: '/admin/usage', icon: BarChart3 },
  { label: 'Performance Dashboard', to: '/admin/performance', icon: Gauge },
  { label: 'Platform Health', to: '/admin/health', icon: ShieldCheck },
  { label: 'Escalations', to: '/admin/escalations', icon: ShieldAlert },
  { label: 'Program Management', to: '/admin/programs', icon: BookOpen },
  { label: 'Membership Plans', to: '/admin/memberships', icon: ClipboardList },
  { label: 'Activity Logs', to: '/admin/logs', icon: Activity },
];

export function AdminLayout() {
  return <DashboardLayout navItems={adminNavItems} title="Admin Console"><Outlet /></DashboardLayout>;
}

export function PageTitle({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-5 flex items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
        <p className="mt-1 text-sm text-slate-600">{subtitle}</p>
      </div>
      <Link to="/admin" className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-white">Overview</Link>
    </div>
  );
}
