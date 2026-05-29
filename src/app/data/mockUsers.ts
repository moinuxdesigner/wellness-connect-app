import type { UserSummary } from '../types';

export const mockUsers: UserSummary[] = [
  { id: 'U-1001', name: 'Sarah Johnson', email: 'sarah@demo.com', phone: '+91 9000001001', role: 'client', status: 'active', joinedAt: '2026-02-12', lastActiveAt: '2026-05-27T10:24:00+05:30' },
  { id: 'U-1002', name: 'Dr. Ananya Sharma', email: 'ananya@demo.com', phone: '+91 9000001002', role: 'counsellor', status: 'active', joinedAt: '2026-01-08', lastActiveAt: '2026-05-26T15:40:00+05:30' },
  { id: 'U-1003', name: 'Rahul Mehta', email: 'rahul@demo.com', phone: '+91 9000001003', role: 'trainer', status: 'active', joinedAt: '2026-01-16', lastActiveAt: '2026-05-27T08:10:00+05:30' },
  { id: 'U-1004', name: 'Priya Nair', email: 'priya@demo.com', phone: '+91 9000001004', role: 'coach', status: 'pending', joinedAt: '2026-04-27', lastActiveAt: null },
  { id: 'U-1005', name: 'Aarav Gupta', email: 'aarav@demo.com', phone: '+91 9000001005', role: 'helpdesk', status: 'active', joinedAt: '2026-03-03', lastActiveAt: '2026-05-25T18:15:00+05:30' },
  { id: 'U-1006', name: 'Neha Verma', email: 'neha@demo.com', phone: '+91 9000001006', role: 'counsellor', status: 'pending', joinedAt: '2026-04-20', lastActiveAt: null },
  { id: 'U-1007', name: 'Ishita Rao', email: 'ishita@demo.com', phone: '+91 9000001007', role: 'client', status: 'suspended', joinedAt: '2026-02-02', lastActiveAt: '2026-04-10T11:00:00+05:30' },
  { id: 'U-1008', name: 'Karan Singh', email: 'karan@demo.com', phone: '+91 9000001008', role: 'trainer', status: 'active', joinedAt: '2026-03-11', lastActiveAt: '2026-05-24T09:05:00+05:30' },
];
