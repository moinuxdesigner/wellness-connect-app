import { InputHTMLAttributes, forwardRef } from 'react';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, className = '', ...props }, ref) => {
    return (
      <label className={`inline-flex items-center gap-2 cursor-pointer group ${className}`}>
        <div className="relative">
          <input
            ref={ref}
            type="checkbox"
            className="peer sr-only"
            {...props}
          />
          <div className="w-5 h-5 border-2 border-border-strong rounded-md bg-surface-elevated transition-all peer-checked:bg-action-primary peer-checked:border-action-primary peer-focus-visible:ring-2 peer-focus-visible:ring-focus-ring peer-focus-visible:ring-offset-2 peer-disabled:opacity-50 peer-disabled:cursor-not-allowed">
            <svg
              className="w-full h-full text-text-inverse opacity-0 peer-checked:opacity-100 transition-opacity"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              aria-hidden="true"
            >
              <path d="M6 10l2 2 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
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

Checkbox.displayName = 'Checkbox';
