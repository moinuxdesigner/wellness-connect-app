import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { cn } from './ui/utils';

export type UserAvatarUser = {
  name?: string | null;
  email?: string | null;
  avatarUrl?: string | null;
  avatar_url?: string | null;
  profilePhotoUrl?: string | null;
  profile_photo_url?: string | null;
};

type UserAvatarSize = 'sm' | 'md' | 'lg' | 'xl';

type UserAvatarProps = {
  user?: UserAvatarUser | null;
  size?: UserAvatarSize;
  alt?: string;
  className?: string;
  fallbackClassName?: string;
  decorative?: boolean;
  src?: string | null;
};

const sizeClassNames: Record<UserAvatarSize, string> = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
  xl: 'h-20 w-20 text-xl',
};

function firstPresentUrl(values: Array<string | null | undefined>) {
  return values.find((value) => typeof value === 'string' && value.trim().length > 0)?.trim();
}

export function getUserInitials(user?: UserAvatarUser | null) {
  const displayName = user?.name?.trim();

  if (displayName) {
    const parts = displayName.split(/\s+/).filter(Boolean);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return `${parts[0][0] ?? ''}${parts[parts.length - 1][0] ?? ''}`.toUpperCase() || 'WC';
  }

  const emailPrefix = user?.email?.split('@')[0]?.trim();
  if (emailPrefix) return emailPrefix.slice(0, 2).toUpperCase();

  return 'WC';
}

export function UserAvatar({
  user,
  size = 'md',
  alt,
  className,
  fallbackClassName,
  decorative = false,
  src,
}: UserAvatarProps) {
  const imageSrc = firstPresentUrl([
    src,
    user?.avatarUrl,
    user?.avatar_url,
    user?.profilePhotoUrl,
    user?.profile_photo_url,
  ]);
  const label = alt ?? `${user?.name?.trim() || user?.email?.trim() || 'WellnessConnect user'} avatar`;

  return (
    <Avatar
      className={cn(sizeClassNames[size], 'rounded-full', className)}
      aria-hidden={decorative || undefined}
    >
      {imageSrc ? (
        <AvatarImage
          src={imageSrc}
          alt={decorative ? '' : label}
          className="object-cover"
        />
      ) : null}
      <AvatarFallback
        className={cn(
          'bg-violet-100 font-semibold text-violet-700 dark:bg-indigo-950/70 dark:text-indigo-100',
          fallbackClassName,
        )}
      >
        {getUserInitials(user)}
      </AvatarFallback>
    </Avatar>
  );
}

