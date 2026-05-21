
import { createFileRoute, Link } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { 
  Package, 
  TrendingUp, 
  Users, 
  MessageSquare,
  ArrowUpRight,
  ArrowDownRight,
  Loader2
} from 'lucide-react';
import { query, countRows } from '@/lib/turso';

export const Route = createFileRoute('/admin/')({
  component: AdminDashboard,
});

function AdminDashboard() {
  const [counts, setCounts] = useState({ products: 0, reviews: 0, offers: 0 });
  const [recentProducts, setRecentProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [prodCount, revCount, offCount, recProducts] = await Promise.all([
        countRows('SELECT COUNT(*) FROM products'),
        countRows('SELECT COUNT(*) FROM reviews'),
        countRows('SELECT COUNT(*) FROM offers WHERE is_active = 1'),
        query('SELECT name, created_at, category FROM products ORDER BY created_at DESC LIMIT 5')
      ]);

      setCounts({
        products: prodCount,
        reviews: revCount,
        offers: offCount
      });
      setRecentProducts(recProducts || []);
    } catch (error) {
      console.error('Dashboard Fetch Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const timeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)} mins ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    return `${Math.floor(diff / 86400)} days ago`;
  };

  const stats = [
    { label: 'Total Products', value: counts.products, icon: Package, color: 'bg-blue-500' },
    { label: 'Total Reviews', value: counts.reviews, icon: MessageSquare, color: 'bg-cyan-500' },
    { label: 'Active Offers', value: counts.offers, icon: TrendingUp, color: 'bg-indigo-500' },
    { label: 'Total Users', value: '842', icon: Users, color: 'bg-violet-500' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-[#001C4B]">Dashboard Overview</h1>
        <p className="text-slate-500 mt-1">Welcome back to your store management center.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-[2rem] shadow-lg shadow-blue-900/5 border border-slate-100 group transition-all hover:shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-2xl ${stat.color} flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:rotate-6 transition-transform`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-300">Live</div>
            </div>
            <p className="text-slate-400 text-sm font-medium">{stat.label}</p>
            {isLoading ? (
              <div className="h-8 w-16 bg-slate-50 rounded-lg animate-pulse mt-1" />
            ) : (
              <h3 className="text-2xl font-bold text-[#001C4B] mt-1">{stat.value.toLocaleString()}</h3>
            )}
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-8 shadow-lg shadow-blue-900/5 border border-slate-100">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-[#001C4B]">Recent Inventory</h3>
            <Link to="/admin/products" className="text-sm font-bold text-cyan-500 hover:text-cyan-600">View All Products</Link>
          </div>
          
          <div className="space-y-6">
            {isLoading ? (
              <div className="py-20 flex flex-col items-center gap-4">
                <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Refreshing Feed...</p>
              </div>
            ) : recentProducts.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-10 font-medium">No recent activity found.</p>
            ) : (
              recentProducts.map((p, i) => (
                <div key={i} className="flex items-center justify-between py-4 border-b border-slate-50 last:border-0 group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:bg-cyan-50 transition-colors">
                      <Package className="w-6 h-6 text-[#001C4B] group-hover:text-cyan-500" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#001C4B] line-clamp-1">{p.name}</p>
                      <p className="text-[10px] font-black text-cyan-500 uppercase tracking-widest mt-0.5">{p.category}</p>
                    </div>
                  </div>
                  <p className="text-xs font-medium text-slate-400">{timeAgo(p.created_at)}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-[#001C4B] rounded-[3rem] p-8 shadow-2xl text-white relative overflow-hidden flex flex-col">
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-cyan-400/20 blur-3xl rounded-full"></div>
          <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-blue-400/10 blur-3xl rounded-full"></div>
          
          <div className="relative z-10 flex-1">
            <h3 className="text-xl font-bold mb-6">Quick Actions</h3>
            <div className="space-y-4">
              <Link to="/admin/products" className="block">
                <button className="w-full py-4 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl text-sm font-bold transition-all">
                  Manage Products
                </button>
              </Link>
              <Link to="/admin/offers" className="block">
                <button className="w-full py-4 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl text-sm font-bold transition-all">
                  Create New Offer
                </button>
              </Link>
              <Link to="/admin/reviews" className="block">
                <button className="w-full py-4 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl text-sm font-bold transition-all">
                  Moderate Reviews
                </button>
              </Link>
              <button className="w-full mt-4 py-4 bg-gradient-to-r from-cyan-400 to-blue-500 shadow-xl shadow-cyan-500/20 rounded-full text-sm font-black uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-[0.98]">
                Generate Report
              </button>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-white/5 relative z-10">
            <p className="text-[10px] font-black uppercase tracking-widest text-white/40">System Status</p>
            <div className="mt-2 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
              <span className="text-xs font-bold text-emerald-400">All Systems Operational</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
