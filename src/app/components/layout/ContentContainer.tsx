import { HTMLAttributes, forwardRef } from 'react';

export type ContentContainerSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

export interface ContentContainerProps extends HTMLAttributes<HTMLDivElement> {
  size?: ContentContainerSize;
}

export const ContentContainer = forwardRef<HTMLDivElement, ContentContainerProps>(
  ({ size = 'lg', className = '', children, ...props }, ref) => {
    const sizeStyles = {
      sm: 'max-w-2xl',
      md: 'max-w-4xl',
      lg: 'max-w-6xl',
      xl: 'max-w-7xl',
      full: 'max-w-none',
    };

    return (
      <div ref={ref} className={`mx-auto w-full px-4 md:px-6 lg:px-8 ${sizeStyles[size]} ${className}`} {...props}>
        {children}
      </div>
    );
  }
);

ContentContainer.displayName = 'ContentContainer';

