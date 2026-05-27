export type TrainerRenewalStatus = 'Active' | 'Due Soon';

export type TrainerRenewalDisplay = {
  id: string;
  clientName: string;
  planName: string;
  renewalDate: string;
  dueLabel: string;
  price: string;
  status: TrainerRenewalStatus;
};

export type CompactPriorityMockItem = {
  id: 'programs' | 'messages' | 'requests';
  value: string;
  label: string;
  supportingText: string;
  tone: 'green' | 'purple' | 'blue';
  icon: 'programs' | 'messages' | 'client';
  to?: '/trainer/plans' | '/trainer/notifications';
};

export const trainerAvatarByName: Record<string, string> = {
  'Coach Arjun': '/images/ui_faces/uifaces-popular-avatar.jpg',
  'Rohan Mehta': '/images/ui_faces/uifaces-popular-avatar (1).jpg',
  'Anaya Sharma': '/images/ui_faces/uifaces-human-avatar.jpg',
  'Vikram Singh': '/images/ui_faces/uifaces-popular-avatar (2).jpg',
  'Neha Verma': '/images/ui_faces/uifaces-human-avatar (1).jpg',
  'Arjun Kapoor': '/images/ui_faces/uifaces-popular-avatar (3).jpg',
  'Simran Kaur': '/images/ui_faces/uifaces-human-avatar (2).jpg',
};

const avatarPool = [
  '/images/ui_faces/uifaces-popular-avatar (4).jpg',
  '/images/ui_faces/uifaces-human-avatar (3).jpg',
  '/images/ui_faces/uifaces-popular-avatar (5).jpg',
];

export function avatarForName(name?: string | null): string {
  if (!name) return avatarPool[0];
  if (trainerAvatarByName[name]) return trainerAvatarByName[name];
  const seed = [...name].reduce((sum, character) => sum + character.charCodeAt(0), 0);
  return avatarPool[seed % avatarPool.length];
}

// TODO: Replace with a trainer-authorized subscription renewals API when it is available.
export const mockUpcomingRenewals: TrainerRenewalDisplay[] = [
  { id: 'renewal-rohan', clientName: 'Rohan Mehta', planName: 'Premium Plan', renewalDate: 'May 22, 2024', dueLabel: 'in 4 days', price: '\u20b92,499', status: 'Active' },
  { id: 'renewal-anaya', clientName: 'Anaya Sharma', planName: 'Premium Plan', renewalDate: 'May 25, 2024', dueLabel: 'in 7 days', price: '\u20b92,499', status: 'Active' },
  { id: 'renewal-vikram', clientName: 'Vikram Singh', planName: 'Standard Plan', renewalDate: 'May 27, 2024', dueLabel: 'in 9 days', price: '\u20b91,999', status: 'Due Soon' },
  { id: 'renewal-neha', clientName: 'Neha Verma', planName: 'Premium Plan', renewalDate: 'May 30, 2024', dueLabel: 'in 12 days', price: '\u20b92,499', status: 'Due Soon' },
];

// TODO: Replace with activity/nutrition-derived calories totals when tracking is exposed to trainers.
export const mockCaloriesTracked = { value: '18,420', trend: '8% vs last week' };

// TODO: Replace these compact-only unsupported widgets with trainer APIs when available.
export const mockCompactFocus = {
  dailyGoalPercent: 78,
  message: "You're on track to help clients crush their goals!",
};

export const mockCompactPriorityItems: CompactPriorityMockItem[] = [
  { id: 'programs', value: '3', label: 'Programs', supportingText: 'To Review', tone: 'green', icon: 'programs', to: '/trainer/plans' },
  { id: 'messages', value: '5', label: 'Unread', supportingText: 'Notifications', tone: 'purple', icon: 'messages', to: '/trainer/notifications' },
  { id: 'requests', value: '1', label: 'New Client', supportingText: 'Request', tone: 'blue', icon: 'client' },
];
