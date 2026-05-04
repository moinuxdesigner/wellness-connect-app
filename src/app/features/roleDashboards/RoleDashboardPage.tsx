import type { Role } from '../../types';
import { Panel, StatCard, ToneBadge } from '../shared/components/Ui';
import { getRoleShellTitle } from './RoleDashboardLayout';

const rolePageCopy: Record<Role, { heading: string; subtitle: string; metrics: Array<{ title: string; value: string; hint: string }>; actions: string[] }> = {
  admin: {
    heading: 'Admin Dashboard',
    subtitle: 'Operational overview across users, performance, finance, and escalations.',
    metrics: [],
    actions: [],
  },
  client: {
    heading: 'Client Dashboard',
    subtitle: 'A starting point for appointments, wellness programs, and care team updates.',
    metrics: [
      { title: 'Upcoming Sessions', value: '2', hint: 'Counselling and training' },
      { title: 'Active Programs', value: '3', hint: 'Personalized wellness plans' },
      { title: 'Care Updates', value: '5', hint: 'Unread team notes' },
    ],
    actions: ['Book a session', 'Review program progress', 'Message support'],
  },
  counsellor: {
    heading: 'Counsellor Dashboard',
    subtitle: 'Session schedule, assigned clients, and follow-up work in one place.',
    metrics: [
      { title: "Today's Sessions", value: '6', hint: '2 intake appointments' },
      { title: 'Assigned Clients', value: '28', hint: '4 need follow-up' },
      { title: 'Open Notes', value: '7', hint: 'Pending completion' },
    ],
    actions: ['Review session queue', 'Update case notes', 'Escalate a risk case'],
  },
  trainer: {
    heading: 'Trainer Dashboard',
    subtitle: 'Training plans, check-ins, and client progress placeholders.',
    metrics: [
      { title: 'Active Plans', value: '18', hint: '5 updated this week' },
      { title: 'Check-ins Due', value: '9', hint: 'Across fitness clients' },
      { title: 'Completion Rate', value: '82%', hint: 'Weekly plan adherence' },
    ],
    actions: ['Create a workout plan', 'Log a check-in', 'Review adherence'],
  },
  coach: {
    heading: 'Coach Dashboard',
    subtitle: 'Goals, habit tracking, and coaching messages placeholders.',
    metrics: [
      { title: 'Active Goals', value: '34', hint: '12 close to completion' },
      { title: 'Messages', value: '11', hint: 'Awaiting reply' },
      { title: 'Milestones', value: '6', hint: 'Reached this week' },
    ],
    actions: ['Review goal updates', 'Send coaching feedback', 'Plan next milestone'],
  },
  helpdesk: {
    heading: 'Help Desk Dashboard',
    subtitle: 'Ticket intake, triage, and support queue placeholders.',
    metrics: [
      { title: 'Open Tickets', value: '23', hint: '4 high priority' },
      { title: 'First Response', value: '24m', hint: 'Current average' },
      { title: 'Resolved Today', value: '12', hint: 'Across all channels' },
    ],
    actions: ['Triage new tickets', 'Update knowledge base', 'Escalate priority case'],
  },
  finance: {
    heading: 'Finance Dashboard',
    subtitle: 'Revenue, subscriptions, invoices, and reconciliation placeholders.',
    metrics: [
      { title: 'Monthly Revenue', value: 'Rs 8.4L', hint: '+12% from last month' },
      { title: 'Open Invoices', value: '31', hint: '7 overdue' },
      { title: 'Refund Queue', value: '5', hint: 'Pending review' },
    ],
    actions: ['Review revenue report', 'Resolve invoices', 'Audit refunds'],
  },
  legal: {
    heading: 'Legal Dashboard',
    subtitle: 'Policy review, compliance checks, and approval queue placeholders.',
    metrics: [
      { title: 'Policy Reviews', value: '8', hint: '3 due this week' },
      { title: 'Approvals', value: '14', hint: 'Awaiting legal review' },
      { title: 'Compliance Tasks', value: '6', hint: 'Open controls' },
    ],
    actions: ['Review policy change', 'Approve professional terms', 'Check audit queue'],
  },
  content: {
    heading: 'Content Dashboard',
    subtitle: 'Program content, assets, and publishing workflow placeholders.',
    metrics: [
      { title: 'Draft Programs', value: '9', hint: '2 ready for review' },
      { title: 'Assets', value: '46', hint: 'Wellness library items' },
      { title: 'Publishing Queue', value: '4', hint: 'Scheduled this week' },
    ],
    actions: ['Edit program content', 'Review assets', 'Publish approved content'],
  },
};

export function RoleDashboardPage({ role }: { role: Role }) {
  const page = rolePageCopy[role];

  return (
    <div className="space-y-6">
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600">{getRoleShellTitle(role)}</p>
        <h1 className="mt-1 text-2xl font-semibold text-slate-900">{page.heading}</h1>
        <p className="mt-1 text-sm text-slate-600">{page.subtitle}</p>
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        {page.metrics.map((item) => (
          <StatCard key={item.title} title={item.title} value={item.value} hint={item.hint} />
        ))}
      </section>

      <Panel title="Next Actions">
        <div className="grid gap-2 sm:grid-cols-3">
          {page.actions.map((action) => (
            <div key={action} className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700">
              {action}
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="Implementation Status">
        <ToneBadge tone="warning">Route shell</ToneBadge>
        <p className="mt-3 text-sm text-slate-600">
          This workspace is connected to authentication. Domain data and workflows can now be built behind this role.
        </p>
      </Panel>
    </div>
  );
}

export function RolePlaceholderPage({ role, title }: { role: Role; title: string }) {
  return (
    <div className="space-y-6">
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600">{getRoleShellTitle(role)}</p>
        <h1 className="mt-1 text-2xl font-semibold text-slate-900">{title}</h1>
        <p className="mt-1 text-sm text-slate-600">This route is ready for backend integration and detailed workflow screens.</p>
      </div>
      <Panel title="Route Status">
        <ToneBadge tone="neutral">Placeholder</ToneBadge>
        <p className="mt-3 text-sm text-slate-600">Navigation, authentication, and role access are wired for this module.</p>
      </Panel>
    </div>
  );
}
