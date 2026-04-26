import { ReactNode } from 'react';

export interface SectionHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
}

export const SectionHeader = ({ title, description, actions, className = '' }: SectionHeaderProps) => {
  return (
    <div className={`flex flex-col gap-3 md:flex-row md:items-center md:justify-between ${className}`}>
      <div>
        <h2 className="text-lg font-semibold leading-tight text-text-primary">{title}</h2>
        {description && <p className="mt-1 text-sm leading-5 text-text-secondary">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
};

