import { useEffect, useState } from 'react';
import { ClientPageTitle } from '../ClientLayout';
import { getClientMemberships, type ClientMembership } from '../../shared/services/membershipApi';
import { Link } from 'react-router';

function inr(amountMinor: number) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amountMinor / 100);
}

export default function ClientMembershipPage() {
  const [memberships, setMemberships] = useState<ClientMembership[]>([]);
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getClientMemberships().then(setMemberships).catch((error) => setNotice(error instanceof Error ? error.message : 'Unable to load memberships.')).finally(() => setLoading(false));
  }, []);
  return (
    <div className="mx-auto max-w-2xl space-y-4 pb-4">
      <ClientPageTitle title="My Membership" subtitle="Your paid plan benefits, session credit balances, and receipts." />
      <p className="rounded-xl bg-indigo-50 p-3 text-sm text-indigo-700">You can still book ordinary pay-as-you-go appointments without using membership credits.</p>
      {notice ? <p className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{notice}</p> : null}
      {loading ? <div className="h-48 animate-pulse rounded-xl bg-slate-100" /> : memberships.length ? memberships.map((membership) => (
        <article key={membership.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex justify-between gap-3">
            <div><h2 className="font-semibold text-slate-900">{membership.planName}</h2><p className="text-sm text-slate-500">{membership.tierLabel}</p></div>
            <span className="h-fit rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold capitalize text-emerald-700">{membership.status}</span>
          </div>
          <p className="mt-3 text-xs text-slate-500">{membership.startsAt ? new Date(membership.startsAt).toLocaleDateString() : '-'} to {membership.endsAt ? new Date(membership.endsAt).toLocaleDateString() : '-'}</p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-slate-50 p-3"><p className="text-xs text-slate-500">Counselling Credits</p><p className="mt-1 text-2xl font-semibold">{membership.credits.counselling}</p></div>
            <div className="rounded-xl bg-slate-50 p-3"><p className="text-xs text-slate-500">Training Credits</p><p className="mt-1 text-2xl font-semibold">{membership.credits.training}</p></div>
          </div>
          {membership.receipt ? <p className="mt-4 text-sm text-slate-600">Receipt <strong>{membership.receipt.receipt_number}</strong> - {inr(membership.receipt.amount_minor)} <Link to={`/client/receipts/${membership.receipt.id}`} className="ml-2 font-semibold text-indigo-600">View receipt</Link></p> : null}
        </article>
      )) : <p className="rounded-xl bg-white p-6 text-sm text-slate-600">You do not have a purchased membership yet. Visit Pricing to explore plans.</p>}
    </div>
  );
}
