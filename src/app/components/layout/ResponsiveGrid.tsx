import { HTMLAttributes, forwardRef } from 'react';

export interface ResponsiveGridProps extends HTMLAttributes<HTMLDivElement> {
  columns?: 1 | 2 | 3 | 4;
  gap?: '3' | '4' | '6' | '8';
}

export const ResponsiveGrid = forwardRef<HTMLDivElement, ResponsiveGridProps>(
  ({ columns = 3, gap = '4', className = '', children, ...props }, ref) => {
    const columnStyles = {
      1: 'grid-cols-1',
      2: 'grid-cols-1 md:grid-cols-2',
      3: 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3',
      4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
    };

    const gapStyles = {
      '3': 'gap-3',
      '4': 'gap-4',
      '6': 'gap-6',
      '8': 'gap-8',
    };

    return (
      <div ref={ref} className={`grid ${columnStyles[columns]} ${gapStyles[gap]} ${className}`} {...props}>
        {children}
      </div>
    );
  }
);

ResponsiveGrid.displayName = 'ResponsiveGrid';

