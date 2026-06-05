import { useEffect, useState } from 'react';
import { AlertTriangle, CalendarDays } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Panel, ToneBadge } from '../shared/components/Ui';
import { getCounsellorClientsRequest, type CounsellorClientItem } from '../shared/services/api';

function riskTone(risk: string): 'success' | 'warning' | 'danger' | 'neutral' {
  if (risk === 'high') return 'danger';
  if (risk === 'watch') return 'warning';
  if (risk === 'normal') return 'success';
  return 'neutral';
}

function riskLabel(risk: string) {
  return risk ? risk.charAt(0).toUpperCase() + risk.slice(1) : 'Unknown';
}

function initialsForName(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('') || 'WC';
}

function sessionLabel(value?: string | null) {
  if (!value) return 'No sessions yet';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}

function workflowStatus(client: CounsellorClientItem) {
  if (client.intakeStatus === 'under_review') return { label: 'Intake review', className: 'bg-violet-50 text-violet-700' };
  if (!client.nextSession) return { label: 'Follow-up needed', className: 'bg-amber-50 text-amber-700' };
  return { label: `Session scheduled: ${sessionLabel(client.nextSession)}`, className: 'bg-sky-50 text-sky-700' };
}

function ClientCardSkeleton() {
  return (
    <div className="space-y-3" aria-label="Loading assigned clients">
      {[0, 1, 2].map((item) => (
        <article key={item} className="rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
          <div className="flex animate-pulse items-start justify-between gap-3">
            <div className="flex min-w-0 flex-1 items-start gap-3">
              <div className="h-11 w-11 shrink-0 rounded-full bg-slate-100" />
              <div className="min-w-0 flex-1 space-y-2">
                <div className="h-4 w-36 rounded bg-slate-100" />
                <div className="h-3 w-48 max-w-full rounded bg-slate-100" />
              </div>
            </div>
            <div className="flex shrink-0 gap-2">
              <div className="h-7 w-16 rounded-full bg-slate-100" />
              <div className="h-7 w-32 rounded-full bg-slate-100" />
            </div>
          </div>
          <div className="mt-3 h-11 animate-pulse rounded-xl border border-amber-100 bg-amber-50/50">
            <div className="mx-3 mt-4 h-3 w-64 max-w-[80%] rounded bg-amber-100" />
          </div>
        </article>
      ))}
    </div>
  );
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
          <ClientCardSkeleton />
        ) : error ? (
          <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-6 text-sm font-medium text-rose-700">{error}</p>
        ) : clients.length ? (
          <div className="space-y-3">
          {clients.map((client) => (
            <article key={client.id} className="rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-start gap-3">
                  <Avatar className="h-11 w-11 border border-slate-200">
                    {client.profilePhotoUrl ? <AvatarImage src={client.profilePhotoUrl} alt={`${client.name} avatar`} className="object-cover" /> : null}
                    <AvatarFallback className="bg-indigo-50 text-xs font-semibold text-indigo-700">{initialsForName(client.name)}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900">{client.name}</p>
                    <p className="mt-2 flex items-center gap-2 text-xs text-slate-500"><CalendarDays size={14} />Last session: {sessionLabel(client.lastSession)}</p>
                  </div>
                </div>
                <div className="flex shrink-0 flex-wrap justify-end gap-2">
                  <ToneBadge tone={riskTone(client.risk)}>{riskLabel(client.risk)}</ToneBadge>
                  <span className={`inline-flex max-w-full shrink-0 rounded-full px-2.5 py-1 text-xs font-medium sm:whitespace-nowrap ${workflowStatus(client).className}`}>
                    {workflowStatus(client).label}
                  </span>
                </div>
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
