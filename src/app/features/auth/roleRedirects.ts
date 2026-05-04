import type { Role } from '../../types';

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
