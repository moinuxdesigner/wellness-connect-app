import { ReactNode } from 'react';
import { ContentContainer, type ContentContainerSize } from './ContentContainer';

export interface AppShellProps {
  children: ReactNode;
  topbar?: ReactNode;
  sidebar?: ReactNode;
  bottomNav?: ReactNode;
  contentSize?: ContentContainerSize;
  className?: string;
}

export const AppShell = ({
  children,
  topbar,
  sidebar,
  bottomNav,
  contentSize = 'lg',
  className = '',
}: AppShellProps) => {
  return (
    <div className={`min-h-screen bg-surface-subtle text-text-primary ${className}`}>
      {topbar}
      <div className="mx-auto flex min-h-screen w-full">
        {sidebar && <aside className="hidden w-72 shrink-0 border-r border-border-default bg-surface-elevated lg:block">{sidebar}</aside>}
        <main className="min-w-0 flex-1 pb-24 lg:pb-0">
          <ContentContainer size={contentSize} className="py-6 md:py-8">
            {children}
          </ContentContainer>
        </main>
      </div>
      {bottomNav}
    </div>
  );
};

