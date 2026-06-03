export function RiskAlertBadge({ level }: { level?: 'low' | 'medium' | 'high' | string | null }) {
  const tone = level === 'high'
    ? 'bg-rose-100 text-rose-700'
    : level === 'medium'
      ? 'bg-amber-100 text-amber-700'
      : 'bg-emerald-100 text-emerald-700';

  return <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${tone}`}>Risk: {level ?? 'low'}</span>;
}
