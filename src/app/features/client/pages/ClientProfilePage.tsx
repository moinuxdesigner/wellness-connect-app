import { useEffect, useState } from 'react';
import { getAuthState } from '../../auth/auth';
import { changePasswordRequest, meRequest, updateProfileRequest } from '../../auth/apiAuth';
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
  const [passwordNotice, setPasswordNotice] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

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
      <DSCard>
        <form
          className="grid gap-4"
          onSubmit={async (event) => {
            event.preventDefault();
            setPasswordNotice('');
            if (newPassword !== confirmPassword) {
              setPasswordNotice('New password and confirm password do not match.');
              return;
            }
            setPasswordLoading(true);
            try {
              const message = await changePasswordRequest({
                current_password: currentPassword,
                password: newPassword,
                password_confirmation: confirmPassword,
              });
              setPasswordNotice(message);
              setCurrentPassword('');
              setNewPassword('');
              setConfirmPassword('');
            } catch (error) {
              setPasswordNotice(error instanceof Error ? error.message : 'Password update failed.');
            } finally {
              setPasswordLoading(false);
            }
          }}
        >
          <h2 className="text-base font-semibold text-slate-900">Change Password</h2>
          <div className="grid gap-3 sm:grid-cols-3">
            <label className="grid gap-1 text-sm font-medium text-slate-700">
              Current password
              <input
                className="rounded-xl border border-slate-300 px-3 py-2"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </label>
            <label className="grid gap-1 text-sm font-medium text-slate-700">
              New password
              <input
                className="rounded-xl border border-slate-300 px-3 py-2"
                type="password"
                minLength={8}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </label>
            <label className="grid gap-1 text-sm font-medium text-slate-700">
              Confirm password
              <input
                className="rounded-xl border border-slate-300 px-3 py-2"
                type="password"
                minLength={8}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </label>
          </div>
          {passwordNotice ? <p className="rounded-lg bg-indigo-50 px-3 py-2 text-sm text-indigo-700">{passwordNotice}</p> : null}
          <DSButton disabled={passwordLoading}>{passwordLoading ? 'Updating password...' : 'Update password'}</DSButton>
        </form>
      </DSCard>
    </div>
  );
}
