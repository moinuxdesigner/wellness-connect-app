import { NavLink } from 'react-router';
import { Menu } from 'lucide-react';
import type { NavItem } from '../layout/Sidebar';

export interface BottomNavProps {
  items: NavItem[];
  onOpenMenu: () => void;
}

export const BottomNav = ({ items, onOpenMenu }: BottomNavProps) => {
  const visibleItems = items.slice(0, 3);

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-2 pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_24px_rgba(15,23,42,0.08)] backdrop-blur lg:hidden" aria-label="Primary navigation">
      <div className="grid h-16 grid-cols-4 items-center gap-1">
        {visibleItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex h-14 min-w-0 flex-col items-center justify-center gap-1 rounded-xl px-1 text-xs font-medium ${
                  isActive ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                }`
              }
            >
              <Icon size={18} />
              <span className="max-w-full truncate">{item.label}</span>
            </NavLink>
          );
        })}
        <button
          type="button"
          onClick={onOpenMenu}
          className="flex h-14 min-w-0 flex-col items-center justify-center gap-1 rounded-xl px-1 text-xs font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-800"
          aria-label="Open menu"
        >
          <Menu size={18} />
          <span>Menu</span>
        </button>
      </div>
    </nav>
  );
};
