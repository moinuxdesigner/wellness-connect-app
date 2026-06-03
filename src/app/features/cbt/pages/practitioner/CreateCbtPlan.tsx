import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { createCbtPlan } from '../../services/cbtApi';

export default function CreateCbtPlan() {
  const clientId = Number(useParams().clientId ?? 2);
  const navigate = useNavigate();
  const [title, setTitle] = useState('Work Anxiety CBT Plan');
  const [primaryGoal, setPrimaryGoal] = useState('Reduce office anxiety from 80/100 to 40/100.');
  const [description, setDescription] = useState('Structured CBT plan with thought records, mood check-ins, and behavioral practice.');

  async function submit() {
    const plan = await createCbtPlan(clientId, {
      title,
      primary_goal: primaryGoal,
      description,
      status: 'active',
      start_date: new Date().toISOString().slice(0, 10),
      review_frequency: 'weekly',
      goals: [{ goal_title: primaryGoal, goal_description: description, baseline_score: 80, target_score: 40 }],
    });
    navigate(`/counsellor/cbt/plans/${plan.id}`);
  }

  return (
    <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h1 className="text-xl font-semibold text-slate-900">Create CBT Care Plan</h1>
      <div className="mt-5 space-y-4">
        <Input label="Plan title" value={title} onChange={setTitle} />
        <Input label="Primary goal" value={primaryGoal} onChange={setPrimaryGoal} />
        <label className="block text-sm font-semibold text-slate-800">Description<textarea value={description} onChange={(event) => setDescription(event.target.value)} className="mt-2 min-h-28 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" /></label>
        <button onClick={submit} className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700">Create plan</button>
      </div>
    </div>
  );
}

function Input({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return <label className="block text-sm font-semibold text-slate-800">{label}<input value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" /></label>;
}
