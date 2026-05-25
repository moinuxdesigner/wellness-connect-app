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
  contact: {
    load: () => import('./animations/contact us.json').then((module) => module.default),
    fallback: 'ðŸ‘‹',
    label: 'Nice to meet you animation',
  },
  email: {
    load: () => import('./animations/Email check.json').then((module) => module.default),
    fallback: '✉️',
    label: 'Email animation',
  },
  password: {
    load: () => import('./animations/Change Passwords.json').then((module) => module.default),
    fallback: '🔒',
    label: 'Security animation',
  },
  review: {
    load: () => import('./animations/final-plan.json').then((module) => module.default),
    fallback: '📋',
    label: 'Plan review animation',
  },
  success: {
    load: () => import('./animations/Welcome title animation.json').then((module) => module.default),
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
  const [loadedType, setLoadedType] = useState(null);

  useEffect(() => {
    if (prefersReducedMotion) return undefined;

    let isMounted = true;
    setAnimationData(null);
    setLottieComponent(null);
    setHasError(false);
    setLoadedType(null);

    Promise.all([
      import('lottie-react'),
      config.data
        ? Promise.resolve(config.data)
        : config.load
          ? config.load()
          : fetch(`${config.src}?v=20260520-lottie-fix`, { cache: 'no-store' }).then((response) => {
            if (!response.ok) throw new Error(`Missing animation: ${config.src}`);
            return response.json();
          }),
    ])
      .then(([module, json]) => {
        if (!isMounted) return;
        setLottieComponent(() => module.default);
        setAnimationData(json);
        setLoadedType(type);
      })
      .catch(() => {
        if (isMounted) setHasError(true);
      });

    return () => {
      isMounted = false;
    };
  }, [config.data, config.load, config.src, prefersReducedMotion, type]);

  const showFallback = prefersReducedMotion || hasError;
  const showAnimation = loadedType === type && animationData && LottieComponent;

  return (
    <div className={`onboarding-animation ${className}`} aria-label={config.label} role="img">
      {showFallback ? (
        <span className="onboarding-animation__fallback" aria-hidden="true">
          {config.fallback}
        </span>
      ) : showAnimation ? (
        <LottieComponent
          animationData={animationData}
          autoplay
          loop
          renderer="svg"
          className="onboarding-animation__lottie"
          rendererSettings={{ preserveAspectRatio: 'xMidYMid meet' }}
        />
      ) : null}
    </div>
  );
}

// Place production Lottie JSON files in public/animations/onboarding/.
// The component falls back to the emoji above if any JSON file is absent or invalid.
