import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router';
import { ExerciseFormRenderer } from '../../components/ExerciseFormRenderer';
import { getCbtExerciseInstance, startCbtExerciseInstance, submitCbtExerciseInstance } from '../../services/cbtApi';
import type { CbtExerciseInstance } from '../../types/cbt.types';

type FormValue = string | number | boolean | string[];

export default function CompleteExercise() {
  const params = useParams();
  const id = Number(params.instanceId);
  const [exercise, setExercise] = useState<CbtExerciseInstance | null>(null);
  const [values, setValues] = useState<Record<string, FormValue>>({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!id) return;
    void getCbtExerciseInstance(id).then((item) => {
      setExercise(item);
      if (item.status === 'pending') void startCbtExerciseInstance(id);
    });
  }, [id]);

  const template = exercise?.template ?? exercise?.planExercise?.template;
  const emotionBefore = useMemo(() => Number(values.emotion_before ?? values.anxiety_score ?? 0), [values]);
  const emotionAfter = useMemo(() => Number(values.emotion_after ?? values.mood_after ?? 0), [values]);

  async function submit() {
    if (!exercise) return;
    await submitCbtExerciseInstance(exercise.id, {
      response_json: values,
      emotion_before: Number.isFinite(emotionBefore) ? emotionBefore : undefined,
      emotion_after: Number.isFinite(emotionAfter) ? emotionAfter : undefined,
    });
    setSubmitted(true);
  }

  if (!exercise || !template) return <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">Loading exercise...</div>;

  if (submitted) {
    return (
      <div className="mx-auto max-w-3xl rounded-2xl border border-emerald-100 bg-emerald-50 p-6">
        <h1 className="text-xl font-semibold text-emerald-900">Exercise submitted</h1>
        <p className="mt-2 text-sm text-emerald-800">Your counsellor can now review your practice and share feedback.</p>
        <Link to="/client/cbt/exercises" className="mt-4 inline-flex rounded-lg bg-emerald-700 px-3 py-2 text-sm font-semibold text-white">Back to exercises</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl space-y-5">
      <section className="rounded-2xl border border-violet-100 bg-white p-5 shadow-sm">
        <h1 className="text-xl font-semibold text-slate-900">{template.title}</h1>
        <p className="mt-2 text-sm text-slate-600">{template.instructions}</p>
      </section>
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <ExerciseFormRenderer schema={template.templateSchema} values={values} onChange={(key, value) => setValues((current) => ({ ...current, [key]: value }))} />
        <button onClick={submit} className="mt-5 rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700">Submit exercise</button>
      </section>
    </div>
  );
}
