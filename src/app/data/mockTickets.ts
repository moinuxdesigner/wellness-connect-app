import type { TicketSummary, Role } from '../types';

export const mockTickets: TicketSummary[] = [
  { id: 'T-101', title: 'Client reports panic episode post-session', priority: 'high', status: 'in-progress', createdAt: '2026-05-01' },
  { id: 'T-102', title: 'Payment reconciliation mismatch', priority: 'medium', status: 'open', createdAt: '2026-04-30' },
  { id: 'T-103', title: 'Unable to assign coach in intake flow', priority: 'medium', status: 'open', createdAt: '2026-04-29' },
  { id: 'T-104', title: 'Data export request from enterprise partner', priority: 'low', status: 'resolved', createdAt: '2026-04-27' },
];

export const mockRoles: { role: Role; users: number; status: 'healthy' | 'needs-review' }[] = [
  { role: 'client', users: 2228, status: 'healthy' },
  { role: 'counsellor', users: 47, status: 'healthy' },
  { role: 'trainer', users: 39, status: 'healthy' },
  { role: 'coach', users: 22, status: 'needs-review' },
  { role: 'helpdesk', users: 14, status: 'healthy' },
  { role: 'admin', users: 5, status: 'healthy' },
  { role: 'finance', users: 4, status: 'healthy' },
  { role: 'legal', users: 3, status: 'healthy' },
  { role: 'content', users: 9, status: 'healthy' },
];
