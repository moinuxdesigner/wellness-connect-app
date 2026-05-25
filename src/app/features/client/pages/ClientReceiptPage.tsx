import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import { getClientReceipt } from '../../shared/services/membershipApi';

function inr(amount: number) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount / 100);
}

export default function ClientReceiptPage() {
  const { receiptId } = useParams();
  const [receipt, setReceipt] = useState<any | null>(null);
  const [notice, setNotice] = useState('');
  useEffect(() => {
    getClientReceipt(Number(receiptId)).then(setReceipt).catch((error) => setNotice(error instanceof Error ? error.message : 'Unable to load receipt.'));
  }, [receiptId]);
  if (notice) return <p className="rounded-xl bg-rose-50 p-4 text-sm text-rose-700">{notice}</p>;
  if (!receipt) return <div className="h-72 animate-pulse rounded-xl bg-slate-100" />;
  return <div className="mx-auto max-w-xl">
    <div className="mb-4 flex justify-between print:hidden"><Link to="/client/membership" className="text-sm font-semibold text-indigo-600">Back to membership</Link><button type="button" onClick={() => window.print()} className="rounded-lg border px-4 py-2 text-sm font-semibold">Print Receipt</button></div>
    <article className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600">Aura Wellness Connect</p>
      <h1 className="mt-3 text-2xl font-semibold">Payment Receipt</h1>
      <p className="mt-1 text-sm text-slate-500">{receipt.receipt_number}</p>
      <dl className="mt-8 grid gap-4 text-sm">
        <div className="flex justify-between"><dt className="text-slate-500">Client</dt><dd>{receipt.client_name}</dd></div>
        <div className="flex justify-between"><dt className="text-slate-500">Email</dt><dd>{receipt.client_email}</dd></div>
        <div className="flex justify-between"><dt className="text-slate-500">Plan</dt><dd>{receipt.plan_name}</dd></div>
        <div className="flex justify-between"><dt className="text-slate-500">Tier</dt><dd>{receipt.tier_label}</dd></div>
        <div className="flex justify-between"><dt className="text-slate-500">Issued</dt><dd>{new Date(receipt.issued_at).toLocaleString()}</dd></div>
        <div className="mt-3 flex justify-between border-t pt-4 text-lg font-semibold"><dt>Amount Paid</dt><dd>{inr(receipt.amount_minor)}</dd></div>
      </dl>
      <p className="mt-8 text-xs text-slate-500">This is a payment receipt and not a statutory GST tax invoice.</p>
    </article>
  </div>;
}
