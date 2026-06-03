import type { CbtCarePlan, CbtCategory, CbtExerciseInstance, CbtExerciseTemplate, CbtProgress, CbtPractitionerReview, CbtExerciseResponse } from '../types/cbt.types';

export const mockCbtCategories: CbtCategory[] = [
  { id: 1, name: 'Mood Tracking', slug: 'mood-tracking', description: 'Brief wellbeing check-ins.', sortOrder: 10, isActive: true },
  { id: 2, name: 'Cognitive Restructuring', slug: 'cognitive-restructuring', description: 'Thought records and balanced thinking.', sortOrder: 20, isActive: true },
  { id: 3, name: 'Behavioral Activation', slug: 'behavioral-activation', description: 'Small actions that support mood.', sortOrder: 30, isActive: true },
];

export const mockCbtTemplates: CbtExerciseTemplate[] = [
  {
    id: 1,
    categoryId: 1,
    category: mockCbtCategories[0],
    title: 'Mood Check-in',
    slug: 'mood-check-in',
    description: 'A quick daily check-in for mood, anxiety, sleep, and energy.',
    clinicalPurpose: 'Track daily emotional state.',
    instructions: 'Answer each item based on today.',
    difficultyLevel: 'intro',
    estimatedMinutes: 4,
    targetConditions: ['anxiety', 'depression', 'stress'],
    isActive: true,
    templateSchema: {
      fields: [
        { key: 'mood_score', label: 'Mood score', type: 'slider', min: 0, max: 10, required: true },
        { key: 'anxiety_score', label: 'Anxiety score', type: 'slider', min: 0, max: 10, required: true },
        { key: 'main_emotion', label: 'Main emotion', type: 'select', options: ['Good', 'Okay', 'Anxious', 'Low', 'Angry'] },
        { key: 'note', label: 'Anything important today?', type: 'textarea' },
      ],
    },
  },
  {
    id: 2,
    categoryId: 2,
    category: mockCbtCategories[1],
    title: 'Thought Record',
    slug: 'thought-record',
    description: 'Identify a situation, automatic thought, evidence, and balanced alternative.',
    clinicalPurpose: 'Support cognitive restructuring.',
    instructions: 'Move step by step. A few honest notes are enough.',
    difficultyLevel: 'standard',
    estimatedMinutes: 15,
    targetConditions: ['anxiety', 'depression'],
    isActive: true,
    templateSchema: {
      fields: [
        { key: 'situation', label: 'What happened?', type: 'textarea', required: true },
        { key: 'emotions', label: 'What emotions did you feel?', type: 'multi_select', options: ['Anxiety', 'Sadness', 'Anger', 'Guilt', 'Fear'] },
        { key: 'emotion_before', label: 'Emotion intensity before', type: 'slider', min: 0, max: 100, required: true },
        { key: 'automatic_thought', label: 'What went through your mind?', type: 'textarea', required: true },
        { key: 'cognitive_distortion', label: 'Possible thinking pattern', type: 'select', options: ['Catastrophizing', 'Mind reading', 'Overgeneralization', 'Should statements'] },
        { key: 'balanced_thought', label: 'A more balanced thought', type: 'textarea' },
        { key: 'emotion_after', label: 'Emotion intensity now', type: 'slider', min: 0, max: 100 },
      ],
    },
  },
  {
    id: 3,
    categoryId: 3,
    category: mockCbtCategories[2],
    title: 'Behavioral Activation',
    slug: 'behavioral-activation',
    description: 'Plan and review one meaningful or pleasant activity.',
    clinicalPurpose: 'Connect behavior and mood change.',
    instructions: 'Choose a small realistic activity.',
    difficultyLevel: 'intro',
    estimatedMinutes: 10,
    targetConditions: ['depression', 'stress'],
    isActive: true,
    templateSchema: {
      fields: [
        { key: 'planned_activity', label: 'Planned activity', type: 'text', required: true },
        { key: 'activity_type', label: 'Activity type', type: 'radio', options: ['Pleasant', 'Mastery', 'Social', 'Health'] },
        { key: 'planned_date', label: 'Date', type: 'date' },
        { key: 'planned_time', label: 'Time', type: 'time' },
        { key: 'completed', label: 'I completed this activity', type: 'checkbox' },
        { key: 'mood_after', label: 'Mood after', type: 'slider', min: 0, max: 10 },
      ],
    },
  },
];

const mockReview: CbtPractitionerReview = {
  id: 1,
  exerciseResponseId: 1,
  reviewedBy: 3,
  reviewStatus: 'reviewed',
  clinicalNotes: 'Good use of evidence against the thought.',
  feedbackToClient: 'You identified a balanced thought clearly. Practice re-reading it before your next meeting.',
  riskFlag: false,
  nextAction: 'Repeat once before the next session.',
  reviewedAt: '2026-06-02T11:00:00+05:30',
};

const mockResponse: CbtExerciseResponse = {
  id: 1,
  exerciseInstanceId: 2,
  clientId: 2,
  responseJson: {
    situation: 'Manager asked for a quick update.',
    emotion_before: 75,
    automatic_thought: 'I will make a mistake.',
    balanced_thought: 'I can answer what I know and ask for time if needed.',
    emotion_after: 45,
  },
  emotionBefore: 75,
  emotionAfter: 45,
  submittedAt: '2026-06-02T10:30:00+05:30',
  exerciseTitle: 'Thought Record',
  review: mockReview,
};

export const mockCbtInstances: CbtExerciseInstance[] = [
  { id: 1, planExerciseId: 1, clientId: 2, scheduledDate: '2026-06-03', dueAt: '2026-06-03T18:00:00+05:30', status: 'pending', template: mockCbtTemplates[0], response: null },
  { id: 2, planExerciseId: 2, clientId: 2, scheduledDate: '2026-06-02', dueAt: '2026-06-02T18:00:00+05:30', status: 'reviewed', template: mockCbtTemplates[1], response: mockResponse },
];

export const mockCbtPlan: CbtCarePlan = {
  id: 1,
  clientId: 2,
  clientName: 'Client User',
  primaryPractitionerId: 1,
  practitionerName: 'Dr. Aisha Sharma',
  title: 'Work Anxiety CBT Plan',
  description: 'A structured CBT plan focused on work anxiety, thought records, and small behavior experiments.',
  primaryGoal: 'Reduce office anxiety from 80/100 to 40/100.',
  status: 'active',
  startDate: '2026-06-01',
  endDate: '2026-07-15',
  reviewFrequency: 'weekly',
  riskLevel: 'low',
  goals: [
    { id: 1, goalTitle: 'Complete 3 thought records per week', goalDescription: 'Practice identifying automatic thoughts during work stress.', baselineScore: 1, targetScore: 3, currentScore: 2, status: 'active' },
  ],
  exercises: [
    { id: 1, carePlanId: 1, exerciseTemplateId: 1, template: mockCbtTemplates[0], title: 'Mood Check-in', instructions: mockCbtTemplates[0].instructions, frequency: 'daily', startDate: '2026-06-01', dueTime: '18:00', priority: 'medium', status: 'active', instances: [mockCbtInstances[0]] },
    { id: 2, carePlanId: 1, exerciseTemplateId: 2, template: mockCbtTemplates[1], title: 'Thought Record', instructions: mockCbtTemplates[1].instructions, frequency: 'weekly', startDate: '2026-06-02', dueTime: '18:00', priority: 'high', status: 'active', instances: [mockCbtInstances[1]] },
  ],
};

export const mockCbtProgress: CbtProgress = {
  carePlanId: 1,
  completionRate: 62,
  totalInstances: 8,
  completedInstances: 5,
  pendingReviews: 1,
  averageAnxietyBefore: 72,
  averageAnxietyAfter: 48,
  improvementScore: 24,
};

export const mockCbtResponses: CbtExerciseResponse[] = [mockResponse];
