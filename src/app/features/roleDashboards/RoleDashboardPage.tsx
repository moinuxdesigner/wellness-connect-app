import { useEffect, useState } from 'react';
import type { Role } from '../../types';
import { DashboardSkeleton, Panel, StatCard, ToneBadge } from '../shared/components/Ui';
import { getRoleShellTitle } from './RoleDashboardLayout';
import { getRoleScenario } from '../demo/demoScenarios';
import { getCounsellorDashboardRequest, type CounsellorDashboardResponse } from '../shared/services/api';

const rolePageCopy: Record<Role, { heading: string; subtitle: string; metrics: Array<{ title: string; value: string; hint: string }>; actions: string[] }> = {
  admin: {
    heading: 'Admin Dashboard',
    subtitle: 'Operational overview across users, performance, finance, and escalations.',
    metrics: [
      { title: 'Open Escalations', value: '7', hint: '2 critical' },
      { title: 'Pending Approvals', value: '11', hint: 'Across professional roles' },
      { title: 'SLA Compliance', value: '96%', hint: 'Last 7 days' },
    ],
    actions: ['Review approvals', 'Resolve escalations', 'Monitor platform KPIs'],
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
    subtitle: 'Session schedule, assigned clients, and risk handoff in one place.',
    metrics: [
      { title: "Today's Sessions", value: '6', hint: '2 intake sessions' },
      { title: 'Assigned Clients', value: '28', hint: '4 need follow-up' },
      { title: 'Risk Flags', value: '2', hint: 'Awaiting admin review' },
    ],
    actions: ['Review session queue', 'Update case notes', 'Escalate risk case'],
  },
  trainer: {
    heading: 'Trainer Dashboard',
    subtitle: 'Trainer workflows now live in the dedicated trainer workspace dashboard.',
    metrics: [],
    actions: [],
  },
  coach: { heading: 'Coach Dashboard', subtitle: 'Goals and coaching workflows.', metrics: [], actions: [] },
  helpdesk: {
    heading: 'Help Desk Dashboard',
    subtitle: 'Ticket triage, routing, and resolution states.',
    metrics: [
      { title: 'Open Tickets', value: '23', hint: '4 high priority' },
      { title: 'First Response', value: '24m', hint: 'Current average' },
      { title: 'Resolved Today', value: '12', hint: 'Across all channels' },
    ],
    actions: ['Triage queue', 'Reassign tickets', 'Escalate SLA breach'],
  },
  finance: { heading: 'Finance Dashboard', subtitle: 'Revenue and invoices.', metrics: [], actions: [] },
  legal: { heading: 'Legal Dashboard', subtitle: 'Policy and compliance.', metrics: [], actions: [] },
  content: {
    heading: 'Content Dashboard',
    subtitle: 'Program drafting, review, and publishing workflow.',
    metrics: [
      { title: 'Draft Programs', value: '9', hint: '2 ready for review' },
      { title: 'Review Queue', value: '4', hint: '1 compliance hold' },
      { title: 'Published This Week', value: '6', hint: 'Across wellness tracks' },
    ],
    actions: ['Edit program draft', 'Submit for review', 'Publish approved update'],
  },
};

const coreRoles: Role[] = ['client', 'counsellor', 'trainer', 'helpdesk', 'admin', 'content'];

function toneFromStatus(status: 'not_started' | 'in_progress' | 'completed' | 'escalated') {
  if (status === 'completed') return 'success';
  if (status === 'in_progress') return 'warning';
  if (status === 'escalated') return 'danger';
  return 'neutral';
}

export function RoleDashboardPage({ role }: { role: Role }) {
  const page = rolePageCopy[role];
  const [counsellorDashboard, setCounsellorDashboard] = useState<CounsellorDashboardResponse | null>(null);
  const [loadingCounsellorDashboard, setLoadingCounsellorDashboard] = useState(role === 'counsellor');
  const [counsellorDashboardError, setCounsellorDashboardError] = useState<string | null>(null);
  const scenario = role !== 'counsellor' && coreRoles.includes(role) ? getRoleScenario(role as 'client' | 'trainer' | 'helpdesk' | 'admin' | 'content') : undefined;
  const counsellorErrorMetrics = [
    { title: "Today's Sessions", value: '-', hint: 'Unable to load live data' },
    { title: 'Assigned Clients', value: '-', hint: 'Unable to load live data' },
    { title: 'Risk Flags', value: '-', hint: 'Unable to load live data' },
  ];
  const metrics = role === 'counsellor'
    ? (counsellorDashboard?.metrics ?? counsellorErrorMetrics)
    : page.metrics;
  const actions = role === 'counsellor'
    ? (counsellorDashboard?.actions ?? ['Refresh dashboard data'])
    : page.actions;
  const flowReadiness = role === 'counsellor' ? counsellorDashboard?.flowReadiness : scenario;

  useEffect(() => {
    if (role !== 'counsellor') {
      setCounsellorDashboard(null);
      setLoadingCounsellorDashboard(false);
      setCounsellorDashboardError(null);
      return;
    }

    let isMounted = true;
    setLoadingCounsellorDashboard(true);
    setCounsellorDashboardError(null);

    getCounsellorDashboardRequest()
      .then((dashboard) => {
        if (isMounted) setCounsellorDashboard(dashboard);
      })
      .catch((error: unknown) => {
        if (!isMounted) return;
        setCounsellorDashboardError(error instanceof Error ? error.message : 'Unable to load counsellor dashboard');
        setCounsellorDashboard(null);
      })
      .finally(() => {
        if (isMounted) setLoadingCounsellorDashboard(false);
      });

    return () => {
      isMounted = false;
    };
  }, [role]);

  return (
    <div className="space-y-6">
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600">{getRoleShellTitle(role)}</p>
        <h1 className="mt-1 text-2xl font-semibold text-slate-900">{page.heading}</h1>
        <p className="mt-1 text-sm text-slate-600">{page.subtitle}</p>
      </div>

      {counsellorDashboardError ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {counsellorDashboardError}
        </div>
      ) : null}

      {role === 'counsellor' && loadingCounsellorDashboard ? (
        <DashboardSkeleton statCount={3} panelCount={2} />
      ) : null}

      {(!loadingCounsellorDashboard || role !== 'counsellor') && metrics.length ? (
        <section className="grid gap-4 md:grid-cols-3">
          {metrics.map((item) => (
            <StatCard key={item.title} title={item.title} value={item.value} hint={item.hint} />
          ))}
        </section>
      ) : null}

      {(!loadingCounsellorDashboard || role !== 'counsellor') && actions.length ? (
        <Panel title="Next Actions">
          <div className="grid gap-2 sm:grid-cols-3">
            {actions.map((action) => (
              <div key={action} className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700">
                {action}
              </div>
            ))}
          </div>
        </Panel>
      ) : null}

      {(!loadingCounsellorDashboard || role !== 'counsellor') && flowReadiness ? (
        <Panel title="Flow Readiness">
          <div className="space-y-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Happy path</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {flowReadiness.happyPath.map((step) => (
                  <ToneBadge key={step.id} tone={toneFromStatus(step.status)}>{step.title}</ToneBadge>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Exception path</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {flowReadiness.exceptionPath.map((step) => (
                  <ToneBadge key={step.id} tone={toneFromStatus(step.status)}>{step.title}</ToneBadge>
                ))}
              </div>
            </div>
          </div>
        </Panel>
      ) : !loadingCounsellorDashboard || role !== 'counsellor' ? (
        <Panel title="Implementation Status">
          <ToneBadge tone="warning">Route shell</ToneBadge>
          <p className="mt-3 text-sm text-slate-600">Domain workflows can be built behind this role after MVP demo phase.</p>
        </Panel>
      ) : null}
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
      </Panel>
    </div>
  );
}
