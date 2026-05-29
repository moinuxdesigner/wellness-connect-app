import { useEffect, useMemo, useState } from 'react';
import { ArrowUpDown, Bell, Check, CheckCheck, ChevronRight, MoreVertical, Search } from 'lucide-react';
import { useNavigate } from 'react-router';
import type { Role } from '../../types';
import {
  calculateAdminNotificationOverview,
  buildAdminNotificationViewModels,
  groupAdminNotifications,
  notificationMatchesFilter,
  overviewCardIcon,
  overviewCardTone,
  severityBadgeStyles,
  tabIcon,
  type AdminNotificationFilter,
  type AdminNotificationOverview,
  type AdminNotificationSort,
  type AdminNotificationViewModel,
} from './adminNotificationPresentation';
import {
  getNotifications,
  markAllNotificationsRead,
  notificationCategoryLabel,
  updateNotification,
  type AppNotification,
} from './notificationsApi';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';

const roleCopy: Record<Role, { title: string; description: string; empty: string }> = {
  admin: {
    title: 'Admin Notifications',
    description: 'Escalations, workflow updates, approvals, and system-level operational alerts.',
    empty: 'No admin notifications right now.',
  },
  client: {
    title: 'Client Notifications',
    description: 'Track intake, appointments, memberships, and account-related updates.',
    empty: 'No client notifications yet.',
  },
  counsellor: {
    title: 'Counsellor Notifications',
    description: 'Session, client, and care coordination updates visible to counsellors.',
    empty: 'No counsellor notifications right now.',
  },
  trainer: {
    title: 'Trainer Notifications',
    description: 'Review follow-ups, safety alerts, adherence issues, and training updates.',
    empty: 'No trainer notifications right now.',
  },
  coach: {
    title: 'Coach Notifications',
    description: 'Goal-related and coaching workflow updates will appear here.',
    empty: 'No coach notifications right now.',
  },
  helpdesk: {
    title: 'Help Desk Notifications',
    description: 'Support escalations, workflow events, and operational updates.',
    empty: 'No help desk notifications right now.',
  },
  finance: {
    title: 'Finance Notifications',
    description: 'Billing, payment, and finance operations updates will appear here.',
    empty: 'No finance notifications right now.',
  },
  legal: {
    title: 'Legal Notifications',
    description: 'Policy, review, and legal workflow updates will appear here.',
    empty: 'No legal notifications right now.',
  },
  content: {
    title: 'Content Notifications',
    description: 'Content publishing and asset workflow updates will appear here.',
    empty: 'No content notifications right now.',
  },
};

type NotificationData = {
  unreadCount: number;
  items: AppNotification[];
};

type StandardFilterKey = 'all' | 'unread' | 'read';
type NoticeState = { tone: 'success' | 'error'; text: string } | null;

const adminFilters: Array<{ key: AdminNotificationFilter; label: string }> = [
  { key: 'all', label: 'All' },
  { key: 'unread', label: 'Unread' },
  { key: 'read', label: 'Read' },
  { key: 'escalations', label: 'Escalations' },
  { key: 'approvals', label: 'Approvals' },
  { key: 'system', label: 'System' },
];

const quickActions = [
  {
    title: 'Review escalations',
    description: 'Resolve high-risk operational cases.',
    to: '/admin/escalations',
  },
  {
    title: 'Pending approvals',
    description: 'Open the active approval and application queue.',
    to: '/admin/approvals',
  },
  {
    title: 'System health',
    description: 'Check live service and platform status.',
    to: '/admin/health',
  },
  {
    title: 'Workflow updates',
    description: 'Review workflow configuration and automation.',
    to: '/admin/workflows',
  },
];

function NoticeBanner({ notice }: { notice: NoticeState }) {
  if (!notice) return null;

  return (
    <div
      className={`rounded-2xl border px-4 py-3 text-sm ${
        notice.tone === 'error'
          ? 'border-rose-200 bg-rose-50 text-rose-700'
          : 'border-emerald-200 bg-emerald-50 text-emerald-700'
      }`}
    >
      {notice.text}
    </div>
  );
}

function StandardNotificationsPage({
  data,
  loading,
  notice,
  filter,
  onFilterChange,
  onToggleRead,
  role,
}: {
  data: NotificationData | null;
  loading: boolean;
  notice: NoticeState;
  filter: StandardFilterKey;
  onFilterChange: (filter: StandardFilterKey) => void;
  onToggleRead: (notification: AppNotification) => Promise<void>;
  role: Role;
}) {
  const copy = roleCopy[role];
  const filteredItems = useMemo(() => {
    if (!data) return [];
    if (filter === 'unread') return data.items.filter((item) => !item.read);
    if (filter === 'read') return data.items.filter((item) => item.read);
    return data.items;
  }, [data, filter]);

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">Workspace Inbox</p>
          <h1 className="mt-1 text-2xl font-semibold text-slate-900">{copy.title}</h1>
          <p className="mt-1 text-sm text-slate-600">{copy.description}</p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600">
          <Bell size={16} className="text-indigo-600" />
          <span>{data?.unreadCount ?? 0} unread</span>
        </div>
      </header>

      <NoticeBanner notice={notice} />

      <section className="flex flex-wrap gap-2">
        {([
          ['all', 'All'],
          ['unread', 'Unread'],
          ['read', 'Read'],
        ] as Array<[StandardFilterKey, string]>).map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => onFilterChange(value)}
            className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
              filter === value
                ? 'border-indigo-200 bg-indigo-50 text-indigo-700'
                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            {label}
          </button>
        ))}
      </section>

      {loading && !data ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-24 animate-pulse rounded-xl bg-slate-100" />
          ))}
        </div>
      ) : filteredItems.length ? (
        <div className="space-y-3">
          {filteredItems.map((notification) => (
            <article
              key={notification.id}
              className={`rounded-xl border p-4 transition ${
                notification.read
                  ? 'border-slate-200 bg-white'
                  : 'border-indigo-100 bg-indigo-50/70'
              }`}
            >
              <div className="flex flex-col items-start justify-between gap-4 sm:flex-row">
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {notificationCategoryLabel(notification.type)}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-900">{notification.message}</p>
                  <p className="mt-3 text-xs text-slate-400">
                    {notification.createdAt ? new Date(notification.createdAt).toLocaleString() : 'Date unavailable'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => void onToggleRead(notification)}
                  className={`inline-flex shrink-0 items-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold transition ${
                    notification.read
                      ? 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      : 'border-indigo-200 bg-white text-indigo-700 hover:bg-indigo-50'
                  }`}
                >
                  {notification.read ? <Check size={14} /> : <CheckCheck size={14} />}
                  {notification.read ? 'Mark unread' : 'Mark read'}
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center">
          <Bell size={24} className="mx-auto text-slate-400" />
          <p className="mt-4 text-sm text-slate-600">{copy.empty}</p>
        </div>
      )}
    </div>
  );
}

function OverviewCard({
  label,
  value,
  cardKey,
}: {
  label: string;
  value: number;
  cardKey: keyof AdminNotificationOverview;
}) {
  const Icon = overviewCardIcon(cardKey);

  return (
    <article className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-[0_18px_45px_-34px_rgba(15,23,42,0.22)]">
      <div className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl ${overviewCardTone(cardKey)}`}>
        <Icon size={18} />
      </div>
      <p className="mt-3 text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-1 text-3xl font-semibold tracking-tight text-slate-950">{value}</p>
    </article>
  );
}

function AdminNotificationsPage({
  data,
  loading,
  notice,
  filter,
  sort,
  search,
  actingNotificationId,
  markAllPending,
  onFilterChange,
  onSortChange,
  onSearchChange,
  onMarkAllRead,
  onToggleRead,
  onCopySummary,
  onOpenRelatedPage,
}: {
  data: NotificationData | null;
  loading: boolean;
  notice: NoticeState;
  filter: AdminNotificationFilter;
  sort: AdminNotificationSort;
  search: string;
  actingNotificationId: number | null;
  markAllPending: boolean;
  onFilterChange: (filter: AdminNotificationFilter) => void;
  onSortChange: (sort: AdminNotificationSort) => void;
  onSearchChange: (value: string) => void;
  onMarkAllRead: () => Promise<void>;
  onToggleRead: (notification: AppNotification) => Promise<void>;
  onCopySummary: (item: AdminNotificationViewModel) => Promise<void>;
  onOpenRelatedPage: (path: string) => void;
}) {
  const adminItems = useMemo(() => buildAdminNotificationViewModels(data?.items ?? []), [data]);
  const overview = useMemo(() => calculateAdminNotificationOverview(adminItems), [adminItems]);
  const visibleItems = useMemo(
    () => adminItems.filter((item) => notificationMatchesFilter(item, filter, search)),
    [adminItems, filter, search],
  );
  const groupedItems = useMemo(() => groupAdminNotifications(visibleItems, sort), [visibleItems, sort]);

  const filterCounts = useMemo(
    () => ({
      all: adminItems.length,
      unread: adminItems.filter((item) => !item.read).length,
      read: adminItems.filter((item) => item.read).length,
      escalations: adminItems.filter((item) => item.category === 'escalations').length,
      approvals: adminItems.filter((item) => item.category === 'approvals').length,
      system: adminItems.filter((item) => item.category === 'system').length,
    }),
    [adminItems],
  );

  return (
    <div className="space-y-6">
      <section className="rounded-[30px] border border-violet-100 bg-[linear-gradient(135deg,#ffffff_0%,#f7f4ff_45%,#eef6ff_100%)] p-6 shadow-[0_26px_80px_-46px_rgba(76,29,149,0.35)] sm:p-7">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-600">Workspace Inbox</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 sm:text-[2.2rem]">Admin Notifications</h1>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Escalations, workflow updates, approvals, and system-level operational alerts.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row xl:justify-end">
            <div className="inline-flex items-center gap-3 rounded-2xl border border-white/70 bg-white/90 px-4 py-3 text-sm shadow-sm backdrop-blur">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
                <Bell size={18} />
              </span>
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-400">Unread</p>
                <p className="text-base font-semibold text-slate-950">{data?.unreadCount ?? 0} in queue</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => void onMarkAllRead()}
              disabled={markAllPending || !data?.unreadCount}
              className="inline-flex h-[58px] items-center justify-center rounded-2xl bg-violet-600 px-6 text-sm font-semibold text-white shadow-[0_20px_50px_-25px_rgba(109,40,217,0.85)] transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {markAllPending ? 'Marking...' : 'Mark all as read'}
            </button>
          </div>
        </div>
      </section>

      <NoticeBanner notice={notice} />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6">
          <section className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-[0_20px_60px_-38px_rgba(15,23,42,0.16)] sm:p-5">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex flex-wrap gap-2">
                {adminFilters.map((option) => {
                  const Icon = tabIcon(option.key);
                  const count = filterCounts[option.key];
                  return (
                    <button
                      key={option.key}
                      type="button"
                      onClick={() => onFilterChange(option.key)}
                      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold transition ${
                        filter === option.key
                          ? 'border-violet-200 bg-violet-600 text-white shadow-[0_18px_40px_-28px_rgba(109,40,217,0.8)]'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Icon size={15} />
                      <span>{option.label}</span>
                      <span
                        className={`inline-flex min-w-6 items-center justify-center rounded-full px-1.5 py-0.5 text-[11px] ${
                          filter === option.key ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_180px] xl:min-w-[500px]">
                <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                  <Search size={16} className="text-slate-400" />
                  <input
                    value={search}
                    onChange={(event) => onSearchChange(event.target.value)}
                    placeholder="Search notifications..."
                    className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                  />
                </label>
                <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                  <ArrowUpDown size={16} className="text-slate-400" />
                  <select
                    value={sort}
                    onChange={(event) => onSortChange(event.target.value as AdminNotificationSort)}
                    className="w-full bg-transparent text-sm font-medium text-slate-700 outline-none"
                  >
                    <option value="newest">Newest first</option>
                    <option value="oldest">Oldest first</option>
                  </select>
                </label>
              </div>
            </div>
          </section>

          <section className="rounded-[28px] border border-slate-200 bg-white shadow-[0_20px_60px_-38px_rgba(15,23,42,0.16)]">
            <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
              <h2 className="text-xl font-semibold text-slate-950">Notification feed</h2>
              <p className="mt-1 text-sm text-slate-500">
                {visibleItems.length} visible notification{visibleItems.length === 1 ? '' : 's'}
              </p>
            </div>

            <div className="space-y-6 p-4 sm:p-6">
              {loading && !data ? (
                Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
                    <div className="h-5 w-40 animate-pulse rounded bg-slate-200" />
                    <div className="mt-3 h-4 w-full animate-pulse rounded bg-slate-200" />
                    <div className="mt-2 h-4 w-2/3 animate-pulse rounded bg-slate-200" />
                  </div>
                ))
              ) : null}

              {!loading && !adminItems.length ? (
                <div className="rounded-[26px] border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
                  <Bell size={26} className="mx-auto text-slate-400" />
                  <h3 className="mt-4 text-lg font-semibold text-slate-950">The admin inbox is quiet right now</h3>
                  <p className="mt-2 text-sm text-slate-500">New escalations, approvals, workflow changes, and system alerts will appear here.</p>
                </div>
              ) : null}

              {!loading && adminItems.length && !visibleItems.length ? (
                <div className="rounded-[26px] border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
                  <Search size={24} className="mx-auto text-slate-400" />
                  <h3 className="mt-4 text-lg font-semibold text-slate-950">No notifications match those filters</h3>
                  <p className="mt-2 text-sm text-slate-500">Try a different search term or switch back to a broader inbox segment.</p>
                  <button
                    type="button"
                    onClick={() => {
                      onFilterChange('all');
                      onSearchChange('');
                    }}
                    className="mt-5 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    Clear filters
                  </button>
                </div>
              ) : null}

              {!loading ? groupedItems.map((group) => (
                <div key={group.key}>
                  <h3 className="mb-3 text-lg font-semibold text-slate-950">{group.title}</h3>
                  <div className="space-y-3">
                    {group.items.map((item) => {
                      const matchingNotification = data?.items.find((notification) => notification.id === item.id);
                      const Icon = item.icon;
                      const isRowPending = actingNotificationId === item.id;

                      return (
                        <article
                          key={item.id}
                          className={`rounded-[24px] border p-4 transition sm:p-5 ${
                            item.read ? 'border-slate-200 bg-white' : item.accent.card
                          }`}
                        >
                          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                            <div className="min-w-0 flex-1">
                              <div className="flex items-start gap-4">
                                <span className={`mt-2 hidden h-2.5 w-2.5 rounded-full ${item.read ? 'bg-slate-300' : item.accent.dot} sm:block`} />
                                <span className={`inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${item.accent.icon}`}>
                                  <Icon size={18} />
                                </span>
                                <div className="min-w-0 flex-1">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <span className="text-sm font-semibold text-slate-950">{item.title}</span>
                                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${severityBadgeStyles(item.severity)}`}>
                                      {item.severityLabel}
                                    </span>
                                    {!item.read ? (
                                      <span className="inline-flex rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700 ring-1 ring-inset ring-violet-200">
                                        Unread
                                      </span>
                                    ) : null}
                                  </div>
                                  <p className="mt-2 text-sm font-medium text-slate-500">{item.label}</p>
                                  <p className="mt-2 text-sm leading-6 text-slate-700">{item.message}</p>
                                  <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_180px]">
                                    <div className="rounded-2xl bg-slate-50 px-4 py-3">
                                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Related</p>
                                      <p className="mt-2 truncate text-sm font-semibold text-slate-900">{item.entityName}</p>
                                      <p className="truncate text-xs text-slate-500">{item.entityMeta}</p>
                                    </div>
                                    <div className="rounded-2xl bg-slate-50 px-4 py-3">
                                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Received</p>
                                      <p className="mt-2 text-sm font-semibold text-slate-900">{item.timeLabel}</p>
                                      <p className="text-xs text-slate-500">{item.dateLabel}</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-col gap-3 lg:w-[220px] lg:items-end">
                              <button
                                type="button"
                                onClick={() => onOpenRelatedPage(item.relatedPath)}
                                className={`inline-flex min-h-[44px] items-center justify-center rounded-2xl border bg-white px-4 py-2.5 text-sm font-semibold transition ${item.accent.action}`}
                              >
                                {item.ctaLabel}
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  if (matchingNotification) {
                                    void onToggleRead(matchingNotification);
                                  }
                                }}
                                disabled={isRowPending || !matchingNotification}
                                className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                              >
                                {item.read ? <Check size={15} /> : <CheckCheck size={15} />}
                                {isRowPending ? 'Updating...' : item.read ? 'Mark unread' : 'Mark read'}
                              </button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <button
                                    type="button"
                                    className="inline-flex h-11 w-11 items-center justify-center self-end rounded-2xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-700"
                                    aria-label="More notification actions"
                                  >
                                    <MoreVertical size={16} />
                                  </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-52 rounded-2xl border-slate-200 bg-white p-1 shadow-xl">
                                  <DropdownMenuItem
                                    onClick={() => {
                                      if (matchingNotification) {
                                        void onToggleRead(matchingNotification);
                                      }
                                    }}
                                  >
                                    {item.read ? 'Mark as unread' : 'Mark as read'}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => void onCopySummary(item)}>
                                    Copy summary
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem onClick={() => onOpenRelatedPage(item.relatedPath)}>
                                    Open related page
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </div>
              )) : null}
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_20px_60px_-38px_rgba(15,23,42,0.16)]">
            <h2 className="text-xl font-semibold text-slate-950">Notification Overview</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
              <OverviewCard label="Total notifications" value={overview.total} cardKey="total" />
              <OverviewCard label="Unread" value={overview.unread} cardKey="unread" />
              <OverviewCard label="Escalations" value={overview.escalations} cardKey="escalations" />
              <OverviewCard label="Approvals pending" value={overview.approvals} cardKey="approvals" />
              <OverviewCard label="System alerts" value={overview.system} cardKey="system" />
            </div>
          </section>

          <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_20px_60px_-38px_rgba(15,23,42,0.16)]">
            <h2 className="text-xl font-semibold text-slate-950">Quick Actions</h2>
            <div className="mt-4 space-y-2">
              {quickActions.map((action) => (
                <button
                  key={action.to}
                  type="button"
                  onClick={() => onOpenRelatedPage(action.to)}
                  className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left transition hover:bg-slate-50"
                >
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{action.title}</p>
                    <p className="mt-1 text-xs text-slate-500">{action.description}</p>
                  </div>
                  <ChevronRight size={16} className="shrink-0 text-slate-400" />
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-[28px] border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8f5ff_100%)] p-5 shadow-[0_20px_60px_-38px_rgba(15,23,42,0.16)]">
            <h2 className="text-xl font-semibold text-slate-950">Notification Preferences</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Preference controls are not available in this workspace yet, but this panel is reserved for delivery and routing settings.
            </p>
            <button
              type="button"
              disabled
              className="mt-5 inline-flex h-11 w-full items-center justify-center rounded-2xl bg-violet-200/70 px-4 text-sm font-semibold text-violet-700 opacity-80"
            >
              Preferences coming soon
            </button>
          </section>
        </aside>
      </div>
    </div>
  );
}

export default function NotificationsPage({ role }: { role: Role }) {
  const navigate = useNavigate();
  const [data, setData] = useState<NotificationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState<NoticeState>(null);
  const [standardFilter, setStandardFilter] = useState<StandardFilterKey>('all');
  const [adminFilter, setAdminFilter] = useState<AdminNotificationFilter>('all');
  const [adminSort, setAdminSort] = useState<AdminNotificationSort>('newest');
  const [adminSearch, setAdminSearch] = useState('');
  const [actingNotificationId, setActingNotificationId] = useState<number | null>(null);
  const [markAllPending, setMarkAllPending] = useState(false);

  async function refresh() {
    setLoading(true);
    try {
      setData(await getNotifications());
      setNotice(null);
    } catch (error) {
      setNotice({
        tone: 'error',
        text: error instanceof Error ? error.message : 'Unable to load notifications.',
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void refresh();
  }, []);

  async function handleToggleRead(notification: AppNotification) {
    setActingNotificationId(notification.id);
    try {
      await updateNotification(notification.id, !notification.read);
      await refresh();
      setNotice({
        tone: 'success',
        text: notification.read ? 'Notification marked as unread.' : 'Notification marked as read.',
      });
    } catch (error) {
      setNotice({
        tone: 'error',
        text: error instanceof Error ? error.message : 'Unable to update notification.',
      });
    } finally {
      setActingNotificationId(null);
    }
  }

  async function handleMarkAllRead() {
    setMarkAllPending(true);
    try {
      const result = await markAllNotificationsRead();
      await refresh();
      setNotice({
        tone: 'success',
        text: result.message,
      });
    } catch (error) {
      setNotice({
        tone: 'error',
        text: error instanceof Error ? error.message : 'Unable to update notifications.',
      });
    } finally {
      setMarkAllPending(false);
    }
  }

  async function handleCopySummary(item: AdminNotificationViewModel) {
    const summary = `${item.title}: ${item.message} (${item.entityName} | ${item.timeLabel} ${item.dateLabel})`;
    if (!navigator.clipboard?.writeText) {
      setNotice({
        tone: 'error',
        text: 'Clipboard access is not available in this browser.',
      });
      return;
    }

    try {
      await navigator.clipboard.writeText(summary);
      setNotice({
        tone: 'success',
        text: 'Notification summary copied.',
      });
    } catch (error) {
      setNotice({
        tone: 'error',
        text: error instanceof Error ? error.message : 'Unable to copy the notification summary.',
      });
    }
  }

  function handleOpenRelatedPage(path: string) {
    navigate(path);
  }

  if (role !== 'admin') {
    return (
      <StandardNotificationsPage
        data={data}
        loading={loading}
        notice={notice}
        filter={standardFilter}
        onFilterChange={setStandardFilter}
        onToggleRead={handleToggleRead}
        role={role}
      />
    );
  }

  return (
    <AdminNotificationsPage
      data={data}
      loading={loading}
      notice={notice}
      filter={adminFilter}
      sort={adminSort}
      search={adminSearch}
      actingNotificationId={actingNotificationId}
      markAllPending={markAllPending}
      onFilterChange={setAdminFilter}
      onSortChange={setAdminSort}
      onSearchChange={setAdminSearch}
      onMarkAllRead={handleMarkAllRead}
      onToggleRead={handleToggleRead}
      onCopySummary={handleCopySummary}
      onOpenRelatedPage={handleOpenRelatedPage}
    />
  );
}
