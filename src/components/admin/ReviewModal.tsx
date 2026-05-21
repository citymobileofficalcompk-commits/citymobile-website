import { useState, useEffect } from 'react';
import { X, Star, Loader2, MessageSquare, User, Smartphone } from 'lucide-react';
import { query, insertRow } from '@/lib/turso';
import { toast } from 'sonner';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  products: any[];
}



export function ReviewModal({ isOpen, onClose, onSuccess, products: initialProducts }: ReviewModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [availableProducts, setAvailableProducts] = useState<any[]>(initialProducts || []);
  const [formData, setFormData] = useState({
    product_id: '',
    customer_name: '',
    rating: 5,
    comment: '',
    status: 'published'
  });

  // Fetch products if prop is empty or whenever modal opens
  useEffect(() => {
    const fetchAvailableProducts = async () => {
      try {
        const data = await query("SELECT id, name FROM products WHERE is_active = 1 ORDER BY name ASC");
        setAvailableProducts(data || []);
      } catch (err) {
        console.error("Error fetching products for review modal:", err);
      }
    };

    if (isOpen) {
      fetchAvailableProducts();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        product_id: availableProducts[0]?.id || '',
        customer_name: '',
        rating: 5,
        comment: '',
        status: 'published'
      });
    }
  }, [isOpen, availableProducts]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.product_id) {
      toast.error("Please select a product");
      return;
    }

    setIsLoading(true);
    try {
      // Find product name for snapshotting
      const selectedProduct = availableProducts.find(p => String(p.id) === String(formData.product_id));
      const productName = selectedProduct?.name || 'Unknown Product';

      const payload = {
        product_id: formData.product_id,
        product_name: productName,
        customer_name: formData.customer_name,
        rating: Number(formData.rating),
        comment: formData.comment,
        status: 'published',
        created_at: new Date().toISOString()
      };

      console.log("PAYLOAD BEING SENT:", payload);

      await insertRow('reviews', payload);

      toast.success('Review added successfully');
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error("Review Submission Crash:", err);
      alert("CODE ERROR: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#000B29]/60 backdrop-blur-sm" onClick={onClose}></div>

      <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-xl font-black text-[#001C4B]">Add Manual Review</h2>
            <p className="text-xs text-slate-400 mt-1">Upload feedback received via social media.</p>
          </div>
          <button onClick={onClose} className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-red-500 transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-4">
            {/* Product Selection */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                <Smartphone className="w-3 h-3" /> Targeted Product
              </label>
              <select
                required
                value={formData.product_id}
                onChange={(e) => setFormData({ ...formData, product_id: e.target.value })}
                className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-cyan-400/50 appearance-none outline-none"
              >
                <option value="" disabled>Select a product</option>
                {availableProducts.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            {/* Customer Name */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                <User className="w-3 h-3" /> Customer Name
              </label>
              <input
                type="text"
                required
                value={formData.customer_name}
                onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-cyan-400/50 outline-none"
                placeholder="e.g. John Doe"
              />
            </div>

            {/* Rating */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                <Star className="w-3 h-3" /> Rating (1-5)
              </label>
              <div className="flex gap-2 p-2 bg-slate-50 rounded-2xl">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormData({ ...formData, rating: star })}
                    className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center ${formData.rating >= star ? 'text-amber-400 bg-white shadow-sm' : 'text-slate-300 hover:text-slate-400'
                      }`}
                  >
                    <Star className={`w-5 h-5 ${formData.rating >= star ? 'fill-current' : ''}`} />
                  </button>
                ))}
              </div>
            </div>

            {/* Comment */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                <MessageSquare className="w-3 h-3" /> Review Comment
              </label>
              <textarea
                required
                value={formData.comment}
                onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-cyan-400/50 min-h-[120px] resize-none outline-none"
                placeholder="Paste the review text here..."
              />
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-8 py-3.5 bg-[#001C4B] text-white font-bold rounded-2xl flex items-center justify-center gap-2 min-w-[140px] hover:bg-cyan-600 transition-all shadow-lg shadow-blue-900/10"
            >
              {isLoading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
              ) : (
                'Publish Review'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
