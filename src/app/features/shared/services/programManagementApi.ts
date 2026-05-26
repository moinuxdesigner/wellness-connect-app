import { getAuthState } from '../../auth/auth';

const API_BASE = import.meta.env.VITE_API_URL ?? '/api/v1';

export type ProgramCredits = {
  counselling: number;
  training: number;
};

export type ProgramVersion = {
  id: number;
  versionNumber: number;
  name: string;
  description?: string | null;
  durationWeeks: number;
  credits: ProgramCredits;
  status: 'draft' | 'published' | 'archived';
  publishedAt?: string | null;
  createdAt?: string | null;
};

export type AdminProgram = {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  status: 'draft' | 'published' | 'archived';
  durationWeeks: number;
  credits: ProgramCredits;
  versionCount: number;
  publishedVersionId?: number | null;
  latestVersion?: ProgramVersion | null;
  intakeFlowCount: number;
  isActive: boolean;
};

export type ProgramDraft = {
  name: string;
  description: string;
  duration_weeks: number;
  credits: ProgramCredits;
};

function headers(withJson = false): HeadersInit {
  const token = getAuthState().token;

  return {
    Accept: 'application/json',
    ...(withJson ? { 'Content-Type': 'application/json' } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function json<T>(response: Response): Promise<T> {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const errorBag = typeof data.errors === 'object' && data.errors !== null
      ? Object.values(data.errors as Record<string, string[]>).flat().join(' ')
      : '';
    throw new Error(String(errorBag || data.message || 'Request failed.'));
  }

  return data as T;
}

export async function getAdminPrograms() {
  return (await json<{ programs: AdminProgram[] }>(
    await fetch(`${API_BASE}/admin/programs`, { headers: headers() }),
  )).programs;
}

export async function saveAdminProgram(draft: ProgramDraft, id?: number) {
  return json<{ message: string; program: AdminProgram }>(
    await fetch(`${API_BASE}/admin/programs${id ? `/${id}/draft` : ''}`, {
      method: id ? 'PUT' : 'POST',
      headers: headers(true),
      body: JSON.stringify(draft),
    }),
  );
}

export async function publishAdminProgram(id: number) {
  return json<{ message: string; program: AdminProgram }>(
    await fetch(`${API_BASE}/admin/programs/${id}/publish`, {
      method: 'POST',
      headers: headers(true),
    }),
  );
}

export async function archiveAdminProgram(id: number) {
  return json<{ message: string; program: AdminProgram }>(
    await fetch(`${API_BASE}/admin/programs/${id}/archive`, {
      method: 'POST',
      headers: headers(true),
    }),
  );
}

export async function getAdminProgramVersions(id: number) {
  return (await json<{ versions: ProgramVersion[] }>(
    await fetch(`${API_BASE}/admin/programs/${id}/versions`, { headers: headers() }),
  )).versions;
}
