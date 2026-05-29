import { useEffect, useState, type ComponentType } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router';
import {
  BarChart3,
  Bell,
  CalendarDays,
  ChevronDown,
  ClipboardList,
  Dumbbell,
  LayoutGrid,
  LogOut,
  Menu,
  MessageCircle,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  Search,
  Settings,
  UsersRound,
} from 'lucide-react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '../../components/ui/sheet';
import AuthActionLoader from '../auth/AuthActionLoader';
import { getAuthState } from '../auth/auth';
import { logoutRequest } from '../auth/apiAuth';
import { getNotifications } from '../notifications/notificationsApi';
import { liveSessionMockData } from './mockLiveSessionData';
import { avatarForName } from './mockTrainerDashboardData';
import { coachGreetingName } from './trainerDashboardViewModel';

type TrainerNavItem = { label: string; to?: string; icon: ComponentType<{ size?: number; className?: string }> };

const trainerNav: TrainerNavItem[] = [
  { label: 'Dashboard', to: '/trainer', icon: LayoutGrid },
  { label: 'Clients', icon: UsersRound },
  { label: 'Sessions', to: '/trainer/sessions/live', icon: CalendarDays },
  { label: 'Workout Plans', to: '/trainer/plans', icon: Dumbbell },
  { label: 'Progress', to: '/trainer/progress-review', icon: BarChart3 },
  { label: 'Messages', to: '/trainer/messages', icon: MessageCircle },
  { label: 'Calendar', icon: CalendarDays },
  { label: 'Resources', icon: ClipboardList },
  { label: 'Settings', to: '/trainer/profile', icon: Settings },
];

const bottomNav: Array<{ label: string; to: string; icon: ComponentType<{ size?: number; className?: string }>; center?: boolean }> = [
  { label: 'Dashboard', to: '/trainer', icon: LayoutGrid },
  { label: 'Plans', to: '/trainer/plans', icon: Dumbbell },
  { label: 'New', to: '/trainer/sessions/new', icon: Plus, center: true },
  { label: 'Progress', to: '/trainer/progress-review', icon: BarChart3 },
  { label: 'Alerts', to: '/trainer/notifications', icon: Bell },
];

function isProgressReviewPath(pathname: string): boolean {
  return pathname === '/trainer/progress-review' || /^\/trainer\/clients\/[^/]+\/progress-review$/.test(pathname);
}

function matchesNavLabel(label: string, pathname: string): boolean {
  if (label === 'Dashboard') return pathname === '/trainer';
  if (label === 'Sessions') return pathname.startsWith('/trainer/sessions/live');
  if (label === 'Workout Plans' || label === 'Plans') return pathname.startsWith('/trainer/plans');
  if (label === 'Progress') return isProgressReviewPath(pathname) || pathname.startsWith('/trainer/check-ins');
  if (label === 'Messages') return pathname === '/trainer/messages' || /^\/trainer\/clients\/[^/]+\/messages$/.test(pathname);
  if (label === 'Settings') return pathname.startsWith('/trainer/profile');
  if (label === 'Alerts') return pathname.startsWith('/trainer/notifications');
  return false;
}

export default function TrainerCommandCenterLayout() {
  const auth = getAuthState();
  const navigate = useNavigate();
  const location = useLocation();
  const isLiveSession = location.pathname === '/trainer/sessions/live';
  const isProgressReview = isProgressReviewPath(location.pathname);
  const trainerName = auth.user?.name ?? 'Coach Arjun';
  const greetingName = coachGreetingName(trainerName);
  const visibleTrainerName = isLiveSession ? liveSessionMockData.trainer.name : trainerName;
  const avatar = isLiveSession
    ? liveSessionMockData.trainer.avatarUrl
    : avatarForName(greetingName === 'Coach' ? 'Coach Arjun' : auth.user?.name ?? trainerName);
  const [unreadCount, setUnreadCount] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const sidebarWidth = sidebarCollapsed ? 88 : 280;

  useEffect(() => {
    let mounted = true;
    void getNotifications()
      .then((notifications) => {
        if (mounted) setUnreadCount(notifications.unreadCount);
      })
      .catch(() => {
        if (mounted) setUnreadCount(0);
      });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const savedState = window.localStorage.getItem('trainer-sidebar-collapsed');
    if (savedState === '1') setSidebarCollapsed(true);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem('trainer-sidebar-collapsed', sidebarCollapsed ? '1' : '0');
  }, [sidebarCollapsed]);

  async function handleLogout() {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      await logoutRequest();
      setDrawerOpen(false);
      navigate('/login');
    } finally {
      setIsLoggingOut(false);
    }
  }

  return (
    <div
      className="min-h-screen bg-white text-slate-900 lg:bg-[radial-gradient(circle_at_top_right,#f1efff_0%,#fbfbff_32%,#f8fafc_68%)]"
      style={{ ['--trainer-sidebar-width' as string]: `${sidebarWidth}px` }}
    >
      {isLoggingOut ? <AuthActionLoader action="logout" /> : null}
      <aside
        className="fixed inset-y-0 left-0 z-30 hidden flex-col border-r border-indigo-100 bg-white/95 transition-[width] duration-300 lg:flex"
        style={{ width: sidebarWidth }}
      >
        <Brand collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed((value) => !value)} />
        <TrainerNavigation pathname={location.pathname} collapsed={sidebarCollapsed} />
        <TrainerProfileCard
          trainerName={visibleTrainerName}
          avatar={avatar}
          onLogout={handleLogout}
          isLoggingOut={isLoggingOut}
          collapsed={sidebarCollapsed}
        />
      </aside>

      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent side="left" className="w-[84vw] max-w-[310px] gap-0 border-indigo-100 bg-white p-0 lg:hidden">
          <SheetHeader className="sr-only">
            <SheetTitle>Trainer navigation</SheetTitle>
            <SheetDescription>Navigate within your trainer workspace.</SheetDescription>
          </SheetHeader>
          <Brand onNavigate={() => setDrawerOpen(false)} />
          <TrainerNavigation pathname={location.pathname} onNavigate={() => setDrawerOpen(false)} />
          <TrainerProfileCard trainerName={visibleTrainerName} avatar={avatar} onNavigate={() => setDrawerOpen(false)} onLogout={handleLogout} isLoggingOut={isLoggingOut} />
        </SheetContent>
      </Sheet>

      <div className="transition-[padding-left] duration-300 lg:pl-[var(--trainer-sidebar-width)]">
        {!isLiveSession && !isProgressReview ? <header className="sticky top-0 z-20 hidden h-[78px] items-center gap-8 border-b border-indigo-100 bg-white/85 px-8 backdrop-blur lg:flex">
          <h1 className="shrink-0 text-2xl font-semibold tracking-tight text-[#101842]">Trainer Command Center</h1>
          <label className="ml-auto flex h-12 w-[390px] items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 text-slate-400 shadow-sm">
            <Search size={18} />
            <input type="search" placeholder="Search clients, sessions, plans..." className="w-full border-none bg-transparent text-sm outline-none placeholder:text-slate-400" />
          </label>
          <NotificationButton unreadCount={unreadCount} onClick={() => navigate('/trainer/notifications')} />
          <Link to="/trainer/sessions/new" className="inline-flex h-12 items-center gap-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:brightness-105">
            <Plus size={20} /> New Session <ChevronDown size={16} />
          </Link>
          <Link to="/trainer/profile" className="flex items-center gap-3 border-l border-slate-200 pl-5">
            <img src={avatar} alt={`${visibleTrainerName} avatar`} className="h-11 w-11 rounded-full border border-slate-100 object-cover" />
            <ChevronDown size={16} className="text-slate-600" />
          </Link>
        </header> : null}

        <header className="sticky top-0 z-20 flex h-[74px] items-center justify-between bg-white/95 px-5 backdrop-blur sm:px-7 lg:hidden">
          <button type="button" aria-label="Open navigation" onClick={() => setDrawerOpen(true)} className="-ml-1 rounded-xl p-2 text-indigo-800 transition hover:bg-indigo-50">
            <Menu size={27} strokeWidth={1.75} />
          </button>
          <div className="flex items-center gap-4">
            <NotificationButton unreadCount={unreadCount} onClick={() => navigate('/trainer/notifications')} />
            <Link to="/trainer/profile" className="relative">
              <img src={avatar} alt={`${visibleTrainerName} avatar`} className="h-12 w-12 rounded-full border border-slate-100 object-cover shadow-sm" />
              <span className="absolute right-0 top-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
            </Link>
          </div>
        </header>

        <main className={isLiveSession
          ? 'w-full pb-[calc(5.75rem+env(safe-area-inset-bottom))] lg:pb-0'
          : 'w-full px-5 pb-[calc(5.75rem+env(safe-area-inset-bottom))] pt-2 sm:px-7 md:px-8 lg:px-8 lg:py-6 lg:pb-6'}
        >
          <Outlet />
        </main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-30 flex h-[76px] items-center justify-around border-t border-indigo-50 bg-white/98 px-2 pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_22px_rgba(51,65,85,0.06)] backdrop-blur lg:hidden">
        {bottomNav.map((item) => {
          const Icon = item.icon;
          const isActive = matchesNavLabel(item.label, location.pathname) || location.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={item.center
                ? 'relative -top-4 flex flex-col items-center gap-1 text-[11px] font-medium text-slate-600'
                : `flex min-w-[54px] flex-col items-center gap-1 rounded-xl px-2 py-2 text-[11px] font-medium transition ${isActive ? 'text-indigo-600' : 'text-slate-500'}`}
            >
              {item.center ? (
                <>
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-[0_10px_22px_rgba(79,70,229,0.32)]">
                    <Icon size={28} />
                  </span>
                  <span className={isActive ? 'text-indigo-600' : 'text-slate-500'}>{item.label}</span>
                </>
              ) : (
                <>
                  <Icon size={21} />
                  <span>{item.label}</span>
                </>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

function Brand({
  onNavigate,
  collapsed = false,
  onToggle,
}: {
  onNavigate?: () => void;
  collapsed?: boolean;
  onToggle?: () => void;
}) {
  return (
    <div className={`flex h-[78px] items-center border-b border-indigo-50 ${collapsed ? 'justify-center px-3' : 'justify-between gap-3 px-7'}`}>
      <Link to="/trainer" onClick={onNavigate} className={`flex min-w-0 items-center ${collapsed ? 'justify-center' : 'gap-3'}`}>
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
          <Dumbbell size={27} />
        </span>
        {!collapsed ? (
          <span className="min-w-0">
            <strong className="block truncate text-lg font-semibold tracking-tight text-indigo-700">Aura Wellness</strong>
            <span className="block text-[11px] font-medium uppercase tracking-[0.16em] text-slate-400">Connect</span>
          </span>
        ) : null}
      </Link>
      {onToggle ? (
        <button
          type="button"
          onClick={onToggle}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="hidden rounded-xl border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-100 lg:inline-flex"
        >
          {collapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
        </button>
      ) : null}
    </div>
  );
}

function TrainerNavigation({
  activeItem,
  onNavigate,
  pathname,
  collapsed = false,
}: {
  activeItem?: string;
  onNavigate?: () => void;
  pathname: string;
  collapsed?: boolean;
}) {
  return (
    <nav className={`flex-1 space-y-2 overflow-y-auto py-7 ${collapsed ? 'px-3' : 'px-4'}`}>
      {trainerNav.map((item) => {
        const Icon = item.icon;
        const isActive = activeItem ? activeItem === item.label : matchesNavLabel(item.label, pathname) || pathname === item.to;
        if (!item.to) {
          return (
            <button
              key={item.label}
              type="button"
              disabled
              title="Coming soon"
              className={`flex w-full cursor-not-allowed items-center rounded-xl py-3 text-sm font-medium ${
                collapsed ? 'justify-center px-2' : 'gap-4 px-4'
              } ${
                isActive ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-200 opacity-100' : 'text-slate-400'
              }`}
            >
              <Icon size={20} />
              {!collapsed ? item.label : null}
            </button>
          );
        }
        return (
          <Link
            key={item.label}
            to={item.to}
            onClick={onNavigate}
            title={collapsed ? item.label : undefined}
            className={`flex items-center rounded-xl py-3 text-sm font-medium transition ${
              collapsed ? 'justify-center px-2' : 'gap-4 px-4'
            } ${
              isActive ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-200' : 'text-slate-600 hover:bg-indigo-50 hover:text-indigo-700'
            }`}
          >
            <Icon size={20} />
            {!collapsed ? item.label : null}
          </Link>
        );
      })}
    </nav>
  );
}

function TrainerProfileCard({
  trainerName,
  avatar,
  onNavigate,
  onLogout,
  isLoggingOut,
  collapsed = false,
}: {
  trainerName: string;
  avatar: string;
  onNavigate?: () => void;
  onLogout: () => void;
  isLoggingOut: boolean;
  collapsed?: boolean;
}) {
  return (
    <div className={`mb-6 mt-auto rounded-2xl border border-slate-100 bg-white shadow-[0_2px_14px_rgba(30,41,59,0.06)] ${collapsed ? 'mx-3 p-3' : 'mx-4 p-4'}`}>
      <Link to="/trainer/profile" onClick={onNavigate} title={collapsed ? trainerName : undefined} className="block rounded-xl transition hover:bg-slate-50">
        <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'}`}>
          <img src={avatar} alt="" className="h-12 w-12 rounded-full object-cover" />
          {!collapsed ? (
            <>
              <span className="min-w-0 flex-1">
                <strong className="block truncate text-sm font-semibold text-slate-900">{trainerName}</strong>
                <span className="block text-xs text-slate-500">Personal Trainer</span>
              </span>
              <ChevronDown size={16} className="text-indigo-600" />
            </>
          ) : null}
        </div>
      </Link>
      <div className={`mt-3 flex ${collapsed ? 'flex-col items-center gap-2' : 'items-center justify-between gap-3'}`}>
        <span className={`flex items-center gap-2 text-xs text-slate-500 ${collapsed ? 'justify-center' : ''}`}>
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
          {!collapsed ? 'Online' : null}
        </span>
        <button
          type="button"
          onClick={onLogout}
          disabled={isLoggingOut}
          title={collapsed ? 'Logout' : undefined}
          className={`inline-flex items-center rounded-xl text-xs font-semibold text-rose-600 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60 ${
            collapsed ? 'justify-center px-2 py-2' : 'gap-2 px-3 py-2'
          }`}
        >
          <LogOut size={15} />
          {!collapsed ? 'Logout' : null}
        </button>
      </div>
    </div>
  );
}

function NotificationButton({ unreadCount, onClick }: { unreadCount: number; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} aria-label="Notifications" className="relative rounded-lg p-2 text-indigo-800 transition hover:bg-indigo-50">
      <Bell size={23} strokeWidth={1.8} />
      {unreadCount > 0 ? <span className="absolute -right-1 -top-1 rounded-full bg-rose-500 px-1.5 py-0.5 text-[10px] font-semibold text-white">{Math.min(unreadCount, 99)}</span> : null}
    </button>
  );
}
