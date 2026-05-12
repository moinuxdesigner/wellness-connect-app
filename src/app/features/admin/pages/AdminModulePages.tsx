import { useEffect, useMemo, useRef, useState } from 'react';
import * as echarts from 'echarts';
import { PageTitle } from '../AdminLayout';
import { Panel, ToneBadge } from '../../shared/components/Ui';
import { getAdminActivities, getAdminEscalations, getAdminOverview, getAdminPrograms, getAdminUsers } from '../../shared/services/adminApi';
import type { AppointmentSummary, ProgramSummary, Role, TicketSummary, UserSummary } from '../../../types';

type RoleDistributionItem = {
  role: Role;
  users: number;
  status: 'healthy' | 'attention' | 'needs-review';
};

function toneByUserStatus(status: UserSummary['status']) {
  return status === 'active' ? 'success' : status === 'pending' ? 'warning' : 'danger';
}

function toneByRoleStatus(status: RoleDistributionItem['status']) {
  return status === 'healthy' ? 'success' : 'warning';
}

export function UserManagementPage() {
  const [users, setUsers] = useState<UserSummary[]>([]);

  useEffect(() => {
    getAdminUsers().then(setUsers);
  }, []);

  return (
    <div className="space-y-6">
      <PageTitle title="User Management" subtitle="Manage member and staff lifecycle." />
      <Panel title="All Users">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-slate-500"><tr><th className="py-2">Name</th><th className="py-2">Email</th><th className="py-2">Role</th><th className="py-2">Status</th></tr></thead>
            <tbody>{users.map((u) => <tr key={u.id} className="border-t border-slate-200"><td className="py-2 font-medium text-slate-900">{u.name}</td><td className="py-2 text-slate-600">{u.email}</td><td className="py-2 capitalize">{u.role}</td><td className="py-2"><ToneBadge tone={toneByUserStatus(u.status)}>{u.status}</ToneBadge></td></tr>)}</tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}

export function RoleManagementPage() {
  const [roles, setRoles] = useState<RoleDistributionItem[]>([]);

  useEffect(() => {
    getAdminOverview().then((data) => setRoles((data.role_distribution ?? []) as RoleDistributionItem[]));
  }, []);

  return <SimpleList title="Role Management" subtitle="Manage role distribution and staffing." items={roles.map((r) => `${r.role}: ${r.users} users (${r.status})`)} />;
}

export function PermissionMatrixPage() {
  return <SimpleList title="Permission Matrix" subtitle="RBAC placeholder for module-level permissions." items={['User read/write by role', 'Finance report visibility controls', 'Escalation visibility restrictions', 'Audit log access policy']} />;
}

export function ProfessionalApprovalsPage() {
  const [users, setUsers] = useState<UserSummary[]>([]);

  useEffect(() => {
    getAdminUsers().then(setUsers);
  }, []);

  const pending = useMemo(() => users.filter((u) => u.status === 'pending'), [users]);

  return <SimpleList title="Professional Approvals" subtitle="Review and approve counsellor, trainer, and coach applications." items={pending.map((u) => `${u.name} (${u.role}) - submitted ${u.joinedAt}`)} />;
}

export function TrainerApplicationsPage() {
  return (
    <div className="space-y-6">
      <PageTitle title="Trainer Applications" subtitle="Review trainer onboarding submissions, documents, demo videos, interviews, and approval decisions." />
      <Panel title="Application Queue">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-slate-500">
              <tr>
                <th className="py-2">Trainer</th>
                <th className="py-2">Status</th>
                <th className="py-2">Safety Score</th>
                <th className="py-2">Next Action</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Aarav Mehta', 'Under Review', '82%', 'Verify documents'],
                ['Sneha Rao', 'Skill Test Pending', '64%', 'Assign safety training'],
                ['Imran Khan', 'Interview Scheduled', '91%', 'Lead coach demo review'],
              ].map(([name, status, score, action]) => (
                <tr key={name} className="border-t border-slate-200">
                  <td className="py-2 font-medium text-slate-900">{name}</td>
                  <td className="py-2"><ToneBadge tone={status === 'Skill Test Pending' ? 'warning' : 'neutral'}>{status}</ToneBadge></td>
                  <td className="py-2 text-slate-700">{score}</td>
                  <td className="py-2 text-slate-600">{action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
      <SimpleList
        title="Review Actions"
        subtitle="Admin, lead coach, legal, and owner checkpoints."
        items={[
          'Verify ID and certificates',
          'Review demo videos',
          'Request corrections for missing or incorrect data',
          'Schedule interview or practical demo',
          'Approve, reject, suspend, or blacklist trainer',
          'Activate trainer dashboard only after admin and lead coach approval',
        ]}
      />
    </div>
  );
}

export function WorkflowConfigurationPage() {
  return <SimpleList title="Workflow Configuration" subtitle="Operational flows for booking, escalation, and follow-ups." items={['Intake assignment workflow', 'Session no-show handling', 'Critical risk escalation path', 'Cross-team follow-up SLA policy']} />;
}

export function RevenueReportsPage() {
  const monthlyRecurringRevenue = [82, 88, 94, 102, 108, 116, 122, 128, 131, 138, 146, 154];
  const monthlyOrders = [420, 460, 490, 515, 548, 576, 602, 618, 641, 668, 702, 734];
  const refundRate = [4.1, 3.9, 3.6, 3.4, 3.3, 3.1, 2.9, 2.7, 2.8, 2.6, 2.5, 2.4];

  const trendOption: echarts.EChartsOption = {
    tooltip: { trigger: 'axis' },
    grid: { left: 22, right: 20, top: 24, bottom: 24, containLabel: true },
    legend: { bottom: 0, textStyle: { color: '#475569' } },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      axisLine: { lineStyle: { color: '#cbd5e1' } },
      axisLabel: { color: '#64748b' },
    },
    yAxis: [
      {
        type: 'value',
        axisLine: { show: false },
        splitLine: { lineStyle: { color: '#e2e8f0' } },
        axisLabel: { color: '#64748b', formatter: '${value}k' },
      },
      {
        type: 'value',
        axisLine: { show: false },
        splitLine: { show: false },
        axisLabel: { color: '#64748b' },
      },
    ],
    series: [
      {
        name: 'MRR',
        type: 'line',
        smooth: true,
        data: monthlyRecurringRevenue,
        yAxisIndex: 0,
        symbol: 'circle',
        symbolSize: 7,
        itemStyle: { color: '#2563eb' },
        lineStyle: { width: 3, color: '#2563eb' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(37,99,235,0.24)' },
            { offset: 1, color: 'rgba(37,99,235,0.02)' },
          ]),
        },
      },
      {
        name: 'Orders',
        type: 'line',
        smooth: true,
        data: monthlyOrders,
        yAxisIndex: 1,
        symbol: 'none',
        itemStyle: { color: '#0ea5e9' },
        lineStyle: { width: 2, color: '#0ea5e9', type: 'dashed' },
      },
      {
        name: 'Refund %',
        type: 'line',
        smooth: true,
        data: refundRate,
        yAxisIndex: 1,
        symbol: 'none',
        itemStyle: { color: '#f97316' },
        lineStyle: { width: 2, color: '#f97316' },
      },
    ],
  };

  const planSplitOption: echarts.EChartsOption = {
    tooltip: { trigger: 'item' },
    legend: { bottom: 0, textStyle: { color: '#475569' } },
    series: [
      {
        type: 'pie',
        radius: ['58%', '78%'],
        center: ['50%', '44%'],
        avoidLabelOverlap: true,
        label: { show: false },
        data: [
          { value: 42, name: 'Premium Care', itemStyle: { color: '#2563eb' } },
          { value: 28, name: 'Mind + Body', itemStyle: { color: '#0ea5e9' } },
          { value: 18, name: 'Corporate', itemStyle: { color: '#14b8a6' } },
          { value: 12, name: 'Family', itemStyle: { color: '#94a3b8' } },
        ],
      },
    ],
    graphic: [
      { type: 'text', left: 'center', top: '37%', style: { text: '154k', fill: '#0f172a', font: '700 24px sans-serif' } },
      { type: 'text', left: 'center', top: '51%', style: { text: 'Monthly ARR', fill: '#64748b', font: '500 12px sans-serif' } },
    ],
  };

  const agingOption: echarts.EChartsOption = {
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: 22, right: 20, top: 16, bottom: 24, containLabel: true },
    xAxis: {
      type: 'value',
      axisLine: { lineStyle: { color: '#cbd5e1' } },
      splitLine: { lineStyle: { color: '#e2e8f0' } },
      axisLabel: { color: '#64748b', formatter: '${value}k' },
    },
    yAxis: {
      type: 'category',
      data: ['0-30 days', '31-60 days', '61-90 days', '90+ days'],
      axisLine: { show: false },
      axisLabel: { color: '#475569' },
    },
    series: [
      {
        type: 'bar',
        data: [44, 26, 14, 8],
        barWidth: 16,
        itemStyle: {
          borderRadius: 8,
          color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [
            { offset: 0, color: '#3b82f6' },
            { offset: 1, color: '#93c5fd' },
          ]),
        },
      },
    ],
  };

  return (
    <div className="space-y-6">
      <PageTitle title="Revenue Reports" subtitle="Finance overview powered by mock analytics data." />

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Monthly Revenue</p>
          <p className="mt-2 text-4xl font-semibold tracking-tight text-slate-900">$154K</p>
          <p className="mt-2 text-xs font-medium text-emerald-700">+12.8% vs previous month</p>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Total Orders</p>
          <p className="mt-2 text-4xl font-semibold tracking-tight text-slate-900">734</p>
          <p className="mt-2 text-xs font-medium text-emerald-700">+9.2% conversion uplift</p>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Avg. Ticket Size</p>
          <p className="mt-2 text-4xl font-semibold tracking-tight text-slate-900">$209</p>
          <p className="mt-2 text-xs font-medium text-sky-700">Stable across top plans</p>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Outstanding Invoices</p>
          <p className="mt-2 text-4xl font-semibold tracking-tight text-slate-900">$92K</p>
          <p className="mt-2 text-xs font-medium text-amber-700">Needs collection follow-up</p>
        </article>
      </section>

      <Panel title="Monthly recurring revenue trend">
        <EChart option={trendOption} height={360} />
      </Panel>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Panel title="Plan-wise revenue split">
          <EChart option={planSplitOption} height={300} />
        </Panel>
        <Panel title="Outstanding invoices aging">
          <EChart option={agingOption} height={300} />
        </Panel>
      </section>
    </div>
  );
}

export function UsageMetricsPage() {
  const [items, setItems] = useState<string[]>([]);

  useEffect(() => {
    getAdminOverview().then((data) => setItems((data.usage_metrics ?? []).map((u) => `${u.label}: ${u.value} (${u.delta})`)));
  }, []);

  return <SimpleList title="Usage Metrics" subtitle="Engagement and operational KPIs." items={items} />;
}

export function PerformanceDashboardPage() {
  return <SimpleList title="Performance Dashboard" subtitle="Platform and team performance summaries." items={['Counsellor utilization 78%', 'Trainer utilization 72%', 'Coach follow-up completion 88%', 'Help desk first response 24m']} />;
}

export function PlatformHealthPage() {
  return <SimpleList title="Platform Health" subtitle="System and process health checkpoints." items={['Auth services: healthy', 'Booking service: healthy', 'Messaging queue: monitored', 'Escalation pipeline: healthy']} />;
}

export function EscalationsPage() {
  const [tickets, setTickets] = useState<TicketSummary[]>([]);

  useEffect(() => {
    getAdminEscalations().then(setTickets);
  }, []);

  return <SimpleList title="Escalations" subtitle="High-priority cases requiring admin action." items={tickets.filter((t) => t.priority !== 'low').map((t) => `${t.id}: ${t.title} (${t.status})`)} />;
}

export function ProgramManagementPage() {
  const [programs, setPrograms] = useState<ProgramSummary[]>([]);

  useEffect(() => {
    getAdminPrograms().then(setPrograms);
  }, []);

  return <SimpleList title="Program Management" subtitle="Manage wellness programs and lifecycle status." items={programs.map((p) => `${p.title} - ${p.category} - ${p.status}`)} />;
}

export function MembershipPlanManagementPage() {
  return <SimpleList title="Membership Plan Management" subtitle="Manage plan catalog and subscription policy placeholders." items={['Basic Care Plan', 'Mind + Body Plus Plan', 'Family Wellness Plan', 'Corporate Program Plan']} />;
}

export function ActivityLogsPage() {
  const [activities, setActivities] = useState<AppointmentSummary[]>([]);

  useEffect(() => {
    getAdminActivities().then(setActivities);
  }, []);

  return <SimpleList title="Activity Logs" subtitle="Audit and activity stream." items={activities.map((a) => `${a.id}: ${a.serviceType} ${a.status} for ${a.clientName}`)} />;
}

function SimpleList({ title, subtitle, items }: { title: string; subtitle: string; items: string[] }) {
  return (
    <div className="space-y-6">
      <PageTitle title={title} subtitle={subtitle} />
      <Panel title="Overview">
        <ul className="space-y-2 text-sm text-slate-700">
          {items.map((item) => (
            <li key={item} className="rounded-xl border border-slate-200 px-3 py-2">{item}</li>
          ))}
          {!items.length ? <li className="rounded-xl border border-slate-200 px-3 py-2 text-slate-500">No records found.</li> : null}
        </ul>
      </Panel>
    </div>
  );
}

function EChart({ option, height }: { option: echarts.EChartsOption; height: number }) {
  const chartRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;
    const instance = echarts.init(chartRef.current);
    instance.setOption(option);
    const resizeObserver = new ResizeObserver(() => instance.resize());
    resizeObserver.observe(chartRef.current);

    return () => {
      resizeObserver.disconnect();
      instance.dispose();
    };
  }, [option]);

  return <div ref={(node) => { chartRef.current = node; }} style={{ height, width: '100%' }} />;
}
