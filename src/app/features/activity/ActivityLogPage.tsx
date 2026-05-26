import { useEffect, useState } from 'react';
import { Panel, ToneBadge } from '../shared/components/Ui';
import { getActivityLogs, type ActivityLogFilters } from '../shared/services/activityApi';
import { getAuthState } from '../auth/auth';
import type { ActivityLogEntry, ActivityLogPagination, Role } from '../../types';

const roleOptions: Role[] = ['admin', 'client', 'counsellor', 'trainer', 'coach', 'helpdesk', 'finance', 'legal', 'content'];

type ActivityLogPageProps = {
  title: string;
  subtitle: string;
  emptyMessage: string;
  showAdminFilters?: boolean;
};

const emptyPagination: ActivityLogPagination = {
  page: 1,
  pageSize: 20,
  total: 0,
  totalPages: 1,
};

function humanize(value: string) {
  return value
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (match) => match.toUpperCase());
}

function badgeTone(category: string): 'success' | 'warning' | 'danger' | 'neutral' {
  if (category === 'billing' || category === 'membership_plan') return 'success';
  if (category === 'workflow_case' || category === 'workflow_config') return 'warning';
  if (category === 'rbac') return 'danger';
  return 'neutral';
}

function formatDate(value: string | null) {
  if (!value) return 'Unknown time';
  return new Date(value).toLocaleString();
}

function EntryCard({ entry }: { entry: ActivityLogEntry }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <ToneBadge tone={badgeTone(entry.category)}>{humanize(entry.category)}</ToneBadge>
            <span className="text-xs font-medium uppercase tracking-wide text-slate-400">{humanize(entry.action)}</span>
          </div>
          <h3 className="mt-2 text-base font-semibold text-slate-900">{entry.summary}</h3>
          <p className="mt-1 text-xs text-slate-500">{formatDate(entry.occurredAt)}</p>
        </div>
        {entry.subject.label ? (
          <div className="rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-600">
            <span className="font-semibold text-slate-700">Subject:</span> {entry.subject.label}
          </div>
        ) : null}
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <div className="rounded-xl border border-slate-200 px-3 py-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Actor</p>
          <p className="mt-1 text-sm text-slate-900">{entry.actor?.name ?? 'System'}</p>
          <p className="text-xs text-slate-500">{entry.actor?.role ? humanize(String(entry.actor.role)) : 'Automated action'}</p>
        </div>
        <div className="rounded-xl border border-slate-200 px-3 py-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Target</p>
          <p className="mt-1 text-sm text-slate-900">{entry.target?.name ?? (entry.target?.role ? humanize(String(entry.target.role)) : 'None')}</p>
          <p className="text-xs text-slate-500">{entry.target?.email ?? 'No direct target user'}</p>
        </div>
        <div className="rounded-xl border border-slate-200 px-3 py-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Details</p>
          <p className="mt-1 text-sm text-slate-900">{Object.keys(entry.details ?? {}).length ? `${Object.keys(entry.details).length} fields recorded` : 'No extra details'}</p>
          <p className="text-xs text-slate-500">{entry.subject.type ? humanize(entry.subject.type.split('\\').pop() ?? entry.subject.type) : 'General event'}</p>
        </div>
      </div>
    </article>
  );
}

export default function ActivityLogPage({ title, subtitle, emptyMessage, showAdminFilters = false }: ActivityLogPageProps) {
  const auth = getAuthState();
  const [entries, setEntries] = useState<ActivityLogEntry[]>([]);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [pagination, setPagination] = useState<ActivityLogPagination>(emptyPagination);
  const [filters, setFilters] = useState<ActivityLogFilters>({ page: 1, pageSize: 20 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError('');

    getActivityLogs(filters)
      .then((data) => {
        if (!mounted) return;
        setEntries(data.entries);
        setAvailableCategories(data.availableCategories);
        setPagination(data.pagination);
      })
      .catch((nextError) => {
        if (!mounted) return;
        setEntries([]);
        setAvailableCategories([]);
        setPagination(emptyPagination);
        setError(nextError instanceof Error ? nextError.message : 'Unable to load activity logs.');
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [filters]);

  function updateFilters(next: Partial<ActivityLogFilters>) {
    setFilters((current) => ({
      ...current,
      ...next,
      page: next.page ?? 1,
    }));
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
        <p className="mt-1 text-sm text-slate-600">{subtitle}</p>
      </div>

      <Panel title="Filters">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <label className="text-sm text-slate-600">
            Category
            <select
              value={filters.category ?? ''}
              onChange={(event) => updateFilters({ category: event.target.value || undefined })}
              className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
            >
              <option value="">All categories</option>
              {availableCategories.map((category) => (
                <option key={category} value={category}>{humanize(category)}</option>
              ))}
            </select>
          </label>

          <label className="text-sm text-slate-600">
            Subject Type
            <input
              value={filters.subjectType ?? ''}
              onChange={(event) => updateFilters({ subjectType: event.target.value || undefined })}
              placeholder="e.g. App\\Models\\Appointment"
              className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
            />
          </label>

          {showAdminFilters ? (
            <label className="text-sm text-slate-600">
              Audience Role
              <select
                value={filters.role ?? ''}
                onChange={(event) => updateFilters({ role: (event.target.value || undefined) as Role | undefined })}
                className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
              >
                <option value="">All roles</option>
                {roleOptions.map((role) => (
                  <option key={role} value={role}>{humanize(role)}</option>
                ))}
              </select>
            </label>
          ) : <div />}

          {showAdminFilters ? (
            <label className="text-sm text-slate-600">
              Target Role
              <select
                value={filters.targetRole ?? ''}
                onChange={(event) => updateFilters({ targetRole: (event.target.value || undefined) as Role | undefined })}
                className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
              >
                <option value="">Any target role</option>
                {roleOptions.map((role) => (
                  <option key={role} value={role}>{humanize(role)}</option>
                ))}
              </select>
            </label>
          ) : <div />}

          {showAdminFilters ? (
            <label className="text-sm text-slate-600">
              Actor User ID
              <input
                value={filters.actorUserId ?? ''}
                onChange={(event) => updateFilters({ actorUserId: event.target.value || undefined })}
                placeholder="Numeric user id"
                className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
              />
            </label>
          ) : null}
        </div>
      </Panel>

      <Panel title={showAdminFilters ? 'Platform Activity' : `${humanize(auth.user?.role ?? 'role')} Activity`}>
        <div className="mb-4 flex items-center justify-between gap-3 text-sm text-slate-500">
          <p>{pagination.total} visible events</p>
          <p>Page {pagination.page} of {pagination.totalPages}</p>
        </div>

        {error ? <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p> : null}

        <div className="space-y-3">
          {loading ? Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="h-4 w-32 animate-pulse rounded bg-slate-200" />
              <div className="mt-3 h-5 w-2/3 animate-pulse rounded bg-slate-200" />
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                {Array.from({ length: 3 }).map((__, cardIndex) => <div key={cardIndex} className="h-16 animate-pulse rounded-xl bg-slate-200" />)}
              </div>
            </div>
          )) : null}

          {!loading && !error && !entries.length ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center">
              <p className="text-sm font-medium text-slate-700">{emptyMessage}</p>
              <p className="mt-2 text-sm text-slate-500">Logs will appear here as actions are performed in this workspace.</p>
            </div>
          ) : null}

          {!loading && !error ? entries.map((entry) => (
            <EntryCard key={entry.id} entry={entry} />
          )) : null}
        </div>

        <div className="mt-5 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => updateFilters({ page: Math.max(1, pagination.page - 1) })}
            disabled={loading || pagination.page <= 1}
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous
          </button>
          <button
            type="button"
            onClick={() => updateFilters({ page: Math.min(pagination.totalPages, pagination.page + 1) })}
            disabled={loading || pagination.page >= pagination.totalPages}
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </Panel>
    </div>
  );
}
