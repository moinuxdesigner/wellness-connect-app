import { useState } from 'react';
import { Link, useParams } from 'react-router';
import {
  BodyMetricsTrendCard,
  ClientWorkspaceSummary,
  CompletedWorkoutsCard,
  EmptyProgressReviewState,
  MuscleGroupFocusCard,
  ProgressOverviewCard,
  ProgressReviewSkeleton,
  ProgressReviewTopbar,
  RecommendationCards,
} from './components/ProgressReviewComponents';
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
    <section className={`mx-5 rounded-[28px] border px-5 py-4 shadow-sm sm:mx-7 lg:mx-0 ${
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

export default function ProgressReviewPage() {
  const { clientId: clientIdParam } = useParams();
  const clientId = Number(clientIdParam);
  const resolvedClientId = Number.isFinite(clientId) && clientId > 0 ? clientId : null;
  const [searchValue, setSearchValue] = useState('');
  const { payload, loading, error } = useProgressReviewData(resolvedClientId);

  if (!resolvedClientId) {
    return <NoticeCard title="Invalid progress review route" body="A client id is required to open this progress review workspace." tone="error" />;
  }

  if (loading) {
    return <ProgressReviewSkeleton />;
  }

  if (error) {
    return <NoticeCard title="Progress review unavailable" body={error} tone="error" />;
  }

  if (!payload) {
    return <EmptyProgressReviewState />;
  }

  return (
    <div className="mx-auto max-w-[1600px] space-y-6 pb-8">
      <ProgressReviewTopbar
        title="Progress Review + Follow-up Workspace"
        dateLabel={payload.dateRange.label}
        searchValue={searchValue}
        notificationCount={payload.notificationUnreadCount}
        onSearchChange={setSearchValue}
      />

      <div className="mx-5 sm:mx-7 lg:mx-0">
        <ClientWorkspaceSummary payload={payload} messageTo={`/trainer/clients/${payload.client.id}/messages`} />
      </div>

      <div className="grid gap-5 px-5 pb-3 sm:px-7 lg:px-0">
        <div className="space-y-4">
          <ProgressOverviewCard payload={payload} />
          <div className="grid gap-4 xl:grid-cols-2 2xl:grid-cols-3">
            <BodyMetricsTrendCard metrics={payload.bodyMetrics} />
            <CompletedWorkoutsCard points={payload.completedWorkouts} />
            <MuscleGroupFocusCard items={payload.muscleFocus} />
          </div>
          <RecommendationCards items={payload.recommendations} />
        </div>
      </div>
    </div>
  );
}
