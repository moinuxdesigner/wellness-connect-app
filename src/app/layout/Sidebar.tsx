import { NavLink } from 'react-router';
import { PanelLeftClose, PanelLeftOpen, type LucideIcon } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

export interface NavItem {
  label: string;
  to: string;
  icon: LucideIcon;
}

export default function Sidebar({
  items,
  collapsed,
  onToggle,
  width,
}: {
  items: NavItem[];
  collapsed: boolean;
  onToggle: () => void;
  width: number;
}) {
  return (
    <motion.aside
      initial={false}
      animate={{ width }}
      transition={{ type: 'spring', stiffness: 240, damping: 28 }}
      className="fixed inset-y-0 left-0 z-30 hidden overflow-hidden border-r border-slate-200 bg-white lg:block"
    >
      <div className="flex h-full flex-col p-4">
        <div className={`mb-4 flex items-center ${collapsed ? 'justify-center' : 'justify-between gap-2'}`}>
          <AnimatePresence mode="wait" initial={false}>
            {collapsed ? (
              <motion.p
                key="short-brand"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
                className="text-xs font-semibold uppercase tracking-widest text-indigo-600"
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
                <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600">WellnessConnect</p>
                <h1 className="text-xl font-semibold text-slate-900">Admin Console</h1>
              </motion.div>
            )}
          </AnimatePresence>
          <button
            type="button"
            onClick={onToggle}
            className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-100"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
          </button>
        </div>
        <nav className="space-y-1 overflow-x-hidden overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                title={collapsed ? item.label : undefined}
                className={({ isActive }) =>
                  `flex items-center rounded-xl py-2 text-sm font-medium ${
                    collapsed ? 'justify-center px-2' : 'gap-2 px-3'
                  } ${
                    isActive ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
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
      </div>
    </motion.aside>
  );
}
