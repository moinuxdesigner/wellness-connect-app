import { useEffect, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import welcomeAnimation from './animations/Welcome Animation.json';
import mascotAnimation from './animations/mascot.json';

const onboardingAnimations = {
  name: {
    data: mascotAnimation,
    fallback: '👋',
    label: 'Welcome animation',
  },
  goal: {
    src: '/animations/onboarding/wellness-goal.json',
    fallback: '🎯',
    label: 'Goal selection animation',
  },
  email: {
    src: '/animations/onboarding/email.json',
    fallback: '✉️',
    label: 'Email animation',
  },
  password: {
    src: '/animations/onboarding/secure-lock.json',
    fallback: '🔒',
    label: 'Security animation',
  },
  review: {
    src: '/animations/onboarding/personal-plan.json',
    fallback: '📋',
    label: 'Plan review animation',
  },
  success: {
    src: '/animations/onboarding/success.json',
    fallback: '🌟',
    label: 'Success animation',
  },
};

export default function OnboardingAnimation({ type, className = '' }) {
  const prefersReducedMotion = useReducedMotion();
  const config = onboardingAnimations[type] ?? onboardingAnimations.name;
  const [animationData, setAnimationData] = useState(null);
  const [LottieComponent, setLottieComponent] = useState(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion) return undefined;

    let isMounted = true;
    setAnimationData(null);
    setLottieComponent(null);
    setHasError(false);

    Promise.all([
      import('lottie-react'),
      config.data
        ? Promise.resolve(config.data)
        : fetch(`${config.src}?v=20260520-lottie-fix`, { cache: 'no-store' }).then((response) => {
            if (!response.ok) throw new Error(`Missing animation: ${config.src}`);
            return response.json();
          }),
    ])
      .then(([module, json]) => {
        if (!isMounted) return;
        setLottieComponent(() => module.default);
        setAnimationData(json);
      })
      .catch(() => {
        if (isMounted) setHasError(true);
      });

    return () => {
      isMounted = false;
    };
  }, [config.data, config.src, prefersReducedMotion]);

  const showFallback = prefersReducedMotion || hasError || !animationData || !LottieComponent;

  return (
    <div className={`onboarding-animation ${className}`} aria-label={config.label} role="img">
      {showFallback ? (
        <span className="onboarding-animation__fallback" aria-hidden="true">
          {config.fallback}
        </span>
      ) : (
        <LottieComponent
          animationData={animationData}
          autoplay
          loop
          renderer="svg"
          className="onboarding-animation__lottie"
          rendererSettings={{ preserveAspectRatio: 'xMidYMid meet' }}
        />
      )}
    </div>
  );
}

// Place production Lottie JSON files in public/animations/onboarding/.
// The component falls back to the emoji above if any JSON file is absent or invalid.
