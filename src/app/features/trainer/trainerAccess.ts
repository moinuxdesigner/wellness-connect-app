import { getAuthState } from '../auth/auth';
import { mergeTrainerOnboardingValues, readTrainerApplications, type TrainerApplicationRecord } from './trainerOnboarding';

const API_BASE = import.meta.env.VITE_API_URL ?? '/api/v1';

export type TrainerAccessStatus = 'onboarding_pending' | 'pending_review' | 'needs_resubmission' | 'rejected' | 'suspended' | 'approved';

export type TrainerAccessState = {
  status: TrainerAccessStatus;
  application: TrainerApplicationRecord | null;
  adminRemarks: string;
};

let cachedTrainerAccessState: TrainerAccessState | null = null;
let cachedTrainerAccessToken: string | null = null;
let pendingTrainerAccessRequest: Promise<TrainerAccessState> | null = null;

function localTrainerAccessState(): TrainerAccessState {
  const user = getAuthState().user;

  if (user?.status === 'suspended') {
    return { status: 'suspended', application: null, adminRemarks: '' };
  }

  const application = readTrainerApplications()
    .filter((item) => item.applicantEmail.toLowerCase() === user?.email.toLowerCase())
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))[0] ?? null;

  if (!application) {
    return { status: 'onboarding_pending', application: null, adminRemarks: '' };
  }

  switch (application.status) {
    case 'approved':
      return { status: 'approved', application, adminRemarks: application.adminRemarks };
    case 'needs_resubmission':
      return { status: 'needs_resubmission', application, adminRemarks: application.adminRemarks };
    case 'rejected':
      return { status: 'rejected', application, adminRemarks: application.adminRemarks };
    case 'draft':
      return { status: 'onboarding_pending', application, adminRemarks: application.adminRemarks };
    case 'submitted':
    case 'under_review':
      return { status: 'pending_review', application, adminRemarks: application.adminRemarks };
  }
}

function accessStateFromApplication(application: TrainerApplicationRecord): TrainerAccessState {
  switch (application.status) {
    case 'approved':
      return { status: 'approved', application, adminRemarks: application.adminRemarks };
    case 'needs_resubmission':
      return { status: 'needs_resubmission', application, adminRemarks: application.adminRemarks };
    case 'rejected':
      return { status: 'rejected', application, adminRemarks: application.adminRemarks };
    case 'draft':
      return { status: 'onboarding_pending', application, adminRemarks: application.adminRemarks };
    case 'submitted':
    case 'under_review':
      return { status: 'pending_review', application, adminRemarks: application.adminRemarks };
  }
}

export async function fetchTrainerAccessState(): Promise<TrainerAccessState> {
  const auth = getAuthState();
  const currentToken = auth.token ?? null;

  if (cachedTrainerAccessState && cachedTrainerAccessToken === currentToken) {
    return cachedTrainerAccessState;
  }

  if (pendingTrainerAccessRequest && cachedTrainerAccessToken === currentToken) {
    return pendingTrainerAccessRequest;
  }

  const resolveAndCache = (value: TrainerAccessState) => {
    cachedTrainerAccessState = value;
    cachedTrainerAccessToken = currentToken;
    return value;
  };

  if (!auth.token || auth.token.startsWith('demo-token-')) {
    return resolveAndCache(localTrainerAccessState());
  }

  pendingTrainerAccessRequest = (async () => {
    try {
    const response = await fetch(`${API_BASE}/trainer/access-status`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${auth.token}`,
      },
    });

      if (!response.ok) {
        return resolveAndCache(localTrainerAccessState());
      }

      const data = await response.json() as TrainerAccessState;
      const application = data.application
        ? {
            ...data.application,
            values: mergeTrainerOnboardingValues(data.application.values),
          }
        : null;

      const nextAccess = {
        status: data.status,
        application,
        adminRemarks: data.adminRemarks ?? application?.adminRemarks ?? '',
      } satisfies TrainerAccessState;
      const localAccess = localTrainerAccessState();

      return resolveAndCache(nextAccess.status === 'onboarding_pending' && localAccess.status !== 'onboarding_pending' ? localAccess : nextAccess);
    } catch {
      return resolveAndCache(localTrainerAccessState());
    } finally {
      pendingTrainerAccessRequest = null;
    }
  })();

  return pendingTrainerAccessRequest;
}

export function getCachedTrainerAccessState() {
  const auth = getAuthState();
  return cachedTrainerAccessToken === (auth.token ?? null) ? cachedTrainerAccessState : null;
}

export function invalidateTrainerAccessState() {
  cachedTrainerAccessState = null;
  cachedTrainerAccessToken = null;
  pendingTrainerAccessRequest = null;
}

export function setCachedTrainerAccessStateFromApplication(application: TrainerApplicationRecord) {
  cachedTrainerAccessState = accessStateFromApplication(application);
  cachedTrainerAccessToken = getAuthState().token ?? null;
  pendingTrainerAccessRequest = null;
}
