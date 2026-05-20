import { createFileRoute } from "@tanstack/react-router";
import { ProductCard } from "@/components/ProductCard";
import { supabase } from "@/lib/supabase";
import { useState, useRef, useEffect } from "react";
import { Search, X, Loader2, Package, SlidersHorizontal, Sparkles, Tag, Clock, Check } from "lucide-react";
import * as Icons from "lucide-react";
import { z } from "zod";
import { CATEGORIES } from "@/lib/site-data";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const searchSchema = z.object({ q: z.string().optional(), cat: z.string().optional() });

export const Route = createFileRoute("/mobiles")({
  validateSearch: searchSchema,
  component: ShopPage,
});

const SHOP_CATEGORIES = [
  { slug: "all", name: "All", icon: "Sparkles" },
  ...CATEGORIES.map((c) => ({ slug: c.name, name: c.name, icon: c.icon })),
];

type FilterMode = "all" | "offers" | "latest";

function ShopPage() {
  const { q: initialQ, cat: initialCat } = Route.useSearch();
  const [query, setQuery] = useState(initialQ ?? "");
  const [active, setActive] = useState<string>(initialCat ?? "all");
  const [filter, setFilter] = useState<FilterMode>("all");
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const tabsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    async function fetchProducts() {
      setIsLoading(true);
      let q = supabase.from('products').select('*').eq('is_active', true);
      if (active !== "all") {
        const activeLower = active.toLowerCase();
        if (activeLower === "mobiles") {
          q = q.or('category.ilike."new mobile",category.ilike.mobiles,category.ilike.new-mobile,category.ilike.mobile,category.ilike."new mobiles"');
        } else if (activeLower === "used mobiles" || activeLower === "used mobile") {
          q = q.or('category.ilike."used mobile",category.ilike."used mobiles",category.ilike.used-mobile');
        } else {
          const category = CATEGORIES.find(c => c.name.toLowerCase() === activeLower);
          if (category) {
            const orParts = new Set<string>();
            const addTerm = (term: string) => {
              if (!term) return;
              const clean = term.trim().toLowerCase();
              if (clean) orParts.add(`category.ilike."${clean}"`);
            };

            addTerm(category.name);
            addTerm(category.slug);
            addTerm(category.name.replace(/[-\s]+/g, ' '));
            addTerm(category.slug.replace(/[-\s]+/g, ' '));
            addTerm(category.name.replace(/[-\s]+/g, '-'));
            addTerm(category.slug.replace(/[-\s]+/g, '-'));

            if (category.name.toLowerCase().endsWith('es')) {
              addTerm(category.name.slice(0, -2));
            } else if (category.name.toLowerCase().endsWith('s')) {
              addTerm(category.name.slice(0, -1));
            }
            
            if (category.slug.toLowerCase().endsWith('es')) {
              addTerm(category.slug.slice(0, -2));
            } else if (category.slug.toLowerCase().endsWith('s')) {
              addTerm(category.slug.slice(0, -1));
            }

            if (!category.name.toLowerCase().endsWith('s')) {
              addTerm(category.name + 's');
            }
            if (!category.slug.toLowerCase().endsWith('s')) {
              addTerm(category.slug + 's');
            }

            q = q.or(Array.from(orParts).join(','));
          } else {
            q = q.ilike('category', active);
          }
        }
      }
      if (query.trim()) q = q.ilike('name', `%${query}%`);
      if (filter === "offers") q = q.not('discounted_price', 'is', null);
      q = q.order('created_at', { ascending: false });
      const { data } = await q;
      if (!cancelled) {
        setProducts(data || []);
        setIsLoading(false);
      }
    }
    const timer = setTimeout(fetchProducts, 200);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [active, query, filter]);

  useEffect(() => {
    const el = tabsRef.current?.querySelector<HTMLButtonElement>(`[data-cat="${active}"]`);
    el?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [active]);

  const activeName = SHOP_CATEGORIES.find((c) => c.slug === active)?.name ?? "All";

  return (
    <div className="pt-24 pb-32 min-h-screen bg-white font-inter">
      <div className="mx-auto max-w-6xl px-4">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-500">Inventory</p>
        <h1 className="mt-2 text-4xl sm:text-6xl font-black text-[#001C4B] tracking-tight">
          Premium <span className="text-cyan-500 underline decoration-cyan-400/20 underline-offset-8">Store</span>
        </h1>
        <p className="mt-4 text-slate-500 max-w-xl text-sm font-medium">
          Browse all categories — original PTA-approved products, ready to ship nationwide.
        </p>

        {/* Search + Filter */}
        <div className="mt-8 flex items-center gap-2.5">
          <div className="relative flex-1 group">
            <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-cyan-400/0 via-cyan-400/40 to-blue-500/0 opacity-0 group-focus-within:opacity-100 blur transition-opacity duration-300" />
            <div className="relative bg-white/70 backdrop-blur-xl border border-slate-200/70 rounded-2xl shadow-sm group-focus-within:border-cyan-400/50 group-focus-within:shadow-md group-focus-within:shadow-cyan-400/10 transition-all duration-200">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search iPhone, AirPods, covers…"
                className="w-full h-14 bg-transparent pl-12 pr-12 text-sm outline-none font-medium text-[#001C4B] placeholder:text-slate-400"
              />
              {query && (
                <button onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors">
                  <X className="h-3.5 w-3.5 text-slate-500" />
                </button>
              )}
            </div>
          </div>

          <Popover>
            <PopoverTrigger asChild>
              <button
                className={`relative h-14 w-14 shrink-0 rounded-2xl border flex items-center justify-center transition-all duration-200 active:scale-95 ${
                  filter !== "all"
                    ? "bg-[#001C4B] border-[#001C4B] text-white shadow-md shadow-blue-900/20"
                    : "bg-white/70 backdrop-blur-xl border-slate-200/70 text-[#001C4B] hover:border-cyan-400/50"
                }`}
                aria-label="Filter"
              >
                <SlidersHorizontal className="h-4 w-4" />
                {filter !== "all" && (
                  <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-cyan-400" />
                )}
              </button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-56 p-2 rounded-2xl border-slate-200/70 shadow-xl">
              <p className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400">Filter by</p>
              {[
                { id: "all" as const, label: "All Products", icon: Sparkles },
                { id: "offers" as const, label: "Offers Only", icon: Tag },
                { id: "latest" as const, label: "Latest", icon: Clock },
              ].map((opt) => {
                const Icon = opt.icon;
                const isActive = filter === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setFilter(opt.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                      isActive ? "bg-cyan-50 text-cyan-600" : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="flex-1 text-left">{opt.label}</span>
                    {isActive && <Check className="h-4 w-4" />}
                  </button>
                );
              })}
            </PopoverContent>
          </Popover>
        </div>

        {/* Category tabs */}
        <div ref={tabsRef} className="mt-5 flex gap-2 overflow-x-auto scrollbar-hide -mx-4 px-4 pb-2">
          {SHOP_CATEGORIES.map((c) => {
            const Icon = (Icons as any)[c.icon] || Package;
            const isActive = active === c.slug;
            return (
              <button
                key={c.slug}
                data-cat={c.slug}
                onClick={() => setActive(c.slug)}
                className={`shrink-0 inline-flex items-center gap-2 px-5 h-11 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-200 active:scale-95 ${
                  isActive
                    ? "bg-[#001C4B] text-white shadow-lg shadow-blue-900/20"
                    : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {c.name}
              </button>
            );
          })}
        </div>

        {isLoading ? (
          <div className="py-32 flex flex-col items-center gap-4">
            <Loader2 className="w-10 h-10 text-cyan-500 animate-spin" />
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Loading...</p>
          </div>
        ) : (
          <div className="mt-8">
            <div className="flex items-center justify-between mb-6">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                <span className="text-[#001C4B]">{products.length}</span> {activeName.toLowerCase()} items
              </p>
            </div>

            {products.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {products.map((p, i) => (
                  <ProductCard key={p.id} p={p} index={i} />
                ))}
              </div>
            ) : (
              <div className="mt-6 rounded-[2.5rem] bg-slate-50 border border-slate-100 p-16 text-center flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-3xl bg-white flex items-center justify-center shadow-soft">
                  <Package className="w-8 h-8 text-slate-300" />
                </div>
                <div>
                  <p className="text-lg font-black text-[#001C4B]">Products Not Found</p>
                  <p className="mt-1 text-sm text-slate-400 font-medium">No items in this category yet.</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
