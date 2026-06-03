import { NavLink } from 'react-router';
import { PanelLeftClose, PanelLeftOpen, X, type LucideIcon } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { LogOut } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { logoutRequest } from '../features/auth/apiAuth';
import AuthActionLoader from '../features/auth/AuthActionLoader';
import clientSidebarBg from '../../assets/client-sidebar-bg.svg';

export interface NavItem {
  label: string;
  to: string;
  icon: LucideIcon;
  end?: boolean;
  permission?: string;
}

export default function Sidebar({
  items,
  collapsed,
  onToggle,
  width,
  title = 'Admin Console',
  mobileOpen = false,
  onMobileClose,
}: {
  items: NavItem[];
  collapsed: boolean;
  onToggle: () => void;
  width: number;
  title?: string;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}) {
  return (
    <>
      <motion.aside
        initial={false}
        animate={{ width }}
        transition={{ type: 'spring', stiffness: 240, damping: 28 }}
        className="fixed inset-y-0 left-0 z-30 hidden overflow-hidden border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 lg:block"
      >
        <SidebarContent collapsed={collapsed} items={items} onToggle={onToggle} title={title} />
      </motion.aside>

      <AnimatePresence>
        {mobileOpen ? (
          <>
            <motion.button
              type="button"
              aria-label="Close menu"
              className="fixed inset-0 z-40 bg-slate-950/60 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onMobileClose}
            />
            <motion.aside
              className="fixed inset-y-0 left-0 z-50 w-[min(88vw,320px)] overflow-hidden border-r border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950 lg:hidden"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 260, damping: 30 }}
            >
              <SidebarContent collapsed={false} items={items} onMobileClose={onMobileClose} title={title} />
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}

function SidebarContent({
  collapsed,
  items,
  onToggle,
  onMobileClose,
  title,
}: {
  collapsed: boolean;
  items: NavItem[];
  onToggle?: () => void;
  onMobileClose?: () => void;
  title: string;
}) {
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-white p-4 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      {title === 'Client Portal' ? (
        <img
          src={clientSidebarBg}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-auto w-full"
        />
      ) : null}
      {isLoggingOut ? <AuthActionLoader action="logout" /> : null}
      <div className={`relative z-10 mb-4 flex items-center ${collapsed ? 'justify-center' : 'justify-between gap-2'}`}>
        <AnimatePresence mode="wait" initial={false}>
          {collapsed ? (
            <motion.p
              key="short-brand"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="text-xs font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-300"
            >
              WC
            </motion.p>
          ) : (
            <motion.div
              key="full-brand"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.18 }}
            >
              <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-300">WellnessConnect</p>
              <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{title}</h1>
            </motion.div>
          )}
        </AnimatePresence>
        <button
          type="button"
          onClick={onMobileClose ?? onToggle}
          className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          aria-label={onMobileClose ? 'Close sidebar' : collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {onMobileClose ? <X size={16} /> : collapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
        </button>
      </div>
      <nav className="relative z-10 flex-1 space-y-1 overflow-x-hidden overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              title={collapsed ? item.label : undefined}
              onClick={onMobileClose}
              className={({ isActive }) =>
                `flex items-center rounded-xl py-2 text-sm font-medium ${
                  collapsed ? 'justify-center px-2' : 'gap-2 px-3'
                } ${
                  isActive ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-200' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
                }`
              }
            >
              <Icon size={16} />
              <AnimatePresence initial={false}>
                {!collapsed ? (
                  <motion.span
                    key={item.label}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    transition={{ duration: 0.14 }}
                  >
                    {item.label}
                  </motion.span>
                ) : null}
              </AnimatePresence>
            </NavLink>
          );
        })}
      </nav>
      <div className="relative z-10 mt-3 border-t border-slate-200 pt-3 dark:border-slate-800">
        <button
          type="button"
          disabled={isLoggingOut}
          title={collapsed ? 'Logout' : undefined}
          onClick={async () => {
            if (isLoggingOut) return;
            setIsLoggingOut(true);
            try {
              await logoutRequest();
              navigate('/login');
              onMobileClose?.();
            } finally {
              setIsLoggingOut(false);
            }
          }}
          className={`flex w-full items-center rounded-xl py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60 dark:text-rose-300 dark:hover:bg-rose-500/10 ${
            collapsed ? 'justify-center px-2' : 'gap-2 px-3'
          }`}
        >
          <LogOut size={16} />
          <AnimatePresence initial={false}>
            {!collapsed ? (
              <motion.span
                key="logout-label"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.14 }}
              >
                Logout
              </motion.span>
            ) : null}
          </AnimatePresence>
        </button>
      </div>
    </div>
  );
}
