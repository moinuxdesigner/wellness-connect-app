import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import type { Role } from '../../types';
import { registerRequest } from './apiAuth';
import { getRoleHomePath } from './roleRedirects';

const signupRoles: Array<{ label: string; value: Role }> = [
  { label: 'Client', value: 'client' },
  { label: 'Counsellor', value: 'counsellor' },
  { label: 'Trainer', value: 'trainer' },
  { label: 'Coach', value: 'coach' },
  { label: 'Help Desk', value: 'helpdesk' },
  { label: 'Finance', value: 'finance' },
  { label: 'Legal', value: 'legal' },
  { label: 'Content', value: 'content' },
];

export default function SignupPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>('client');
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(false);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-semibold text-slate-900">Create account</h1>
      <p className="mt-1 text-sm text-slate-600">Register with the Laravel API to continue.</p>
      <form
        className="mt-6 grid gap-4"
        onSubmit={async (event) => {
          event.preventDefault();
          setNotice('');
          setLoading(true);

          try {
            const user = await registerRequest(name, email, password, role);
            navigate(getRoleHomePath(user.role));
          } catch (error) {
            const message = error instanceof Error ? error.message : 'Unable to create account.';
            setNotice(message);
          } finally {
            setLoading(false);
          }
        }}
      >
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Full name</label>
          <input
            className="w-full rounded-xl border border-slate-300 px-3 py-2"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Enter your full name"
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
          <input
            className="w-full rounded-xl border border-slate-300 px-3 py-2"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Password</label>
          <input
            className="w-full rounded-xl border border-slate-300 px-3 py-2"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Minimum 8 characters"
            minLength={8}
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Role</label>
          <select
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2"
            value={role}
            onChange={(event) => setRole(event.target.value as Role)}
          >
            {signupRoles.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
        {notice ? <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-700">{notice}</p> : null}
        <button
          className="rounded-xl bg-indigo-600 px-4 py-2.5 font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          type="submit"
          disabled={loading}
        >
          {loading ? (
            <span className="inline-flex items-center justify-center gap-2">
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-indigo-200 border-t-white" />
              Creating account...
            </span>
          ) : (
            'Create account'
          )}
        </button>
      </form>
      <p className="mt-4 text-sm text-slate-600">Already have an account? <Link className="text-indigo-600" to="/login">Sign in</Link></p>
    </div>
  );
}
