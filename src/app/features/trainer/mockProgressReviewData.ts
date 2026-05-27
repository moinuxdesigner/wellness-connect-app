import { trainerAvatarByName } from './mockTrainerDashboardData';

export type TrainerProfile = {
  name: string;
  title: string;
  avatarUrl: string;
  online: boolean;
};

export type DateRange = {
  label: string;
};

export type ProgressKpi = {
  id: 'weight-change' | 'strength-gain' | 'attendance' | 'workout-adherence';
  title: string;
  icon: 'scale' | 'dumbbell' | 'calendar' | 'target';
  value: string;
  supportingText: string;
  tone: 'success' | 'neutral';
  usesInfoDot?: boolean;
};

export type BodyMetricTrend = {
  id: 'weight' | 'body-fat' | 'muscle-mass' | 'bmi';
  label: string;
  icon: 'scale' | 'percent' | 'arm' | 'badge';
  startValue: string;
  currentValue: string;
  change: string;
  tone: 'success' | 'neutral';
};

export type MuscleFocusItem = {
  id: 'lower-body' | 'upper-body' | 'core' | 'conditioning';
  label: string;
  percent: number;
  sets: number;
  color: string;
};

export type RecommendationCard = {
  id: 'coach' | 'recovery';
  title: string;
  icon: 'star' | 'heart';
  body: string;
  ctaLabel: string;
  to: string;
};

export type MessageAttachmentView = {
  name: string;
  type: string;
  sizeLabel: string;
};

export type MessageThreadItem = {
  id: string;
  senderName: string;
  senderRole: 'trainer' | 'client';
  timestampLabel: string;
  body: string;
  attachment?: MessageAttachmentView;
};

export type QuickAction = {
  id: 'plan' | 'template' | 'photo' | 'note';
  label: string;
  icon: 'calendar' | 'file' | 'image' | 'note';
};

export type ProgressReviewMockData = {
  trainer: TrainerProfile;
  clientFallback: {
    name: string;
    status: string;
    age: number;
    gender: string;
  };
  dateRange: DateRange;
  bodyMetrics: BodyMetricTrend[];
  muscleFocus: MuscleFocusItem[];
  recommendations: RecommendationCard[];
  messages: MessageThreadItem[];
  quickActions: QuickAction[];
};

export const progressReviewMockData: ProgressReviewMockData = {
  trainer: {
    name: 'Coach Arjun',
    title: 'Personal Trainer',
    avatarUrl: trainerAvatarByName['Coach Arjun'],
    online: true,
  },
  clientFallback: {
    name: 'Neha Verma',
    status: 'Active',
    age: 28,
    gender: 'Female',
  },
  dateRange: {
    label: 'May 12 - Jun 12, 2024',
  },
  bodyMetrics: [
    { id: 'weight', label: 'Weight (kg)', icon: 'scale', startValue: '62.4', currentValue: '59.6', change: '-2.8 kg', tone: 'success' },
    { id: 'body-fat', label: 'Body Fat (%)', icon: 'percent', startValue: '26.1', currentValue: '23.3', change: '-2.8%', tone: 'success' },
    { id: 'muscle-mass', label: 'Muscle Mass (kg)', icon: 'arm', startValue: '45.2', currentValue: '47.1', change: '+1.9 kg', tone: 'success' },
    { id: 'bmi', label: 'BMI', icon: 'badge', startValue: '22.1', currentValue: '21.1', change: '-1.0', tone: 'success' },
  ],
  muscleFocus: [
    { id: 'lower-body', label: 'Lower Body', percent: 35, sets: 24, color: '#6246ea' },
    { id: 'upper-body', label: 'Upper Body', percent: 30, sets: 20, color: '#5fa8ff' },
    { id: 'core', label: 'Core', percent: 15, sets: 10, color: '#22c55e' },
    { id: 'conditioning', label: 'Conditioning', percent: 20, sets: 14, color: '#fb923c' },
  ],
  recommendations: [
    {
      id: 'coach',
      title: 'Coach Recommendation',
      icon: 'star',
      body: 'Excellent progress! Consider increasing intensity on compound lifts by 5-10% and add 1 extra set for lower body movements to continue building strength.',
      ctaLabel: 'View Updated Plan',
      to: '/trainer/plans',
    },
    {
      id: 'recovery',
      title: 'Recovery Reminder',
      icon: 'heart',
      body: 'Great effort this week! Prioritize 7-8 hrs of sleep, stay hydrated, and maintain 1.6-2.0g protein/kg body weight for optimal recovery and results.',
      ctaLabel: 'View Recovery Tips',
      to: '/trainer/check-ins',
    },
  ],
  messages: [
    {
      id: 'seed-1',
      senderName: 'Coach Arjun',
      senderRole: 'trainer',
      timestampLabel: '9:30 AM',
      body: 'Hey Neha! Great work this week. Your consistency is paying off!',
    },
    {
      id: 'seed-2',
      senderName: 'Neha Verma',
      senderRole: 'client',
      timestampLabel: '9:32 AM',
      body: 'Thanks Coach! Feeling stronger and more energetic.',
    },
    {
      id: 'seed-3',
      senderName: 'Coach Arjun',
      senderRole: 'trainer',
      timestampLabel: '9:33 AM',
      body: "Amazing! Here's your updated plan for next week.",
      attachment: {
        name: 'Neha_Week6_Plan.pdf',
        type: 'PDF',
        sizeLabel: '1.2 MB',
      },
    },
    {
      id: 'seed-4',
      senderName: 'Neha Verma',
      senderRole: 'client',
      timestampLabel: '9:35 AM',
      body: "Got it, Coach! Let's crush it.",
    },
  ],
  quickActions: [
    { id: 'plan', label: 'Plan', icon: 'calendar' },
    { id: 'template', label: 'Template', icon: 'file' },
    { id: 'photo', label: 'Photo', icon: 'image' },
    { id: 'note', label: 'Note', icon: 'note' },
  ],
};
