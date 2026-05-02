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
