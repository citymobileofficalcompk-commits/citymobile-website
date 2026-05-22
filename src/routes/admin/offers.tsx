import { createFileRoute } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Tag,
  Loader2,
  Image as ImageIcon
} from 'lucide-react';
import { query, insertRow, updateRow, deleteRow } from '@/lib/turso';
import { toast } from 'sonner';

export const Route = createFileRoute('/admin/offers')({
  component: AdminOffers,
});

const initialOffers = [
  {
    id: '1',
    title: 'New Arrival Special',
    subtitle: 'iPhone 15 Series Now Available',
    badge: 'New',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?w=400&h=200&fit=crop'
  },
  {
    id: '2',
    title: 'Samsung Fest',
    subtitle: 'Up to 15% off on S24 Series',
    badge: '-15%',
    status: 'active',
    image: 'https://images.unsplash.com/photo-17072314590ef6-92f58e244837?w=400&h=200&fit=crop'
  },
  {
    id: '3',
    title: 'Weekend Flash Sale',
    subtitle: 'Accessories at best prices',
    badge: 'Limited',
    status: 'disabled',
    image: 'https://images.unsplash.com/photo-1588423770674-f2855ee476e7?w=400&h=200&fit=crop'
  }
];

function AdminOffers() {
  const [offers, setOffers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<any>(null);

  const [hasProductIdsCol, setHasProductIdsCol] = useState(true);

  const fetchOffers = async () => {
    setIsLoading(true);
    try {
      const data = await query('SELECT * FROM offers ORDER BY id DESC');
      setOffers(data || []);
      setHasProductIdsCol(true);
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch offers');
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
    fetchOffers();
  }, []);

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      await updateRow('offers', id, { is_active: !currentStatus });
      toast.success(`Offer ${!currentStatus ? 'activated' : 'disabled'} successfully`);
      fetchOffers();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update offer');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this offer?')) return;
    try {
      await deleteRow('offers', id);
      toast.success('Offer deleted successfully');
      fetchOffers();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete offer');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#001C4B]">Promotional Offers</h1>
          <p className="text-slate-500 mt-1">Manage banners and special deals shown on the homepage.</p>
        </div>
        <button
          onClick={() => { setSelectedOffer(null); setIsModalOpen(true); }}
          className="inline-flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-bold rounded-full shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <Plus className="w-5 h-5" />
          Create New Offer
        </button>
      </div>

      {!hasProductIdsCol && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-[2rem] p-6 text-amber-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in duration-300">
          <div>
            <h4 className="font-extrabold text-sm flex items-center gap-2">
              ⚠️ Database Migration Pending
            </h4>
            <p className="text-xs text-amber-700 font-semibold mt-1">
              To enable attaching products to campaigns, you must add the <code className="bg-amber-500/20 px-1.5 py-0.5 rounded font-mono font-bold text-[10px]">product_ids</code> column to your <code className="bg-amber-500/20 px-1.5 py-0.5 rounded font-mono font-bold text-[10px]">offers</code> table.
            </p>
          </div>
          <button 
            onClick={() => {
              navigator.clipboard.writeText("ALTER TABLE offers ADD COLUMN IF NOT EXISTS product_ids text[] DEFAULT '{}';");
              toast.success("Migration SQL copied to clipboard!");
            }}
            className="flex-shrink-0 bg-amber-500/20 hover:bg-amber-500/30 text-amber-900 px-4 py-2 rounded-full font-bold text-xs uppercase tracking-wider transition-all"
          >
            Copy SQL Code
          </button>
        </div>
      )}

      {/* Offers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {isLoading ? (
          <div className="col-span-full py-20 flex flex-col items-center gap-4">
            <Loader2 className="w-10 h-10 text-cyan-500 animate-spin" />
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Fetching offers...</p>
          </div>
        ) : offers.length === 0 ? (
          <div className="col-span-full py-20 flex flex-col items-center gap-4 text-center">
            <div className="w-20 h-20 rounded-[2rem] bg-slate-50 flex items-center justify-center text-slate-200 mx-auto">
              <ImageIcon className="w-10 h-10" />
            </div>
            <div>
              <p className="text-lg font-bold text-[#001C4B]">No active offers</p>
              <p className="text-sm text-slate-400">Click the button above to create your first promotion.</p>
            </div>
          </div>
        ) : (
          offers.map((offer) => (
            <div key={offer.id} className="group relative bg-white rounded-[2.5rem] overflow-hidden shadow-lg shadow-blue-900/5 border border-slate-100 transition-all hover:shadow-2xl hover:shadow-blue-900/10">
              {/* Image Preview */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={offer.image_url}
                  alt={offer.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#001C4B]/80 via-transparent to-transparent"></div>

                {offer.discount_badge && (
                  <div className="absolute top-4 left-4 bg-cyan-400 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg">
                    {offer.discount_badge}
                  </div>
                )}

                <button
                  onClick={() => handleToggleStatus(offer.id, offer.is_active)}
                  className="absolute top-4 right-4"
                >
                  <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer ${offer.is_active
                      ? 'bg-emerald-500/20 text-emerald-300 backdrop-blur-md border border-emerald-500/30'
                      : 'bg-slate-500/20 text-slate-300 backdrop-blur-md border border-slate-500/30'
                    }`}>
                    {offer.is_active ? 'Active' : 'Disabled'}
                  </span>
                </button>

                <div className="absolute bottom-4 left-6 right-6 text-white">
                  <h3 className="text-xl font-bold leading-tight">{offer.title}</h3>
                  <p className="text-cyan-400 text-xs font-medium mt-1 uppercase tracking-wider">{offer.subtitle}</p>
                </div>
              </div>

              <div className="p-6 flex items-center justify-between bg-white">
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Target Link</span>
                  <span className="text-xs font-bold text-[#001C4B] truncate max-w-[150px]">{offer.target_link || '/'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => { setSelectedOffer(offer); setIsModalOpen(true); }}
                    className="p-3 bg-slate-50 text-slate-400 hover:text-cyan-500 hover:bg-cyan-50 rounded-2xl transition-all"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(offer.id)}
                    className="p-3 bg-slate-50 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <OfferModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        offer={selectedOffer}
        onSuccess={fetchOffers}
        hasProductIdsCol={hasProductIdsCol}
      />
    </div>

  );
}

function OfferModal({ isOpen, onClose, offer, onSuccess, hasProductIdsCol = true }: any) {

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    category: 'New Mobile',
    discount_badge: '',
    discount_text: '',
    end_date: '',
    target_link: '',
    image_url: '' as any,
    is_active: true,
    product_ids: [] as string[]
  });


  const categories = [
    "New Mobile", "Used Mobiles", "Used Mobile", "Tablet", "iPod", "Watch",
    "Power Bank", "Hand Free", "Headphones", "Buds", "AirPods",
    "Data Cable", "Adapter", "Games", "Covers", "Glass",
    "3D Sheets", "Speakers", "Mic", "Lights", "Holders"
  ];

  useEffect(() => {
    if (offer) {
      setFormData({
        title: offer.title || '',
        subtitle: offer.subtitle || '',
        category: offer.category || 'New Mobile',
        discount_badge: offer.discount_badge || '',
        discount_text: offer.discount_text || '',
        end_date: offer.end_date ? new Date(offer.end_date).toISOString().slice(0, 16) : '',
        target_link: offer.target_link || '',
        image_url: offer.image_url || '',
        is_active: offer.is_active ?? true,
        product_ids: offer.product_ids || []
      });
    } else {
      setFormData({
        title: '', subtitle: '', category: 'New Mobile', discount_badge: '', discount_text: '', end_date: '', target_link: '', image_url: '', is_active: true, product_ids: []
      });
    }
  }, [offer, isOpen]);

  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [productSearch, setProductSearch] = useState('');

  useEffect(() => {
    const fetchActiveProducts = async () => {
      try {
        const data = await query('SELECT id, name, category, is_active FROM products WHERE is_active = 1 ORDER BY name ASC');
        setAllProducts(data || []);
      } catch (err: any) {
        console.error("Failed to fetch active products", err);
      }
    };
    if (isOpen) {
      fetchActiveProducts();
    }
  }, [isOpen]);


  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let finalImageUrl = formData.image_url;

      if (formData.image_url instanceof File) {
        const file = formData.image_url;
        const reader = new FileReader();
        const base64Promise = new Promise<string>((resolve, reject) => {
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = (err) => reject(err);
        });
        reader.readAsDataURL(file);
        finalImageUrl = await base64Promise;
      }

      const generateUUID = () => {
        if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
          return crypto.randomUUID();
        }
        return 'off-' + Math.random().toString(36).substring(2, 15) + '-' + Date.now().toString(36);
      };

      const payload: any = { 
        id: offer ? offer.id : generateUUID(),
        title: formData.title,
        subtitle: formData.subtitle,
        category: formData.category,
        discount_badge: formData.discount_badge,
        discount_text: formData.discount_text,
        end_date: formData.end_date ? new Date(formData.end_date).toISOString() : null,
        target_link: formData.target_link,
        image_url: finalImageUrl,
        is_active: formData.is_active
      };

      if (hasProductIdsCol) {
        payload.product_ids = formData.product_ids;
      }


      if (offer) {
        await updateRow('offers', offer.id, payload);
      } else {
        await insertRow('offers', payload);
      }

      toast.success(`Offer ${offer ? 'updated' : 'created'} successfully!`);
      onSuccess();
      onClose();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#000B29]/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl relative z-10 overflow-hidden max-h-[90vh] flex flex-col animate-in zoom-in-95">
        <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between flex-shrink-0">
          <h2 className="text-2xl font-black text-[#001C4B]">{offer ? 'Edit Offer' : 'New Offer'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-xl"><Plus className="w-6 h-6 rotate-45" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-6 overflow-y-auto flex-1">

          <div className="space-y-4">
            <div className="relative h-40 bg-slate-50 rounded-3xl overflow-hidden group cursor-pointer border-2 border-dashed border-slate-200 hover:border-cyan-400 transition-all">
              {formData.image_url ? (
                <img
                  src={formData.image_url instanceof File ? URL.createObjectURL(formData.image_url) : formData.image_url}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-300">
                  <Plus className="w-8 h-8" />
                  <span className="text-xs font-bold uppercase tracking-widest mt-2">Upload Banner</span>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files?.[0] && setFormData({ ...formData, image_url: e.target.files[0] })}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>

            <input
              placeholder="Offer Title (e.g. Premium Smartphones)"
              required
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-6 py-4 bg-slate-50 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-cyan-400"
            />

            <div className="grid grid-cols-2 gap-4">
              <input
                placeholder="Discount Text (e.g. 30% OFF)"
                value={formData.discount_text}
                onChange={e => setFormData({ ...formData, discount_text: e.target.value })}
                className="px-6 py-4 bg-slate-50 rounded-2xl text-sm font-bold outline-none"
              />
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Sale End Date</label>
                <input
                  type="datetime-local"
                  value={formData.end_date}
                  onChange={e => setFormData({ ...formData, end_date: e.target.value })}
                  className="px-6 py-4 bg-slate-50 rounded-2xl text-sm font-bold outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <input placeholder="Subtitle" value={formData.subtitle} onChange={e => setFormData({ ...formData, subtitle: e.target.value })} className="px-6 py-4 bg-slate-50 rounded-2xl text-sm font-medium outline-none" />
              <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="px-6 py-4 bg-slate-50 rounded-2xl text-sm font-bold outline-none appearance-none">
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <input placeholder="Badge (e.g. -20%)" value={formData.discount_badge} onChange={e => setFormData({ ...formData, discount_badge: e.target.value })} className="px-6 py-4 bg-slate-50 rounded-2xl text-sm font-bold outline-none" />
              <input placeholder="Target Link" value={formData.target_link} onChange={e => setFormData({ ...formData, target_link: e.target.value })} className="px-6 py-4 bg-slate-50 rounded-2xl text-sm font-bold outline-none" />
            </div>

            {/* Attached Products Section */}
            <div className="space-y-2 border border-slate-100 rounded-3xl p-5 bg-slate-50/50">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">
                Campaign Products {!hasProductIdsCol ? "" : `(${formData.product_ids.length} attached)`}
              </label>
              
              {!hasProductIdsCol ? (
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 text-xs text-amber-800 font-semibold text-center">
                  ⚠️ Product association is disabled until the <code className="bg-amber-500/20 px-1 py-0.5 rounded font-mono font-bold text-[9px]">product_ids</code> column is added to the database.
                </div>
              ) : (
                <>

              
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search products to attach..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-cyan-400/50"
                />
              </div>

              {/* Display list of filtered products */}
              <div className="max-h-40 overflow-y-auto border border-slate-100 rounded-2xl bg-white p-2 space-y-1 mt-2">
                {allProducts
                  .filter(p => p.name.toLowerCase().includes(productSearch.toLowerCase()))
                  .map(product => {
                    const isAttached = formData.product_ids.includes(product.id);
                    return (
                      <button
                        type="button"
                        key={product.id}
                        onClick={() => {
                          const updated = isAttached
                            ? formData.product_ids.filter(id => id !== product.id)
                            : [...formData.product_ids, product.id];
                          setFormData({ ...formData, product_ids: updated });
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all text-left ${
                          isAttached
                            ? 'bg-cyan-500/10 text-cyan-600 border border-cyan-500/20'
                            : 'hover:bg-slate-50 text-slate-700 border border-transparent'
                        }`}
                      >
                        <div className="flex flex-col">
                          <span>{product.name}</span>
                          <span className="text-[9px] text-slate-400 font-semibold">{product.category}</span>
                        </div>
                        <div className={`w-4 h-4 rounded-md flex items-center justify-center border transition-all ${
                          isAttached ? 'bg-cyan-500 border-cyan-500 text-white' : 'border-slate-300 bg-white'
                        }`}>
                          {isAttached && (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                              <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                      </button>
                    );
                  })}
                {allProducts.filter(p => p.name.toLowerCase().includes(productSearch.toLowerCase())).length === 0 && (
                  <p className="text-center py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">No matching active products</p>
                )}
              </div>
            </>
          )}
        </div>
      </div>


          <button type="submit" disabled={isLoading} className="w-full py-4 bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-bold rounded-full shadow-lg flex justify-center items-center gap-2">
            {isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : offer ? 'Update Offer' : 'Create Offer'}
          </button>
        </form>
      </div>
    </div>
  );
}
