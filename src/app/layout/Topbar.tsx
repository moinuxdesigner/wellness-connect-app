import { Bell, LogOut, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { getAuthState } from '../features/auth/auth';
import { logoutRequest } from '../features/auth/apiAuth';

export default function Topbar({ collapsed, onToggleSidebar }: { collapsed: boolean; onToggleSidebar: () => void }) {
  const navigate = useNavigate();
  const auth = getAuthState();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur lg:px-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleSidebar}
            className="hidden rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 lg:inline-flex"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
          </button>
          <div>
            <p className="text-xs uppercase tracking-wider text-slate-500">Signed in as</p>
            <p className="text-sm font-semibold capitalize text-slate-900">{auth.user?.role ?? 'guest'}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-100" aria-label="Notifications">
            <Bell size={16} />
          </button>
          <button
            onClick={async () => {
              if (isLoggingOut) return;
              setIsLoggingOut(true);
              try {
                await logoutRequest();
                navigate('/login');
              } finally {
                setIsLoggingOut(false);
              }
            }}
            disabled={isLoggingOut}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoggingOut ? (
              <>
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600" />
                Logging out...
              </>
            ) : (
              <>
                <LogOut size={14} /> Logout
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
