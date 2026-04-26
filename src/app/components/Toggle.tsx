import { InputHTMLAttributes, forwardRef } from 'react';

export interface ToggleProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
}

export const Toggle = forwardRef<HTMLInputElement, ToggleProps>(
  ({ label, className = '', ...props }, ref) => {
    return (
      <label className={`inline-flex items-center gap-3 cursor-pointer group ${className}`}>
        <div className="relative">
          <input
            ref={ref}
            type="checkbox"
            role="switch"
            className="peer sr-only"
            {...props}
          />
          <div className="w-11 h-6 bg-border-strong rounded-full transition-all peer-checked:bg-action-primary peer-focus-visible:ring-2 peer-focus-visible:ring-focus-ring peer-focus-visible:ring-offset-2 peer-disabled:opacity-50 peer-disabled:cursor-not-allowed" />
          <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-surface-elevated rounded-full shadow-sm transition-transform peer-checked:translate-x-5" />
        </div>
        {label && (
          <span className="text-sm text-text-secondary group-hover:text-text-primary select-none">
            {label}
          </span>
        )}
      </label>
    );
  }
);

Toggle.displayName = 'Toggle';
