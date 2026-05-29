import { useState } from 'react';
import { useParams } from 'react-router';
import { MessageThreadCard } from './components/ProgressReviewComponents';
import { useProgressReviewData } from './useProgressReviewData';

function NoticeCard({
  title,
  body,
  tone = 'default',
}: {
  title: string;
  body: string;
  tone?: 'default' | 'error';
}) {
  return (
    <section className={`rounded-[28px] border px-5 py-4 shadow-sm ${
      tone === 'error'
        ? 'border-rose-100 bg-rose-50 text-rose-700'
        : 'border-indigo-100 bg-white text-slate-600'
    }`}
    >
      <h2 className={`text-base font-semibold ${tone === 'error' ? 'text-rose-700' : 'text-[#111941]'}`}>{title}</h2>
      <p className="mt-2 text-sm">{body}</p>
    </section>
  );
}

export default function TrainerMessagesPage() {
  const { clientId: clientIdParam } = useParams();
  const clientId = Number(clientIdParam);
  const resolvedClientId = Number.isFinite(clientId) && clientId > 0 ? clientId : null;
  const [searchValue, setSearchValue] = useState('');
  const [draftMessage, setDraftMessage] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [isSending, setIsSending] = useState(false);
  const { payload, loading, error, sendMessage } = useProgressReviewData(resolvedClientId);

  async function handleSubmit() {
    const nextMessage = draftMessage.trim();
    if (!nextMessage || isSending) return;

    setIsSending(true);
    setSubmitError('');
    try {
      await sendMessage({ body: nextMessage });
      setDraftMessage('');
    } catch (reason) {
      setSubmitError(reason instanceof Error ? reason.message : 'Unable to send the message right now.');
    } finally {
      setIsSending(false);
    }
  }

  if (!resolvedClientId) {
    return <NoticeCard title="Invalid messages route" body="A client id is required to open this trainer message thread." tone="error" />;
  }

  if (loading) {
    return (
      <section className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold tracking-tight text-[#111941]">Messages</h1>
        <p className="mt-3 text-sm text-slate-500">Loading the conversation thread...</p>
        <div className="mt-6 h-3 w-full animate-pulse rounded-full bg-slate-100" />
      </section>
    );
  }

  if (error) {
    return <NoticeCard title="Messages unavailable" body={error} tone="error" />;
  }

  if (!payload) {
    return <NoticeCard title="Messages unavailable" body="This trainer conversation is not available right now." tone="error" />;
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-indigo-600">Trainer Workspace</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#101842]">Messages</h1>
          <p className="mt-2 text-sm text-slate-600">Continue follow-ups, share plans, and coach {payload.client.name} in one dedicated thread.</p>
        </div>
        <label className="flex h-12 w-full max-w-[360px] items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 text-slate-400 shadow-sm">
          <input
            type="search"
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
            placeholder="Search messages..."
            className="w-full border-none bg-transparent text-sm text-[#111941] outline-none placeholder:text-slate-400"
          />
        </label>
      </header>

      {submitError ? <NoticeCard title="Message not sent" body={submitError} tone="error" /> : null}

      <MessageThreadCard
        payload={payload}
        searchValue={searchValue}
        draftMessage={draftMessage}
        isSending={isSending}
        onDraftChange={setDraftMessage}
        onSubmit={handleSubmit}
        className="min-h-[calc(100vh-14rem)]"
      />
    </div>
  );
}
