import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Check, MessageCircle, ShieldCheck, Smartphone, Star, Truck, Loader2, ImageIcon } from "lucide-react";
import { WHATSAPP } from "@/lib/site-data";
import { ProductCard } from "@/components/ProductCard";
import { query, querySingle } from "@/lib/turso";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/product/$productSlug")({
  loader: async ({ params }) => {
    const product = await querySingle(
      'SELECT * FROM products WHERE id = ?',
      [params.productSlug]
    );
    
    if (!product) throw notFound();
    return { product };
  },
  component: ProductPage,
  notFoundComponent: () => (
    <div className="pt-32 pb-20 text-center flex flex-col items-center gap-4">
      <div className="w-16 h-16 rounded-3xl bg-slate-50 flex items-center justify-center text-slate-200">
        <Smartphone className="w-8 h-8" />
      </div>
      <h1 className="text-2xl font-black text-[#001C4B]">Product not found</h1>
      <Link to="/" className="text-cyan-500 font-bold mt-2">Back to home</Link>
    </div>
  ),
});

const fmt = (n: number) => "Rs. " + (n || 0).toLocaleString("en-PK");

function ProductPage() {
  const { product: p } = Route.useLoaderData();
  const [related, setRelated] = useState<any[]>([]);
  const [activeImg, setActiveImg] = useState(p.images?.[0] || '');

  useEffect(() => {
    async function fetchRelated() {
      const data = await query(
        'SELECT * FROM products WHERE category = ? AND is_active = 1 AND id != ? LIMIT 4',
        [p.category, p.id]
      );
      if (data) setRelated(data);
    }
    fetchRelated();
    setActiveImg(p.images?.[0] || '');
  }, [p]);

  const price = p.discounted_price || p.base_price;
  const oldPrice = p.discounted_price ? p.base_price : null;
  const off = oldPrice ? Math.round(((oldPrice - price) / oldPrice) * 100) : 0;

  const [form, setForm] = useState({
    name: "", phone: "", city: "", address: "", quantity: 1, notes: "",
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg =
      `*New Order — City Mobile*\n\n` +
      `*Product:* ${p.name}\n` +
      `*Price:* ${fmt(price)}\n` +
      `*Quantity:* ${form.quantity}\n\n` +
      `*Customer Name:* ${form.name}\n` +
      `*Phone:* ${form.phone}\n` +
      `*City:* ${form.city}\n` +
      `*Address:* ${form.address}\n` +
      `*Notes:* ${form.notes || "—"}`;
    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <div className="pt-24 pb-32 animate-in fade-in duration-700 bg-white">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-400 hover:text-cyan-500 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Store
        </Link>

        <div className="mt-8 grid lg:grid-cols-2 gap-16 items-start">
          {/* Gallery Section */}
          <div className="space-y-6">
            <div className="relative aspect-[4/5] rounded-[2.5rem] bg-slate-50 overflow-hidden border border-slate-100 shadow-xl shadow-slate-200/50">
              {activeImg ? (
                <img src={activeImg} alt={p.name} className="w-full h-full object-cover animate-in fade-in zoom-in-95 duration-500" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-200">
                  <Smartphone className="h-32 w-32" strokeWidth={1} />
                </div>
              )}
              {(p.discount_badge || off > 0) && (
                <div className="absolute top-8 left-8 flex flex-col gap-2">
                   <span className="rounded-full bg-cyan-500 text-white text-[10px] font-black uppercase tracking-widest px-5 py-2 shadow-lg shadow-cyan-500/20">
                    {p.discount_badge || `-${off}% OFF`}
                  </span>
                </div>
              )}
            </div>
            
            {p.images?.length > 1 && (
              <div className="grid grid-cols-5 gap-3">
                {p.images.map((img: string, i: number) => (
                  <button 
                    key={i} 
                    onClick={() => setActiveImg(img)}
                    className={cn(
                      "aspect-square rounded-2xl overflow-hidden border-2 transition-all group relative",
                      activeImg === img ? "border-cyan-500 shadow-md shadow-cyan-100" : "border-slate-100 opacity-60 hover:opacity-100 hover:border-slate-200"
                    )}
                  >
                    <img src={img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Summary */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-500 bg-cyan-50 px-3 py-1 rounded-full">{p.brand}</span>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{p.category}</span>
            </div>
            
            <h1 className="font-display text-4xl sm:text-6xl font-extrabold text-[#001C4B] leading-[1.1] tracking-tight">{p.name}</h1>
            
            <div className="mt-6 flex items-center gap-4">
              <span className="text-5xl font-black text-[#001C4B] tracking-tight">{fmt(price)}</span>
              {oldPrice && (
                <span className="text-2xl text-slate-300 line-through font-bold">{fmt(oldPrice)}</span>
              )}
            </div>

            {/* Highlights List */}
            {p.highlights?.length > 0 && (
              <div className="mt-10 space-y-4">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Key Highlights</h3>
                <ul className="space-y-3">
                  {p.highlights.map((h: string, i: number) => (
                    <li key={i} className="flex items-center gap-3 text-slate-600 font-medium group">
                      <div className="w-2 h-2 rounded-full bg-cyan-400 group-hover:scale-125 transition-transform" />
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Features Badges */}
            {p.features?.length > 0 && (
              <div className="mt-10 flex flex-wrap gap-2">
                {p.features.map((f: string, i: number) => (
                  <span key={i} className="px-4 py-2 bg-slate-50 border border-slate-100 text-[#001C4B] text-[10px] font-black uppercase tracking-widest rounded-xl flex items-center gap-2">
                    <Check className="w-3 h-3 text-cyan-500" /> {f}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-12 flex items-center gap-6 p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
               <div className="flex -space-x-2">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?u=${i+10}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <div>
                <div className="flex text-amber-400 gap-0.5">
                  {[1, 2, 3, 4, 5].map((i) => <Star key={i} className="h-3 w-3 fill-current" />)}
                </div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Trusted by 2k+ happy customers</p>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Info Tabs Section */}
        <div className="mt-32 border-t border-slate-100 pt-20">
          <div className="grid lg:grid-cols-3 gap-20">
            <div className="lg:col-span-2 space-y-16">
              {/* Description */}
              <section>
                <h3 className="text-2xl font-black text-[#001C4B] mb-8 flex items-center gap-3">
                  <div className="w-2 h-8 bg-cyan-400 rounded-full" />
                  Product Overview
                </h3>
                <div className="prose prose-slate max-w-none">
                  <p className="text-lg text-slate-600 leading-relaxed font-medium">
                    {p.description || "Order original PTA-approved smartphones and premium accessories with official warranty and nationwide delivery. We ensure authentic products with reliable customer support and fast shipping across Pakistan."}
                  </p>
                </div>
              </section>

              {/* Specs Table */}
              {p.specs && Object.keys(p.specs).length > 0 && (
                <section>
                  <h3 className="text-2xl font-black text-[#001C4B] mb-8 flex items-center gap-3">
                    <div className="w-2 h-8 bg-blue-500 rounded-full" />
                    Technical Specifications
                  </h3>
                  <div className="rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm">
                    <table className="w-full border-collapse">
                      <tbody>
                        {Object.entries(p.specs).map(([key, value], i) => (
                          <tr key={key} className={cn(
                            "group transition-colors",
                            i % 2 === 0 ? "bg-slate-50/50" : "bg-white"
                          )}>
                            <td className="px-8 py-5 text-sm font-black text-slate-400 uppercase tracking-widest w-1/3 border-r border-slate-100">{key}</td>
                            <td className="px-8 py-5 text-sm font-bold text-[#001C4B]">{String(value)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              )}
            </div>

            {/* Sticky Order Form Side */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 rounded-[3rem] bg-[#001C4B] p-8 text-white shadow-2xl overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-400/10 blur-[80px] rounded-full group-hover:bg-cyan-400/20 transition-all duration-700" />
                
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-xl">
                      <MessageCircle className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">Quick Checkout</h4>
                      <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Via WhatsApp</p>
                    </div>
                  </div>

                  <form onSubmit={onSubmit} className="space-y-3.5">
                    <Field label="Customer Name" required value={form.name} onChange={(v) => setForm({ ...form, name: v })} placeholder="e.g. Ahmad Raza" />
                    <Field label="Phone Number" required type="tel" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} placeholder="03XX-XXXXXXX" />
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="City" required value={form.city} onChange={(v) => setForm({ ...form, city: v })} placeholder="Lahore" />
                      <Field label="Quantity" required type="number" min={1} value={String(form.quantity)} onChange={(v) => setForm({ ...form, quantity: Math.max(1, Number(v) || 1) })} />
                    </div>
                    <Field label="Address" required value={form.address} onChange={(v) => setForm({ ...form, address: v })} placeholder="House #, Street, Area" />
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Notes (optional)</label>
                      <textarea
                        value={form.notes}
                        onChange={(e) => setForm({ ...form, notes: e.target.value })}
                        rows={2}
                        placeholder="Any special instructions…"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/30 transition-all resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full mt-2 h-14 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 text-white text-xs font-black uppercase tracking-[0.2em] shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.01] active:scale-95 transition-all duration-200"
                    >
                      Order Now via WhatsApp
                    </button>
                  </form>

                  <div className="mt-8 flex items-center justify-center gap-4 text-white/30">
                    <Truck className="w-4 h-4" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-center">Fast Nationwide Delivery</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="mt-32">
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-3xl font-black text-[#001C4B]">You May Also Like</h2>
              <Link to="/mobiles" className="text-sm font-black text-cyan-500 uppercase tracking-widest hover:text-cyan-600">View All</Link>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((r, i) => <ProductCard key={r.id} p={r} index={i} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", required, disabled, min, placeholder }: { label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean; disabled?: boolean; min?: number; placeholder?: string }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">{label}</label>
      <input
        type={type}
        value={value}
        required={required}
        disabled={disabled}
        min={min}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-12 bg-white/5 border border-white/10 rounded-2xl px-4 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/30 transition-all"
      />
    </div>
  );
}
