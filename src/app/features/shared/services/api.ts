import { clearAuthState, getAuthState, setAuthState, type AuthUser } from '../../auth/auth';
import { findDemoAuthUser, upsertDemoAuthUser } from '../../auth/demoAuthDirectory';

const API_BASE = import.meta.env.VITE_API_URL ?? '/api/v1';

export interface ClientAppointment {
  id: number;
  client_user_id: number;
  practitioner_id: number;
  practitioner?: {
    id: number;
    practitioner_type?: 'counsellor' | 'trainer' | 'coach' | string;
    user?: {
      id: number;
      name: string;
      email?: string;
      avatarUrl?: string | null;
      avatar_url?: string | null;
    } | null;
  } | null;
  intake_flow_id?: number | null;
  service_type: 'psychology' | 'training' | 'combined' | 'package';
  mode: 'online' | 'in_person' | 'hybrid';
  starts_at: string;
  ends_at: string;
  status: 'scheduled' | 'rescheduled' | 'cancelled' | 'completed' | 'no_show';
  cancel_reason?: string | null;
  reschedule_count: number;
}

export interface ClientDashboardSessionMetric {
  value: string | null;
  badge: string;
  serviceType: ClientAppointment['service_type'];
  startsAt: string | null;
}

export interface ClientDashboardProgram {
  title: string | null;
  type: ClientAppointment['service_type'] | 'training' | 'psychology';
  status: string;
}

export interface ClientDashboardMembershipStatus {
  label: string;
  status: string;
}

export interface ClientDashboardScheduleItem {
  id: number;
  time: string | null;
  title: string;
  coach: string;
  location: string;
  detail: string;
  status: string;
  serviceType: ClientAppointment['service_type'];
  mode: ClientAppointment['mode'];
  startsAt: string | null;
}

export interface ClientDashboardActivityItem {
  id: number;
  title: string;
  detail: string;
  time: string | null;
  category: string;
}

export interface ClientDashboardResponse {
  user: {
    id: number;
    name: string;
  };
  metrics: {
    nextSession: ClientDashboardSessionMetric | null;
    tasksPending: number;
    activeProgram: ClientDashboardProgram | null;
    membershipStatus: ClientDashboardMembershipStatus;
  };
  schedule: ClientDashboardScheduleItem[];
  recentActivity: ClientDashboardActivityItem[];
  progress: {
    sessionsCompletedThisMonth: number;
    daysActiveThisMonth: number;
    currentStreakDays: number;
  };
}

export interface ClientProgressPoint {
  date?: string | null;
  label: string;
  value: number;
}

export interface ClientProgressGoal {
  id: string;
  label: string;
  value: number;
  category: 'training' | 'mind' | 'streak' | string;
  status?: string;
}

export interface ClientProgressMilestone {
  title: string;
  subtitle: string;
  value: number;
  category: 'training' | 'mind' | 'streak' | string;
}

export interface ClientProgressResource {
  title: string;
  subtitle: string;
  image: string;
  kind?: string;
}

export interface ClientProgressActivity {
  id: number | string;
  title: string;
  subtitle: string;
  time: string;
  category?: string;
}

export interface ClientProgressMetric {
  label: string;
  value: string;
  detail: string;
  positive?: boolean;
}

export interface ClientProgressResponse {
  source: 'database' | 'mock';
  generatedAt?: string;
  summary: {
    wellnessScore: number;
    wellnessDelta: number;
    sessionsCompletedThisMonth: number;
    sessionsDeltaFromLastMonth: number;
    currentStreakDays: number;
    goalsOnTrack: number;
    totalGoals: number;
    goalsOnTrackPercent: number;
  };
  fitness: {
    statusLabel: string;
    currentWeightKg: number | null;
    weightDeltaKg: number | null;
    latestGoalProgressPercent: number | null;
    averageGoalProgressPercent: number | null;
    points: ClientProgressPoint[];
  };
  mind: {
    statusLabel: string;
    weeklyCheckInsCompleted: number;
    weeklyCheckInsTotal: number;
    currentMood: string;
    trendLabel: string;
    points: ClientProgressPoint[];
  };
  goals: ClientProgressGoal[];
  bodyMetrics: ClientProgressMetric[];
  milestones: ClientProgressMilestone[];
  resources: ClientProgressResource[];
  recentActivity: ClientProgressActivity[];
}

export interface IntakeFlow {
  id: number;
  service_type: 'psychology' | 'training' | 'combined' | 'package';
  current_step: 'service' | 'intake' | 'schedule' | 'confirm';
  status: 'draft' | 'submitted' | 'under_review' | 'auto_bookable' | 'booked' | 'closed';
  risk_level?: 'low' | 'medium' | 'high' | null;
}

export interface PractitionerItem {
  id: number;
  name: string;
  type: 'counsellor' | 'trainer' | 'coach';
  rating?: number;
  specialties: string[];
}

export interface SlotItem {
  id: number;
  starts_at: string;
  ends_at: string;
  slot_status: 'open' | 'held' | 'booked' | 'blocked';
}

export interface AccountProfileRoleDetails {
  roleLabel: string;
  workspaceTitle: string;
  client?: {
    primaryGoal?: 'fitness' | 'mental_health' | 'both' | null;
    dob?: string | null;
    age?: number | null;
    gender?: string | null;
    occupation?: string | null;
    timezone?: string | null;
    preferredLanguage?: string | null;
    profilePhotoUrl?: string | null;
  };
  trainer?: {
    applicationStatus?: string | null;
    applicationId?: string | null;
    submittedAt?: string | null;
    profilePhotoUrl?: string | null;
    specialties?: string[];
    location?: string | null;
    editUrl?: string | null;
  };
}

export interface AccountProfileResponse {
  user: AuthUser;
  roleDetails: AccountProfileRoleDetails;
}

export interface CounsellorClientItem {
  id: number;
  name: string;
  email?: string | null;
  phone?: string | null;
  avatarUrl?: string | null;
  avatar_url?: string | null;
  profilePhotoUrl?: string | null;
  primaryGoal?: string | null;
  lastSession?: string | null;
  nextSession?: string | null;
  intakeStatus?: string | null;
  risk: 'normal' | 'watch' | 'high' | string;
  nextAction: string;
}

export interface CounsellorDashboardResponse {
  metrics: Array<{
    title: string;
    value: string;
    hint: string;
  }>;
  actions: string[];
  flowReadiness: {
    happyPath: Array<{
      id: string;
      title: string;
      status: 'not_started' | 'in_progress' | 'completed' | 'escalated';
    }>;
    exceptionPath: Array<{
      id: string;
      title: string;
      status: 'not_started' | 'in_progress' | 'completed' | 'escalated';
    }>;
  };
}

export type CounsellorSessionWorkflowState = 'upcoming' | 'client_waiting' | 'in_progress' | 'notes_pending' | 'follow_up_required' | 'escalated' | 'completed';
export type CounsellorAssessmentType = 'phq_9' | 'gad_7' | 'dass_21' | 'pss' | 'bdi_ii';

export interface CounsellorSessionQueueItem {
  id: number;
  startsAt?: string | null;
  endsAt?: string | null;
  time?: string | null;
  clientId: number;
  clientName: string;
  sessionType: string;
  mode: string;
  appointmentStatus: string;
  workflowState: CounsellorSessionWorkflowState;
  actionLabel: string;
  riskLevel?: string | null;
}

export interface CounsellorSessionNotes {
  id: number;
  workflowState: CounsellorSessionWorkflowState;
  subjective?: string | null;
  objective?: string | null;
  assessment?: string | null;
  plan?: string | null;
  nextAction?: string | null;
  startedAt?: string | null;
  completedAt?: string | null;
  followUpRequestedAt?: string | null;
  escalatedAt?: string | null;
}

export interface CounsellorAssessmentResult {
  id: number;
  assessmentType: CounsellorAssessmentType;
  label?: string;
  score: number;
  severity?: string | null;
  tone?: 'danger' | 'warning' | 'success' | 'neutral' | string;
  administeredAt?: string | null;
}

export type CounsellorFlowStepStatus = 'not_started' | 'in_progress' | 'completed' | 'skipped';

export interface CounsellorSessionFlowStep {
  id: number;
  stepKey: string;
  phase: string;
  title: string;
  sortOrder: number;
  status: CounsellorFlowStepStatus;
  prompt?: string | null;
  response: Record<string, unknown>;
  clinicalNote?: string | null;
  startedAt?: string | null;
  completedAt?: string | null;
}

export interface CounsellorSessionFlowPhase {
  phase: string;
  steps: CounsellorSessionFlowStep[];
}

export interface CounsellorSessionGuidedFlow {
  id: number;
  activeStepKey?: string | null;
  completionPercent: number;
  requiredStepKeys: string[];
  phases: CounsellorSessionFlowPhase[];
}

export interface CounsellorSessionSummary {
  sessionRating?: number | null;
  clientFeedback?: string | null;
  clinicianSummary?: string | null;
  clientSummary?: string | null;
  privateSummary?: string | null;
  nextAgenda?: string | null;
}

export interface CounsellorSessionWorkspace {
  session: CounsellorSessionQueueItem;
  client: {
    id: number;
    name: string;
    email?: string | null;
    phone?: string | null;
    age?: number | null;
    gender?: string | null;
    occupation?: string | null;
    riskFlags: Array<{ id: number; label: string; level: string }>;
    previousDiagnoses: string[];
    previousSessionSummary?: string | null;
    treatmentPlan: string[];
  };
  notes: CounsellorSessionNotes;
  guidedFlow?: CounsellorSessionGuidedFlow;
  sessionSummary?: CounsellorSessionSummary;
  assessments: CounsellorAssessmentResult[];
  homeworkReview?: Array<{
    id: number;
    title: string;
    status: string;
    dueLabel: string;
    reviewState: string;
  }>;
  treatmentProgress?: {
    title: string;
    status: string;
    startedAt?: string | null;
    goalProgressPercent: number;
    goalSummary: string;
    riskLevel: string;
  } | null;
  cbt: {
    activePlan?: {
      id: number;
      title: string;
      status: string;
      riskLevel: string;
      exerciseCount: number;
      goalCount?: number;
    } | null;
    homeworkTemplates: Array<{ id: number; title: string; slug: string }>;
  };
  documents: Array<unknown>;
}

async function readJson(response: Response) {
  const contentType = response.headers.get('content-type') ?? '';
  if (contentType.includes('application/json')) {
    return response.json();
  }
  return null;
}

function authHeaders(token: string, withJson = false): HeadersInit {
  return {
    ...(withJson ? { 'Content-Type': 'application/json' } : {}),
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

function getToken() {
  const token = getAuthState().token;
  if (!token) throw new Error('Missing token');
  return token;
}

type ClientProfileApiShape = {
  primary_goal?: AuthUser['primary_goal'] | null;
  dob?: string | null;
  age?: number | null;
  gender?: string | null;
  occupation?: string | null;
};

function mergeUserProfile(user: AuthUser, profile?: ClientProfileApiShape | null): AuthUser {
  return {
    ...user,
    primary_goal: profile?.primary_goal ?? user.primary_goal ?? null,
    wellness_goal: profile?.primary_goal ?? user.wellness_goal ?? null,
    dob: profile?.dob ?? user.dob ?? null,
    age: profile?.age ?? user.age ?? null,
    gender: profile?.gender ?? user.gender ?? null,
    occupation: profile?.occupation ?? user.occupation ?? null,
  };
}

function mergeAccountProfileUser(user: AuthUser, roleDetails?: AccountProfileRoleDetails | null): AuthUser {
  const primaryGoal = roleDetails?.client?.primaryGoal ?? user.primary_goal ?? null;

  return {
    ...user,
    primary_goal: primaryGoal,
    wellness_goal: primaryGoal,
    dob: roleDetails?.client?.dob ?? user.dob ?? null,
    age: roleDetails?.client?.age ?? user.age ?? null,
    gender: roleDetails?.client?.gender ?? user.gender ?? null,
    occupation: roleDetails?.client?.occupation ?? user.occupation ?? null,
  };
}

export async function registerRequest(payload: {
  name: string;
  email: string;
  password: string;
  role?: string;
  phone?: string;
  primary_goal?: 'fitness' | 'mental_health' | 'both';
  consent_to_terms?: boolean;
}) {
  let response: Response;

  try {
    response = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch {
    const demoUser: AuthUser = {
      id: Date.now(),
      name: payload.name,
      email: payload.email,
      role: 'client',
      status: 'active',
      primary_goal: payload.primary_goal ?? null,
      wellness_goal: payload.primary_goal ?? null,
      consent_to_terms: payload.consent_to_terms,
      phone: payload.phone ?? null,
    };

    upsertDemoAuthUser({
      id: demoUser.id,
      name: demoUser.name,
      email: demoUser.email,
      role: demoUser.role,
      status: 'active',
    }, payload.password);
    setAuthState(`demo-token-${demoUser.id}`, demoUser);
    return demoUser;
  }

  const data = await readJson(response);
  if (!response.ok) throw new Error(String(data?.message ?? 'Registration failed'));
  const mergedUser = mergeUserProfile(data.user as AuthUser, data.profile);
  upsertDemoAuthUser({
    id: mergedUser.id,
    name: mergedUser.name,
    email: mergedUser.email,
    role: mergedUser.role,
    status: mergedUser.status ?? 'active',
  }, payload.password);
  setAuthState(data.token as string, mergedUser);
  return mergedUser;
}

export async function loginRequest(email: string, password: string) {
  let response: Response;

  try {
    response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ email, password }),
    });
  } catch (error) {
    const demoUser = findDemoAuthUser(email, password);
    if (demoUser) {
      setAuthState(`demo-token-${demoUser.id}`, demoUser);
      return demoUser;
    }

    throw error instanceof Error ? error : new Error('Login failed');
  }

  const data = await readJson(response);
  if (!response.ok) throw new Error(String(data?.message ?? 'Login failed'));

  const mergedUser = mergeUserProfile(data.user as AuthUser, data.profile);
  upsertDemoAuthUser({
    id: mergedUser.id,
    name: mergedUser.name,
    email: mergedUser.email,
    role: mergedUser.role,
    status: mergedUser.status ?? 'active',
  }, password);
  setAuthState(data.token as string, mergedUser);
  return mergedUser;
}

export async function forgotPasswordRequest(email: string) {
  const response = await fetch(`${API_BASE}/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ email }),
  });
  const data = await readJson(response);
  if (!response.ok) throw new Error(String(data?.message ?? 'Unable to send password reset link'));
  return String(data?.message ?? 'Password reset link sent to your email.');
}

export async function resetPasswordRequest(payload: { email: string; token: string; password: string; password_confirmation: string }) {
  const response = await fetch(`${API_BASE}/auth/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await readJson(response);
  if (!response.ok) throw new Error(String(data?.message ?? 'Unable to reset password'));
  return String(data?.message ?? 'Password reset successful.');
}

export async function changePasswordRequest(payload: { current_password: string; password: string; password_confirmation: string }) {
  const token = getToken();
  const response = await fetch(`${API_BASE}/auth/change-password`, {
    method: 'POST',
    headers: authHeaders(token, true),
    body: JSON.stringify(payload),
  });
  const data = await readJson(response);
  if (!response.ok) throw new Error(String(data?.message ?? 'Unable to change password'));

  if (typeof data?.token === 'string' && data.user) {
    const mergedUser = mergeUserProfile(data.user as AuthUser, data.profile);
    setAuthState(data.token, mergedUser);
  }

  return String(data?.message ?? 'Password updated successfully.');
}

export async function meRequest() {
  const token = getToken();
  const response = await fetch(`${API_BASE}/auth/me`, { headers: authHeaders(token) });
  const data = await readJson(response);
  if (!response.ok) {
    clearAuthState();
    throw new Error('Session expired');
  }
  const mergedUser = mergeUserProfile(data.user as AuthUser, data.profile);
  setAuthState(token, mergedUser);
  return mergedUser;
}

export async function logoutRequest() {
  const token = getAuthState().token;
  if (token) {
    await fetch(`${API_BASE}/auth/logout`, { method: 'POST', headers: authHeaders(token) });
  }
  clearAuthState();
}

export async function updateProfileRequest(payload: { name: string; phone?: string; primary_goal?: 'fitness' | 'mental_health' | 'both'; dob?: string | null; gender?: string | null; occupation?: string | null; timezone?: string; preferred_language?: string; consent_to_terms: boolean }) {
  const token = getToken();
  const response = await fetch(`${API_BASE}/client/profile`, {
    method: 'PUT',
    headers: authHeaders(token, true),
    body: JSON.stringify(payload),
  });
  const data = await readJson(response);
  if (!response.ok) throw new Error(String(data?.message ?? 'Profile update failed'));
  setAuthState(token, mergeUserProfile(data.user as AuthUser, data.profile));
  return data;
}

export async function getAccountProfileRequest() {
  const token = getToken();
  const response = await fetch(`${API_BASE}/account/profile`, {
    headers: authHeaders(token),
  });
  const data = await readJson(response);
  if (!response.ok) throw new Error(String(data?.message ?? 'Unable to load profile'));
  const mergedUser = mergeAccountProfileUser(data.user as AuthUser, data.roleDetails as AccountProfileRoleDetails | undefined);
  setAuthState(token, mergedUser);
  return {
    user: mergedUser,
    roleDetails: (data.roleDetails ?? {}) as AccountProfileRoleDetails,
  } satisfies AccountProfileResponse;
}

export async function updateAccountProfileRequest(payload: {
  name: string;
  phone?: string;
  consent_to_terms: boolean;
  primary_goal?: 'fitness' | 'mental_health' | 'both';
  dob?: string | null;
  gender?: string | null;
  occupation?: string | null;
  timezone?: string;
  preferred_language?: string;
}) {
  const token = getToken();
  const response = await fetch(`${API_BASE}/account/profile`, {
    method: 'PUT',
    headers: authHeaders(token, true),
    body: JSON.stringify(payload),
  });
  const data = await readJson(response);
  if (!response.ok) throw new Error(String(data?.message ?? 'Profile update failed'));
  const mergedUser = mergeAccountProfileUser(data.user as AuthUser, data.roleDetails as AccountProfileRoleDetails | undefined);
  setAuthState(token, mergedUser);
  return {
    message: String(data?.message ?? 'Profile updated.'),
    user: mergedUser,
    roleDetails: (data.roleDetails ?? {}) as AccountProfileRoleDetails,
  } satisfies AccountProfileResponse & { message: string };
}

export async function updateAccountAvatarRequest(file: Blob | File) {
  const token = getToken();
  const formData = new FormData();
  formData.append('avatar', file, file instanceof File ? file.name : 'profile-avatar.jpg');

  const response = await fetch(`${API_BASE}/account/profile/avatar`, {
    method: 'POST',
    headers: authHeaders(token),
    body: formData,
  });
  const data = await readJson(response);
  if (!response.ok) throw new Error(String(data?.message ?? 'Profile photo update failed'));

  const mergedUser = mergeAccountProfileUser(data.user as AuthUser, data.roleDetails as AccountProfileRoleDetails | undefined);
  setAuthState(token, mergedUser);

  return {
    message: String(data?.message ?? 'Profile photo updated.'),
    user: mergedUser,
    roleDetails: (data.roleDetails ?? {}) as AccountProfileRoleDetails,
  } satisfies AccountProfileResponse & { message: string };
}

export async function createIntakeFlow(service_type: 'psychology' | 'training' | 'combined' | 'package') {
  const token = getToken();
  const response = await fetch(`${API_BASE}/intake-flows`, {
    method: 'POST',
    headers: authHeaders(token, true),
    body: JSON.stringify({ service_type }),
  });
  const data = await readJson(response);
  if (!response.ok) throw new Error(String(data?.message ?? 'Unable to create intake flow'));
  return data as { intake_flow_id: number; service_type: string; current_step: string; status: string };
}

export async function getIntakeFlow(flowId: number) {
  const token = getToken();
  const response = await fetch(`${API_BASE}/intake-flows/${flowId}`, { headers: authHeaders(token) });
  const data = await readJson(response);
  if (!response.ok) throw new Error(String(data?.message ?? 'Unable to fetch intake flow'));
  return data as IntakeFlow & { answers: { question_key: string; answer_json: unknown }[] };
}

export async function saveIntakeAnswers(flowId: number, answers: { section_key: string; question_key: string; answer_type: string; answer_json: unknown }[]) {
  const token = getToken();
  const response = await fetch(`${API_BASE}/intake-flows/${flowId}/intake`, {
    method: 'PUT',
    headers: authHeaders(token, true),
    body: JSON.stringify({ answers }),
  });
  const data = await readJson(response);
  if (!response.ok) throw new Error(String(data?.message ?? 'Unable to save intake answers'));
  return data;
}

export async function submitIntakeFlow(flowId: number) {
  const token = getToken();
  const response = await fetch(`${API_BASE}/intake-flows/${flowId}/submit`, { method: 'POST', headers: authHeaders(token) });
  const data = await readJson(response);
  if (!response.ok) throw new Error(String(data?.message ?? 'Unable to submit intake flow'));
  return data as { id: number; status: IntakeFlow['status']; current_step: IntakeFlow['current_step']; review_eta_hours?: number | null };
}

export async function getRecommendedPractitioners(flowId: number) {
  const token = getToken();
  const response = await fetch(`${API_BASE}/intake-flows/${flowId}/recommended-practitioners`, { headers: authHeaders(token) });
  const data = await readJson(response);
  if (!response.ok) throw new Error(String(data?.message ?? 'Unable to fetch practitioners'));
  return (data.practitioners ?? []) as PractitionerItem[];
}

export async function getPractitionerSlots(practitionerId: number, from?: string, to?: string) {
  const token = getToken();
  const params = new URLSearchParams();
  if (from) params.set('from', from);
  if (to) params.set('to', to);
  const response = await fetch(`${API_BASE}/practitioners/${practitionerId}/slots?${params.toString()}`, { headers: authHeaders(token) });
  const data = await readJson(response);
  if (!response.ok) throw new Error(String(data?.message ?? 'Unable to fetch slots'));
  return (data.slots ?? []) as SlotItem[];
}

export async function bookAppointmentRequest(payload: { intake_flow_id?: number; practitioner_id: number; slot_id: number; service_type: 'psychology' | 'training' | 'combined' | 'package'; mode: 'online' | 'in_person' | 'hybrid'; use_membership_credits?: boolean; membership_subscription_id?: number }) {
  const token = getToken();
  const response = await fetch(`${API_BASE}/appointments`, {
    method: 'POST',
    headers: authHeaders(token, true),
    body: JSON.stringify(payload),
  });
  const data = await readJson(response);
  if (!response.ok) throw new Error(String(data?.message ?? 'Unable to book appointment'));
  return data.appointment as ClientAppointment;
}

export async function getClientAppointmentsRequest() {
  const token = getToken();
  const response = await fetch(`${API_BASE}/client/appointments`, { headers: authHeaders(token) });
  const data = await readJson(response);
  if (!response.ok) throw new Error(String(data?.message ?? 'Unable to fetch appointments'));
  return (data.appointments ?? []) as ClientAppointment[];
}

export async function getCounsellorClientsRequest() {
  const token = getToken();
  const response = await fetch(`${API_BASE}/counsellor/clients`, { headers: authHeaders(token) });
  const data = await readJson(response);
  if (!response.ok) throw new Error(String(data?.message ?? 'Unable to fetch assigned clients'));
  return (data.clients ?? []) as CounsellorClientItem[];
}

export async function getCounsellorDashboardRequest() {
  const token = getToken();
  const response = await fetch(`${API_BASE}/counsellor/dashboard`, { headers: authHeaders(token) });
  const data = await readJson(response);
  if (!response.ok) throw new Error(String(data?.message ?? 'Unable to fetch counsellor dashboard'));
  return data as CounsellorDashboardResponse;
}

export async function getCounsellorSessionsRequest() {
  const token = getToken();
  const response = await fetch(`${API_BASE}/counsellor/sessions`, { headers: authHeaders(token) });
  const data = await readJson(response);
  if (!response.ok) throw new Error(String(data?.message ?? 'Unable to fetch counsellor sessions'));
  return (data.sessions ?? []) as CounsellorSessionQueueItem[];
}

export async function getCounsellorSessionWorkspaceRequest(appointmentId: number) {
  const token = getToken();
  const response = await fetch(`${API_BASE}/counsellor/sessions/${appointmentId}`, { headers: authHeaders(token) });
  const data = await readJson(response);
  if (!response.ok) throw new Error(String(data?.message ?? 'Unable to fetch session workspace'));
  return data as CounsellorSessionWorkspace;
}

export async function startCounsellorSessionRequest(appointmentId: number) {
  return counsellorSessionActionRequest(appointmentId, 'start');
}

export async function saveCounsellorSessionNotesRequest(appointmentId: number, payload: { subjective?: string; objective?: string; assessment?: string; plan?: string }) {
  const token = getToken();
  const response = await fetch(`${API_BASE}/counsellor/sessions/${appointmentId}/notes`, {
    method: 'PUT',
    headers: authHeaders(token, true),
    body: JSON.stringify(payload),
  });
  const data = await readJson(response);
  if (!response.ok) throw new Error(String(data?.message ?? 'Unable to save session notes'));
  return data as CounsellorSessionWorkspace;
}

export async function saveCounsellorSessionFlowStepRequest(appointmentId: number, stepKey: string, payload: {
  status: CounsellorFlowStepStatus;
  response_json?: Record<string, unknown>;
  clinical_note?: string | null;
}) {
  const token = getToken();
  const response = await fetch(`${API_BASE}/counsellor/sessions/${appointmentId}/flow-steps/${stepKey}`, {
    method: 'PUT',
    headers: authHeaders(token, true),
    body: JSON.stringify(payload),
  });
  const data = await readJson(response);
  if (!response.ok) throw new Error(String(data?.message ?? 'Unable to save guided CBT step'));
  return data as CounsellorSessionWorkspace;
}

export async function saveCounsellorSessionSummaryRequest(appointmentId: number, payload: {
  session_rating?: number | null;
  client_feedback?: string | null;
  clinician_summary?: string | null;
  client_summary?: string | null;
  private_summary?: string | null;
  next_agenda?: string | null;
}) {
  const token = getToken();
  const response = await fetch(`${API_BASE}/counsellor/sessions/${appointmentId}/summary`, {
    method: 'PUT',
    headers: authHeaders(token, true),
    body: JSON.stringify(payload),
  });
  const data = await readJson(response);
  if (!response.ok) throw new Error(String(data?.message ?? 'Unable to save session summary'));
  return data as CounsellorSessionWorkspace;
}

export async function completeCounsellorSessionRequest(appointmentId: number) {
  return counsellorSessionActionRequest(appointmentId, 'complete');
}

export async function followUpCounsellorSessionRequest(appointmentId: number, nextAction = 'Schedule follow-up appointment.') {
  return counsellorSessionActionRequest(appointmentId, 'follow-up', { next_action: nextAction });
}

export async function escalateCounsellorSessionRequest(appointmentId: number, reason = 'Clinical escalation requested from session workspace.') {
  return counsellorSessionActionRequest(appointmentId, 'escalate', { reason, risk_level: 'high' });
}

export async function createCounsellorAssessmentRequest(appointmentId: number, payload: { assessment_type: CounsellorAssessmentType; score?: number; severity?: string; answers_json?: Record<string, unknown> }) {
  const token = getToken();
  const response = await fetch(`${API_BASE}/counsellor/sessions/${appointmentId}/assessments`, {
    method: 'POST',
    headers: authHeaders(token, true),
    body: JSON.stringify(payload),
  });
  const data = await readJson(response);
  if (!response.ok) throw new Error(String(data?.message ?? 'Unable to record assessment'));
  return data as { assessment: CounsellorAssessmentResult; workspace: CounsellorSessionWorkspace };
}

export async function assignCounsellorCbtHomeworkRequest(planId: number, templateId: number) {
  const token = getToken();
  const response = await fetch(`${API_BASE}/cbt/plans/${planId}/exercises`, {
    method: 'POST',
    headers: authHeaders(token, true),
    body: JSON.stringify({
      exercise_template_id: templateId,
      frequency: 'once',
      start_date: new Date().toISOString().slice(0, 10),
      priority: 'medium',
    }),
  });
  const data = await readJson(response);
  if (!response.ok) throw new Error(String(data?.message ?? 'Unable to send CBT homework'));
  return data;
}

export async function createCounsellorCbtPlanRequest(clientId: number, payload: {
  title: string;
  primary_goal: string;
  description: string;
  status: 'active';
  start_date: string;
  review_frequency: 'weekly';
  risk_level: 'low';
  goals: Array<{
    goal_title: string;
    goal_description: string;
    baseline_score: number;
    target_score: number;
  }>;
}) {
  const token = getToken();
  const response = await fetch(`${API_BASE}/cbt/clients/${clientId}/plans`, {
    method: 'POST',
    headers: authHeaders(token, true),
    body: JSON.stringify(payload),
  });
  const data = await readJson(response);
  if (!response.ok) throw new Error(String(data?.message ?? 'Unable to create CBT plan'));
  return data;
}

async function counsellorSessionActionRequest(appointmentId: number, action: 'start' | 'complete' | 'follow-up' | 'escalate', payload?: Record<string, unknown>) {
  const token = getToken();
  const response = await fetch(`${API_BASE}/counsellor/sessions/${appointmentId}/${action}`, {
    method: 'POST',
    headers: authHeaders(token, Boolean(payload)),
    body: payload ? JSON.stringify(payload) : undefined,
  });
  const data = await readJson(response);
  if (!response.ok) throw new Error(String(data?.message ?? 'Unable to update session'));
  return data as CounsellorSessionWorkspace;
}

export async function getClientDashboardRequest() {
  const token = getToken();
  const response = await fetch(`${API_BASE}/client/dashboard`, { headers: authHeaders(token) });
  const data = await readJson(response);
  if (!response.ok) throw new Error(String(data?.message ?? 'Unable to fetch client dashboard'));
  return data as ClientDashboardResponse;
}

export async function getClientProgressRequest() {
  const token = getToken();
  const response = await fetch(`${API_BASE}/client/progress`, { headers: authHeaders(token) });
  const data = await readJson(response);
  if (!response.ok) throw new Error(String(data?.message ?? 'Unable to fetch client progress'));
  return data as ClientProgressResponse;
}

export async function rescheduleAppointmentRequest(id: number, slot_id: number) {
  const token = getToken();
  const response = await fetch(`${API_BASE}/appointments/${id}/reschedule`, {
    method: 'PUT',
    headers: authHeaders(token, true),
    body: JSON.stringify({ slot_id }),
  });
  const data = await readJson(response);
  if (!response.ok) throw new Error(String(data?.message ?? 'Unable to reschedule appointment'));
  return data.appointment as ClientAppointment;
}

export async function cancelAppointmentRequest(id: number, reason?: string) {
  const token = getToken();
  const response = await fetch(`${API_BASE}/appointments/${id}/cancel`, {
    method: 'POST',
    headers: authHeaders(token, true),
    body: JSON.stringify({ reason }),
  });
  const data = await readJson(response);
  if (!response.ok) throw new Error(String(data?.message ?? 'Unable to cancel appointment'));
  return data.appointment as ClientAppointment;
}

export async function getIntakeConfirmation(flowId: number) {
  const token = getToken();
  const response = await fetch(`${API_BASE}/intake-flows/${flowId}/confirmation`, { headers: authHeaders(token) });
  const data = await readJson(response);
  if (!response.ok) throw new Error(String(data?.message ?? 'Unable to fetch confirmation'));
  return data;
}
