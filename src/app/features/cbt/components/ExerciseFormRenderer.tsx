import type { CbtTemplateField, CbtTemplateSchema } from '../types/cbt.types';

type FormValue = string | number | boolean | string[];

export function ExerciseFormRenderer({
  schema,
  values,
  onChange,
}: {
  schema: CbtTemplateSchema;
  values: Record<string, FormValue>;
  onChange: (key: string, value: FormValue) => void;
}) {
  return (
    <div className="space-y-4">
      {schema.fields.map((field) => (
        <FieldRenderer key={field.key} field={field} value={values[field.key]} onChange={(value) => onChange(field.key, value)} />
      ))}
    </div>
  );
}

function FieldRenderer({ field, value, onChange }: { field: CbtTemplateField; value: FormValue | undefined; onChange: (value: FormValue) => void }) {
  const label = (
    <label className="text-sm font-semibold text-slate-800" htmlFor={field.key}>
      {field.label}{field.required ? <span className="text-rose-600"> *</span> : null}
    </label>
  );

  if (field.type === 'textarea') {
    return <div className="space-y-2">{label}<textarea id={field.key} value={String(value ?? '')} onChange={(event) => onChange(event.target.value)} className="min-h-28 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" /></div>;
  }

  if (field.type === 'select') {
    return (
      <div className="space-y-2">
        {label}
        <select id={field.key} value={String(value ?? '')} onChange={(event) => onChange(event.target.value)} className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm">
          <option value="">Select</option>
          {(field.options ?? []).map((option) => <option key={option} value={option}>{option}</option>)}
        </select>
      </div>
    );
  }

  if (field.type === 'multi_select') {
    const selected = Array.isArray(value) ? value : [];
    return (
      <fieldset className="space-y-2">
        <legend className="text-sm font-semibold text-slate-800">{field.label}</legend>
        <div className="flex flex-wrap gap-2">
          {(field.options ?? []).map((option) => {
            const active = selected.includes(option);
            return (
              <button key={option} type="button" onClick={() => onChange(active ? selected.filter((item) => item !== option) : [...selected, option])} className={`rounded-full border px-3 py-1.5 text-sm ${active ? 'border-violet-600 bg-violet-600 text-white' : 'border-slate-300 bg-white text-slate-700'}`}>
                {option}
              </button>
            );
          })}
        </div>
      </fieldset>
    );
  }

  if (field.type === 'slider') {
    const numericValue = typeof value === 'number' ? value : field.min ?? 0;
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-3">{label}<span className="text-sm font-semibold text-violet-700">{numericValue}</span></div>
        <input id={field.key} type="range" min={field.min ?? 0} max={field.max ?? 100} value={numericValue} onChange={(event) => onChange(Number(event.target.value))} className="w-full accent-violet-600" />
      </div>
    );
  }

  if (field.type === 'checkbox') {
    return (
      <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800">
        <input type="checkbox" checked={Boolean(value)} onChange={(event) => onChange(event.target.checked)} className="h-4 w-4 accent-violet-600" />
        {field.label}
      </label>
    );
  }

  if (field.type === 'radio') {
    return (
      <fieldset className="space-y-2">
        <legend className="text-sm font-semibold text-slate-800">{field.label}</legend>
        <div className="flex flex-wrap gap-2">
          {(field.options ?? []).map((option) => (
            <label key={option} className={`rounded-full border px-3 py-1.5 text-sm ${value === option ? 'border-violet-600 bg-violet-600 text-white' : 'border-slate-300 bg-white text-slate-700'}`}>
              <input type="radio" name={field.key} value={option} checked={value === option} onChange={() => onChange(option)} className="sr-only" />
              {option}
            </label>
          ))}
        </div>
      </fieldset>
    );
  }

  return (
    <div className="space-y-2">
      {label}
      <input id={field.key} type={field.type === 'date' || field.type === 'time' ? field.type : 'text'} value={String(value ?? '')} onChange={(event) => onChange(event.target.value)} className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" />
    </div>
  );
}
