import { AlertTriangle, CalendarDays, UserRound } from 'lucide-react';
import { Panel, ToneBadge } from '../shared/components/Ui';

const clients = [
  { name: 'Riya Shah', lastSession: '2026-05-10', risk: 'normal', nextAction: 'Follow-up check-in' },
  { name: 'Vivek Menon', lastSession: '2026-05-09', risk: 'watch', nextAction: 'Sleep plan adjustment' },
  { name: 'Ananya Das', lastSession: '2026-05-11', risk: 'high', nextAction: 'Escalate to admin workflow' },
];

function riskTone(risk: string): 'success' | 'warning' | 'danger' | 'neutral' {
  if (risk === 'high') return 'danger';
  if (risk === 'watch') return 'warning';
  if (risk === 'normal') return 'success';
  return 'neutral';
}

export default function CounsellorClientsPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-violet-100 bg-gradient-to-br from-violet-50 via-white to-indigo-50 p-6">
        <h1 className="text-2xl font-semibold text-slate-900">Client Summary</h1>
        <p className="mt-2 text-sm text-slate-600">Quick clinical context and risk visibility for each assigned client.</p>
      </section>

      <Panel title="Assigned Clients">
        <div className="space-y-3">
          {clients.map((client) => (
            <article key={client.name} className="rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="flex items-center gap-2 text-sm font-semibold text-slate-900"><UserRound size={15} />{client.name}</p>
                  <p className="mt-2 flex items-center gap-2 text-xs text-slate-500"><CalendarDays size={14} />Last session: {client.lastSession}</p>
                </div>
                <ToneBadge tone={riskTone(client.risk)}>{client.risk}</ToneBadge>
              </div>
              <div className="mt-3 rounded-xl border border-amber-100 bg-amber-50/50 px-3 py-2 text-sm text-slate-700">
                <p className="flex items-center gap-2"><AlertTriangle size={14} className="text-amber-600" />Next action: {client.nextAction}</p>
              </div>
            </article>
          ))}
        </div>
      </Panel>
    </div>
  );
}
