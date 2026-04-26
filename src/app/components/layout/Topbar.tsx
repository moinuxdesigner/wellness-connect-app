import { ReactNode } from 'react';

export interface TopbarProps {
  brand?: ReactNode;
  nav?: ReactNode;
  actions?: ReactNode;
  className?: string;
}

export const Topbar = ({ brand, nav, actions, className = '' }: TopbarProps) => {
  return (
    <header className={`sticky top-0 z-40 border-b border-border-default bg-surface-elevated/95 backdrop-blur ${className}`}>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 md:px-6 lg:px-8">
        <div className="min-w-0 shrink-0">{brand}</div>
        {nav && <nav className="hidden min-w-0 flex-1 justify-center md:flex" aria-label="Primary">{nav}</nav>}
        {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
      </div>
    </header>
  );
};

