import { useEffect, useState } from 'react';
import { Link, Navigate, Outlet } from 'react-router';
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
import { clearAuthState, getAuthState } from '../auth/auth';
import { meRequest } from '../auth/apiAuth';
import { hasPermission } from '../auth/permissions';

export const adminNavItems = [
  { label: 'Dashboard', to: '/admin', icon: LayoutPanelTop, end: true, permission: 'admin.dashboard.view' },
  { label: 'User Management', to: '/admin/users', icon: Users, permission: 'admin.users.manage' },
  { label: 'Role Management', to: '/admin/roles', icon: UserCog, permission: 'admin.roles.manage' },
  { label: 'Permission Matrix', to: '/admin/permissions', icon: Lock, permission: 'admin.permissions.manage' },
  { label: 'Professional Approvals', to: '/admin/approvals', icon: UserCheck, permission: 'admin.approvals.manage' },
  { label: 'Trainer Applications', to: '/admin/trainer-applications', icon: UserRoundCheck, permission: 'admin.trainer_applications.manage' },
  { label: 'Workflow Configuration', to: '/admin/workflows', icon: ListChecks },
  { label: 'Revenue Reports', to: '/admin/revenue', icon: BadgeIndianRupee },
  { label: 'Usage Metrics', to: '/admin/usage', icon: BarChart3, permission: 'admin.usage.view' },
  { label: 'Performance Dashboard', to: '/admin/performance', icon: Gauge },
  { label: 'Platform Health', to: '/admin/health', icon: ShieldCheck },
  { label: 'Escalations', to: '/admin/escalations', icon: ShieldAlert, permission: 'admin.escalations.view' },
  { label: 'Program Management', to: '/admin/programs', icon: BookOpen, permission: 'admin.programs.view' },
  { label: 'Membership Plans', to: '/admin/memberships', icon: ClipboardList, permission: 'admin.memberships.manage' },
  { label: 'Activity Logs', to: '/admin/logs', icon: Activity },
];

export function AdminLayout() {
  const [sessionState, setSessionState] = useState<'checking' | 'authenticated' | 'invalid'>('checking');

  useEffect(() => {
    let mounted = true;
    const auth = getAuthState();

    if (!auth.token || auth.token.startsWith('demo-token-')) {
      clearAuthState();
      setSessionState('invalid');
      return () => {
        mounted = false;
      };
    }

    void meRequest()
      .then(() => {
        if (!mounted) return;
        setSessionState('authenticated');
      })
      .catch(() => {
        if (mounted) setSessionState('invalid');
      });

    return () => {
      mounted = false;
    };
  }, []);

  if (sessionState === 'checking') {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-sm font-medium text-slate-500">Verifying admin session...</p>
      </main>
    );
  }

  if (sessionState === 'invalid') {
    return <Navigate to="/login" replace state={{ authNotice: 'Your admin session is not valid for database access. Please sign in again.' }} />;
  }

  const user = getAuthState().user;
  const visibleNavItems = adminNavItems.filter((item) => (
    item.permission ? hasPermission(user, item.permission) : user?.role === 'admin'
  ));

  return <DashboardLayout navItems={visibleNavItems} title="Admin Console"><Outlet /></DashboardLayout>;
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
