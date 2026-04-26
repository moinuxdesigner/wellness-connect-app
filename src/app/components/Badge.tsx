import { HTMLAttributes, forwardRef } from 'react';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'neutral';
  size?: 'sm' | 'md';
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = 'primary', size = 'md', className = '', children, ...props }, ref) => {
    const variantStyles = {
      primary: 'bg-action-primary-subtle text-action-primary',
      secondary: 'bg-action-secondary-subtle text-secondary',
      success: 'bg-status-success-subtle text-status-success',
      warning: 'bg-status-warning-subtle text-status-warning',
      error: 'bg-status-error-subtle text-status-error',
      info: 'bg-status-info-subtle text-status-info',
      neutral: 'bg-surface-muted text-text-secondary',
    };

    const sizeStyles = {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-3 py-1 text-sm',
    };

    return (
      <span
        ref={ref}
        className={`inline-flex items-center justify-center font-medium rounded-full ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';
