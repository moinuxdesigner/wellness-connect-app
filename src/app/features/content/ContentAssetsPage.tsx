import { FileCheck2, ShieldAlert } from 'lucide-react';
import { Panel, ToneBadge } from '../shared/components/Ui';

const assets = [
  { title: 'Breathing Basics Video', state: 'ready' },
  { title: 'Home Mobility Card Set', state: 'review' },
  { title: 'Sleep Routine PDF', state: 'compliance_hold' },
];

export default function ContentAssetsPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-sky-100 bg-gradient-to-br from-sky-50 via-white to-blue-50 p-6">
        <h1 className="text-2xl font-semibold text-slate-900">Content Assets</h1>
        <p className="mt-2 text-sm text-slate-600">Track draft readiness, review progress, and compliance gates before publish.</p>
      </section>

      <Panel title="Asset Queue">
        <div className="space-y-3">
          {assets.map((asset) => (
            <article key={asset.title} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
              <p className="inline-flex items-center gap-2 text-sm font-medium text-slate-800"><FileCheck2 size={15} />{asset.title}</p>
              <ToneBadge tone={asset.state === 'ready' ? 'success' : asset.state === 'review' ? 'warning' : 'danger'}>
                {asset.state.replace('_', ' ')}
              </ToneBadge>
            </article>
          ))}
        </div>
        <div className="mt-4 rounded-xl border border-rose-100 bg-rose-50/40 px-3 py-2 text-sm text-rose-700">
          <p className="inline-flex items-center gap-2"><ShieldAlert size={15} />Compliance hold items must clear legal/admin review before publishing.</p>
        </div>
      </Panel>
    </div>
  );
}
