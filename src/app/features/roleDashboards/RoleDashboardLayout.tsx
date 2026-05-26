import { Outlet } from 'react-router';
import {
  Activity,
  Bell,
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
  UserCircle2,
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
    navItems: [
      { label: 'Dashboard', to: '/admin', icon: LayoutPanelTop },
      { label: 'Notifications', to: '/admin/notifications', icon: Bell },
      { label: 'Profile', to: '/admin/profile', icon: UserCircle2 },
    ],
  },
  client: {
    title: 'Client Portal',
    navItems: [
      { label: 'Dashboard', to: '/client', icon: LayoutPanelTop },
      { label: 'Notifications', to: '/client/notifications', icon: Bell },
      { label: 'Profile', to: '/client/profile', icon: UserCircle2 },
      { label: 'Appointments', to: '/client/appointments', icon: CalendarDays },
      { label: 'Programs', to: '/client/programs', icon: HeartPulse },
    ],
  },
  counsellor: {
    title: 'Counsellor Workspace',
    navItems: [
      { label: 'Dashboard', to: '/counsellor', icon: LayoutPanelTop },
      { label: 'Notifications', to: '/counsellor/notifications', icon: Bell },
      { label: 'Profile', to: '/counsellor/profile', icon: UserCircle2 },
      { label: 'Sessions', to: '/counsellor/sessions', icon: CalendarDays },
      { label: 'Clients', to: '/counsellor/clients', icon: ClipboardCheck },
      { label: 'Activity', to: '/counsellor/activity', icon: Activity, permission: 'counsellor.activity_logs.view' },
    ],
  },
  trainer: {
    title: 'Trainer Workspace',
    navItems: [
      { label: 'Dashboard', to: '/trainer', icon: LayoutPanelTop },
      { label: 'Notifications', to: '/trainer/notifications', icon: Bell },
      { label: 'Profile', to: '/trainer/profile', icon: UserCircle2 },
      { label: 'Plans', to: '/trainer/plans', icon: Dumbbell },
      { label: 'Check-ins', to: '/trainer/check-ins', icon: ClipboardCheck },
      { label: 'Activity', to: '/trainer/activity', icon: Activity, permission: 'trainer.activity_logs.view' },
    ],
  },
  coach: {
    title: 'Coach Workspace',
    navItems: [
      { label: 'Dashboard', to: '/coach', icon: LayoutPanelTop },
      { label: 'Notifications', to: '/coach/notifications', icon: Bell },
      { label: 'Profile', to: '/coach/profile', icon: UserCircle2 },
      { label: 'Goals', to: '/coach/goals', icon: Activity },
      { label: 'Messages', to: '/coach/messages', icon: MessageSquare },
      { label: 'Activity', to: '/coach/activity', icon: ClipboardList, permission: 'coach.activity_logs.view' },
    ],
  },
  helpdesk: {
    title: 'Help Desk',
    navItems: [
      { label: 'Dashboard', to: '/helpdesk', icon: LayoutPanelTop },
      { label: 'Notifications', to: '/helpdesk/notifications', icon: Bell },
      { label: 'Profile', to: '/helpdesk/profile', icon: UserCircle2 },
      { label: 'Tickets', to: '/helpdesk/tickets', icon: LifeBuoy, permission: 'helpdesk.tickets.manage' },
      { label: 'Knowledge Base', to: '/helpdesk/knowledge-base', icon: BookOpen },
      { label: 'Activity', to: '/helpdesk/activity', icon: Activity, permission: 'helpdesk.activity_logs.view' },
    ],
  },
  finance: {
    title: 'Finance Console',
    navItems: [
      { label: 'Dashboard', to: '/finance', icon: LayoutPanelTop },
      { label: 'Notifications', to: '/finance/notifications', icon: Bell },
      { label: 'Profile', to: '/finance/profile', icon: UserCircle2 },
      { label: 'Revenue', to: '/finance/revenue', icon: Store },
      { label: 'Invoices', to: '/finance/invoices', icon: FileText, permission: 'finance.invoices.view' },
      { label: 'Activity', to: '/finance/activity', icon: Activity, permission: 'finance.activity_logs.view' },
    ],
  },
  legal: {
    title: 'Legal Console',
    navItems: [
      { label: 'Dashboard', to: '/legal', icon: LayoutPanelTop },
      { label: 'Notifications', to: '/legal/notifications', icon: Bell },
      { label: 'Profile', to: '/legal/profile', icon: UserCircle2 },
      { label: 'Reviews', to: '/legal/reviews', icon: Scale },
      { label: 'Policies', to: '/legal/policies', icon: FileText },
      { label: 'Activity', to: '/legal/activity', icon: Activity, permission: 'legal.activity_logs.view' },
    ],
  },
  content: {
    title: 'Content Console',
    navItems: [
      { label: 'Dashboard', to: '/content', icon: LayoutPanelTop },
      { label: 'Notifications', to: '/content/notifications', icon: Bell },
      { label: 'Profile', to: '/content/profile', icon: UserCircle2 },
      { label: 'Programs', to: '/content/programs', icon: BookOpen },
      { label: 'Assets', to: '/content/assets', icon: FileText },
      { label: 'Activity', to: '/content/activity', icon: Activity, permission: 'content.activity_logs.view' },
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
  const navItems = [...shell.navItems.filter((item) => !item.permission || hasPermission(user, item.permission)), ...delegatedItems.filter((item) => hasPermission(user, item.permission))];

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
