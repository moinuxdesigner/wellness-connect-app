import { useEffect, useState } from 'react';
import { AlertTriangle, CalendarDays, UserRound } from 'lucide-react';
import { Panel, ToneBadge } from '../shared/components/Ui';
import { getCounsellorClientsRequest, type CounsellorClientItem } from '../shared/services/api';

function riskTone(risk: string): 'success' | 'warning' | 'danger' | 'neutral' {
  if (risk === 'high') return 'danger';
  if (risk === 'watch') return 'warning';
  if (risk === 'normal') return 'success';
  return 'neutral';
}

function sessionLabel(value?: string | null) {
  return value ? value.slice(0, 10) : 'No sessions yet';
}

export default function CounsellorClientsPage() {
  const [clients, setClients] = useState<CounsellorClientItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    getCounsellorClientsRequest()
      .then((items) => {
        if (active) {
          setClients(items);
          setError('');
        }
      })
      .catch((exception) => {
        if (active) setError(exception instanceof Error ? exception.message : 'Unable to load assigned clients.');
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
      <section className="rounded-3xl border border-violet-100 bg-gradient-to-br from-violet-50 via-white to-indigo-50 p-6">
        <h1 className="text-2xl font-semibold text-slate-900">Client Summary</h1>
        <p className="mt-2 text-sm text-slate-600">Quick clinical context and risk visibility for each assigned client.</p>
      </section>

      <Panel title="Assigned Clients">
        {loading ? (
          <p className="rounded-2xl border border-slate-200 bg-white px-4 py-6 text-sm font-medium text-slate-500">Loading assigned clients...</p>
        ) : error ? (
          <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-6 text-sm font-medium text-rose-700">{error}</p>
        ) : clients.length ? (
          <div className="space-y-3">
          {clients.map((client) => (
            <article key={client.id} className="rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="flex items-center gap-2 text-sm font-semibold text-slate-900"><UserRound size={15} />{client.name}</p>
                  <p className="mt-2 flex items-center gap-2 text-xs text-slate-500"><CalendarDays size={14} />Last session: {sessionLabel(client.lastSession)}</p>
                </div>
                <ToneBadge tone={riskTone(client.risk)}>{client.risk}</ToneBadge>
              </div>
              <div className="mt-3 rounded-xl border border-amber-100 bg-amber-50/50 px-3 py-2 text-sm text-slate-700">
                <p className="flex items-center gap-2"><AlertTriangle size={14} className="text-amber-600" />Next action: {client.nextAction}</p>
              </div>
            </article>
          ))}
          </div>
        ) : (
          <p className="rounded-2xl border border-slate-200 bg-white px-4 py-6 text-sm font-medium text-slate-500">
            No assigned clients yet. Clients will appear here after they book sessions with this counsellor.
          </p>
        )}
      </Panel>
    </div>
  );
}
