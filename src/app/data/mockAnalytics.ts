import type { DashboardMetric } from '../types';

export const mockAdminMetrics: DashboardMetric[] = [
  { label: 'Active Members', value: '2,481', delta: '+4.2% this month' },
  { label: 'Scheduled Sessions', value: '318', delta: '+8.1% this week' },
  { label: 'MRR (Placeholder)', value: '$48,230', delta: '+3.7% this month' },
  { label: 'Open Escalations', value: '17', delta: '-9.5% this week' },
];

export const mockUsageMetrics: DashboardMetric[] = [
  { label: 'DAU', value: '1,102', delta: '+2.1%' },
  { label: 'MAU', value: '6,873', delta: '+5.8%' },
  { label: 'Session Completion', value: '83%', delta: '+1.4%' },
  { label: 'Avg Resolution Time', value: '5h 20m', delta: '-11%' },
];
