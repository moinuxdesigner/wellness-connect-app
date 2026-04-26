import { ReactNode } from 'react';
import { Card } from './Card';

export interface StatCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  trend?: {
    value: string;
    direction: 'up' | 'down';
  };
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'purple' | 'teal';
}

export const StatCard = ({ title, value, icon, trend, color = 'primary' }: StatCardProps) => {
  const colorStyles = {
    primary: 'bg-action-primary-subtle text-action-primary',
    secondary: 'bg-action-secondary-subtle text-secondary',
    success: 'bg-status-success-subtle text-status-success',
    warning: 'bg-status-warning-subtle text-status-warning',
    purple: 'bg-purple-light text-purple',
    teal: 'bg-teal-light text-teal',
  };

  return (
    <Card variant="elevated" padding="md">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-text-secondary mb-1">{title}</p>
          <p className="text-2xl font-semibold text-text-primary">{value}</p>
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              <span
                className={`text-xs font-medium ${
                  trend.direction === 'up' ? 'text-status-success' : 'text-status-error'
                }`}
              >
                {trend.direction === 'up' ? '+' : '-'} {trend.value}
              </span>
            </div>
          )}
        </div>
        {icon && (
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorStyles[color]}`}>
            <div className="text-2xl">{icon}</div>
          </div>
        )}
      </div>
    </Card>
  );
};
