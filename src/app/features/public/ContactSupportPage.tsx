import { useMemo, useState, type FormEvent, type ReactNode } from 'react';
import { CheckCircle2, Headphones, Mail } from 'lucide-react';
import { useNavigate } from 'react-router';
import { getAuthState } from '../auth/auth';

const API_BASE = import.meta.env.VITE_API_URL ?? '/api/v1';

const topics = [
  { value: 'trainer_approval', label: 'Trainer profile approval' },
  { value: 'account_access', label: 'Account access' },
  { value: 'technical_issue', label: 'Technical issue' },
  { value: 'billing', label: 'Billing or payment' },
  { value: 'other', label: 'Other query' },
] as const;

export default function ContactSupportPage() {
  const navigate = useNavigate();
  const auth = useMemo(() => getAuthState(), []);
  const [name, setName] = useState(auth.user?.name ?? '');
  const [email, setEmail] = useState(auth.user?.email ?? '');
  const [topic, setTopic] = useState('trainer_approval');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [ticketNumber, setTicketNumber] = useState('');

  async function submitRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE}/support-requests`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          ...(auth.token ? { Authorization: `Bearer ${auth.token}` } : {}),
        },
        body: JSON.stringify({ name, email, topic, subject, message }),
      });
      const data = await response.json() as { ticketNumber?: string; message?: string };

      if (!response.ok || !data.ticketNumber) {
        throw new Error(data.message ?? 'Unable to submit your query right now.');
      }

      setTicketNumber(data.ticketNumber);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Unable to submit your query right now.');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (ticketNumber) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-5 py-12">
        <section className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <CheckCircle2 className="mx-auto text-emerald-600" size={48} />
          <h1 className="mt-5 text-2xl font-semibold text-slate-950">Your query has been submitted</h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">Our support team will review your request and contact you by email.</p>
          <p className="mt-6 rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
            Ticket reference: <span className="font-semibold text-slate-950">{ticketNumber}</span>
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-10 sm:px-8">
      <div className="mx-auto grid max-w-5xl gap-7 lg:grid-cols-[0.82fr_1.18fr]">
        <section className="rounded-3xl bg-indigo-700 p-7 text-white sm:p-9">
          <Headphones size={36} />
          <p className="mt-7 text-xs font-semibold uppercase tracking-widest text-indigo-200">Support</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">Contact our team</h1>
          <p className="mt-4 text-sm leading-7 text-indigo-100">
            Tell us what you need help with. Queries about trainer profile review, documents, and workspace access will be routed to the support team.
          </p>
          <div className="mt-9 flex items-start gap-3 rounded-2xl bg-white/10 p-4">
            <Mail className="mt-0.5 shrink-0 text-indigo-100" size={19} />
            <p className="text-sm leading-6 text-indigo-100">We will respond using the email address supplied in your request.</p>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-2xl font-semibold text-slate-950">Submit a query</h2>
          <p className="mt-2 text-sm text-slate-600">Complete the form below and we will create a support ticket.</p>
          <form className="mt-7 space-y-5" onSubmit={submitRequest}>
            <div className="grid gap-5 sm:grid-cols-2">
              <FormField label="Your name">
                <input className={inputStyles} value={name} onChange={(event) => setName(event.target.value)} required maxLength={120} />
              </FormField>
              <FormField label="Email address">
                <input className={inputStyles} type="email" value={email} onChange={(event) => setEmail(event.target.value)} required maxLength={255} />
              </FormField>
            </div>
            <FormField label="What do you need help with?">
              <select className={inputStyles} value={topic} onChange={(event) => setTopic(event.target.value)} required>
                {topics.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
              </select>
            </FormField>
            <FormField label="Subject">
              <input className={inputStyles} value={subject} onChange={(event) => setSubject(event.target.value)} placeholder="Example: Question about my trainer profile review" required maxLength={160} />
            </FormField>
            <FormField label="Your message">
              <textarea className={`${inputStyles} min-h-36 resize-y`} value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Describe your query and any details that can help our team respond." required minLength={10} maxLength={3000} />
            </FormField>
            {error ? <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p> : null}
            <div className="flex flex-col-reverse gap-3 sm:flex-row">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => navigate(-1)}
                className="w-full rounded-xl border border-slate-300 bg-white px-5 py-3.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-xl bg-indigo-600 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? 'Submitting query...' : 'Submit query'}
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}

const inputStyles = 'w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100';

function FormField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block text-sm font-medium text-slate-700">
      <span className="mb-2 block">{label}</span>
      {children}
    </label>
  );
}
