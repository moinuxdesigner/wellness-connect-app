import { getAuthState } from '../auth/auth';
import {
  buildTrainerApplicationRecord,
  createHistoryItem,
  findTrainerApplication,
  mergeTrainerOnboardingValues,
  readTrainerApplications,
  upsertTrainerApplication,
  type TrainerApplicationRecord,
  type TrainerApplicationStatus,
  type TrainerOnboardingFormValues,
} from './trainerOnboarding';

const API_BASE = import.meta.env.VITE_API_URL ?? '/api/v1';

type TrainerApplicationResponse = {
  application: {
    applicationId: string;
    status: TrainerApplicationStatus;
    applicantName: string;
    applicantEmail: string;
    applicantMobile: string;
    city: string;
    state: string;
    expertise: string[];
    values: Partial<TrainerOnboardingFormValues>;
    submittedAt: string;
    updatedAt: string;
    adminRemarks: string;
    reviewHistory: TrainerApplicationRecord['reviewHistory'];
  };
};

function readJson(response: Response) {
  const contentType = response.headers.get('content-type') ?? '';
  return contentType.includes('application/json') ? response.json() : Promise.resolve(null);
}

function authHeaders(withJson = false): HeadersInit {
  const token = getAuthState().token;
  return {
    Accept: 'application/json',
    ...(withJson ? { 'Content-Type': 'application/json' } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

function normalizeTrainerApplicationRecord(application: TrainerApplicationResponse['application']): TrainerApplicationRecord {
  return {
    applicationId: application.applicationId,
    status: application.status,
    applicantName: application.applicantName,
    applicantEmail: application.applicantEmail,
    applicantMobile: application.applicantMobile,
    city: application.city,
    state: application.state,
    expertise: application.expertise ?? [],
    values: mergeTrainerOnboardingValues(application.values),
    submittedAt: application.submittedAt,
    updatedAt: application.updatedAt,
    adminRemarks: application.adminRemarks ?? '',
    reviewHistory: application.reviewHistory ?? [],
  };
}

export async function submitTrainerApplicationToApi(input: {
  applicationId?: string | null;
  values: TrainerOnboardingFormValues;
}) {
  try {
    const response = await fetch(`${API_BASE}/trainer-applications`, {
      method: 'POST',
      headers: authHeaders(true),
      body: JSON.stringify({
        applicationId: input.applicationId ?? undefined,
        values: input.values,
      }),
    });

    const data = (await readJson(response)) as TrainerApplicationResponse | { message?: string } | null;
    if (!response.ok || !data || !('application' in data)) {
      throw new Error(String(data && 'message' in data ? data.message : 'Unable to submit trainer onboarding.'));
    }

    const application = normalizeTrainerApplicationRecord(data.application);
    upsertTrainerApplication(application);
    return application;
  } catch {
    const timestamp = new Date().toISOString();
    const existingApplication = findTrainerApplication(input.applicationId);
    const fallback = buildTrainerApplicationRecord({
      applicationId: input.applicationId ?? `TRN-${Date.now()}`,
      values: input.values,
      submittedAt: timestamp,
      status: 'submitted',
      adminRemarks: '',
      previousHistory: [
        ...(existingApplication?.reviewHistory ?? []),
        createHistoryItem({
          action: 'submitted',
          actor: 'trainer',
          note: existingApplication?.status === 'needs_resubmission'
            ? 'Trainer resubmitted the application after admin remarks.'
            : 'Trainer submitted the onboarding application.',
          at: timestamp,
        }),
      ],
    });

    upsertTrainerApplication(fallback);
    return fallback;
  }
}

export async function fetchTrainerApplicationFromApi(applicationId: string | null | undefined) {
  if (!applicationId) return null;

  try {
    const response = await fetch(`${API_BASE}/trainer-applications/${applicationId}`, {
      method: 'GET',
      headers: authHeaders(),
    });

    if (response.status === 404) {
      return findTrainerApplication(applicationId);
    }

    const data = (await readJson(response)) as TrainerApplicationResponse | { message?: string } | null;
    if (!response.ok || !data || !('application' in data)) {
      throw new Error(String(data && 'message' in data ? data.message : 'Unable to load trainer application.'));
    }

    const application = normalizeTrainerApplicationRecord(data.application);
    upsertTrainerApplication(application);
    return application;
  } catch {
    return findTrainerApplication(applicationId);
  }
}

export async function fetchAdminTrainerApplicationsFromApi() {
  try {
    const response = await fetch(`${API_BASE}/admin/trainer-applications`, {
      method: 'GET',
      headers: authHeaders(),
    });

    const data = (await readJson(response)) as { applications?: TrainerApplicationResponse['application'][]; message?: string } | null;
    if (!response.ok) {
      throw new Error(String(data?.message ?? 'Unable to load trainer applications.'));
    }

    const applications = (data?.applications ?? []).map(normalizeTrainerApplicationRecord);
    applications.forEach((application) => upsertTrainerApplication(application));
    return applications;
  } catch {
    return readTrainerApplications();
  }
}

export async function updateTrainerApplicationReviewInApi(input: {
  applicationId: string;
  status: Extract<TrainerApplicationStatus, 'under_review' | 'needs_resubmission' | 'approved' | 'rejected'>;
  adminRemarks: string;
}) {
  try {
    const response = await fetch(`${API_BASE}/admin/trainer-applications/${input.applicationId}`, {
      method: 'PATCH',
      headers: authHeaders(true),
      body: JSON.stringify({
        status: input.status,
        adminRemarks: input.adminRemarks,
      }),
    });

    const data = (await readJson(response)) as TrainerApplicationResponse | { message?: string } | null;
    if (!response.ok || !data || !('application' in data)) {
      throw new Error(String(data && 'message' in data ? data.message : 'Unable to update trainer application.'));
    }

    const application = normalizeTrainerApplicationRecord(data.application);
    upsertTrainerApplication(application);
    return application;
  } catch (error) {
    const localApplication = findTrainerApplication(input.applicationId);
    if (!localApplication) {
      throw error instanceof Error ? error : new Error('Unable to update trainer application.');
    }

    const timestamp = new Date().toISOString();
    const fallback: TrainerApplicationRecord = {
      ...localApplication,
      status: input.status,
      adminRemarks: input.adminRemarks,
      updatedAt: timestamp,
      reviewHistory: [
        ...localApplication.reviewHistory,
        createHistoryItem({
          action: input.status,
          actor: 'admin',
          note: input.adminRemarks || 'Admin updated the trainer application status.',
          at: timestamp,
        }),
      ],
    };

    upsertTrainerApplication(fallback);
    return fallback;
  }
}
