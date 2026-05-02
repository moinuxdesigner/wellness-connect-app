export default function SimplePublicPage({ title, description }: { title: string; description: string }) {
  return (
    <div className="mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <h1 className="text-3xl font-semibold text-slate-900">{title}</h1>
      <p className="mt-3 text-slate-600">{description}</p>
    </div>
  );
}
