import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit2,
  Trash2,
  Smartphone,
  CheckCircle2,
  XCircle,
  Image as ImageIcon
} from 'lucide-react';
import { ProductModal } from '@/components/admin/ProductModal';
import { cn } from '@/lib/utils';

import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export const Route = createFileRoute('/admin/products')({
  component: AdminProducts,
});

// Mock data for products
const initialProducts = [
  {
    id: '1',
    name: 'iPhone 15 Pro Max',
    category: 'Premium New Mobile',
    basePrice: 540000,
    discountedPrice: 525000,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?w=100&h=100&fit=crop'
  },
  {
    id: '2',
    name: 'Samsung Galaxy S24 Ultra',
    category: 'Premium New Mobile',
    basePrice: 480000,
    discountedPrice: 465000,
    status: 'active',
    image: 'https://images.unsplash.com/photo-17072314590ef6-92f58e244837?w=100&h=100&fit=crop'
  },
  {
    id: '3',
    name: 'Google Pixel 8 Pro',
    category: 'Premium New Mobile',
    basePrice: 320000,
    discountedPrice: 295000,
    status: 'disabled',
    image: 'https://images.unsplash.com/photo-1696446702183-bc1315b7190d?w=100&h=100&fit=crop'
  },
  {
    id: '4',
    name: 'Apple AirPods Pro 2',
    category: 'Premium Accessories',
    basePrice: 75000,
    discountedPrice: 68000,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1588423770674-f2855ee476e7?w=100&h=100&fit=crop'
  }
];

function AdminProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  // Filter States
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch products');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const availableCategories = Array.from(new Set([
    ...products.map(p => p.category).filter(Boolean),
    "New Mobile", "Used Mobiles", "Used Mobile", "Tablet", "iPod", "Watch",
    "Power Bank", "Hand Free", "Headphones", "Buds", "AirPods",
    "Data Cable", "Adapter", "Games", "Covers", "Glass",
    "3D Sheets", "Speakers", "Mic", "Lights", "Holders"
  ])).sort();

  const filteredProducts = products.filter(p => {
    const matchesSearch = 
      p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category?.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesCategory = !selectedCategory || p.category === selectedCategory;
    
    const matchesStatus = !selectedStatus || 
      (selectedStatus === 'active' && p.is_active === true) ||
      (selectedStatus === 'inactive' && p.is_active === false);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleEdit = (product: any) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Product deleted successfully');
      fetchProducts();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete product');
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      toast.success(`Product ${!currentStatus ? 'activated' : 'disabled'} successfully`);
      fetchProducts();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update status');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#001C4B]">Products</h1>
          <p className="text-slate-500 mt-1">Manage your mobile inventory and accessories.</p>
        </div>
        <button
          onClick={handleAddNew}
          className="inline-flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-bold rounded-full shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <Plus className="w-5 h-5" />
          Add New Product
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-3xl shadow-lg shadow-blue-900/5 border border-slate-100 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search products by name or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-cyan-400/50 transition-all text-sm"
          />
        </div>
        <div className="relative w-full md:w-auto z-30">
          <button
            onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-[#001C4B] hover:bg-slate-50 transition-colors w-full md:w-auto cursor-pointer"
          >
            <Filter className="w-4 h-4 text-cyan-500" />
            Filters
            {(selectedCategory || selectedStatus) && (
              <span className="inline-flex items-center justify-center w-5 h-5 bg-cyan-400 text-white text-[9px] font-black rounded-full shadow-md shadow-cyan-400/20">
                {Number(!!selectedCategory) + Number(!!selectedStatus)}
              </span>
            )}
          </button>

          {isFilterDropdownOpen && (
            <>
              {/* Click outside backdrop */}
              <div 
                className="fixed inset-0 z-30" 
                onClick={() => setIsFilterDropdownOpen(false)} 
              />
              <div className="absolute right-0 mt-3 w-80 bg-white/95 backdrop-blur-md rounded-3xl shadow-xl shadow-blue-900/10 border border-slate-100 p-6 z-40 animate-in fade-in slide-in-from-top-2 duration-300 space-y-5">
                <div>
                  <h4 className="font-extrabold text-[#001C4B] text-sm tracking-tight">Filter Inventory</h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Refine product catalog list</p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Category Selection</label>
                  <select 
                    value={selectedCategory} 
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl text-xs font-bold text-[#001C4B] focus:ring-2 focus:ring-cyan-400/30 outline-none appearance-none cursor-pointer"
                  >
                    <option value="">All Categories</option>
                    {availableCategories.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Live Status</label>
                  <select 
                    value={selectedStatus} 
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl text-xs font-bold text-[#001C4B] focus:ring-2 focus:ring-cyan-400/30 outline-none appearance-none cursor-pointer"
                  >
                    <option value="">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive (Disabled)</option>
                  </select>
                </div>

                {(selectedCategory || selectedStatus) && (
                  <button 
                    onClick={() => { setSelectedCategory(""); setSelectedStatus(""); }}
                    className="w-full py-3 text-[10px] font-black uppercase tracking-widest text-red-500 bg-red-50 hover:bg-red-100 transition-colors rounded-2xl cursor-pointer"
                  >
                    Reset Active Filters
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-[2.5rem] shadow-lg shadow-blue-900/5 border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-50">
                <th className="px-8 py-6 text-xs font-bold uppercase tracking-wider text-slate-400">Product</th>
                <th className="px-6 py-6 text-xs font-bold uppercase tracking-wider text-slate-400">Category</th>
                <th className="px-6 py-6 text-xs font-bold uppercase tracking-wider text-slate-400">Price</th>
                <th className="px-6 py-6 text-xs font-bold uppercase tracking-wider text-slate-400">Status</th>
                <th className="px-8 py-6 text-xs font-bold uppercase tracking-wider text-slate-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-10 h-10 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Loading Inventory...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 rounded-3xl bg-slate-50 flex items-center justify-center">
                        <Smartphone className="w-8 h-8 text-slate-200" />
                      </div>
                      <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No products found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-slate-100 overflow-hidden border border-slate-200 flex-shrink-0 group-hover:scale-110 transition-transform">
                          {product.images?.[0] || product.image ? (
                            <img src={product.images?.[0] || product.image} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ImageIcon className="w-6 h-6 text-slate-300" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-[#001C4B]">{product.name}</p>
                          <p className="text-xs text-slate-400 truncate max-w-[150px]">ID: {product.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div>
                        <p className="font-bold text-[#001C4B]">Rs. {Number(product.discounted_price || product.discountedPrice).toLocaleString()}</p>
                        <p className="text-xs text-slate-400 line-through">Rs. {Number(product.base_price || product.basePrice).toLocaleString()}</p>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <button
                        onClick={() => handleToggleStatus(product.id, product.is_active)}
                        className="flex items-center gap-2 group/status cursor-pointer"
                      >
                        <div className={`w-2 h-2 rounded-full ${product.is_active ? 'bg-cyan-400 animate-pulse' : 'bg-slate-300'}`}></div>
                        <span className={cn(
                          "text-xs font-bold uppercase tracking-wide transition-colors",
                          product.is_active ? 'text-cyan-500' : 'text-slate-400 group-hover/status:text-[#001C4B]'
                        )}>
                          {product.is_active ? 'Active' : 'Disabled'}
                        </span>
                      </button>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEdit(product)}
                          className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-cyan-500 hover:border-cyan-200 transition-all shadow-sm"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-red-500 hover:border-red-200 transition-all shadow-sm"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )))}
            </tbody>
          </table>
        </div>

        {/* Pagination placeholder */}
        <div className="px-8 py-6 border-t border-slate-50 flex items-center justify-between">
          <p className="text-sm text-slate-400">Showing <span className="font-bold text-[#001C4B]">{filteredProducts.length}</span> of <span className="font-bold text-[#001C4B]">{products.length}</span> products</p>
          <div className="flex items-center gap-2">
            <button disabled className="px-4 py-2 bg-slate-50 text-slate-400 rounded-xl text-xs font-bold disabled:opacity-50">Previous</button>
            <button className="px-4 py-2 bg-[#001C4B] text-white rounded-xl text-xs font-bold">Next</button>
          </div>
        </div>
      </div>

      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={selectedProduct}
        onSuccess={fetchProducts}
      />
    </div>
  );
}
