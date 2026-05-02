export default function SignupPage() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-semibold text-slate-900">Create account</h1>
      <p className="mt-1 text-sm text-slate-600">Prototype onboarding screen.</p>
      <div className="mt-6 grid gap-3">
        <input className="rounded-xl border border-slate-300 px-3 py-2" placeholder="Full name" />
        <input className="rounded-xl border border-slate-300 px-3 py-2" placeholder="Email" />
        <input className="rounded-xl border border-slate-300 px-3 py-2" placeholder="Phone" />
        <button className="rounded-xl bg-indigo-600 px-4 py-2.5 font-semibold text-white">Create account</button>
      </div>
    </div>
  );
}
