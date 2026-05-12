import type { DemoScenario, RoleScenario } from '../../types';

const toFlowStep = (id: string, title: string, description: string, status: 'not_started' | 'in_progress' | 'completed' | 'escalated') => ({
  id,
  title,
  description,
  status,
});

export const roleScenarios: RoleScenario[] = [
  {
    role: 'client',
    title: 'Client journey from onboarding to support',
    happyPath: [
      toFlowStep('onboarding', 'Onboarding', 'Client signs up and confirms wellness goals.', 'completed'),
      toFlowStep('intake', 'Intake', 'Client submits intake and receives care matching.', 'completed'),
      toFlowStep('booking', 'Book Session', 'Client books first counselling or training slot.', 'in_progress'),
      toFlowStep('progress', 'Track Progress', 'Client sees program progress and check-in trends.', 'not_started'),
    ],
    exceptionPath: [
      toFlowStep('support_ticket', 'Raise Support Ticket', 'Client raises ticket for schedule conflict.', 'completed'),
      toFlowStep('ticket_resolution', 'Resolution', 'Helpdesk resolves and confirms new slot.', 'in_progress'),
    ],
  },
  {
    role: 'counsellor',
    title: 'Counsellor session and escalation flow',
    happyPath: [
      toFlowStep('queue', 'Session Queue', 'Review assigned sessions for the day.', 'completed'),
      toFlowStep('profile', 'Client Summary', 'Open client profile and previous notes.', 'completed'),
      toFlowStep('notes', 'Session Notes', 'Complete session notes and follow-up plan.', 'in_progress'),
    ],
    exceptionPath: [
      toFlowStep('risk_flag', 'Risk Flag', 'Counsellor marks high-risk concern.', 'completed'),
      toFlowStep('admin_escalation', 'Escalate to Admin', 'Escalation sent to helpdesk/admin with SLA.', 'escalated'),
    ],
  },
  {
    role: 'trainer',
    title: 'Trainer planning and adherence flow',
    happyPath: [
      toFlowStep('assigned_plans', 'Assigned Plans', 'Trainer opens plan assignments for active clients.', 'completed'),
      toFlowStep('checkin', 'Check-in Update', 'Trainer logs check-in and session feedback.', 'in_progress'),
      toFlowStep('adherence', 'Adherence View', 'Trainer reviews adherence trend and next action.', 'not_started'),
    ],
    exceptionPath: [
      toFlowStep('pain_flag', 'Pain/Injury Flag', 'Client reports pain during check-in.', 'completed'),
      toFlowStep('handoff', 'Clinical Handoff', 'Trainer hands off case to counsellor/helpdesk path.', 'escalated'),
    ],
  },
  {
    role: 'helpdesk',
    title: 'Helpdesk triage and resolution flow',
    happyPath: [
      toFlowStep('triage', 'Ticket Triage', 'Classify incoming ticket by urgency and module.', 'completed'),
      toFlowStep('reassign', 'Reassignment', 'Route to counsellor/trainer/admin owner.', 'in_progress'),
      toFlowStep('resolve', 'Resolution', 'Confirm user resolution and close ticket.', 'not_started'),
    ],
    exceptionPath: [
      toFlowStep('sla_breach', 'SLA Breach Risk', 'Ticket nears SLA breach threshold.', 'completed'),
      toFlowStep('priority_escalation', 'Priority Escalation', 'Escalate to admin for immediate action.', 'escalated'),
    ],
  },
  {
    role: 'admin',
    title: 'Admin governance and operations flow',
    happyPath: [
      toFlowStep('approvals', 'Approvals', 'Approve professional onboarding and role access.', 'completed'),
      toFlowStep('ops_dash', 'Operations Dashboard', 'Monitor usage, revenue, and performance KPIs.', 'in_progress'),
      toFlowStep('oversight', 'Escalation Oversight', 'Close escalations with owner assignment.', 'not_started'),
    ],
    exceptionPath: [
      toFlowStep('critical_incident', 'Critical Incident', 'Platform incident or risk case detected.', 'completed'),
      toFlowStep('war_room', 'Cross-team Response', 'Admin triggers cross-team mitigation workflow.', 'escalated'),
    ],
  },
  {
    role: 'content',
    title: 'Content publishing flow',
    happyPath: [
      toFlowStep('draft', 'Program Draft', 'Create or edit wellness program draft.', 'completed'),
      toFlowStep('review', 'Review', 'Submit draft for quality and compliance checks.', 'in_progress'),
      toFlowStep('publish', 'Publish', 'Publish approved version to member programs.', 'not_started'),
    ],
    exceptionPath: [
      toFlowStep('compliance_hold', 'Compliance Hold', 'Program flagged for sensitive content review.', 'completed'),
      toFlowStep('legal_route', 'Legal Review', 'Route to legal/admin before publish.', 'escalated'),
    ],
  },
];

export const demoScenarios: DemoScenario[] = [
  {
    role: 'client',
    entryRoute: '/client/intake',
    steps: ['Onboarding', 'Intake', 'Book Session', 'Progress', 'Support Ticket'],
    expectedOutcome: 'Client booked and actively supported through helpdesk if needed.',
  },
  {
    role: 'counsellor',
    entryRoute: '/counsellor/sessions',
    steps: ['Session Queue', 'Client Summary', 'Session Notes', 'Escalation'],
    expectedOutcome: 'Counsellor closes routine sessions and escalates flagged cases.',
  },
  {
    role: 'trainer',
    entryRoute: '/trainer/plans',
    steps: ['Assigned Plans', 'Check-in', 'Adherence Review', 'Escalation'],
    expectedOutcome: 'Trainer tracks outcomes and routes edge cases safely.',
  },
  {
    role: 'helpdesk',
    entryRoute: '/helpdesk/tickets',
    steps: ['Triage', 'Reassignment', 'Resolution', 'SLA Escalation'],
    expectedOutcome: 'Support queue gets resolved without dead ends.',
  },
  {
    role: 'admin',
    entryRoute: '/admin',
    steps: ['Approvals', 'Ops Dashboard', 'Escalation Oversight'],
    expectedOutcome: 'Admin maintains platform control and service quality.',
  },
  {
    role: 'content',
    entryRoute: '/content/programs',
    steps: ['Draft', 'Review', 'Publish', 'Compliance Escalation'],
    expectedOutcome: 'Safe wellness content is published with review gates.',
  },
];

export function getRoleScenario(role: RoleScenario['role']) {
  return roleScenarios.find((item) => item.role === role);
}
