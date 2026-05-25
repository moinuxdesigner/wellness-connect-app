import { Outlet } from 'react-router';
import {
  Activity,
  BookOpen,
  CalendarDays,
  ClipboardCheck,
  ClipboardList,
  Dumbbell,
  FileText,
  HeartPulse,
  LayoutPanelTop,
  LifeBuoy,
  MessageSquare,
  Scale,
  Store,
  type LucideIcon,
} from 'lucide-react';
import DashboardLayout from '../../layout/DashboardLayout';
import type { NavItem } from '../../layout/Sidebar';
import type { Role } from '../../types';
import { getAuthState } from '../auth/auth';
import { hasPermission } from '../auth/permissions';

const roleShells: Record<Role, { title: string; navItems: NavItem[] }> = {
  admin: {
    title: 'Admin Console',
    navItems: [{ label: 'Dashboard', to: '/admin', icon: LayoutPanelTop }],
  },
  client: {
    title: 'Client Portal',
    navItems: [
      { label: 'Dashboard', to: '/client', icon: LayoutPanelTop },
      { label: 'Appointments', to: '/client/appointments', icon: CalendarDays },
      { label: 'Programs', to: '/client/programs', icon: HeartPulse },
    ],
  },
  counsellor: {
    title: 'Counsellor Workspace',
    navItems: [
      { label: 'Dashboard', to: '/counsellor', icon: LayoutPanelTop },
      { label: 'Sessions', to: '/counsellor/sessions', icon: CalendarDays },
      { label: 'Clients', to: '/counsellor/clients', icon: ClipboardCheck },
    ],
  },
  trainer: {
    title: 'Trainer Workspace',
    navItems: [
      { label: 'Dashboard', to: '/trainer', icon: LayoutPanelTop },
      { label: 'Onboarding', to: '/trainer/onboarding', icon: ClipboardList },
      { label: 'Plans', to: '/trainer/plans', icon: Dumbbell },
      { label: 'Check-ins', to: '/trainer/check-ins', icon: ClipboardCheck },
    ],
  },
  coach: {
    title: 'Coach Workspace',
    navItems: [
      { label: 'Dashboard', to: '/coach', icon: LayoutPanelTop },
      { label: 'Goals', to: '/coach/goals', icon: Activity },
      { label: 'Messages', to: '/coach/messages', icon: MessageSquare },
    ],
  },
  helpdesk: {
    title: 'Help Desk',
    navItems: [
      { label: 'Dashboard', to: '/helpdesk', icon: LayoutPanelTop },
      { label: 'Tickets', to: '/helpdesk/tickets', icon: LifeBuoy },
      { label: 'Knowledge Base', to: '/helpdesk/knowledge-base', icon: BookOpen },
    ],
  },
  finance: {
    title: 'Finance Console',
    navItems: [
      { label: 'Dashboard', to: '/finance', icon: LayoutPanelTop },
      { label: 'Revenue', to: '/finance/revenue', icon: Store },
      { label: 'Invoices', to: '/finance/invoices', icon: FileText },
    ],
  },
  legal: {
    title: 'Legal Console',
    navItems: [
      { label: 'Dashboard', to: '/legal', icon: LayoutPanelTop },
      { label: 'Reviews', to: '/legal/reviews', icon: Scale },
      { label: 'Policies', to: '/legal/policies', icon: FileText },
    ],
  },
  content: {
    title: 'Content Console',
    navItems: [
      { label: 'Dashboard', to: '/content', icon: LayoutPanelTop },
      { label: 'Programs', to: '/content/programs', icon: BookOpen },
      { label: 'Assets', to: '/content/assets', icon: FileText },
    ],
  },
};

export function RoleDashboardLayout({ role }: { role: Role }) {
  const shell = roleShells[role];
  const user = getAuthState().user;
  const delegatedItems = [
    { label: 'Operations Overview', to: '/admin', icon: LayoutPanelTop, permission: 'admin.dashboard.view' },
    { label: 'Programs', to: '/admin/programs', icon: BookOpen, permission: 'admin.programs.view' },
    { label: 'Escalations', to: '/admin/escalations', icon: Activity, permission: 'admin.escalations.view' },
  ];
  const navItems = [...shell.navItems, ...delegatedItems.filter((item) => hasPermission(user, item.permission))];

  return (
    <DashboardLayout navItems={navItems} title={shell.title}>
      <Outlet />
    </DashboardLayout>
  );
}

export function getRoleShellTitle(role: Role): string {
  return roleShells[role].title;
}

export type RoleShellIcon = LucideIcon;
