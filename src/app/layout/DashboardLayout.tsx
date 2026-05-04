import { useState, type CSSProperties, type ReactNode } from 'react';
import { Outlet } from 'react-router';
import { motion } from 'motion/react';
import Sidebar, { type NavItem } from './Sidebar';
import Topbar from './Topbar';
import { BottomNav } from '../components/BottomNav';

export default function DashboardLayout({ navItems, title, children }: { navItems: NavItem[]; title?: string; children?: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const sidebarWidth = collapsed ? 80 : 288;

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar
        items={navItems}
        collapsed={collapsed}
        width={sidebarWidth}
        onToggle={() => setCollapsed((prev) => !prev)}
        title={title}
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />
      <motion.div
        initial={false}
        style={{ '--sidebar-offset': '288px' } as CSSProperties}
        animate={{ '--sidebar-offset': `${sidebarWidth}px` } as CSSProperties}
        transition={{ type: 'spring', stiffness: 240, damping: 28 }}
        className="dashboard-content min-w-0"
      >
        <Topbar
          collapsed={collapsed}
          onToggleSidebar={() => setCollapsed((prev) => !prev)}
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
        />
        <main className="mx-auto max-w-7xl p-4 pb-24 lg:p-6">{children ?? <Outlet />}</main>
      </motion.div>
      <BottomNav items={navItems} onOpenMenu={() => setMobileSidebarOpen(true)} />
    </div>
  );
}
