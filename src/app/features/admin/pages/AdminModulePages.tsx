import { PageTitle } from '../AdminLayout';
import { Panel, ToneBadge } from '../../shared/components/Ui';
import { getAppointments, getPrograms, getRolesOverview, getTickets, getUsers, getUsageMetrics } from '../../shared/services/mockApi';

export function UserManagementPage() {
  const users = getUsers();
  return (
    <div className="space-y-6">
      <PageTitle title="User Management" subtitle="Manage member and staff lifecycle." />
      <Panel title="All Users">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-slate-500"><tr><th className="py-2">Name</th><th className="py-2">Email</th><th className="py-2">Role</th><th className="py-2">Status</th></tr></thead>
            <tbody>{users.map((u) => <tr key={u.id} className="border-t border-slate-200"><td className="py-2 font-medium text-slate-900">{u.name}</td><td className="py-2 text-slate-600">{u.email}</td><td className="py-2 capitalize">{u.role}</td><td className="py-2"><ToneBadge tone={u.status === 'active' ? 'success' : u.status === 'pending' ? 'warning' : 'danger'}>{u.status}</ToneBadge></td></tr>)}</tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}

export function RoleManagementPage() {
  const roles = getRolesOverview();
  return <SimpleList title="Role Management" subtitle="Manage role distribution and staffing." items={roles.map((r) => `${r.role}: ${r.users} users (${r.status})`)} />;
}

export function PermissionMatrixPage() {
  return <SimpleList title="Permission Matrix" subtitle="RBAC placeholder for module-level permissions." items={['User read/write by role', 'Finance report visibility controls', 'Escalation visibility restrictions', 'Audit log access policy']} />;
}

export function ProfessionalApprovalsPage() {
  const users = getUsers().filter((u) => u.status === 'pending');
  return <SimpleList title="Professional Approvals" subtitle="Review and approve counsellor, trainer, and coach applications." items={users.map((u) => `${u.name} (${u.role}) - submitted ${u.joinedAt}`)} />;
}

export function WorkflowConfigurationPage() {
  return <SimpleList title="Workflow Configuration" subtitle="Operational flows for booking, escalation, and follow-ups." items={['Intake assignment workflow', 'Session no-show handling', 'Critical risk escalation path', 'Cross-team follow-up SLA policy']} />;
}

export function RevenueReportsPage() {
  return <SimpleList title="Revenue Reports" subtitle="Finance overview placeholders for backend integration." items={['Monthly recurring revenue trend', 'Plan-wise revenue split', 'Refund ratio by plan', 'Outstanding invoices aging']} />;
}

export function UsageMetricsPage() {
  const usage = getUsageMetrics();
  return <SimpleList title="Usage Metrics" subtitle="Engagement and operational KPIs." items={usage.map((u) => `${u.label}: ${u.value} (${u.delta})`)} />;
}

export function PerformanceDashboardPage() {
  return <SimpleList title="Performance Dashboard" subtitle="Platform and team performance summaries." items={['Counsellor utilization 78%', 'Trainer utilization 72%', 'Coach follow-up completion 88%', 'Help desk first response 24m']} />;
}

export function PlatformHealthPage() {
  return <SimpleList title="Platform Health" subtitle="System and process health checkpoints." items={['Auth services: healthy', 'Booking service: healthy', 'Messaging queue: degraded (mock)', 'Escalation pipeline: healthy']} />;
}

export function EscalationsPage() {
  const tickets = getTickets();
  return <SimpleList title="Escalations" subtitle="High-priority cases requiring admin action." items={tickets.filter((t) => t.priority !== 'low').map((t) => `${t.id}: ${t.title} (${t.status})`)} />;
}

export function ProgramManagementPage() {
  const programs = getPrograms();
  return <SimpleList title="Program Management" subtitle="Manage wellness programs and lifecycle status." items={programs.map((p) => `${p.title} - ${p.category} - ${p.status}`)} />;
}

export function MembershipPlanManagementPage() {
  return <SimpleList title="Membership Plan Management" subtitle="Manage plan catalog and subscription policy placeholders." items={['Basic Care Plan', 'Mind + Body Plus Plan', 'Family Wellness Plan', 'Corporate Program Plan']} />;
}

export function ActivityLogsPage() {
  const appointments = getAppointments();
  return <SimpleList title="Activity Logs" subtitle="Audit and activity stream placeholders." items={appointments.map((a) => `${a.id}: ${a.serviceType} ${a.status} for ${a.clientName}`)} />;
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
        </ul>
      </Panel>
    </div>
  );
}
