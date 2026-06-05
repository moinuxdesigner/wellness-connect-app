import { createPortal } from 'react-dom';
import OnboardingAnimation from '../../../components/onboarding/OnboardingAnimation';
import logoImage from '../../../assets/brand/aura-connect-logo-3.png';
import loaderBg from '../../../assets/auth/loader-background.png';

type AuthActionLoaderProps = {
  action: 'login' | 'logout';
};

const loaderContent = {
  login: {
    animation: 'password',
    mainLabel: 'Signing you in',
    subtitle: 'Securing your session',
    message: 'Please wait while we securely prepare your workspace.',
  },
  logout: {
    animation: 'name',
    mainLabel: 'Signing you out',
    subtitle: 'Signing you out safely',
    message: 'Please wait while we securely sign you out.',
  },
} as const;

export default function AuthActionLoader({ action }: AuthActionLoaderProps) {
  const content = loaderContent[action];

  return createPortal(
    <div
      className="fixed inset-0 z-[100] min-h-screen overflow-hidden px-6 py-3 sm:px-4 sm:py-4 lg:px-0 lg:py-0"
      role="status"
      aria-live="polite"
      aria-label={content.mainLabel}
      style={{
        backgroundColor: '#ffffff',
        backgroundImage: `url(${loaderBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >

      {/* Logo at top left */}
      <div className="absolute left-0 top-0 z-10 px-6 pt-6 sm:px-8 sm:pt-7 lg:px-12 lg:pt-8 xl:px-16">
        <img 
          src={logoImage} 
          alt="Wellness Connect Logo" 
          className="h-14 w-auto object-contain"
        />
      </div>

      {/* Loading Card */}
      <div className="relative z-20 flex min-h-screen w-full items-center justify-center px-6 py-20 sm:px-4 lg:px-0">
        <div className="w-full max-w-md rounded-3xl border border-slate-100 bg-white px-8 py-12 text-center shadow-[0_20px_60px_rgba(118,94,210,0.10)] sm:px-10 sm:py-14">
          {/* Lock Animation */}
          <div className="mb-8 flex justify-center">
            <div className="h-24 w-24 rounded-full bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
              <OnboardingAnimation type={content.animation} className="h-16 w-16" />
            </div>
          </div>

          {/* Loading Dots - Top */}
          <div className="mb-6 flex justify-center gap-2">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={`dot-top-${i}`}
                className="h-2 w-2 rounded-full bg-gradient-to-r from-indigo-300 to-purple-300 animate-pulse"
                style={{
                  animationDelay: `${i * 0.15}s`,
                  opacity: 0.4 + (0.6 * (i / 3)),
                }}
              />
            ))}
          </div>

          {/* Loading Bar */}
          <div className="mx-auto mb-6 h-1.5 w-3/4 overflow-hidden rounded-full bg-gradient-to-r from-indigo-100 to-purple-100">
            <div
              className="h-full w-1/3 rounded-full bg-gradient-to-r from-indigo-400 to-purple-500"
              style={{
                animation: 'loading 1.5s ease-in-out infinite',
              }}
            />
          </div>

          {/* Subtle loading lines */}
          <div className="space-y-2 mb-6">
            <div className="h-2 w-full rounded bg-gradient-to-r from-indigo-100 via-purple-100 to-transparent opacity-60" />
            <div className="h-2 w-5/6 rounded bg-gradient-to-r from-purple-100 via-indigo-100 to-transparent opacity-50" />
          </div>

          {/* Main Label */}
          <h2 className="mb-2 text-2xl font-semibold text-slate-900">
            {content.mainLabel}
          </h2>

          {/* Subtitle */}
          <p className="mb-6 text-sm font-medium text-indigo-600">
            {content.subtitle}
          </p>

          {/* Bottom Loading Dots */}
          <div className="mb-6 flex justify-center gap-1.5">
            {[0, 1, 2].map((i) => (
              <div
                key={`dot-bottom-${i}`}
                className="h-1.5 w-1.5 rounded-full bg-indigo-400"
                style={{
                  animation: 'bounce 1.4s infinite',
                  animationDelay: `${i * 0.2}s`,
                }}
              />
            ))}
          </div>

          {/* Message */}
          <p className="text-xs font-medium text-slate-500">
            {content.message}
          </p>
        </div>
      </div>

      {/* Animation Styles */}
      <style>{`
        @keyframes loading {
          0% {
            transform: translateX(-100%);
          }
          50% {
            transform: translateX(300%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        
        @keyframes bounce {
          0%, 80%, 100% {
            opacity: 0.5;
            transform: scale(0.8);
          }
          40% {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>,
    document.body
  );
}
