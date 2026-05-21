import { createFileRoute, Outlet, useLocation, useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { Loader2 } from 'lucide-react';

export const Route = createFileRoute('/admin')({
  component: AdminLayout,
});

function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isClient, setIsClient] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('admin-sidebar-collapsed') === 'true';
  });

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      const next = !prev;
      if (typeof window !== 'undefined') {
        localStorage.setItem('admin-sidebar-collapsed', String(next));
      }
      return next;
    });
  };
  
  const isLoginPage = location.pathname === '/admin/login';

  // Synchronous token verification on render
  const token = typeof window !== 'undefined' ? localStorage.getItem('cm-admin-token') : null;
  let isAuthenticated = false;
  
  if (token) {
    try {
      const [payloadStr, signature] = token.split('.');
      if (payloadStr && signature) {
        const expectedSignature = btoa(payloadStr + '_citymobile_secret');
        if (signature === expectedSignature) {
          const payload = JSON.parse(atob(payloadStr));
          if (!payload.exp || payload.exp >= Date.now()) {
            isAuthenticated = true;
          }
        }
      }
    } catch (e) {
      isAuthenticated = false;
    }
  }

  // Handle redirection reactively
  useEffect(() => {
    if (isClient) {
      if (!isAuthenticated && !isLoginPage) {
        navigate({ to: '/admin/login', replace: true });
      } else if (isAuthenticated && isLoginPage) {
        navigate({ to: '/admin', replace: true });
      }
    }
  }, [isClient, isAuthenticated, isLoginPage, navigate]);

  // Prevent hydration mismatch by returning a consistent shell during SSR
  if (!isClient) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // If it's the login page, just render the outlet without layout
  if (isLoginPage) {
    if (isAuthenticated) {
      return (
        <div className="min-h-screen bg-[#001C4B] flex items-center justify-center">
          <Loader2 className="w-10 h-10 text-cyan-400 animate-spin" />
        </div>
      );
    }
    return <Outlet />;
  }

  // Prevent flash of dashboard content before redirection completes
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-cyan-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar
        collapsed={collapsed}
        onToggle={toggleCollapsed}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />
      <div className={`flex-1 min-w-0 transition-[margin] duration-300 ease-in-out ${collapsed ? 'lg:ml-20' : 'lg:ml-72'}`}>
        <AdminHeader onMobileMenuClick={() => setMobileOpen(true)} />
        <main className="p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

