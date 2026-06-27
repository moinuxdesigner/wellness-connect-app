import { useEffect, useState } from 'react';
import { Download, X } from 'lucide-react';
import { useLocation } from 'react-router';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

const DISMISS_KEY = 'wc_pwa_install_dismissed';

export default function PwaInstallPrompt() {
  const location = useLocation();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [showManualHelp, setShowManualHelp] = useState(false);
  const isSuppressedRoute = location.pathname === '/client/appointments' || location.pathname.startsWith('/trainer/onboarding');

  useEffect(() => {
    const dismissed = localStorage.getItem(DISMISS_KEY);
    if (dismissed === '1') return;
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    if (isStandalone) return;

    const onBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
      setVisible(true);
    };

    const onAppInstalled = () => {
      setVisible(false);
      setDeferredPrompt(null);
      localStorage.setItem(DISMISS_KEY, '1');
    };

    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt);
    window.addEventListener('appinstalled', onAppInstalled);

    const helpTimer = window.setTimeout(() => {
      setVisible(true);
      setShowManualHelp(true);
    }, 4500);

    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt);
      window.removeEventListener('appinstalled', onAppInstalled);
      window.clearTimeout(helpTimer);
    };
  }, []);

  if (!visible || isSuppressedRoute) {
    return null;
  }

  return (
    <div className="fixed bottom-20 right-3 z-40 w-[min(92vw,360px)] rounded-2xl border border-indigo-200 bg-white p-4 shadow-xl">
      <button
        type="button"
        onClick={() => {
          localStorage.setItem(DISMISS_KEY, '1');
          setVisible(false);
        }}
        className="absolute right-3 top-3 rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
        aria-label="Dismiss install prompt"
      >
        <X size={16} />
      </button>
      <p className="text-sm font-semibold text-slate-900">Install WellnessConnect</p>
      <p className="mt-1 text-xs text-slate-600">
        {deferredPrompt
          ? 'Add the app to your home screen for a faster, native-like experience.'
          : 'If install is not shown automatically, use your browser menu and choose "Install app" or "Add to home screen".'}
      </p>
      {deferredPrompt ? (
        <button
          type="button"
          className="mt-3 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white"
          onClick={async () => {
            await deferredPrompt.prompt();
            const choice = await deferredPrompt.userChoice;
            if (choice.outcome === 'accepted') {
              localStorage.setItem(DISMISS_KEY, '1');
            }
            setVisible(false);
            setDeferredPrompt(null);
          }}
        >
          <Download size={14} /> Install app
        </button>
      ) : showManualHelp ? (
        <button
          type="button"
          className="mt-3 rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700"
          onClick={() => setVisible(false)}
        >
          Got it
        </button>
      ) : null}
    </div>
  );
}
