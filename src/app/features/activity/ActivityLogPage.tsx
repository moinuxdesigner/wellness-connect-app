import { useEffect, useState } from 'react';
import {
  AlertCircle,
  CalendarRange,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Download,
  FilterX,
  MoreVertical,
  Search,
  ShieldAlert,
  ShieldCheck,
  UserCircle2,
  Users,
  Waves,
} from 'lucide-react';
import { getActivityLogs, type ActivityLogFilters } from '../shared/services/activityApi';
import type { ActivityLogActorOption, ActivityLogEntry, ActivityLogPagination, ActivityLogSummary, Role } from '../../types';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import { avatarForName } from '../trainer/mockTrainerDashboardData';
import { buildActivityPresentation, type ActivityPresentation, type ActivitySeverity } from './activityPresentation';

const roleOptions: Role[] = ['admin', 'client', 'counsellor', 'trainer', 'coach', 'helpdesk', 'finance', 'legal', 'content'];

type ActivityLogPageProps = {
  title: string;
  subtitle: string;
  emptyMessage: string;
  showAdminFilters?: boolean;
};

type DatePreset = '7d' | '30d' | '90d' | 'all';

type AdminFilterState = {
  query: string;
  activityType: string;
  performedBy: string;
  affectedRole: string;
  severity: ActivitySeverity | '';
  datePreset: DatePreset;
};

const emptyPagination: ActivityLogPagination = {
  page: 1,
  pageSize: 10,
  total: 0,
  totalPages: 1,
};

const emptySummary: ActivityLogSummary = {
  totalActivities: 0,
  todayActivities: 0,
  admins: 0,
  usersAffected: 0,
  criticalActions: 0,
};

const defaultAdminFilters: AdminFilterState = {
  query: '',
  activityType: '',
  performedBy: '',
  affectedRole: '',
  severity: '',
  datePreset: '7d',
};

function titleCase(value: string) {
  return value
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function initialsForName(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('') || 'WC';
}

function formatDateLabel(value: string | null) {
  if (!value) return { day: 'Unknown date', time: 'Unknown time' };
  const date = new Date(value);
  return {
    day: date.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }),
    time: date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }),
  };
}

function rangeForPreset(preset: DatePreset) {
  const end = new Date();
  const start = new Date(end);

  if (preset === '7d') start.setDate(end.getDate() - 6);
  if (preset === '30d') start.setDate(end.getDate() - 29);
  if (preset === '90d') start.setDate(end.getDate() - 89);

  const formatQueryDate = (date: Date) => date.toISOString().slice(0, 10);
  const formatDisplayDate = (date: Date) => date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });

  if (preset === 'all') {
    return {
      dateFrom: undefined,
      dateTo: undefined,
      label: 'All time',
    };
  }

  return {
    dateFrom: formatQueryDate(start),
    dateTo: formatQueryDate(end),
    label: `${formatDisplayDate(start)} - ${formatDisplayDate(end)}`,
  };
}

function severityStyles(severity: ActivitySeverity) {
  if (severity === 'high') return 'bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-200';
  if (severity === 'medium') return 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200';
  return 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200';
}

function summaryCardTone(index: number) {
  const tones = [
    'bg-violet-100 text-violet-600',
    'bg-emerald-100 text-emerald-600',
    'bg-sky-100 text-sky-600',
    'bg-amber-100 text-amber-600',
    'bg-rose-100 text-rose-600',
  ];

  return tones[index] ?? tones[0];
}

function downloadFile(fileName: string, content: string, contentType: string) {
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  URL.revokeObjectURL(url);
}

function csvCell(value: string) {
  return `"${value.replace(/"/g, '""')}"`;
}

function buildCsv(entries: Array<{ entry: ActivityLogEntry; presentation: ActivityPresentation }>) {
  const header = [
    'Time',
    'Performed By',
    'Action',
    'What Happened',
    'Affected',
    'Severity',
    'IP Address',
  ].map(csvCell).join(',');

  const rows = entries.map(({ entry, presentation }) => [
    entry.occurredAt ? new Date(entry.occurredAt).toLocaleString() : 'Unknown time',
    presentation.performerName,
    presentation.actionLabel,
    presentation.summary,
    presentation.affectedName,
    titleCase(presentation.severity),
    presentation.ipAddress,
  ].map(csvCell).join(','));

  return [header, ...rows].join('\n');
}

function buildPresentedEntries(entries: ActivityLogEntry[]) {
  return entries.map((entry) => ({
    entry,
    presentation: buildActivityPresentation(entry),
  }));
}

function PersonPill({ name, subtitle }: { name: string; subtitle: string }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <Avatar className="h-9 w-9 border border-white shadow-sm">
        <AvatarImage src={encodeURI(avatarForName(name))} alt={name} className="object-cover" />
        <AvatarFallback className="bg-violet-100 text-xs font-semibold text-violet-700">{initialsForName(name)}</AvatarFallback>
      </Avatar>
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-slate-900">{name}</p>
        <p className="truncate text-xs text-slate-500">{subtitle}</p>
      </div>
    </div>
  );
}

function EntityPill({ name, subtitle }: { name: string; subtitle: string }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-100 text-violet-600">
        <Waves size={16} />
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-slate-900">{name}</p>
        <p className="truncate text-xs text-slate-500">{subtitle}</p>
      </div>
    </div>
  );
}

function ActivityDetailCard({
  item,
  onClose,
}: {
  item: { entry: ActivityLogEntry; presentation: ActivityPresentation } | undefined;
  onClose: () => void;
}) {
  if (!item) return null;

  return (
    <section className="rounded-[28px] border border-violet-100 bg-white p-6 shadow-[0_20px_60px_-35px_rgba(76,29,149,0.35)]">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${item.presentation.actionTone}`}>
              <item.presentation.actionIcon size={14} />
              {item.presentation.actionLabel}
            </span>
            <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${severityStyles(item.presentation.severity)}`}>
              {titleCase(item.presentation.severity)}
            </span>
          </div>
          <h3 className="mt-3 text-xl font-semibold text-slate-950">{item.presentation.summary}</h3>
          <p className="mt-1 text-sm text-slate-500">Original system summary: {item.entry.summary}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
        >
          Close
        </button>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-4">
        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Performed By</p>
          <p className="mt-2 text-sm font-semibold text-slate-900">{item.presentation.performerName}</p>
          <p className="text-xs text-slate-500">{item.presentation.performerRole}</p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Affected</p>
          <p className="mt-2 text-sm font-semibold text-slate-900">{item.presentation.affectedName}</p>
          <p className="text-xs text-slate-500">{item.presentation.affectedMeta}</p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Time</p>
          <p className="mt-2 text-sm font-semibold text-slate-900">{formatDateLabel(item.entry.occurredAt).day}</p>
          <p className="text-xs text-slate-500">{formatDateLabel(item.entry.occurredAt).time}</p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">IP Address</p>
          <p className="mt-2 text-sm font-semibold text-slate-900">{item.presentation.ipAddress}</p>
          <p className="text-xs text-slate-500">Captured with the activity when available</p>
        </div>
      </div>

      <div className="mt-4 rounded-2xl bg-slate-950 p-4 text-xs text-slate-100">
        <p className="mb-3 font-semibold text-white">Technical details</p>
        <pre className="overflow-x-auto whitespace-pre-wrap">{JSON.stringify(item.entry.details ?? {}, null, 2)}</pre>
      </div>
    </section>
  );
}

function StandardFeed({
  title,
  subtitle,
  emptyMessage,
  entries,
  pagination,
  loading,
  error,
  onPageChange,
}: {
  title: string;
  subtitle: string;
  emptyMessage: string;
  entries: Array<{ entry: ActivityLogEntry; presentation: ActivityPresentation }>;
  pagination: ActivityLogPagination;
  loading: boolean;
  error: string;
  onPageChange: (page: number) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
        <p className="mt-1 text-sm text-slate-600">{subtitle}</p>
      </div>

      <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-35px_rgba(15,23,42,0.2)]">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-950">Recent Activity</h2>
            <p className="text-sm text-slate-500">{pagination.total} visible events</p>
          </div>
          <div className="text-sm text-slate-500">Page {pagination.page} of {pagination.totalPages}</div>
        </div>

        {error ? <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p> : null}

        <div className="space-y-3">
          {loading ? Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <div className="h-5 w-40 animate-pulse rounded bg-slate-200" />
              <div className="mt-3 h-4 w-2/3 animate-pulse rounded bg-slate-200" />
            </div>
          )) : null}

          {!loading && !error && !entries.length ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center">
              <p className="text-sm font-medium text-slate-700">{emptyMessage}</p>
              <p className="mt-2 text-sm text-slate-500">Logs will appear here as activity is recorded.</p>
            </div>
          ) : null}

          {!loading && !error ? entries.map(({ entry, presentation }) => (
            <article key={entry.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${presentation.actionTone}`}>
                      <presentation.actionIcon size={14} />
                      {presentation.actionLabel}
                    </span>
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${severityStyles(presentation.severity)}`}>
                      {titleCase(presentation.severity)}
                    </span>
                  </div>
                  <h3 className="mt-3 text-base font-semibold text-slate-950">{presentation.summary}</h3>
                  <p className="mt-1 text-sm text-slate-500">{formatDateLabel(entry.occurredAt).day} at {formatDateLabel(entry.occurredAt).time}</p>
                </div>
                <div className="min-w-[220px]">
                  <PersonPill name={presentation.performerName} subtitle={presentation.performerRole} />
                </div>
              </div>
            </article>
          )) : null}
        </div>

        <div className="mt-6 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => onPageChange(Math.max(1, pagination.page - 1))}
            disabled={loading || pagination.page <= 1}
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous
          </button>
          <button
            type="button"
            onClick={() => onPageChange(Math.min(pagination.totalPages, pagination.page + 1))}
            disabled={loading || pagination.page >= pagination.totalPages}
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </section>
    </div>
  );
}

export default function ActivityLogPage({ title, subtitle, emptyMessage, showAdminFilters = false }: ActivityLogPageProps) {
  const isAdminConsole = showAdminFilters;
  const [entries, setEntries] = useState<ActivityLogEntry[]>([]);
  const [availableActors, setAvailableActors] = useState<ActivityLogActorOption[]>([]);
  const [pagination, setPagination] = useState<ActivityLogPagination>({
    ...emptyPagination,
    pageSize: isAdminConsole ? 10 : 20,
  });
  const [summary, setSummary] = useState<ActivityLogSummary>(emptySummary);
  const [filters, setFilters] = useState<ActivityLogFilters>({ page: 1, pageSize: isAdminConsole ? 10 : 20 });
  const [adminFilters, setAdminFilters] = useState<AdminFilterState>(defaultAdminFilters);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [selectedEntryId, setSelectedEntryId] = useState<number | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError('');

    getActivityLogs(filters)
      .then((data) => {
        if (!mounted) return;
        setEntries(data.entries);
        setAvailableActors(data.availableActors);
        setPagination(data.pagination);
        setSummary(data.summary);
      })
      .catch((nextError) => {
        if (!mounted) return;
        setEntries([]);
        setAvailableActors([]);
        setPagination({ ...emptyPagination, pageSize: isAdminConsole ? 10 : 20 });
        setSummary(emptySummary);
        setError(nextError instanceof Error ? nextError.message : 'Unable to load activity logs.');
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [filters, isAdminConsole]);

  const presentedEntries = buildPresentedEntries(entries);
  const activityTypeOptions = Array.from(
    new Map(
      presentedEntries.map(({ presentation }) => [presentation.actionKey, presentation.actionLabel]),
    ).entries(),
  ).map(([value, label]) => ({ value, label }));

  const visibleEntries = presentedEntries.filter(({ presentation }) => {
    if (adminFilters.activityType && presentation.actionKey !== adminFilters.activityType) return false;
    if (adminFilters.severity && presentation.severity !== adminFilters.severity) return false;
    return true;
  });

  const selectedItem = visibleEntries.find(({ entry }) => entry.id === selectedEntryId);
  const hasLocalFilters = Boolean(adminFilters.activityType || adminFilters.severity);
  const pageStart = pagination.total ? (pagination.page - 1) * pagination.pageSize + 1 : 0;
  const pageEnd = pagination.total ? pageStart + Math.max(visibleEntries.length - 1, 0) : 0;
  const tableSubtitle = hasLocalFilters
    ? `Showing ${visibleEntries.length} matching activities on this page`
    : `Showing ${pageStart} to ${pageEnd} of ${pagination.total} activities`;

  function updatePage(page: number) {
    setFilters((current) => ({
      ...current,
      page,
    }));
  }

  function applyAdminFilters() {
    const range = rangeForPreset(adminFilters.datePreset);
    setNotice('');
    setSelectedEntryId(null);
    setFilters({
      page: 1,
      pageSize: 10,
      query: adminFilters.query || undefined,
      actorUserId: adminFilters.performedBy || undefined,
      targetRole: (adminFilters.affectedRole || undefined) as Role | undefined,
      dateFrom: range.dateFrom,
      dateTo: range.dateTo,
    });
  }

  function clearAdminFilters() {
    setAdminFilters(defaultAdminFilters);
    setNotice('');
    setSelectedEntryId(null);
    setFilters({ page: 1, pageSize: 10 });
  }

  function exportVisibleEntries() {
    if (!visibleEntries.length) return;
    downloadFile(`activity-logs-${new Date().toISOString().slice(0, 10)}.csv`, buildCsv(visibleEntries), 'text/csv;charset=utf-8;');
    setNotice('Exported the visible activity list.');
  }

  async function copyActivitySummary(item: { entry: ActivityLogEntry; presentation: ActivityPresentation }) {
    const summaryText = `${item.presentation.summary} (${item.presentation.performerName}, ${formatDateLabel(item.entry.occurredAt).day} ${formatDateLabel(item.entry.occurredAt).time})`;
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(summaryText);
      setNotice('Copied the activity summary.');
      return;
    }

    setNotice('Clipboard access is not available in this browser.');
  }

  function exportSingleRecord(item: { entry: ActivityLogEntry; presentation: ActivityPresentation }) {
    downloadFile(
      `activity-record-${item.entry.id}.json`,
      JSON.stringify({
        id: item.entry.id,
        summary: item.presentation.summary,
        action: item.presentation.actionLabel,
        severity: item.presentation.severity,
        occurredAt: item.entry.occurredAt,
        performedBy: item.presentation.performerName,
        affected: item.presentation.affectedName,
        details: item.entry.details,
      }, null, 2),
      'application/json;charset=utf-8;',
    );
    setNotice('Exported the selected activity record.');
  }

  if (!isAdminConsole) {
    return (
      <StandardFeed
        title={title}
        subtitle={subtitle}
        emptyMessage={emptyMessage}
        entries={presentedEntries}
        pagination={pagination}
        loading={loading}
        error={error}
        onPageChange={updatePage}
      />
    );
  }

  const headerTitle = 'Activity Logs';
  const headerSubtitle = 'A clear record of important actions and changes across the platform.';
  const dateRange = rangeForPreset(adminFilters.datePreset);
  const summaryCards = [
    { label: 'Total Activities', value: summary.totalActivities || pagination.total, hint: 'All time', icon: Waves },
    { label: "Today's Activities", value: summary.todayActivities, hint: 'Recorded today', icon: ShieldCheck },
    { label: 'Admins', value: summary.admins, hint: 'Performed activities', icon: UserCircle2 },
    { label: 'Users Affected', value: summary.usersAffected, hint: 'Across all actions', icon: Users },
    { label: 'Critical Actions', value: summary.criticalActions, hint: 'Require attention', icon: ShieldAlert },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950">{headerTitle}</h1>
          <p className="mt-2 max-w-3xl text-sm text-slate-600">{headerSubtitle}</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="inline-flex min-w-[240px] items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm">
            <CalendarRange size={18} className="text-violet-500" />
            <span className="min-w-0 flex-1 truncate">{dateRange.label}</span>
            <select
              value={adminFilters.datePreset}
              onChange={(event) => setAdminFilters((current) => ({ ...current, datePreset: event.target.value as DatePreset }))}
              className="bg-transparent text-right text-sm font-medium text-slate-700 outline-none"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="all">All time</option>
            </select>
          </label>
          <button
            type="button"
            onClick={exportVisibleEntries}
            disabled={!visibleEntries.length}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Download size={16} />
            Export
          </button>
        </div>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {summaryCards.map((card, index) => (
          <article key={card.label} className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_20px_60px_-35px_rgba(15,23,42,0.16)]">
            <div className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl ${summaryCardTone(index)}`}>
              <card.icon size={20} />
            </div>
            <p className="mt-4 text-sm font-medium text-slate-500">{card.label}</p>
            <p className="mt-1 text-3xl font-semibold tracking-tight text-slate-950">{card.value}</p>
            <p className="mt-1 text-xs text-slate-500">{card.hint}</p>
          </article>
        ))}
      </section>

      <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_20px_60px_-35px_rgba(15,23,42,0.16)]">
        <div className="grid gap-3 xl:grid-cols-5">
          <label className="text-sm text-slate-600">
            <span className="mb-2 block font-medium text-slate-700">Search activities</span>
            <div className="flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 shadow-sm">
              <Search size={16} className="text-slate-400" />
              <input
                value={adminFilters.query}
                onChange={(event) => setAdminFilters((current) => ({ ...current, query: event.target.value }))}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') applyAdminFilters();
                }}
                placeholder="Search by person, action, or details..."
                className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
              />
            </div>
          </label>

          <label className="text-sm text-slate-600">
            <span className="mb-2 block font-medium text-slate-700">Activity type</span>
            <select
              value={adminFilters.activityType}
              onChange={(event) => setAdminFilters((current) => ({ ...current, activityType: event.target.value }))}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 shadow-sm outline-none"
            >
              <option value="">All activities</option>
              {activityTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </label>

          <label className="text-sm text-slate-600">
            <span className="mb-2 block font-medium text-slate-700">Performed by</span>
            <select
              value={adminFilters.performedBy}
              onChange={(event) => setAdminFilters((current) => ({ ...current, performedBy: event.target.value }))}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 shadow-sm outline-none"
            >
              <option value="">All users</option>
              {availableActors.map((actor) => (
                <option key={actor.id} value={String(actor.id)}>{actor.name}</option>
              ))}
            </select>
          </label>

          <label className="text-sm text-slate-600">
            <span className="mb-2 block font-medium text-slate-700">Affected role</span>
            <select
              value={adminFilters.affectedRole}
              onChange={(event) => setAdminFilters((current) => ({ ...current, affectedRole: event.target.value }))}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 shadow-sm outline-none"
            >
              <option value="">All roles</option>
              {roleOptions.map((role) => (
                <option key={role} value={role}>{titleCase(role)}</option>
              ))}
            </select>
          </label>

          <label className="text-sm text-slate-600">
            <span className="mb-2 block font-medium text-slate-700">Severity</span>
            <select
              value={adminFilters.severity}
              onChange={(event) => setAdminFilters((current) => ({ ...current, severity: event.target.value as ActivitySeverity | '' }))}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 shadow-sm outline-none"
            >
              <option value="">All levels</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </label>
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
          <button
            type="button"
            onClick={clearAdminFilters}
            className="inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
          >
            <FilterX size={16} />
            Clear filters
          </button>
          <button
            type="button"
            onClick={applyAdminFilters}
            disabled={loading}
            className="inline-flex items-center justify-center rounded-2xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-[0_20px_50px_-25px_rgba(109,40,217,0.85)] transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Apply Filters
          </button>
        </div>
      </section>

      {notice ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {notice}
        </div>
      ) : null}

      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      <ActivityDetailCard item={selectedItem} onClose={() => setSelectedEntryId(null)} />

      <section className="rounded-[28px] border border-slate-200 bg-white shadow-[0_20px_60px_-35px_rgba(15,23,42,0.16)]">
        <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-5 sm:px-6">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-950">Activity History</h2>
              <p className="mt-1 text-sm text-slate-500">{tableSubtitle}</p>
            </div>
            <div className="flex items-center gap-2 self-end">
              <button
                type="button"
                onClick={() => updatePage(Math.max(1, pagination.page - 1))}
                disabled={loading || pagination.page <= 1}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Previous page"
              >
                <ChevronLeft size={16} />
              </button>
              <div className="inline-flex items-center rounded-xl bg-violet-50 px-3 py-2 text-sm font-semibold text-violet-700">
                {pagination.page}
              </div>
              <button
                type="button"
                onClick={() => updatePage(Math.min(pagination.totalPages, pagination.page + 1))}
                disabled={loading || pagination.page >= pagination.totalPages}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Next page"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        <div className="hidden overflow-x-auto lg:block">
          <table className="min-w-full table-fixed">
            <thead>
              <tr className="border-b border-slate-100 text-left text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                <th className="px-6 py-4">Time</th>
                <th className="px-6 py-4">Performed By</th>
                <th className="px-6 py-4">Action</th>
                <th className="px-6 py-4">What Happened</th>
                <th className="px-6 py-4">Affected</th>
                <th className="px-6 py-4">Severity</th>
                <th className="px-6 py-4">IP Address</th>
                <th className="px-6 py-4 text-right">More actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? Array.from({ length: 8 }).map((_, index) => (
                <tr key={index} className="border-b border-slate-100 last:border-b-0">
                  {Array.from({ length: 8 }).map((__, cellIndex) => (
                    <td key={cellIndex} className="px-6 py-5">
                      <div className="h-4 animate-pulse rounded bg-slate-100" />
                    </td>
                  ))}
                </tr>
              )) : null}

              {!loading && !visibleEntries.length ? (
                <tr>
                  <td colSpan={8} className="px-6 py-16">
                    <div className="mx-auto max-w-md text-center">
                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-violet-100 text-violet-600">
                        <AlertCircle size={22} />
                      </div>
                      <h3 className="mt-4 text-lg font-semibold text-slate-950">No activity found</h3>
                      <p className="mt-2 text-sm text-slate-500">Try changing the filters or date range to see more activity.</p>
                      <button
                        type="button"
                        onClick={clearAdminFilters}
                        className="mt-5 rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                      >
                        Clear filters
                      </button>
                    </div>
                  </td>
                </tr>
              ) : null}

              {!loading ? visibleEntries.map((item) => {
                const time = formatDateLabel(item.entry.occurredAt);
                return (
                  <tr key={item.entry.id} className="border-b border-slate-100 align-top last:border-b-0">
                    <td className="px-6 py-5">
                      <p className="text-sm font-semibold text-slate-900">{time.day}</p>
                      <p className="mt-1 text-xs text-slate-500">{time.time}</p>
                    </td>
                    <td className="px-6 py-5">
                      <PersonPill name={item.presentation.performerName} subtitle={item.presentation.performerRole} />
                    </td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${item.presentation.actionTone}`}>
                        <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full ${item.presentation.iconTone}`}>
                          <item.presentation.actionIcon size={12} />
                        </span>
                        {item.presentation.actionLabel}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <p className="max-w-md text-sm leading-6 text-slate-700">{item.presentation.summary}</p>
                    </td>
                    <td className="px-6 py-5">
                      {item.presentation.affectedIsPerson ? (
                        <PersonPill name={item.presentation.affectedName} subtitle={item.presentation.affectedMeta} />
                      ) : (
                        <EntityPill name={item.presentation.affectedName} subtitle={item.presentation.affectedMeta} />
                      )}
                    </td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${severityStyles(item.presentation.severity)}`}>
                        {titleCase(item.presentation.severity)}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-sm text-slate-600">{item.presentation.ipAddress}</td>
                    <td className="px-6 py-5 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            type="button"
                            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-transparent text-slate-500 transition hover:border-slate-200 hover:bg-slate-50 hover:text-slate-700"
                            aria-label="More actions"
                          >
                            <MoreVertical size={16} />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-52 rounded-xl border-slate-200 bg-white p-1 shadow-xl">
                          <DropdownMenuItem onClick={() => setSelectedEntryId(item.entry.id)}>
                            View details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => void copyActivitySummary(item)}>
                            Copy activity summary
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => exportSingleRecord(item)}>
                            Export record
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                );
              }) : null}
            </tbody>
          </table>
        </div>

        <div className="space-y-4 p-4 lg:hidden">
          {loading ? Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <div className="h-5 w-40 animate-pulse rounded bg-slate-200" />
              <div className="mt-3 h-4 w-3/4 animate-pulse rounded bg-slate-200" />
            </div>
          )) : null}

          {!loading && !visibleEntries.length ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center">
              <h3 className="text-lg font-semibold text-slate-950">No activity found</h3>
              <p className="mt-2 text-sm text-slate-500">Try changing the filters or date range to see more activity.</p>
              <button
                type="button"
                onClick={clearAdminFilters}
                className="mt-5 rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Clear filters
              </button>
            </div>
          ) : null}

          {!loading ? visibleEntries.map((item) => {
            const time = formatDateLabel(item.entry.occurredAt);
            return (
              <article key={item.entry.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${item.presentation.actionTone}`}>
                      <item.presentation.actionIcon size={14} />
                      {item.presentation.actionLabel}
                    </span>
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${severityStyles(item.presentation.severity)}`}>
                      {titleCase(item.presentation.severity)}
                    </span>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        type="button"
                        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500"
                        aria-label="More actions"
                      >
                        <MoreVertical size={16} />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-52 rounded-xl border-slate-200 bg-white p-1 shadow-xl">
                      <DropdownMenuItem onClick={() => setSelectedEntryId(item.entry.id)}>
                        View details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => void copyActivitySummary(item)}>
                        Copy activity summary
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => exportSingleRecord(item)}>
                        Export record
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <p className="mt-4 text-sm leading-6 text-slate-700">{item.presentation.summary}</p>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Performed By</p>
                    <div className="mt-3">
                      <PersonPill name={item.presentation.performerName} subtitle={item.presentation.performerRole} />
                    </div>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Affected</p>
                    <div className="mt-3">
                      {item.presentation.affectedIsPerson ? (
                        <PersonPill name={item.presentation.affectedName} subtitle={item.presentation.affectedMeta} />
                      ) : (
                        <EntityPill name={item.presentation.affectedName} subtitle={item.presentation.affectedMeta} />
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Time</p>
                    <p className="mt-2 text-sm font-semibold text-slate-900">{time.day}</p>
                    <p className="text-xs text-slate-500">{time.time}</p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">IP Address</p>
                    <p className="mt-2 text-sm font-semibold text-slate-900">{item.presentation.ipAddress}</p>
                  </div>
                </div>
              </article>
            );
          }) : null}
        </div>
      </section>

      <section className="rounded-[28px] border border-violet-100 bg-gradient-to-br from-violet-50 via-white to-indigo-50 p-5 shadow-[0_20px_60px_-35px_rgba(76,29,149,0.25)]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-950">Need help reading this page?</h3>
            <p className="mt-1 text-sm text-slate-600">Use the filters to focus on a person, role, or time range, then open any row for the full audit details.</p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-medium text-slate-600 shadow-sm">
            <CircleHelp size={16} className="text-violet-500" />
            Audit-friendly language is active
          </div>
        </div>
      </section>
    </div>
  );
}
