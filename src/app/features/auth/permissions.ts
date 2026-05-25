import type { AuthUser } from './auth';

export function hasPermission(user: AuthUser | null | undefined, permission: string): boolean {
  return Boolean(user?.permissions?.includes(permission));
}

export function hasAnyPermission(user: AuthUser | null | undefined, permissions: string[]): boolean {
  return permissions.some((permission) => hasPermission(user, permission));
}
