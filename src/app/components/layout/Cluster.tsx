import { HTMLAttributes, forwardRef } from 'react';

export interface ClusterProps extends HTMLAttributes<HTMLDivElement> {
  gap?: '1' | '2' | '3' | '4' | '6';
  justify?: 'start' | 'center' | 'between' | 'end';
  align?: 'start' | 'center' | 'end';
}

export const Cluster = forwardRef<HTMLDivElement, ClusterProps>(
  ({ gap = '3', justify = 'start', align = 'center', className = '', children, ...props }, ref) => {
    const gapStyles = {
      '1': 'gap-1',
      '2': 'gap-2',
      '3': 'gap-3',
      '4': 'gap-4',
      '6': 'gap-6',
    };

    const justifyStyles = {
      start: 'justify-start',
      center: 'justify-center',
      between: 'justify-between',
      end: 'justify-end',
    };

    const alignStyles = {
      start: 'items-start',
      center: 'items-center',
      end: 'items-end',
    };

    return (
      <div ref={ref} className={`flex flex-wrap ${gapStyles[gap]} ${justifyStyles[justify]} ${alignStyles[align]} ${className}`} {...props}>
        {children}
      </div>
    );
  }
);

Cluster.displayName = 'Cluster';

