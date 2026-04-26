import { ReactNode } from 'react';

export interface SidebarItem {
  id: string;
  label: string;
  icon?: ReactNode;
  active?: boolean;
  onClick?: () => void;
}

export interface SidebarProps {
  brand?: ReactNode;
  items: SidebarItem[];
  footer?: ReactNode;
  className?: string;
}

export const Sidebar = ({ brand, items, footer, className = '' }: SidebarProps) => {
  return (
    <div className={`flex min-h-screen flex-col bg-surface-elevated p-4 ${className}`}>
      {brand && <div className="mb-6 px-2">{brand}</div>}
      <nav className="flex flex-1 flex-col gap-1" aria-label="Sidebar">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={item.onClick}
            aria-current={item.active ? 'page' : undefined}
            className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring ${
              item.active
                ? 'bg-action-primary-subtle text-action-primary'
                : 'text-text-secondary hover:bg-surface-muted hover:text-text-primary'
            }`}
          >
            {item.icon && <span className="shrink-0" aria-hidden="true">{item.icon}</span>}
            <span className="truncate">{item.label}</span>
          </button>
        ))}
      </nav>
      {footer && <div className="mt-6 border-t border-border-default pt-4">{footer}</div>}
    </div>
  );
};

