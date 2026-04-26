import { ReactNode } from 'react';

export interface PageHeaderProps {
  title: string;
  eyebrow?: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
}

export const PageHeader = ({ title, eyebrow, description, actions, className = '' }: PageHeaderProps) => {
  return (
    <header className={`flex flex-col gap-4 border-b border-border-default pb-5 md:flex-row md:items-end md:justify-between ${className}`}>
      <div className="min-w-0">
        {eyebrow && <p className="mb-1 text-sm font-medium text-action-primary">{eyebrow}</p>}
        <h1 className="text-2xl font-semibold leading-tight text-text-primary md:text-3xl">{title}</h1>
        {description && <p className="mt-2 max-w-3xl text-sm leading-6 text-text-secondary md:text-base">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </header>
  );
};

