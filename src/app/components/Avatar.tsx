import { ImgHTMLAttributes, forwardRef } from 'react';

export interface AvatarProps extends ImgHTMLAttributes<HTMLImageElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  name?: string;
  showBadge?: boolean;
  badgeColor?: 'success' | 'warning' | 'error';
}

export const Avatar = forwardRef<HTMLImageElement, AvatarProps>(
  ({ size = 'md', name, src, alt, showBadge = false, badgeColor = 'success', className = '', ...props }, ref) => {
    const sizeStyles = {
      sm: 'w-8 h-8 text-xs',
      md: 'w-10 h-10 text-sm',
      lg: 'w-14 h-14 text-base',
      xl: 'w-20 h-20 text-xl',
    };

    const badgeColorStyles = {
      success: 'bg-success',
      warning: 'bg-warning',
      error: 'bg-error',
    };

    const badgeSizeStyles = {
      sm: 'w-2 h-2',
      md: 'w-2.5 h-2.5',
      lg: 'w-3 h-3',
      xl: 'w-4 h-4',
    };

    const getInitials = (name: string) => {
      return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    };

    return (
      <div className="relative inline-block">
        <div
          className={`${sizeStyles[size]} rounded-full overflow-hidden bg-neutral-200 flex items-center justify-center font-medium text-neutral-700 ${className}`}
        >
          {src ? (
            <img ref={ref} src={src} alt={alt || name} className="w-full h-full object-cover" {...props} />
          ) : name ? (
            <span>{getInitials(name)}</span>
          ) : (
            <span>?</span>
          )}
        </div>
        {showBadge && (
          <div
            className={`absolute bottom-0 right-0 ${badgeSizeStyles[size]} ${badgeColorStyles[badgeColor]} border-2 border-white rounded-full`}
          />
        )}
      </div>
    );
  }
);

Avatar.displayName = 'Avatar';
