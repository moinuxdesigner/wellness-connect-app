export function isDemoModeEnabled(): boolean {
  const envDemo = String(import.meta.env.VITE_DEMO_MODE ?? '').toLowerCase();
  if (envDemo === '1' || envDemo === 'true' || envDemo === 'yes') return true;

  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    const value = params.get('demo');
    if (value === '1' || value === 'true') return true;
  }

  return false;
}
