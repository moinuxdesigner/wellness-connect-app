export type Role =
  | 'client'
  | 'counsellor'
  | 'trainer'
  | 'coach'
  | 'helpdesk'
  | 'admin'
  | 'finance'
  | 'legal'
  | 'content';

export type FlowStatus = 'not_started' | 'in_progress' | 'completed' | 'escalated';

export interface FlowStep {
  id: string;
  title: string;
  description: string;
  status: FlowStatus;
}

export interface RoleScenario {
  role: Extract<Role, 'client' | 'counsellor' | 'trainer' | 'helpdesk' | 'admin' | 'content'>;
  title: string;
  happyPath: FlowStep[];
  exceptionPath: FlowStep[];
}

export interface DemoScenario {
  role: RoleScenario['role'];
  entryRoute: string;
  steps: string[];
  expectedOutcome: string;
}

export interface UserSummary {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: 'active' | 'pending' | 'suspended';
  joinedAt: string;
}

export interface AppointmentSummary {
  id: string;
  serviceType: 'counselling' | 'training' | 'coaching';
  clientName: string;
  professionalName: string;
  scheduleAt: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

export interface ProgramSummary {
  id: string;
  title: string;
  category: 'fitness' | 'mental-wellness' | 'lifestyle';
  status: 'published' | 'draft' | 'archived';
  assignedCount: number;
}

export interface TicketSummary {
  id: string;
  title: string;
  priority: 'low' | 'medium' | 'high';
  status: 'open' | 'in-progress' | 'resolved';
  createdAt: string;
}

export interface DashboardMetric {
  label: string;
  value: string;
  delta: string;
}
