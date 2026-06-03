import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { assignCbtExercise, getCbtTemplates } from '../../services/cbtApi';
import type { CbtExerciseTemplate } from '../../types/cbt.types';

export default function AssignExercise() {
  const planId = Number(useParams().planId);
  const navigate = useNavigate();
  const [templates, setTemplates] = useState<CbtExerciseTemplate[]>([]);
  const [templateId, setTemplateId] = useState(1);
  const [frequency, setFrequency] = useState('daily');
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10));
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    void getCbtTemplates().then((items) => {
      setTemplates(items);
      setTemplateId(items[0]?.id ?? 1);
    });
  }, []);

  async function submit() {
    await assignCbtExercise(planId, {
      exercise_template_id: templateId,
      frequency,
      start_date: startDate,
      end_date: endDate || undefined,
      due_time: '18:00',
      priority: 'medium',
    });
    navigate(`/counsellor/cbt/plans/${planId}`);
  }

  return (
    <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h1 className="text-xl font-semibold text-slate-900">Assign CBT Exercise</h1>
      <div className="mt-5 space-y-4">
        <label className="block text-sm font-semibold text-slate-800">Template<select value={templateId} onChange={(event) => setTemplateId(Number(event.target.value))} className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm">{templates.map((template) => <option key={template.id} value={template.id}>{template.title}</option>)}</select></label>
        <label className="block text-sm font-semibold text-slate-800">Frequency<select value={frequency} onChange={(event) => setFrequency(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm"><option value="once">Once</option><option value="daily">Daily</option><option value="weekly">Weekly</option><option value="as_needed">As needed</option></select></label>
        <label className="block text-sm font-semibold text-slate-800">Start date<input type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" /></label>
        <label className="block text-sm font-semibold text-slate-800">End date<input type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" /></label>
        <button onClick={submit} className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700">Assign exercise</button>
      </div>
    </div>
  );
}
