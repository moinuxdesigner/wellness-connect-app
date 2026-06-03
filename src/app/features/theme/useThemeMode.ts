import { useEffect, useSyncExternalStore } from 'react';

export type ThemeMode = 'light' | 'dark';

const themeStorageKey = 'wellnessconnect-theme-mode';
const themeChangeEvent = 'wellnessconnect-theme-change';

function getSystemTheme(): ThemeMode {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function readStoredTheme(): ThemeMode | null {
  if (typeof window === 'undefined') return null;
  const value = window.localStorage.getItem(themeStorageKey);
  return value === 'dark' || value === 'light' ? value : null;
}

function getThemeSnapshot(): ThemeMode {
  return readStoredTheme() ?? getSystemTheme();
}

function applyTheme(mode: ThemeMode) {
  if (typeof document === 'undefined') return;
  document.documentElement.classList.toggle('dark', mode === 'dark');
  document.documentElement.dataset.theme = mode;
  document.documentElement.style.colorScheme = mode;
}

function subscribe(callback: () => void) {
  if (typeof window === 'undefined') return () => {};

  const handleStorage = (event: StorageEvent) => {
    if (event.key === themeStorageKey) callback();
  };
  const handleThemeChange = () => callback();
  const media = window.matchMedia('(prefers-color-scheme: dark)');
  const handleSystemTheme = () => {
    if (!readStoredTheme()) callback();
  };

  window.addEventListener('storage', handleStorage);
  window.addEventListener(themeChangeEvent, handleThemeChange);
  media.addEventListener('change', handleSystemTheme);

  return () => {
    window.removeEventListener('storage', handleStorage);
    window.removeEventListener(themeChangeEvent, handleThemeChange);
    media.removeEventListener('change', handleSystemTheme);
  };
}

export function initializeThemeMode() {
  applyTheme(getThemeSnapshot());
}

export function useThemeMode() {
  const mode = useSyncExternalStore(subscribe, getThemeSnapshot, () => 'light');

  useEffect(() => {
    applyTheme(mode);
  }, [mode]);

  function setMode(nextMode: ThemeMode) {
    window.localStorage.setItem(themeStorageKey, nextMode);
    applyTheme(nextMode);
    window.dispatchEvent(new CustomEvent(themeChangeEvent, { detail: nextMode }));
  }

  function toggleMode() {
    setMode(mode === 'dark' ? 'light' : 'dark');
  }

  return { mode, setMode, toggleMode };
}
