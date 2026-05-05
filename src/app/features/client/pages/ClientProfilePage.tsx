import { useEffect, useState } from 'react';
import { getAuthState } from '../../auth/auth';
import { meRequest, updateProfileRequest } from '../../auth/apiAuth';
import { ClientPageTitle } from '../ClientLayout';
import { DSButton, DSCard } from '../../../../design/components/primitives';

const goals = [
  { value: 'fitness', label: 'Fitness' },
  { value: 'mental_health', label: 'Mental Health' },
  { value: 'both', label: 'Both' },
] as const;

export default function ClientProfilePage() {
  const authUser = getAuthState().user;
  const [name, setName] = useState(authUser?.name ?? '');
  const [phone, setPhone] = useState(authUser?.phone ?? '');
  const [primaryGoal, setPrimaryGoal] = useState<(typeof goals)[number]['value']>((authUser?.primary_goal as (typeof goals)[number]['value']) ?? 'fitness');
  const [consent, setConsent] = useState(Boolean(authUser?.consent_to_terms));
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    meRequest().then((user) => {
      setName(user.name);
      setPhone(user.phone ?? '');
      setPrimaryGoal((user.primary_goal as (typeof goals)[number]['value']) ?? 'fitness');
      setConsent(Boolean(user.consent_to_terms));
    }).catch(() => {
      setNotice('Unable to load latest profile right now.');
    });
  }, []);

  return (
    <div className="space-y-4">
      <ClientPageTitle title="Profile & Consent" subtitle="Manage your personal details and wellness preferences." />
      <DSCard>
        <form
          className="grid gap-4"
          onSubmit={async (event) => {
            event.preventDefault();
            setNotice('');
            setLoading(true);
            try {
              await updateProfileRequest({
                name,
                phone,
                primary_goal: primaryGoal,
                consent_to_terms: consent,
                timezone: 'Asia/Kolkata',
                preferred_language: 'en',
              });
              setNotice('Profile updated successfully.');
            } catch (error) {
              setNotice(error instanceof Error ? error.message : 'Profile update failed.');
            } finally {
              setLoading(false);
            }
          }}
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="grid gap-1 text-sm font-medium text-slate-700">Name<input className="rounded-xl border border-slate-300 px-3 py-2" value={name} onChange={(e) => setName(e.target.value)} required /></label>
            <label className="grid gap-1 text-sm font-medium text-slate-700">Phone<input className="rounded-xl border border-slate-300 px-3 py-2" value={phone} onChange={(e) => setPhone(e.target.value)} /></label>
            <label className="grid gap-1 text-sm font-medium text-slate-700">Email<input className="rounded-xl border border-slate-200 bg-slate-100 px-3 py-2 text-slate-600" value={authUser?.email ?? ''} disabled /></label>
            <label className="grid gap-1 text-sm font-medium text-slate-700">Wellness goal<select className="rounded-xl border border-slate-300 px-3 py-2" value={primaryGoal} onChange={(e) => setPrimaryGoal(e.target.value as (typeof goals)[number]['value'])}>{goals.map((goal) => <option key={goal.value} value={goal.value}>{goal.label}</option>)}</select></label>
          </div>

          <label className="mt-1 flex items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
            I confirm consent for data processing under platform terms.
          </label>

          {notice ? <p className="rounded-lg bg-indigo-50 px-3 py-2 text-sm text-indigo-700">{notice}</p> : null}
          <DSButton disabled={loading}>{loading ? 'Saving profile...' : 'Save profile'}</DSButton>
        </form>
      </DSCard>
    </div>
  );
}
