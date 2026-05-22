import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { ArrowLeft, ArrowRight, Brain, Check, Dumbbell, HeartHandshake, Zap } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import OnboardingAnimation from '../../../components/onboarding/OnboardingAnimation';
import { registerRequest } from '../shared/services/api';
import { getPostAuthRedirectPath } from '../auth/roleRedirects';

type PrimaryGoal = 'fitness' | 'mental_health' | 'both';
type Step = 1 | 2 | 3 | 4 | 5 | 6;

const GOALS: Array<{
  id: string;
  label: string;
  description: string;
  Icon: React.FC<{ size?: number; className?: string }>;
  primaryGoal: PrimaryGoal;
  colorClass: string;
  borderClass: string;
  bgClass: string;
}> = [
  {
    id: 'fit_stronger',
    label: 'Fit & Stronger',
    description: 'Build strength, endurance, and healthy habits',
    Icon: Dumbbell,
    primaryGoal: 'fitness',
    colorClass: 'text-emerald-600',
    borderClass: 'border-emerald-500',
    bgClass: 'bg-emerald-50',
  },
  {
    id: 'stress_anxiety',
    label: 'Reduce Stress & Anxiety',
    description: 'Find calm and restore mental balance',
    Icon: Brain,
    primaryGoal: 'mental_health',
    colorClass: 'text-indigo-600',
    borderClass: 'border-indigo-500',
    bgClass: 'bg-indigo-50',
  },
  {
    id: 'mental_wellbeing',
    label: 'Improve Mental Well-being',
    description: 'Build resilience and emotional strength',
    Icon: HeartHandshake,
    primaryGoal: 'mental_health',
    colorClass: 'text-violet-600',
    borderClass: 'border-violet-500',
    bgClass: 'bg-violet-50',
  },
  {
    id: 'energy_confidence',
    label: 'Boost Energy & Confidence',
    description: 'Revitalise your energy and self-belief',
    Icon: Zap,
    primaryGoal: 'both',
    colorClass: 'text-amber-600',
    borderClass: 'border-amber-500',
    bgClass: 'bg-amber-50',
  },
];

const TOTAL_STEPS = 5;

export default function GetStartedWizardPage() {
  const navigate = useNavigate();
  const prefersReducedMotion = useReducedMotion();
  const [step, setStep] = useState<Step>(1);
  const [name, setName] = useState('');
  const [goalId, setGoalId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(false);
  const [postAuthPath, setPostAuthPath] = useState('/client/intake');

  const selectedGoal = GOALS.find((g) => g.id === goalId);
  const firstName = name.split(' ')[0];

  function goBack() {
    setNotice('');
    setStep((s) => (s - 1) as Step);
  }

  async function createAccount() {
    if (!selectedGoal) return;
    setLoading(true);
    setNotice('');
    try {
      const user = await registerRequest({
        name,
        email,
        password,
        role: 'client',
        primary_goal: selectedGoal.primaryGoal,
        consent_to_terms: true,
      });
      setPostAuthPath(getPostAuthRedirectPath(user));
      setStep(6);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Unable to create your account. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function renderStep() {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <OnboardingAnimation type="name" />
            <div>
              <p className="text-sm font-semibold tracking-wide text-indigo-600">Hi there! 👋</p>
              <h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">What's your name?</h1>
              <p className="mt-2 text-slate-500">We'd love to personalise your wellness journey.</p>
            </div>
            <input
              autoFocus
              className="w-full rounded-xl border border-slate-300 px-4 py-3.5 text-base transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && name.trim()) setStep(2);
              }}
            />
            <button
              onClick={() => setStep(2)}
              disabled={!name.trim()}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Continue <ArrowRight size={16} />
            </button>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <OnboardingAnimation type="contact" className="onboarding-animation--compact" />
            <div>
              <p className="text-sm font-semibold tracking-wide text-indigo-600">Step 2 of {TOTAL_STEPS}</p>
              <h1 className="mt-1.5 text-2xl font-bold text-slate-900 sm:text-3xl">
                Nice to meet you, {firstName}!
              </h1>
              <p className="mt-1.5 text-sm text-slate-500 sm:text-base">How can we support you today?</p>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {GOALS.map((goal) => {
                const active = goalId === goal.id;
                return (
                  <button
                    key={goal.id}
                    type="button"
                    onClick={() => setGoalId(goal.id)}
                    className={`flex items-start gap-2.5 rounded-xl border-2 p-3 text-left transition-all ${
                      active
                        ? `${goal.borderClass} ${goal.bgClass}`
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <span className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${goal.bgClass}`}>
                      <goal.Icon size={16} className={goal.colorClass} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold text-slate-900">{goal.label}</span>
                      <span className="mt-0.5 block text-[11px] leading-snug text-slate-500 sm:text-xs">{goal.description}</span>
                    </span>
                    {active && <Check size={16} className={`ml-auto mt-1 shrink-0 ${goal.colorClass}`} />}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => setStep(3)}
              disabled={!goalId}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Continue <ArrowRight size={16} />
            </button>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <OnboardingAnimation type="email" />
            <div>
              <p className="text-sm font-semibold tracking-wide text-indigo-600">Step 3 of {TOTAL_STEPS}</p>
              <h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">What's your email?</h1>
              <p className="mt-2 text-slate-500">We'll use this to create your account and send updates.</p>
            </div>
            <input
              autoFocus
              type="email"
              className="w-full rounded-xl border border-slate-300 px-4 py-3.5 text-base transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && email.includes('@')) setStep(4);
              }}
            />
            <button
              onClick={() => setStep(4)}
              disabled={!email.includes('@')}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Continue <ArrowRight size={16} />
            </button>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <OnboardingAnimation type="password" />
            <div>
              <p className="text-sm font-semibold tracking-wide text-indigo-600">Step 4 of {TOTAL_STEPS}</p>
              <h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">Create a password</h1>
              <p className="mt-2 text-slate-500">Minimum 8 characters. Keep it secure.</p>
            </div>
            <input
              autoFocus
              type="password"
              className="w-full rounded-xl border border-slate-300 px-4 py-3.5 text-base transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              placeholder="Minimum 8 characters"
              value={password}
              minLength={8}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && password.length >= 8) setStep(5);
              }}
            />
            {password.length > 0 && password.length < 8 && (
              <p className="text-xs text-amber-600">{8 - password.length} more characters needed</p>
            )}
            <button
              onClick={() => setStep(5)}
              disabled={password.length < 8}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Continue <ArrowRight size={16} />
            </button>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <OnboardingAnimation type="review" />
            <div>
              <p className="text-sm font-semibold tracking-wide text-indigo-600">Step 5 of {TOTAL_STEPS}</p>
              <h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
                Let's create your personal plan 🎯
              </h1>
              <p className="mt-2 text-slate-500">This helps us personalise your wellness experience.</p>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
              <dl className="space-y-3">
                {[
                  { label: 'Name', value: name },
                  { label: 'Goal', value: selectedGoal?.label },
                  { label: 'Email', value: email },
                ].map((row) => (
                  <div key={row.label} className="flex items-baseline gap-3">
                    <dt className="w-14 shrink-0 text-xs font-medium uppercase tracking-wide text-slate-400">{row.label}</dt>
                    <dd className="text-sm font-semibold text-slate-900">{row.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <p className="text-center text-xs text-slate-400">
              By creating your account you agree to our{' '}
              <a href="#" className="underline hover:text-slate-600">Terms of Service</a>
              {' '}and{' '}
              <a href="#" className="underline hover:text-slate-600">Privacy Policy</a>.
            </p>
            {notice && (
              <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-700">{notice}</p>
            )}
            <button
              onClick={createAccount}
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-indigo-200 border-t-white" />
                  Creating your plan…
                </>
              ) : (
                <>Create My Plan <ArrowRight size={16} /></>
              )}
            </button>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6 text-center">
            <OnboardingAnimation type="success" />
            <div>
              <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
                Welcome to your transformation journey! 🌟
              </h1>
              <p className="mt-3 text-slate-500">
                Your account is ready, {firstName}. Let's complete a quick intake so we can match you with the right professionals.
              </p>
            </div>
            <button
              onClick={() => navigate(postAuthPath)}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700"
            >
              Start my wellness intake <ArrowRight size={16} />
            </button>
            <Link to="/client" className="block text-sm text-slate-400 hover:text-slate-600">
              Go to dashboard
            </Link>
          </div>
        );

      default:
        return null;
    }
  }

  const showBack = step > 1 && step < 6;
  const showProgress = step < 6;

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-slate-50 via-indigo-50/30 to-white">
      <div className="mx-auto w-full max-w-lg flex-1 px-4 py-10 sm:px-6">

        {/* Top bar */}
        <div className="mb-10 flex items-center justify-between">
          {showBack ? (
            <button
              type="button"
              onClick={goBack}
              className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
            >
              <ArrowLeft size={15} /> Back
            </button>
          ) : (
            <Link
              to="/"
              className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
            >
              <ArrowLeft size={15} /> Home
            </Link>
          )}

          {showProgress && (
            <div className="flex items-center gap-1.5" aria-label={`Step ${step} of ${TOTAL_STEPS}`}>
              {Array.from({ length: TOTAL_STEPS }, (_, i) => {
                const s = i + 1;
                return (
                  <span
                    key={s}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      s === step ? 'w-6 bg-indigo-600' : s < step ? 'w-2 bg-indigo-300' : 'w-2 bg-slate-200'
                    }`}
                  />
                );
              })}
            </div>
          )}

          <Link
            to="/login"
            className="rounded-lg px-2 py-1.5 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
          >
            Sign in
          </Link>
        </div>

        {/* Step content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
