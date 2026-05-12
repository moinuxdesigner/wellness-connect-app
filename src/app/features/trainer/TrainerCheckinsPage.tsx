import { Activity, ClipboardCheck, TrendingUp } from 'lucide-react';
import { Panel, ToneBadge } from '../shared/components/Ui';

const updates = [
  { client: 'Nidhi Rao', plan: 'Strength Foundation', checkin: 'Completed', adherence: 84 },
  { client: 'Sameer Ali', plan: 'Mobility Reset', checkin: 'Missed', adherence: 62 },
  { client: 'Kiran Paul', plan: 'Fat Loss Sprint', checkin: 'Completed', adherence: 91 },
];

export default function TrainerCheckinsPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-cyan-50 p-6">
        <h1 className="text-2xl font-semibold text-slate-900">Check-in Updates</h1>
        <p className="mt-2 text-sm text-slate-600">Monitor adherence, update check-ins, and spot escalation risk quickly.</p>
      </section>

      <Panel title="Today's Check-ins">
        <div className="space-y-3">
          {updates.map((item) => (
            <article key={item.client} className="rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
              <div className="flex items-center justify-between gap-2">
                <p className="flex items-center gap-2 text-sm font-semibold text-slate-900"><ClipboardCheck size={15} />{item.client}</p>
                <ToneBadge tone={item.checkin === 'Completed' ? 'success' : 'warning'}>{item.checkin}</ToneBadge>
              </div>
              <p className="mt-2 text-sm text-slate-600">Plan: {item.plan}</p>
              <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="inline-flex items-center gap-1"><Activity size={13} />Adherence</span>
                  <span className="inline-flex items-center gap-1"><TrendingUp size={13} />{item.adherence}%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100">
                  <div className="h-2 rounded-full bg-emerald-500" style={{ width: `${item.adherence}%` }} />
                </div>
              </div>
            </article>
          ))}
        </div>
      </Panel>
    </div>
  );
}
