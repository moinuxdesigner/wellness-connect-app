import { ReactNode, HTMLAttributes } from 'react';

export interface ListItemProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
  leftContent?: ReactNode;
  rightContent?: ReactNode;
  onClick?: () => void;
}

export const ListItem = ({
  title,
  subtitle,
  leftContent,
  rightContent,
  onClick,
  className = '',
  ...props
}: ListItemProps) => {
  const isClickable = !!onClick;

  return (
    <div
      onClick={onClick}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={(event) => {
        if (!onClick) return;
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onClick();
        }
      }}
      className={`flex items-center gap-3 p-4 ${
        isClickable ? 'cursor-pointer hover:bg-surface-subtle active:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-inset' : ''
      } transition-colors ${className}`}
      {...props}
    >
      {leftContent && <div className="flex-shrink-0">{leftContent}</div>}
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-text-primary truncate">{title}</h4>
        {subtitle && <p className="text-sm text-text-secondary truncate mt-0.5">{subtitle}</p>}
      </div>
      {rightContent && <div className="flex-shrink-0">{rightContent}</div>}
    </div>
  );
};
