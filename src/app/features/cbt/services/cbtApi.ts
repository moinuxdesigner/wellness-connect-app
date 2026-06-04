import { getAuthState } from '../../auth/auth';
import { mockCbtCategories, mockCbtInstances, mockCbtPlan, mockCbtProgress, mockCbtResponses, mockCbtTemplates } from '../data/mockCbtData';
import type { CbtCarePlan, CbtCategory, CbtExerciseInstance, CbtExerciseResponse, CbtExerciseTemplate, CbtProgress, PractitionerCbtDashboardResponse } from '../types/cbt.types';

const API_BASE = import.meta.env.VITE_API_URL ?? '/api/v1';

function headers(withJson = false): HeadersInit {
  const token = getAuthState().token;
  if (!token) throw new Error('Missing authenticated session token.');
  return {
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
    ...(withJson ? { 'Content-Type': 'application/json' } : {}),
  };
}

async function request<T>(path: string, options?: RequestInit, fallback?: T): Promise<T> {
  try {
    const response = await fetch(`${API_BASE}/cbt/${path}`, {
      ...options,
      headers: options?.headers ?? headers(Boolean(options?.body)),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(String(data?.message ?? 'Unable to complete CBT request.'));
    return data as T;
  } catch (error) {
    if (fallback !== undefined) return fallback;
    throw error instanceof Error ? error : new Error('Unable to complete CBT request.');
  }
}

export async function getCbtCategories() {
  return (await request<{ categories: CbtCategory[] }>('categories', undefined, { categories: mockCbtCategories })).categories;
}

export async function createCbtCategory(payload: Partial<CbtCategory> & { name: string }) {
  return (await request<{ category: CbtCategory }>('categories', {
    method: 'POST',
    body: JSON.stringify(payload),
  }, { category: { id: Date.now(), slug: payload.name.toLowerCase().replace(/\s+/g, '-'), sortOrder: 99, isActive: true, ...payload } as CbtCategory })).category;
}

export async function getCbtTemplates() {
  return (await request<{ templates: CbtExerciseTemplate[] }>('exercise-templates', undefined, { templates: mockCbtTemplates })).templates;
}

export async function saveCbtTemplate(payload: Partial<CbtExerciseTemplate> & { title: string; template_schema_json?: unknown; templateSchema?: unknown }, id?: number) {
  const body = {
    ...payload,
    template_schema_json: payload.template_schema_json ?? payload.templateSchema,
  };
  return (await request<{ template: CbtExerciseTemplate }>(id ? `exercise-templates/${id}` : 'exercise-templates', {
    method: id ? 'PUT' : 'POST',
    body: JSON.stringify(body),
  }, { template: { ...mockCbtTemplates[0], id: id ?? Date.now(), title: payload.title } })).template;
}

export async function getPractitionerCbtDashboard() {
  return request<PractitionerCbtDashboardResponse>('dashboard');
}

export async function getClientCbtPlans(clientId: number) {
  return (await request<{ plans: CbtCarePlan[] }>(`clients/${clientId}/plans`, undefined, { plans: [mockCbtPlan] })).plans;
}

export async function createCbtPlan(clientId: number, payload: Record<string, unknown>) {
  return (await request<{ plan: CbtCarePlan }>(`clients/${clientId}/plans`, {
    method: 'POST',
    body: JSON.stringify(payload),
  }, { plan: { ...mockCbtPlan, id: Date.now(), ...(payload as Partial<CbtCarePlan>) } })).plan;
}

export async function getCbtPlan(planId: number) {
  return (await request<{ plan: CbtCarePlan }>(`plans/${planId}`, undefined, { plan: mockCbtPlan })).plan;
}

export async function assignCbtExercise(planId: number, payload: Record<string, unknown>) {
  return request<{ exercise: unknown }>(`plans/${planId}/exercises`, {
    method: 'POST',
    body: JSON.stringify(payload),
  }, { exercise: { id: Date.now(), ...payload } });
}

export async function getPlanCbtProgress(planId: number) {
  return (await request<{ progress: CbtProgress }>(`plans/${planId}/progress`, undefined, { progress: mockCbtProgress })).progress;
}

export async function getPlanCbtResponses(planId: number) {
  return (await request<{ responses: CbtExerciseResponse[] }>(`plans/${planId}/responses`, undefined, { responses: mockCbtResponses })).responses;
}

export async function reviewCbtResponse(responseId: number, payload: Record<string, unknown>) {
  return request<{ review: unknown }>(`responses/${responseId}/review`, {
    method: 'POST',
    body: JSON.stringify(payload),
  }, { review: { id: Date.now(), responseId, ...payload } });
}

export async function getMyCbtPlan() {
  return (await request<{ plan: CbtCarePlan | null }>('my-plan', undefined, { plan: mockCbtPlan })).plan;
}

export async function getMyCbtExercises() {
  return (await request<{ exercises: CbtExerciseInstance[] }>('my-exercises', undefined, { exercises: mockCbtInstances })).exercises;
}

export async function getCbtExerciseInstance(id: number) {
  return (await request<{ exercise: CbtExerciseInstance }>(`exercise-instances/${id}`, undefined, { exercise: mockCbtInstances.find((item) => item.id === id) ?? mockCbtInstances[0] })).exercise;
}

export async function startCbtExerciseInstance(id: number) {
  return (await request<{ exercise: CbtExerciseInstance }>(`exercise-instances/${id}/start`, { method: 'POST' }, { exercise: { ...(mockCbtInstances.find((item) => item.id === id) ?? mockCbtInstances[0]), status: 'in_progress' } })).exercise;
}

export async function submitCbtExerciseInstance(id: number, payload: Record<string, unknown>) {
  return (await request<{ response: CbtExerciseResponse }>(`exercise-instances/${id}/submit`, {
    method: 'POST',
    body: JSON.stringify(payload),
  }, {
    response: {
      id: Date.now(),
      exerciseInstanceId: id,
      clientId: 2,
      responseJson: payload.response_json as Record<string, unknown>,
      submittedAt: new Date().toISOString(),
      exerciseTitle: mockCbtInstances.find((item) => item.id === id)?.template?.title,
    },
  })).response;
}

export async function getMyCbtProgress() {
  return (await request<{ progress: CbtProgress | null }>('my-progress', undefined, { progress: mockCbtProgress })).progress;
}
