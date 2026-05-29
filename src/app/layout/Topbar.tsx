import { Bell, ChevronDown, CircleHelp, Menu, PanelLeftClose, PanelLeftOpen, Search } from 'lucide-react';
import { useNavigate } from 'react-router';
import { getAuthState } from '../features/auth/auth';
import { getRoleNotificationsPath } from '../features/auth/roleRedirects';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { avatarForName } from '../features/trainer/mockTrainerDashboardData';

function initialsForName(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('') || 'WC';
}

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
  const auth = getAuthState();
  const navigate = useNavigate();
  const displayName = auth.user?.name ?? 'Admin';
  const displayRole = roleLabel(auth.user?.role);

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur lg:px-6">
      <div className="mx-auto flex w-full max-w-[1600px] items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileSidebar}
          className="inline-flex rounded-xl border border-slate-200 p-2.5 text-slate-600 transition hover:bg-slate-50 lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu size={18} />
        </button>

        <button
          type="button"
          onClick={onToggleSidebar}
          className="hidden rounded-xl border border-slate-200 p-2.5 text-slate-600 transition hover:bg-slate-50 lg:inline-flex"
          aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {sidebarCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
        </button>

        <div className="hidden min-w-0 flex-1 items-center gap-3 md:flex">
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
        </div>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={() => auth.user?.role && navigate(getRoleNotificationsPath(auth.user.role))}
            className="relative inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-50"
            aria-label="Notifications"
          >
            <Bell size={18} />
            <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-rose-500 ring-2 ring-white" />
          </button>

          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-50"
            aria-label="Help"
          >
            <CircleHelp size={18} />
          </button>

          <button
            type="button"
            className="inline-flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm transition hover:bg-slate-50"
            aria-label="Profile"
          >
            <Avatar className="h-10 w-10 border border-white shadow-sm">
              <AvatarImage src={encodeURI(avatarForName(displayName))} alt={`${displayName} avatar`} className="object-cover" />
              <AvatarFallback className="bg-violet-100 text-sm font-semibold text-violet-700">{initialsForName(displayName)}</AvatarFallback>
            </Avatar>
            <div className="hidden text-left sm:block">
              <p className="text-sm font-semibold text-slate-900">{displayName}</p>
              <p className="text-xs text-slate-500">{displayRole}</p>
            </div>
            <ChevronDown size={16} className="hidden text-slate-400 sm:block" />
          </button>
        </div>
      </div>
    </header>
  );
}
