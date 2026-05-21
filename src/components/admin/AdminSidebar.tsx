import { Link, useLocation } from '@tanstack/react-router';
import {
  LayoutDashboard,
  Package,
  Tag,
  MessageSquare,
  LogOut,
  Smartphone,
  ChevronRight,
  ChevronLeft,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { auth } from '@/lib/auth';
import { toast } from 'sonner';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
  { icon: Package, label: 'Products', href: '/admin/products' },
  { icon: Tag, label: 'Offers', href: '/admin/offers' },
  { icon: MessageSquare, label: 'Reviews', href: '/admin/reviews' },
];

interface AdminSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export function AdminSidebar({ collapsed, onToggle, mobileOpen, onMobileClose }: AdminSidebarProps) {
  const location = useLocation();

  const handleLogout = async () => {
    await auth.signOut();
    toast.success('Logged out successfully');
    window.location.href = '/admin/login';
  };

  // On mobile (<lg), always render expanded width regardless of `collapsed`
  const effectiveCollapsed = collapsed; // applied on lg+ only via classes below

  return (
    <>
      {/* Mobile backdrop */}
      <div
        onClick={onMobileClose}
        className={cn(
          'fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300',
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
      />

      <aside
        className={cn(
          'h-screen bg-gradient-to-b from-[#001C4B] to-[#000B29] flex flex-col text-white fixed left-0 top-0 z-50 transition-[width,transform] duration-300 ease-in-out',
          // Width: mobile always 72; lg respects collapse
          'w-72',
          effectiveCollapsed ? 'lg:w-20' : 'lg:w-72',
          // Mobile slide-in/out
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
          'lg:translate-x-0'
        )}
      >
        {/* Desktop collapse toggle (lg+ only) */}
        <button
          onClick={onToggle}
          aria-label={effectiveCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="hidden lg:flex absolute -right-3 top-10 w-7 h-7 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-500 shadow-lg shadow-cyan-500/30 items-center justify-center text-white hover:scale-110 active:scale-95 transition-transform z-50 ring-2 ring-[#001C4B]"
        >
          {effectiveCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>

        {/* Mobile close button */}
        <button
          onClick={onMobileClose}
          aria-label="Close menu"
          className="lg:hidden absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors z-50"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand */}
        <div className={cn('mb-4 transition-all duration-300 p-8', effectiveCollapsed && 'lg:p-4')}>
          <Link to="/admin" onClick={onMobileClose} className="flex items-center gap-3 group">
            <div className="w-10 h-10 shrink-0 rounded-2xl bg-gradient-to-tr from-cyan-400 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <Smartphone className="w-6 h-6 text-white" />
            </div>
            <div
              className={cn(
                'overflow-hidden transition-all duration-300 whitespace-nowrap',
                effectiveCollapsed ? 'lg:opacity-0 lg:w-0' : 'opacity-100 w-auto'
              )}
            >
              <h1 className="text-xl font-bold tracking-tight">City Mobile</h1>
              <p className="text-[10px] text-cyan-400 uppercase tracking-[0.2em] font-semibold">
                Admin Panel
              </p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className={cn('flex-1 space-y-2 px-4', effectiveCollapsed && 'lg:px-3')}>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={onMobileClose}
                title={effectiveCollapsed ? item.label : undefined}
                className={cn(
                  'flex items-center rounded-2xl transition-all duration-300 group justify-between px-4 py-3.5',
                  effectiveCollapsed && 'lg:justify-center lg:px-0',
                  isActive
                    ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-white shadow-lg shadow-cyan-500/20'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                )}
              >
                <div className={cn('flex items-center gap-3', effectiveCollapsed && 'lg:gap-0')}>
                  <item.icon
                    className={cn(
                      'w-5 h-5 shrink-0',
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-cyan-400'
                    )}
                  />
                  <span
                    className={cn(
                      'font-medium overflow-hidden transition-all duration-300 whitespace-nowrap',
                      effectiveCollapsed ? 'lg:opacity-0 lg:w-0' : 'opacity-100 w-auto'
                    )}
                  >
                    {item.label}
                  </span>
                </div>
                {isActive && !effectiveCollapsed && <ChevronRight className="w-4 h-4" />}
              </Link>
            );
          })}
        </nav>

        {/* Footer / Logout */}
        <div className={cn('border-t border-white/5 p-6', effectiveCollapsed && 'lg:p-3')}>
          <button
            onClick={handleLogout}
            title={effectiveCollapsed ? 'Logout' : undefined}
            className={cn(
              'flex items-center w-full rounded-2xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all group gap-3 px-4 py-4',
              effectiveCollapsed && 'lg:justify-center lg:gap-0 lg:px-0 lg:py-3'
            )}
          >
            <div className="w-10 h-10 shrink-0 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-red-500/20 transition-colors">
              <LogOut className="w-5 h-5" />
            </div>
            <span
              className={cn(
                'font-semibold overflow-hidden transition-all duration-300 whitespace-nowrap',
                effectiveCollapsed ? 'lg:opacity-0 lg:w-0' : 'opacity-100 w-auto'
              )}
            >
              Logout
            </span>
          </button>
        </div>
      </aside>
    </>
  );
}
