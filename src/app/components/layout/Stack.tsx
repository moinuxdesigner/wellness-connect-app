import { HTMLAttributes, forwardRef } from 'react';

export interface StackProps extends HTMLAttributes<HTMLDivElement> {
  gap?: '1' | '2' | '3' | '4' | '6' | '8';
  align?: 'start' | 'center' | 'end' | 'stretch';
}

export const Stack = forwardRef<HTMLDivElement, StackProps>(
  ({ gap = '4', align = 'stretch', className = '', children, ...props }, ref) => {
    const gapStyles = {
      '1': 'gap-1',
      '2': 'gap-2',
      '3': 'gap-3',
      '4': 'gap-4',
      '6': 'gap-6',
      '8': 'gap-8',
    };

    const alignStyles = {
      start: 'items-start',
      center: 'items-center',
      end: 'items-end',
      stretch: 'items-stretch',
    };

    return (
      <div ref={ref} className={`flex flex-col ${gapStyles[gap]} ${alignStyles[align]} ${className}`} {...props}>
        {children}
      </div>
    );
  }
);

Stack.displayName = 'Stack';

