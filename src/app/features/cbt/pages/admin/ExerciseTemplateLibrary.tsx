import { useEffect, useState } from 'react';
import { getCbtTemplates, saveCbtTemplate } from '../../services/cbtApi';
import type { CbtExerciseTemplate } from '../../types/cbt.types';

export default function ExerciseTemplateLibrary() {
  const [templates, setTemplates] = useState<CbtExerciseTemplate[]>([]);
  const [title, setTitle] = useState('New CBT Practice');

  useEffect(() => {
    void getCbtTemplates().then(setTemplates);
  }, []);

  async function createTemplate() {
    const template = await saveCbtTemplate({
      title,
      slug: title.toLowerCase().replace(/\s+/g, '-'),
      difficultyLevel: 'intro',
      estimatedMinutes: 8,
      targetConditions: ['stress'],
      templateSchema: { fields: [{ key: 'reflection', label: 'Reflection', type: 'textarea', required: true }] },
      isActive: true,
    });
    setTemplates((current) => [...current, template]);
  }

  return (
    <div className="space-y-5">
      <section className="rounded-3xl border border-violet-100 bg-gradient-to-br from-violet-50 via-white to-indigo-50 p-6">
        <h1 className="text-2xl font-semibold text-slate-900">CBT Exercise Library</h1>
        <p className="mt-2 text-sm text-slate-600">Manage structured CBT templates used by counsellors.</p>
      </section>
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-base font-semibold text-slate-900">Create simple template</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          <input value={title} onChange={(event) => setTitle(event.target.value)} className="min-w-64 flex-1 rounded-xl border border-slate-300 px-3 py-2 text-sm" />
          <button onClick={createTemplate} className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white">Create</button>
        </div>
      </section>
      <div className="grid gap-4 lg:grid-cols-2">
        {templates.map((template) => (
          <article key={template.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-sm font-semibold text-slate-900">{template.title}</h2>
                <p className="mt-1 text-sm text-slate-500">{template.description ?? template.clinicalPurpose}</p>
              </div>
              <span className="rounded-full bg-violet-100 px-2 py-1 text-xs font-semibold text-violet-700">{template.estimatedMinutes} min</span>
            </div>
            <p className="mt-3 text-xs text-slate-500">{template.templateSchema.fields.length} dynamic fields</p>
          </article>
        ))}
      </div>
    </div>
  );
}
