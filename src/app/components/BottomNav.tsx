import { NavLink } from 'react-router';
import { Menu } from 'lucide-react';
import { shouldUseExactNavMatch, type NavItem } from '../layout/Sidebar';

export interface BottomNavProps {
  items: NavItem[];
  onOpenMenu: () => void;
}

export const BottomNav = ({ items, onOpenMenu }: BottomNavProps) => {
  const maxVisibleItems = 5;
  const showMenu = items.length > maxVisibleItems;
  const visibleItems = showMenu ? items.slice(0, maxVisibleItems - 1) : items.slice(0, maxVisibleItems);

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-2 pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_24px_rgba(15,23,42,0.08)] backdrop-blur dark:border-slate-800 dark:bg-slate-950/95 dark:shadow-[0_-8px_24px_rgba(0,0,0,0.35)] lg:hidden" aria-label="Primary navigation">
      <div className="flex h-[72px] items-center justify-between gap-1">
        {visibleItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={shouldUseExactNavMatch(item)}
              className={({ isActive }) =>
                `flex h-[58px] min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-[12px] px-1 text-[13px] font-medium ${
                  isActive ? 'bg-violet-50 text-violet-700 dark:bg-violet-500/15 dark:text-violet-200' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100'
                }`
              }
            >
              <Icon size={22} />
              <span className="max-w-full truncate">{item.label === 'Book Appointment' ? 'Book A...' : item.label}</span>
            </NavLink>
          );
        })}
        {showMenu ? (
          <button
            type="button"
            onClick={onOpenMenu}
            className="flex h-[58px] min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-[12px] px-1 text-[13px] font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
            aria-label="Open menu"
          >
            <Menu size={22} />
            <span>Menu</span>
          </button>
        ) : null}
      </div>
    </nav>
  );
};
