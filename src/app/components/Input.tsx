import { InputHTMLAttributes, forwardRef, ReactNode, useId } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      fullWidth = false,
      className = '',
      id,
      'aria-describedby': ariaDescribedBy,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const errorId = `${inputId}-error`;
    const helperTextId = `${inputId}-helper`;
    const containerClass = fullWidth ? 'w-full' : '';
    const hasError = !!error;
    const describedBy = [
      ariaDescribedBy,
      error ? errorId : undefined,
      helperText && !error ? helperTextId : undefined,
    ]
      .filter(Boolean)
      .join(' ') || undefined;

    return (
      <div className={`flex flex-col gap-1.5 ${containerClass}`}>
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-text-secondary">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            aria-invalid={hasError || undefined}
            aria-describedby={describedBy}
            className={`
              w-full h-11 px-4 rounded-md
              bg-input-background border border-border-default
              text-text-primary placeholder:text-text-muted
              transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-focus-ring focus:border-transparent
              disabled:opacity-50 disabled:cursor-not-allowed
              ${hasError ? 'border-status-error focus:ring-status-error' : ''}
              ${leftIcon ? 'pl-10' : ''}
              ${rightIcon ? 'pr-10' : ''}
              ${className}
            `}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p id={errorId} className="text-sm text-status-error">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={helperTextId} className="text-sm text-text-muted">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
