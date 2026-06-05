import { Bell, ChevronDown, CircleHelp, Menu, PanelLeftClose, PanelLeftOpen, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { AUTH_STATE_CHANGED_EVENT, getAuthState, type AuthState } from '../features/auth/auth';
import { getRoleNotificationsPath } from '../features/auth/roleRedirects';
import { UserAvatar } from '../components/UserAvatar';
import { ThemeModeToggle } from '../features/theme/ThemeModeToggle';
import { getCounsellorNotifications, getNotifications, NOTIFICATION_UNREAD_COUNT_CHANGED } from '../features/notifications/notificationsApi';

function roleLabel(role?: string | null) {
  if (!role) return 'Workspace user';
  if (role === 'admin') return 'Super Admin';
  if (role === 'helpdesk') return 'Help Desk';
  return role
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default function Topbar({
  onOpenMobileSidebar,
  onToggleSidebar,
  sidebarCollapsed,
}: {
  onOpenMobileSidebar: () => void;
  onToggleSidebar: () => void;
  sidebarCollapsed: boolean;
}) {
  const [auth, setAuth] = useState<AuthState>(() => getAuthState());
  const navigate = useNavigate();
  const displayName = auth.user?.name ?? 'Admin';
  const displayRole = roleLabel(auth.user?.role);
  const role = auth.user?.role;
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);
  const [notificationsLoading, setNotificationsLoading] = useState(true);

  useEffect(() => {
    function refreshAuth() {
      setAuth(getAuthState());
    }

    window.addEventListener(AUTH_STATE_CHANGED_EVENT, refreshAuth);
    return () => window.removeEventListener(AUTH_STATE_CHANGED_EVENT, refreshAuth);
  }, []);

  useEffect(() => {
    let mounted = true;

    async function refreshUnreadCount() {
      if (!role) {
        setHasUnreadNotifications(false);
        setNotificationsLoading(false);
        return;
      }

      setNotificationsLoading(true);
      try {
        const unreadCount = role === 'counsellor'
          ? (await getCounsellorNotifications()).summary.unread
          : (await getNotifications()).unreadCount;

        if (mounted) setHasUnreadNotifications(unreadCount > 0);
      } catch {
        if (mounted) setHasUnreadNotifications(false);
      } finally {
        if (mounted) setNotificationsLoading(false);
      }
    }

    void refreshUnreadCount();

    window.addEventListener(NOTIFICATION_UNREAD_COUNT_CHANGED, refreshUnreadCount);
    return () => {
      mounted = false;
      window.removeEventListener(NOTIFICATION_UNREAD_COUNT_CHANGED, refreshUnreadCount);
    };
  }, [role]);

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 px-4 py-5 backdrop-blur dark:border-slate-800 dark:bg-slate-950/88 lg:px-6 lg:py-3">
      <div className="mx-auto flex w-full max-w-[1600px] items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileSidebar}
          className="inline-flex h-14 w-14 items-center justify-center rounded-[13px] border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu size={18} />
        </button>

        {/* <button
          type="button"
          onClick={onToggleSidebar}
          className="hidden rounded-xl border border-slate-200 p-2.5 text-slate-600 transition hover:bg-slate-50 lg:inline-flex"
          aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {sidebarCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
        </button> */}

        {/* <div className="hidden min-w-0 flex-1 items-center gap-3 md:flex">
          <label className="flex w-full max-w-2xl items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <Search size={18} className="text-slate-400" />
            <input
              type="text"
              placeholder="Search users, trainers, programs, tickets..."
              className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
              aria-label="Global search"
            />
            <span className="rounded-lg border border-slate-200 px-2 py-1 text-[11px] font-semibold text-slate-400">Ctrl K</span>
          </label>
        </div> */}

        <div className="ml-auto flex items-center gap-2">
          <ThemeModeToggle />

          <button
            type="button"
            onClick={() => auth.user?.role && navigate(getRoleNotificationsPath(auth.user.role))}
            className="relative inline-flex h-14 w-14 items-center justify-center rounded-[13px] border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 lg:h-11 lg:w-11 lg:rounded-xl lg:shadow-none"
            aria-label="Notifications"
          >
            <Bell size={18} />
            {!notificationsLoading && hasUnreadNotifications ? (
              <span className="absolute right-3 top-3 h-3.5 w-3.5 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900 lg:right-2 lg:top-2 lg:h-2.5 lg:w-2.5" />
            ) : null}
          </button>

          <button
            type="button"
            className="inline-flex h-14 w-14 items-center justify-center rounded-[13px] border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 lg:h-11 lg:w-11 lg:rounded-xl lg:shadow-none"
            aria-label="Help"
          >
            <CircleHelp size={18} />
          </button>

          <button
            type="button"
            className="inline-flex h-[58px] w-[58px] items-center justify-center gap-3 rounded-[14px] border border-slate-200 bg-white p-0 shadow-md transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800 sm:w-auto sm:px-3 sm:py-2 lg:h-auto lg:rounded-2xl lg:shadow-sm"
            aria-label="Profile"
          >
            <UserAvatar user={auth.user ?? { name: displayName }} size="md" className="border border-white shadow-sm dark:border-slate-700" />
            <div className="hidden text-left sm:block">
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{displayName}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{displayRole}</p>
            </div>
            <ChevronDown size={16} className="hidden text-slate-400 dark:text-slate-500 sm:block" />
          </button>
        </div>
      </div>
    </header>
  );
}
