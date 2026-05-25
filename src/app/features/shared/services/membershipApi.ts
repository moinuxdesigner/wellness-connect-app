import { getAuthState } from '../../auth/auth';

const API_BASE = import.meta.env.VITE_API_URL ?? '/api/v1';

export type MembershipTier = { id: number; label: string; amountMinor: number; currency: string; billingType: 'one_time' };
export type PublishedMembershipPlan = {
  id: number;
  slug: string;
  name: string;
  description?: string | null;
  durationWeeks: number;
  credits: { counselling?: number; training?: number };
  versionId: number;
  tiers: MembershipTier[];
};
export type ClientMembership = {
  id: number;
  status: string;
  planName: string;
  tierLabel: string;
  startsAt?: string | null;
  endsAt?: string | null;
  credits: { counselling: number; training: number };
  receipt?: { id: number; receipt_number: string; amount_minor: number; currency: string; issued_at: string } | null;
};
export type AdminMembershipPlan = {
  id: number;
  name: string;
  description?: string | null;
  status: string;
  latestVersion?: {
    id: number;
    version_number: number;
    duration_weeks: number;
    included_credits_json: { counselling?: number; training?: number };
    internal_cost_counselling_minor?: number | null;
    internal_cost_training_minor?: number | null;
    tiers: Array<{ id: number; label: string; amount_minor: number }>;
  } | null;
  estimatedCostMinor?: number | null;
  versionCount: number;
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
  if (!response.ok) throw new Error(String(data.message ?? 'Request failed.'));
  return data as T;
}

export async function getPublishedMembershipPlans() {
  return (await json<{ plans: PublishedMembershipPlan[] }>(await fetch(`${API_BASE}/membership-plans`, { headers: headers() }))).plans;
}
export async function getClientMemberships() {
  return (await json<{ memberships: ClientMembership[] }>(await fetch(`${API_BASE}/client/memberships`, { headers: headers() }))).memberships;
}
export async function getClientReceipt(id: number) {
  return (await json<{ receipt: any }>(await fetch(`${API_BASE}/client/receipts/${id}`, { headers: headers() }))).receipt;
}
export async function createCheckoutOrder(tierId: number) {
  return json<{ subscriptionId: number; paymentId: number; orderId: string; keyId: string; amountMinor: number; currency: string; name: string; tierLabel: string }>(await fetch(`${API_BASE}/client/memberships/checkout/orders`, {
    method: 'POST', headers: headers(true), body: JSON.stringify({ tier_id: tierId }),
  }));
}
export async function verifyCheckout(paymentId: number, providerPaymentId: string, signature: string) {
  return json<{ message: string; subscription: ClientMembership }>(await fetch(`${API_BASE}/client/memberships/checkout/verify`, {
    method: 'POST', headers: headers(true), body: JSON.stringify({ payment_id: paymentId, provider_payment_id: providerPaymentId, signature }),
  }));
}
export async function getAdminMembershipPlans() {
  return (await json<{ plans: AdminMembershipPlan[] }>(await fetch(`${API_BASE}/admin/membership-plans`, { headers: headers() }))).plans;
}
export type PlanDraft = { name: string; description: string; duration_weeks: number; credits: { counselling: number; training: number }; internal_cost_counselling_minor?: number | null; internal_cost_training_minor?: number | null; tiers: Array<{ label: string; amount_minor: number }> };
export async function saveAdminMembershipPlan(draft: PlanDraft, id?: number) {
  return json<{ message: string; plan: AdminMembershipPlan }>(await fetch(`${API_BASE}/admin/membership-plans${id ? `/${id}/draft` : ''}`, {
    method: id ? 'PUT' : 'POST', headers: headers(true), body: JSON.stringify(draft),
  }));
}
export async function publishAdminMembershipPlan(id: number) {
  return json<{ message: string }>(await fetch(`${API_BASE}/admin/membership-plans/${id}/publish`, { method: 'POST', headers: headers(true) }));
}
export async function archiveAdminMembershipPlan(id: number) {
  return json<{ message: string }>(await fetch(`${API_BASE}/admin/membership-plans/${id}/archive`, { method: 'POST', headers: headers(true) }));
}

export type FinanceSummary = { capturedMinor: number; refundedMinor: number; deferredMinor: number; earnedMinor: number; activeMemberships: number };
export async function getFinanceBilling() {
  const [summary, payments, receipts, refunds] = await Promise.all([
    json<{ summary: FinanceSummary }>(await fetch(`${API_BASE}/finance/billing/summary`, { headers: headers() })),
    json<{ payments: any[] }>(await fetch(`${API_BASE}/finance/billing/payments`, { headers: headers() })),
    json<{ receipts: any[] }>(await fetch(`${API_BASE}/finance/billing/receipts`, { headers: headers() })),
    json<{ refunds: any[] }>(await fetch(`${API_BASE}/finance/billing/refunds`, { headers: headers() })),
  ]);
  return { summary: summary.summary, payments: payments.payments, receipts: receipts.receipts, refunds: refunds.refunds };
}
export async function refundPayment(paymentId: number, amountMinor: number, category: string, reason: string) {
  return json<{ message: string }>(await fetch(`${API_BASE}/finance/billing/payments/${paymentId}/refunds`, {
    method: 'POST', headers: headers(true), body: JSON.stringify({ amount_minor: amountMinor, category, reason }),
  }));
}
