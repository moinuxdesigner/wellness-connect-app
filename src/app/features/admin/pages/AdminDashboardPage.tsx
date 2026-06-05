import { useEffect, useState } from 'react';
import { PageTitle } from '../AdminLayout';
import { DashboardSkeleton, Panel, StatCard, ToneBadge } from '../../shared/components/Ui';
import { getAdminOverview } from '../../shared/services/adminApi';
import type { DashboardMetric, Role, TicketSummary } from '../../../types';

type RoleDistributionItem = {
  role: Role;
  users: number;
  status: 'healthy' | 'attention' | 'needs-review';
};

function roleTone(status: RoleDistributionItem['status']) {
  return status === 'healthy' ? 'success' : 'warning';
}

function priorityTone(priority: TicketSummary['priority']) {
  return priority === 'high' ? 'danger' : priority === 'medium' ? 'warning' : 'neutral';
}

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetric[]>([]);
  const [usage, setUsage] = useState<DashboardMetric[]>([]);
  const [roles, setRoles] = useState<RoleDistributionItem[]>([]);
  const [tickets, setTickets] = useState<TicketSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getAdminOverview()
      .then((data) => {
        if (!active) return;
        setMetrics(data.analytics ?? []);
        setUsage(data.usage_metrics ?? []);
        setRoles((data.role_distribution ?? []) as RoleDistributionItem[]);
        setTickets(data.recent_escalations ?? []);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="space-y-6">
      <PageTitle title="Admin Dashboard" subtitle="Operational overview across users, performance, finance, and escalations." />

      {loading ? <DashboardSkeleton statCount={4} panelCount={3} /> : null}

      {!loading ? (
        <>
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {metrics.map((item) => (
              <StatCard key={item.label} title={item.label} value={item.value} hint={item.delta} />
            ))}
          </section>

          <section className="grid gap-4 xl:grid-cols-2">
            <Panel title="Usage Metrics">
              <div className="grid gap-3 sm:grid-cols-2">
                {usage.map((item) => (
                  <div key={item.label} className="rounded-xl border border-slate-200 p-4">
                    <p className="text-sm text-slate-500">{item.label}</p>
                    <p className="mt-1 text-xl font-semibold text-slate-900">{item.value}</p>
                    <p className="text-xs text-slate-500">{item.delta}</p>
                  </div>
                ))}
              </div>
            </Panel>

            <Panel title="Role Distribution">
              <div className="space-y-2">
                {roles.map((item) => (
                  <div key={item.role} className="flex items-center justify-between rounded-xl border border-slate-200 px-3 py-2">
                    <div>
                      <p className="text-sm font-medium capitalize text-slate-900">{item.role}</p>
                      <p className="text-xs text-slate-500">{item.users} users</p>
                    </div>
                    <ToneBadge tone={roleTone(item.status)}>{item.status}</ToneBadge>
                  </div>
                ))}
              </div>
            </Panel>
          </section>

          <Panel title="Recent Escalations">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="text-slate-500">
                  <tr>
                    <th className="py-2">Ticket</th>
                    <th className="py-2">Title</th>
                    <th className="py-2">Priority</th>
                    <th className="py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map((ticket) => (
                    <tr key={ticket.id} className="border-t border-slate-200">
                      <td className="py-2 font-medium text-slate-800">{ticket.id}</td>
                      <td className="py-2 text-slate-600">{ticket.title}</td>
                      <td className="py-2"><ToneBadge tone={priorityTone(ticket.priority)}>{ticket.priority}</ToneBadge></td>
                      <td className="py-2 capitalize text-slate-700">{ticket.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>
        </>
      ) : null}
    </div>
  );
}
