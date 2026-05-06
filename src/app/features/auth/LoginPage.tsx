import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { loginRequest } from './apiAuth';
import { getPostAuthRedirectPath } from './roleRedirects';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@wellnessconnect.local');
  const [password, setPassword] = useState('Admin@12345');
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(false);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-semibold text-slate-900">Welcome back</h1>
      <p className="mt-1 text-sm text-slate-600">Use your Laravel account credentials to continue.</p>

      <form
        className="mt-6 space-y-4"
        onSubmit={async (event) => {
          event.preventDefault();
          setNotice('');
          setLoading(true);

          try {
            const user = await loginRequest(email, password);
            navigate(getPostAuthRedirectPath(user));
          } catch (error) {
            const message = error instanceof Error ? error.message : 'Unable to login.';
            setNotice(message);
          } finally {
            setLoading(false);
          }
        }}
      >
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
          <input
            className="w-full rounded-xl border border-slate-300 px-3 py-2"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="admin@wellnessconnect.local"
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
            placeholder="Enter password"
            required
          />
        </div>
        {notice ? <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-700">{notice}</p> : null}
        <button
          className="w-full rounded-xl bg-indigo-600 px-4 py-2.5 font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          type="submit"
          disabled={loading}
        >
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-indigo-200 border-t-white" />
              Signing in...
            </span>
          ) : (
            'Sign In'
          )}
        </button>
      </form>
      <p className="mt-4 text-sm text-slate-600">Need an account? <Link className="text-indigo-600" to="/signup">Create one</Link></p>
    </div>
  );
}
