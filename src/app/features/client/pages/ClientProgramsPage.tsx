import { ClientPageTitle } from '../ClientLayout';

export default function ClientProgramsPage() {
  return (
    <div className="space-y-6">
      <ClientPageTitle title="My Programs" subtitle="Review assigned workouts and counselling resources." />
      <section className="grid gap-4 md:grid-cols-2">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="font-semibold text-slate-900">Workout Plan A</h3>
          <p className="mt-2 text-sm text-slate-600">Strength, mobility, and consistency tracking for 4 weeks.</p>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="font-semibold text-slate-900">Stress Reset Routine</h3>
          <p className="mt-2 text-sm text-slate-600">Daily breathing + reflection exercises assigned by counsellor.</p>
        </article>
      </section>
    </div>
  );
}
