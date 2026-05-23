import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Home, ArrowLeft, ArrowRight } from 'lucide-react';
import OnboardingAnimation from '../../../components/onboarding/OnboardingAnimation';
import { loginRequest } from './apiAuth';
import { getPostAuthRedirectPath } from './roleRedirects';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@wellnessconnect.local');
  const [password, setPassword] = useState('Admin@12345');
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-slate-50 via-indigo-50/30 to-white">
      <div className="mx-auto w-full max-w-lg flex-1 px-4 py-2 sm:px-6">
        <div className="mb-10 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
          >
            <Home size={15} /> 
          </Link>

          {/* <p className="rounded-lg px-2 py-1.5 text-sm font-medium text-slate-500">Sign in</p> */}

          {/* <Link
            to="/get-started"
            className="rounded-lg px-2 py-1.5 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
          >
            Create account
          </Link> */}
        </div>

        <div className="space-y-6">
          {/* <OnboardingAnimation type="password" /> */}
          <div>
            <p className="text-sm font-semibold tracking-wide text-indigo-600">Welcome back</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">Sign in to WellnessConnect</h1>
            {/* <p className="mt-2 text-slate-500">Use your Laravel account credentials to continue.</p> */}
          </div>

          <form
            className="space-y-4"
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
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Email</label>
              <input
                className="w-full rounded-xl border border-slate-300 px-4 py-3.5 text-base transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="admin@wellnessconnect.local"
                required
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Password</label>
              <input
                className="w-full rounded-xl border border-slate-300 px-4 py-3.5 text-base transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter password"
                required
              />
            </div>
            <div className="text-right">
              <Link className="text-sm text-indigo-600 hover:text-indigo-700" to="/forgot-password">Forgot password?</Link>
            </div>
            {notice ? <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-700">{notice}</p> : null}
            <button
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-indigo-200 border-t-white" />
                  Signing in...
                </>
              ) : (
                <>Sign In <ArrowRight size={16} /></>
              )}
            </button>
          </form>
          <p className="text-sm text-slate-600">
            Need an account? <Link className="font-medium text-indigo-600 hover:text-indigo-700" to="/get-started">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
