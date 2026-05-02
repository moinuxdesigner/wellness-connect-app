import type { UserSummary } from '../types';

export const mockUsers: UserSummary[] = [
  { id: 'U-1001', name: 'Sarah Johnson', email: 'sarah@demo.com', role: 'client', status: 'active', joinedAt: '2026-02-12' },
  { id: 'U-1002', name: 'Dr. Ananya Sharma', email: 'ananya@demo.com', role: 'counsellor', status: 'active', joinedAt: '2026-01-08' },
  { id: 'U-1003', name: 'Rahul Mehta', email: 'rahul@demo.com', role: 'trainer', status: 'active', joinedAt: '2026-01-16' },
  { id: 'U-1004', name: 'Priya Nair', email: 'priya@demo.com', role: 'coach', status: 'pending', joinedAt: '2026-04-27' },
  { id: 'U-1005', name: 'Aarav Gupta', email: 'aarav@demo.com', role: 'helpdesk', status: 'active', joinedAt: '2026-03-03' },
  { id: 'U-1006', name: 'Neha Verma', email: 'neha@demo.com', role: 'counsellor', status: 'pending', joinedAt: '2026-04-20' },
  { id: 'U-1007', name: 'Ishita Rao', email: 'ishita@demo.com', role: 'client', status: 'suspended', joinedAt: '2026-02-02' },
  { id: 'U-1008', name: 'Karan Singh', email: 'karan@demo.com', role: 'trainer', status: 'active', joinedAt: '2026-03-11' },
];
