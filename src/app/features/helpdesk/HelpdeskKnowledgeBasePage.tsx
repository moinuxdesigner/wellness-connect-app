import { Panel } from '../shared/components/Ui';

const articles = [
  'How to reschedule counselling sessions in under 2 minutes',
  'Escalation SOP for risk-tagged counselling cases',
  'When to route client issues to finance or admin',
];

export default function HelpdeskKnowledgeBasePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Knowledge Base</h1>
        <p className="mt-1 text-sm text-slate-600">Support playbooks used during demo triage and resolution.</p>
      </div>
      <Panel title="Top Articles">
        <ul className="space-y-2 text-sm text-slate-700">
          {articles.map((item) => <li key={item} className="rounded-xl border border-slate-200 px-3 py-2">{item}</li>)}
        </ul>
      </Panel>
    </div>
  );
}
