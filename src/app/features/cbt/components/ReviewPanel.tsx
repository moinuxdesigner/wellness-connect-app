import { useState } from 'react';
import type { CbtExerciseResponse } from '../types/cbt.types';

export function ReviewPanel({ response, onSubmit }: { response: CbtExerciseResponse; onSubmit: (payload: Record<string, unknown>) => Promise<void> }) {
  const [feedback, setFeedback] = useState(response.review?.feedbackToClient ?? '');
  const [notes, setNotes] = useState(response.review?.clinicalNotes ?? '');
  const [status, setStatus] = useState(response.review?.reviewStatus ?? 'reviewed');
  const [saving, setSaving] = useState(false);

  async function submit() {
    setSaving(true);
    try {
      await onSubmit({ review_status: status, feedback_to_client: feedback, clinical_notes: notes, risk_flag: status === 'escalated' });
    } finally {
      setSaving(false);
    }
  }

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">{response.exerciseTitle ?? 'CBT response'}</h3>
          <p className="mt-1 text-xs text-slate-500">Submitted {new Date(response.submittedAt).toLocaleString()}</p>
        </div>
        <select value={status} onChange={(event) => setStatus(event.target.value as typeof status)} className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-sm">
          <option value="reviewed">Reviewed</option>
          <option value="needs_follow_up">Needs follow-up</option>
          <option value="escalated">Escalated</option>
        </select>
      </div>
      <dl className="mt-3 space-y-2 rounded-xl bg-slate-50 p-3 text-sm">
        {Object.entries(response.responseJson).slice(0, 5).map(([key, value]) => (
          <div key={key}>
            <dt className="font-semibold capitalize text-slate-700">{key.replace(/_/g, ' ')}</dt>
            <dd className="text-slate-600">{Array.isArray(value) ? value.join(', ') : String(value)}</dd>
          </div>
        ))}
      </dl>
      <textarea value={feedback} onChange={(event) => setFeedback(event.target.value)} placeholder="Feedback visible to client" className="mt-3 min-h-24 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" />
      <textarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Clinical notes" className="mt-3 min-h-20 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" />
      <button onClick={submit} disabled={saving} className="mt-3 rounded-lg bg-violet-600 px-3 py-2 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-60">
        {saving ? 'Saving...' : 'Save review'}
      </button>
    </article>
  );
}
