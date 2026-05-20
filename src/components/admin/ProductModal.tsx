import { useState, useEffect } from 'react';
import {
  X,
  Plus,
  Trash2,
  Upload,
  Smartphone,
  Info,
  Layers,
  Tag,
  ChevronDown,
  Loader2,
  TrendingUp
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

import { useRouter } from '@tanstack/react-router';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: any;
  onSuccess?: () => void;
}

export function ProductModal({ isOpen, onClose, product, onSuccess }: ProductModalProps) {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const [formData, setFormData] = useState({
    name: '', brand: '', category: 'New Mobile',
    base_price: '', discounted_price: '', discount_badge: '',
    description: '', stock_status: 'In Stock', is_active: true,
    is_bestseller: false, is_premium: false,
    images: [] as string[]
  });
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [specs, setSpecs] = useState<{ key: string; value: string }[]>([{ key: '', value: '' }]);
  const [highlights, setHighlights] = useState(['']);
  const [features, setFeatures] = useState(['']);

  const categories = [
    "New Mobile", "Used Mobiles", "Used Mobile", "Tablet", "iPod", "Watch",
    "Power Bank", "Hand Free", "Headphones", "Buds", "AirPods",
    "Data Cable", "Adapter", "Games", "Covers", "Glass",
    "3D Sheets", "Speakers", "Mic", "Lights", "Holders"
  ];

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        brand: product.brand || '',
        category: product.category || 'New Mobile',
        base_price: String(product.base_price || ''),
        discounted_price: String(product.discounted_price || ''),
        discount_badge: product.discount_badge || '',
        description: product.description || '',
        stock_status: product.stock_status || 'In Stock',
        is_active: product.is_active ?? true,
        is_bestseller: product.is_bestseller ?? false,
        is_premium: product.is_premium ?? false,
        images: product.images || []
      });

      const specsArray = product.specs
        ? Object.entries(product.specs).map(([key, value]) => ({ key, value: String(value) }))
        : [{ key: '', value: '' }];
      setSpecs(specsArray);
      setHighlights(product.highlights || ['']);
      setFeatures(product.features || ['']);
    } else {
      setFormData({
        name: '', brand: '', category: 'New Mobile', base_price: '',
        discounted_price: '', discount_badge: '', description: '',
        stock_status: 'In Stock', is_active: true,
        is_bestseller: false, is_premium: false,
        images: []
      });
      setNewFiles([]);
      setSpecs([{ key: '', value: '' }]);
      setHighlights(['']);
      setFeatures(['']);
    }
  }, [product, isOpen]);

  if (!isClient || !isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 1. Process Specs
      const specsObject = specs.reduce((acc: any, s: any) => {
        if (s.key.trim() && s.value.trim()) acc[s.key.trim()] = s.value.trim();
        return acc;
      }, {});

      // 2. Handle Image Uploads for new files
      const newImageUrls = await Promise.all(
        newFiles.map(async (file) => {
          const fileExt = file.name.split('.').pop();
          const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
          const { error: uploadError } = await supabase.storage
            .from('shop-images')
            .upload(fileName, file);

          if (uploadError) throw uploadError;

          const { data: { publicUrl } } = supabase.storage
            .from('shop-images')
            .getPublicUrl(fileName);

          return publicUrl;
        })
      );

      const finalImageUrls = [...formData.images, ...newImageUrls];

      const payload: any = {
        name: formData.name,
        brand: formData.brand,
        category: formData.category,
        base_price: Number(formData.base_price),
        discounted_price: Number(formData.discounted_price),
        discount_badge: formData.discount_badge,
        description: formData.description,
        stock_status: formData.stock_status,
        is_active: formData.is_active,
        is_bestseller: formData.is_bestseller,
        is_premium: formData.is_premium,
        images: finalImageUrls.filter(url => url && typeof url === 'string'),
        specs: specsObject,
        highlights: highlights.filter(h => h.trim() !== ''),
        features: features.filter(f => f.trim() !== ''),
        updated_at: new Date().toISOString()
      };

      const { error } = product
        ? await supabase.from('products').update(payload).eq('id', product.id)
        : await supabase.from('products').insert([payload]);

      if (error) throw error;

      toast.success(`Product ${product ? 'updated' : 'added'} successfully!`);
      router.invalidate();
      onSuccess?.();
      onClose();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to save product.';
      alert(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const addedFiles = Array.from(e.target.files);
      setNewFiles(prev => [...prev, ...addedFiles]);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#000B29]/60 backdrop-blur-sm" onClick={onClose}></div>

      <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[3rem] shadow-2xl relative z-10 overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
        <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-2xl font-black text-[#001C4B]">{product ? 'Edit Product' : 'Add New Product'}</h2>
            <p className="text-sm text-slate-400 mt-1">Configure your product details and store placement.</p>
          </div>
          <button onClick={onClose} className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-red-500 transition-all">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto custom-scrollbar flex flex-col">
          <div className="px-10 py-8 space-y-10">
            {/* Basic Info Group */}
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-cyan-100 flex items-center justify-center">
                  <Info className="w-4 h-4 text-cyan-600" />
                </div>
                <h3 className="text-lg font-bold text-[#001C4B]">General Details</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Full Product Name</label>
                  <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-cyan-400/50 transition-all text-sm font-medium" placeholder="e.g. Samsung Galaxy S24 Ultra" />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Detailed Description</label>
                  <textarea 
                    value={formData.description} 
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
                    className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-cyan-400/50 transition-all text-sm font-medium min-h-[120px] resize-none" 
                    placeholder="Describe the product in detail, its condition, and warranty status..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Brand & Category</label>
                  <div className="flex gap-4">
                    <input type="text" required value={formData.brand} onChange={(e) => setFormData({ ...formData, brand: e.target.value })} className="flex-1 px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm" placeholder="Brand" />
                    <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="flex-1 px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm appearance-none outline-none focus:ring-2 focus:ring-cyan-400/50">
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Pricing (Base / Sale)</label>
                  <div className="flex gap-4">
                    <input type="number" required value={formData.base_price} onChange={(e) => setFormData({ ...formData, base_price: e.target.value })} className="flex-1 px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm" placeholder="Original Rs." />
                    <input type="number" required value={formData.discounted_price} onChange={(e) => setFormData({ ...formData, discounted_price: e.target.value })} className="flex-1 px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm" placeholder="Discounted Rs." />
                  </div>
                </div>
              </div>
            </div>

            {/* Visibility & Homepage placement */}
            <div className="space-y-6 p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-amber-600" />
                </div>
                <h3 className="text-lg font-bold text-[#001C4B]">Visibility & Homepage Placement</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <label className="flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm border border-slate-100 cursor-pointer hover:border-cyan-400 transition-all">
                  <div>
                    <p className="text-sm font-bold text-[#001C4B]">Best Seller Section</p>
                    <p className="text-[10px] text-slate-400 font-medium">Feature in the high-volume sales section</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.is_bestseller}
                    onChange={(e) => setFormData({ ...formData, is_bestseller: e.target.checked })}
                    className="w-6 h-6 rounded-lg border-slate-200 text-cyan-500 focus:ring-cyan-500"
                  />
                </label>

                <label className="flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm border border-slate-100 cursor-pointer hover:border-cyan-400 transition-all">
                  <div>
                    <p className="text-sm font-bold text-[#001C4B]">Premium Pick</p>
                    <p className="text-[10px] text-slate-400 font-medium">Highlight in the premium luxury collection</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.is_premium}
                    onChange={(e) => setFormData({ ...formData, is_premium: e.target.checked })}
                    className="w-6 h-6 rounded-lg border-slate-200 text-cyan-500 focus:ring-cyan-500"
                  />
                </label>
              </div>
            </div>

            {/* Media Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                  <Layers className="w-4 h-4 text-indigo-600" />
                </div>
                <h3 className="text-lg font-bold text-[#001C4B]">Product Media</h3>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Existing Images */}
                {formData.images.map((url, idx) => (
                  <div key={`url-${idx}`} className="relative aspect-square rounded-2xl bg-slate-50 border border-slate-100 overflow-hidden group">
                    <img
                      src={url}
                      className="w-full h-full object-cover"
                      alt=""
                    />
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, images: formData.images.filter((_, i) => i !== idx) })}
                      className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}

                {/* New Files */}
                {newFiles.map((file, idx) => (
                  <div key={`file-${idx}`} className="relative aspect-square rounded-2xl bg-slate-50 border border-slate-100 overflow-hidden group">
                    <img
                      src={URL.createObjectURL(file)}
                      className="w-full h-full object-cover"
                      alt=""
                    />
                    <button
                      type="button"
                      onClick={() => setNewFiles(newFiles.filter((_, i) => i !== idx))}
                      className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                <label className="aspect-square rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 hover:border-cyan-400 hover:bg-cyan-50 transition-all cursor-pointer">
                  <Upload className="w-6 h-6 text-slate-300" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Upload</span>
                  <input type="file" multiple accept="image/*" onChange={handleFileChange} className="hidden" />
                </label>
              </div>
            </div>

            {/* Specs, Highlights & Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-[#001C4B]">Specifications</h3>
                  <button type="button" onClick={() => setSpecs([...specs, { key: '', value: '' }])} className="text-[10px] font-black text-cyan-500 uppercase tracking-widest hover:text-cyan-600">Add New</button>
                </div>
                <div className="space-y-3">
                  {specs.map((s: any, i: number) => (
                    <div key={i} className="flex gap-2">
                      <input value={s.key} onChange={e => { const n = [...specs]; n[i].key = e.target.value; setSpecs(n); }} className="flex-1 px-4 py-3 bg-slate-50 rounded-xl text-xs border border-transparent focus:border-cyan-400 focus:bg-white transition-all" placeholder="Key (e.g. RAM)" />
                      <input value={s.value} onChange={e => { const n = [...specs]; n[i].value = e.target.value; setSpecs(n); }} className="flex-1 px-4 py-3 bg-slate-50 rounded-xl text-xs border border-transparent focus:border-cyan-400 focus:bg-white transition-all" placeholder="Value (e.g. 12GB)" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-[#001C4B]">Highlights</h3>
                  <button type="button" onClick={() => setHighlights([...highlights, ''])} className="text-[10px] font-black text-cyan-500 uppercase tracking-widest hover:text-cyan-600">Add New</button>
                </div>
                <div className="space-y-3">
                  {highlights.map((h: string, i: number) => (
                    <input key={i} value={h} onChange={e => { const n = [...highlights]; n[i] = e.target.value; setHighlights(n); }} className="w-full px-4 py-3 bg-slate-50 rounded-xl text-xs border border-transparent focus:border-cyan-400 focus:bg-white transition-all" placeholder="e.g. 200MP Main Camera" />
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-[#001C4B]">Features</h3>
                  <button type="button" onClick={() => setFeatures([...features, ''])} className="text-[10px] font-black text-cyan-500 uppercase tracking-widest hover:text-cyan-600">Add New</button>
                </div>
                <div className="space-y-3">
                  {features.map((f: string, i: number) => (
                    <input key={i} value={f} onChange={e => { const n = [...features]; n[i] = e.target.value; setFeatures(n); }} className="w-full px-4 py-3 bg-slate-50 rounded-xl text-xs border border-transparent focus:border-cyan-400 focus:bg-white transition-all" placeholder="e.g. PTA Approved" />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-auto px-10 py-8 bg-slate-50/50 border-t border-slate-100 flex items-center justify-end gap-4">
            <button type="button" onClick={onClose} className="px-8 py-3.5 text-sm font-bold text-slate-400">Cancel</button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-10 py-3.5 bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-bold rounded-full flex items-center justify-center gap-2 min-w-[160px]"
            >
              {isLoading ? <><Loader2 className="w-5 h-5 animate-spin" /> Saving...</> : 'Save Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
