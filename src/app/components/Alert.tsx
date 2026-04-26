import { ReactNode, HTMLAttributes } from 'react';

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'success' | 'warning' | 'error' | 'info';
  title?: string;
  icon?: ReactNode;
  onClose?: () => void;
}

export const Alert = ({
  variant = 'info',
  title,
  icon,
  onClose,
  children,
  className = '',
  ...props
}: AlertProps) => {
  const variantStyles = {
    success: 'bg-status-success-subtle border-status-success text-status-success',
    warning: 'bg-status-warning-subtle border-status-warning text-status-warning',
    error: 'bg-status-error-subtle border-status-error text-status-error',
    info: 'bg-status-info-subtle border-status-info text-status-info',
  };

  const defaultIcons = {
    success: 'OK',
    warning: '!',
    error: 'X',
    info: 'i',
  };

  return (
    <div
      className={`flex gap-3 p-4 rounded-md border-l-4 ${variantStyles[variant]} ${className}`}
      role={variant === 'error' ? 'alert' : 'status'}
      {...props}
    >
      <div className="flex-shrink-0 text-sm font-bold" aria-hidden="true">
        {icon || defaultIcons[variant]}
      </div>
      <div className="flex-1">
        {title && <h4 className="font-semibold mb-1">{title}</h4>}
        <div className="text-sm opacity-90">{children}</div>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="flex-shrink-0 rounded-sm px-1 hover:opacity-70 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2"
          aria-label="Dismiss alert"
          type="button"
        >
          X
        </button>
      )}
    </div>
  );
};
