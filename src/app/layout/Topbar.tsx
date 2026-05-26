import { Bell, Menu } from 'lucide-react';
import { useNavigate } from 'react-router';
import { getAuthState } from '../features/auth/auth';
import { getRoleNotificationsPath } from '../features/auth/roleRedirects';

export default function Topbar({
  onOpenMobileSidebar,
}: {
  onOpenMobileSidebar: () => void;
}) {
  const auth = getAuthState();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur lg:px-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenMobileSidebar}
            className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
            aria-label="Open sidebar"
          >
            <Menu size={16} />
          </button>
          <div>
            <p className="text-xs uppercase tracking-wider text-slate-500">Signed in as</p>
            <p className="text-sm font-semibold capitalize text-slate-900">{auth.user?.role ?? 'guest'}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => auth.user?.role && navigate(getRoleNotificationsPath(auth.user.role))}
            className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-100"
            aria-label="Notifications"
          >
            <Bell size={16} />
          </button>
        </div>
      </div>
    </header>
  );
}
