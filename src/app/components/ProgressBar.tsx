import { HTMLAttributes } from 'react';

export interface ProgressBarProps extends HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const ProgressBar = ({
  value,
  max = 100,
  color = 'primary',
  size = 'md',
  showLabel = false,
  className = '',
  ...props
}: ProgressBarProps) => {
  const safeMax = max > 0 ? max : 100;
  const safeValue = Math.min(Math.max(value, 0), safeMax);
  const percentage = Math.min(Math.max((safeValue / safeMax) * 100, 0), 100);

  const colorStyles = {
    primary: 'bg-primary',
    secondary: 'bg-secondary',
    success: 'bg-success',
    warning: 'bg-warning',
    error: 'bg-error',
  };

  const sizeStyles = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  return (
    <div
      className={`w-full ${className}`}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={safeMax}
      aria-valuenow={safeValue}
      {...props}
    >
      <div className={`w-full bg-surface-muted rounded overflow-hidden ${sizeStyles[size]}`}>
        <div
          className={`${colorStyles[color]} h-full rounded transition-all duration-300 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <p className="text-xs text-text-secondary mt-1 text-right">{Math.round(percentage)}%</p>
      )}
    </div>
  );
};
