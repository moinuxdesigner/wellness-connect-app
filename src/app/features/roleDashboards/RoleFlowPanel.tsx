import { AlertTriangle, CheckCircle2, Clock3, Route } from 'lucide-react';
import { Link } from 'react-router';
import type { FlowStep, RoleScenario } from '../../types';
import { Panel, ToneBadge } from '../shared/components/Ui';

function badgeTone(status: FlowStep['status']): 'success' | 'warning' | 'danger' | 'neutral' {
  if (status === 'completed') return 'success';
  if (status === 'in_progress') return 'warning';
  if (status === 'escalated') return 'danger';
  return 'neutral';
}

function statusLabel(status: FlowStep['status']) {
  return status.replace('_', ' ');
}

function StepIcon({ status }: { status: FlowStep['status'] }) {
  if (status === 'completed') return <CheckCircle2 size={16} className="text-emerald-600" />;
  if (status === 'in_progress') return <Clock3 size={16} className="text-amber-600" />;
  if (status === 'escalated') return <AlertTriangle size={16} className="text-rose-600" />;
  return <Route size={16} className="text-slate-500" />;
}

function StepList({ items, mode }: { items: FlowStep[]; mode: 'happy' | 'exception' }) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <article
          key={item.id}
          className={`rounded-2xl border px-4 py-4 shadow-sm transition hover:shadow ${
            mode === 'happy' ? 'border-emerald-100 bg-emerald-50/30' : 'border-rose-100 bg-rose-50/30'
          }`}
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <StepIcon status={item.status} />
              <h4 className="text-sm font-semibold text-slate-900">{item.title}</h4>
            </div>
            <ToneBadge tone={badgeTone(item.status)}>{statusLabel(item.status)}</ToneBadge>
          </div>
          <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
        </article>
      ))}
    </div>
  );
}

export function RoleFlowPanel({ scenario, roleRoute }: { scenario: RoleScenario; roleRoute: string }) {
  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-cyan-50 p-6 shadow-sm">
        <div className="relative z-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600">Flow walkthrough</p>
          <h1 className="mt-1 text-2xl font-semibold text-slate-900">{scenario.title}</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            Clickable MVP flow with deterministic statuses for confident live demos and predictable outcomes.
          </p>
        </div>
      </section>

      <Panel title="Happy Path">
        <StepList items={scenario.happyPath} mode="happy" />
      </Panel>

      <Panel title="Exception Path">
        <StepList items={scenario.exceptionPath} mode="exception" />
      </Panel>

      <Panel title="Demo Route Map">
        <div className="grid gap-3 sm:grid-cols-2">
          <Link
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:-translate-y-0.5 hover:bg-slate-50"
            to={roleRoute}
          >
            Go to dashboard root
          </Link>
          <Link
            className="rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm font-medium text-indigo-700 transition hover:-translate-y-0.5 hover:bg-indigo-100"
            to={`${roleRoute}?demo=1`}
          >
            Open with demo mode query
          </Link>
        </div>
      </Panel>
    </div>
  );
}
