import { createFileRoute } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import {
  Star,
  CheckCircle2,
  XCircle,
  Trash2,
  Search,
  User,
  MessageCircle,
  Clock,
  Filter,
  Loader2,
  Plus
} from 'lucide-react';
import { query, updateRow, deleteRow } from '@/lib/turso';
import { toast } from 'sonner';
import { ReviewModal } from '@/components/admin/ReviewModal';

export const Route = createFileRoute('/admin/reviews')({
  component: AdminReviews,
});

function AdminReviews() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      console.log("Starting Admin Reviews sync...");
      // Fetch reviews and active products in parallel
      const [reviewsData, productsData] = await Promise.all([
        query('SELECT * FROM reviews ORDER BY created_at DESC'),
        query('SELECT id, name FROM products WHERE is_active = 1 ORDER BY name')
      ]);

      console.log("FETCHED ADMIN REVIEWS:", reviewsData);
      setReviews(reviewsData || []);
      setAllProducts(productsData || []);
    } catch (error: any) {
      console.error('CRITICAL MODERATION SYNC FAILURE:', error);
      toast.error(error.message || 'Failed to sync data');
      setReviews([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchReviews = fetchData; // maintain compatibility with existing calls

  const updateReview = async (id: string, updates: any) => {
    try {
      await updateRow('reviews', id, updates);
      toast.success('Review updated successfully');
      fetchReviews();
    } catch (error: any) {
      toast.error(error.message || 'Update failed');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Permanently delete this review?')) return;
    try {
      await deleteRow('reviews', id);
      toast.success('Review deleted');
      fetchReviews();
    } catch (error: any) {
      toast.error(error.message || 'Delete failed');
    }
  };

  const safeReviews = Array.isArray(reviews) ? reviews : [];

  const stats = {
    pending: safeReviews.filter(r => r?.status === 'pending').length,
    published: safeReviews.filter(r => r?.status === 'published').length,
    avg: safeReviews.length
      ? (safeReviews.reduce((acc, r) => acc + (Number(r?.rating) || 0), 0) / safeReviews.length).toFixed(1)
      : '0.0'
  };

  const filteredReviews = safeReviews.filter(r =>
    filter === 'all' || r?.status === filter
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#001C4B]">Moderation Dashboard</h1>
          <p className="text-slate-500 mt-1">Review, prioritize, and approve customer feedback.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-8 py-3.5 bg-[#001C4B] text-white font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-cyan-600 transition-all shadow-lg shadow-blue-900/10"
        >
          <Plus className="w-5 h-5" /> Add Review
        </button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-[2.5rem] shadow-lg shadow-blue-900/5 border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pending Moderation</p>
            <p className="text-3xl font-black text-amber-500 mt-1">{stats.pending}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500">
            <Clock className="w-6 h-6" />
          </div>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] shadow-lg shadow-blue-900/5 border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Published Live</p>
            <p className="text-3xl font-black text-cyan-500 mt-1">{stats.published}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-cyan-50 flex items-center justify-center text-cyan-500">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] shadow-lg shadow-blue-900/5 border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Avg Sentiment</p>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-3xl font-black text-[#001C4B]">{stats.avg}</p>
              <Star className="w-5 h-5 text-amber-400 fill-current" />
            </div>
          </div>
        </div>
      </div>

      {/* Moderation List */}
      <div className="bg-white rounded-[3rem] shadow-xl shadow-blue-900/5 border border-slate-100 overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-full">
            {['all', 'pending', 'published', 'disabled'].map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-6 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-full transition-all ${filter === s ? 'bg-white text-[#001C4B] shadow-lg' : 'text-slate-400 hover:text-slate-600'
                  }`}
              >
                {s}
              </button>
            ))}
          </div>
          <button onClick={fetchReviews} className="p-3 text-slate-400 hover:text-cyan-500 transition-colors">
            <Loader2 className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        <div className="divide-y divide-slate-50">
          {isLoading && safeReviews.length === 0 ? (
            <div className="py-24 flex flex-col items-center gap-4 text-center">
              <Loader2 className="w-12 h-12 text-cyan-500 animate-spin" />
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Syncing Moderation Queue...</p>
            </div>
          ) : filteredReviews.length === 0 ? (
            <div className="py-24 flex flex-col items-center gap-4 text-center">
              <div className="w-20 h-20 rounded-[2.5rem] bg-slate-50 flex items-center justify-center text-slate-200">
                <MessageCircle className="w-10 h-10" />
              </div>
              <div>
                <p className="text-lg font-bold text-[#001C4B]">No reviews found</p>
                <p className="text-sm text-slate-400">All caught up! No reviews matching this filter.</p>
              </div>
            </div>
          ) : (
            filteredReviews.map((review) => (
              <div key={review?.id} className="p-10 hover:bg-slate-50/50 transition-colors group">
                <div className="flex flex-col lg:flex-row gap-8">
                  {/* User & Product Context */}
                  <div className="lg:w-64 flex-shrink-0 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-slate-200 to-slate-100 flex items-center justify-center font-bold text-slate-500">
                        {review?.customer_name?.[0] || 'U'}
                      </div>
                      <div>
                        <p className="font-black text-[#001C4B] leading-none">{review?.customer_name}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Verified User</p>
                      </div>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Target Product</p>
                      <p className="text-xs font-bold text-cyan-600 line-clamp-1">{review?.product_name || 'N/A'}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-3.5 h-3.5 ${i < (Number(review?.rating) || 0) ? 'fill-current' : 'text-slate-200'}`} />
                        ))}
                      </div>
                      <span className="text-[10px] font-black text-slate-300">({review?.rating}/5)</span>
                    </div>
                  </div>

                  {/* Comment Body */}
                  <div className="flex-1 space-y-4">
                    <div className="relative">
                      <p className="text-slate-600 text-sm leading-relaxed italic pr-12">"{review?.comment}"</p>
                      <div className="absolute top-0 right-0 text-[10px] font-black text-slate-300 uppercase tracking-widest">
                        {new Date(review?.created_at).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-slate-50">
                      {/* Status Toggle */}
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block ml-1">Live Status</label>
                        <select
                          value={review?.status}
                          onChange={(e) => updateReview(review.id, { status: e.target.value })}
                          className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest outline-none border-none transition-all ${review?.status === 'published' ? 'bg-emerald-50 text-emerald-600 ring-1 ring-emerald-500/20' :
                            review?.status === 'pending' ? 'bg-amber-50 text-amber-600 ring-1 ring-amber-500/20' :
                              'bg-rose-50 text-rose-600 ring-1 ring-rose-500/20'
                            }`}
                        >
                          <option value="pending">Pending</option>
                          <option value="published">Published</option>
                          <option value="disabled">Disabled</option>
                        </select>
                      </div>

                      {/* Actions */}
                      <div className="ml-auto flex items-center gap-2">
                        <button
                          onClick={() => handleDelete(review.id)}
                          className="p-3 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                          title="Delete Permanently"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <ReviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchData}
        products={allProducts}
      />
    </div>
  );
}
