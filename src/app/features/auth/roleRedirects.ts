import type { Role } from '../../types';
import type { AuthUser } from './auth';

export const roleHomePaths: Record<Role, string> = {
  client: '/client',
  counsellor: '/counsellor',
  trainer: '/trainer',
  coach: '/coach',
  helpdesk: '/helpdesk',
  admin: '/admin',
  finance: '/finance',
  legal: '/legal',
  content: '/content',
};

export function getRoleHomePath(role: Role): string {
  return roleHomePaths[role];
}

export function getRoleNotificationsPath(role: Role): string {
  return `${getRoleHomePath(role)}/notifications`;
}

export function getPostAuthRedirectPath(user: AuthUser): string {
  if (user.role === 'client' && user.requires_client_intake) {
    return '/client/intake';
  }

  return getRoleHomePath(user.role);
}
