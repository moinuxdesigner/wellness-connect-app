import { getAuthState } from '../auth/auth';
import { mergeTrainerOnboardingValues, readTrainerApplications, type TrainerApplicationRecord } from './trainerOnboarding';

const API_BASE = import.meta.env.VITE_API_URL ?? '/api/v1';

export type TrainerAccessStatus = 'onboarding_pending' | 'pending_review' | 'needs_resubmission' | 'rejected' | 'suspended' | 'approved';

export type TrainerAccessState = {
  status: TrainerAccessStatus;
  application: TrainerApplicationRecord | null;
  adminRemarks: string;
};

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

export async function fetchTrainerAccessState(): Promise<TrainerAccessState> {
  const auth = getAuthState();

  if (!auth.token || auth.token.startsWith('demo-token-')) {
    return localTrainerAccessState();
  }

  try {
    const response = await fetch(`${API_BASE}/trainer/access-status`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${auth.token}`,
      },
    });

    if (!response.ok) {
      return { status: 'onboarding_pending', application: null, adminRemarks: '' };
    }

    const data = await response.json() as TrainerAccessState;
    const application = data.application
      ? {
          ...data.application,
          values: mergeTrainerOnboardingValues(data.application.values),
        }
      : null;

    return {
      status: data.status,
      application,
      adminRemarks: data.adminRemarks ?? application?.adminRemarks ?? '',
    };
  } catch {
    return { status: 'onboarding_pending', application: null, adminRemarks: '' };
  }
}
