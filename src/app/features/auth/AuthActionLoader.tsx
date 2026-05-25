import { createPortal } from 'react-dom';
import OnboardingAnimation from '../../../components/onboarding/OnboardingAnimation';

type AuthActionLoaderProps = {
  action: 'login' | 'logout';
};

const loaderContent = {
  login: {
    animation: 'password',
    label: 'Login...',
    message: 'Securing your session',
  },
  logout: {
    animation: 'name',
    label: 'Logout...',
    message: 'Signing you out safely',
  },
} as const;

export default function AuthActionLoader({ action }: AuthActionLoaderProps) {
  const content = loaderContent[action];

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex min-h-screen items-center justify-center bg-white px-6"
      role="status"
      aria-live="polite"
      aria-label={content.label}
    >
      <div className="flex w-full max-w-sm flex-col items-center text-center">
        <OnboardingAnimation type={content.animation} className="mb-6" />
        <p className="text-2xl font-semibold text-slate-900">{content.label}</p>
        <p className="mt-3 text-sm text-slate-500">{content.message}</p>
      </div>
    </div>,
    document.body
  );
}
