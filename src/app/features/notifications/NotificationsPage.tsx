import { useEffect, useMemo, useState } from 'react';
import { Bell, Check, CheckCheck } from 'lucide-react';
import type { Role } from '../../types';
import { getNotifications, notificationCategoryLabel, updateNotification, type AppNotification } from './notificationsApi';

const roleCopy: Record<Role, { title: string; description: string; empty: string }> = {
  admin: {
    title: 'Admin Notifications',
    description: 'Escalations, workflow updates, and system-level operational alerts.',
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

type FilterKey = 'all' | 'unread' | 'read';

export default function NotificationsPage({ role }: { role: Role }) {
  const [data, setData] = useState<{ unreadCount: number; items: AppNotification[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState('');
  const [filter, setFilter] = useState<FilterKey>('all');

  const copy = roleCopy[role];

  async function refresh() {
    setLoading(true);
    try {
      setData(await getNotifications());
      setNotice('');
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Unable to load notifications.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void refresh();
  }, []);

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

      {notice ? <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{notice}</p> : null}

      <section className="flex flex-wrap gap-2">
        {([
          ['all', 'All'],
          ['unread', 'Unread'],
          ['read', 'Read'],
        ] as Array<[FilterKey, string]>).map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => setFilter(value)}
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
              <div className="flex items-start justify-between gap-4">
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
                  onClick={async () => {
                    try {
                      await updateNotification(notification.id, !notification.read);
                      await refresh();
                    } catch (error) {
                      setNotice(error instanceof Error ? error.message : 'Unable to update notification.');
                    }
                  }}
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
