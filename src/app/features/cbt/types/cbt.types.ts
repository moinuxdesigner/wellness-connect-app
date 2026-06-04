export type CbtFieldType = 'text' | 'textarea' | 'select' | 'multi_select' | 'slider' | 'date' | 'time' | 'checkbox' | 'radio';

export interface CbtTemplateField {
  key: string;
  label: string;
  type: CbtFieldType;
  required?: boolean;
  options?: string[];
  min?: number;
  max?: number;
}

export interface CbtTemplateSchema {
  fields: CbtTemplateField[];
}

export interface CbtCategory {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  sortOrder: number;
  isActive: boolean;
}

export interface CbtExerciseTemplate {
  id: number;
  categoryId?: number | null;
  category?: CbtCategory | null;
  title: string;
  slug: string;
  description?: string | null;
  clinicalPurpose?: string | null;
  instructions?: string | null;
  difficultyLevel: 'intro' | 'standard' | 'advanced';
  estimatedMinutes: number;
  targetConditions: string[];
  templateSchema: CbtTemplateSchema;
  isActive: boolean;
}

export interface CbtPlanGoal {
  id: number;
  goalTitle: string;
  goalDescription?: string | null;
  baselineScore?: number | null;
  targetScore?: number | null;
  currentScore?: number | null;
  status: 'active' | 'completed' | 'paused';
}

export interface CbtPlanExercise {
  id: number;
  carePlanId: number;
  exerciseTemplateId: number;
  template?: CbtExerciseTemplate | null;
  title: string;
  instructions?: string | null;
  frequency: 'once' | 'daily' | 'weekly' | 'as_needed' | 'custom';
  startDate?: string | null;
  endDate?: string | null;
  dueTime?: string | null;
  priority: 'low' | 'medium' | 'high';
  status: 'active' | 'paused' | 'completed' | 'cancelled';
  instances: CbtExerciseInstance[];
}

export interface CbtCarePlan {
  id: number;
  clientId: number;
  clientName?: string | null;
  primaryPractitionerId?: number | null;
  practitionerName?: string | null;
  title: string;
  description?: string | null;
  primaryGoal?: string | null;
  status: 'draft' | 'active' | 'paused' | 'completed' | 'cancelled';
  startDate?: string | null;
  endDate?: string | null;
  reviewFrequency?: string | null;
  riskLevel: 'low' | 'medium' | 'high';
  goals: CbtPlanGoal[];
  exercises: CbtPlanExercise[];
}

export interface CbtExerciseInstance {
  id: number;
  planExerciseId: number;
  clientId: number;
  scheduledDate: string;
  dueAt?: string | null;
  status: 'pending' | 'in_progress' | 'completed' | 'missed' | 'reviewed';
  startedAt?: string | null;
  completedAt?: string | null;
  template?: CbtExerciseTemplate | null;
  planExercise?: CbtPlanExercise | null;
  response?: CbtExerciseResponse | null;
}

export interface CbtExerciseResponse {
  id: number;
  exerciseInstanceId: number;
  clientId: number;
  responseJson: Record<string, unknown>;
  scoreJson?: Record<string, unknown> | null;
  emotionBefore?: number | null;
  emotionAfter?: number | null;
  clientReflection?: string | null;
  submittedAt: string;
  exerciseTitle?: string | null;
  review?: CbtPractitionerReview | null;
}

export interface CbtPractitionerReview {
  id: number;
  exerciseResponseId: number;
  reviewedBy?: number | null;
  reviewStatus: 'pending_review' | 'reviewed' | 'needs_follow_up' | 'escalated';
  clinicalNotes?: string | null;
  feedbackToClient?: string | null;
  riskFlag: boolean;
  nextAction?: string | null;
  reviewedAt: string;
}

export interface CbtProgress {
  carePlanId: number;
  completionRate: number;
  totalInstances: number;
  completedInstances: number;
  pendingReviews: number;
  averageAnxietyBefore?: number | null;
  averageAnxietyAfter?: number | null;
  improvementScore?: number | null;
}

export interface PractitionerCbtDashboardPlan {
  id: number;
  clientId: number;
  clientName?: string | null;
  title: string;
  status: CbtCarePlan['status'];
  riskLevel: CbtCarePlan['riskLevel'];
  completionRate: number;
  pendingReviews: number;
  exerciseCount: number;
  updatedAt?: string | null;
}

export interface PractitionerCbtDashboardResponse {
  stats: {
    activePlans: number;
    completionRate: number;
    pendingReviews: number;
  };
  plans: PractitionerCbtDashboardPlan[];
}
