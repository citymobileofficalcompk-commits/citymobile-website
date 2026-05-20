import { createFileRoute } from "@tanstack/react-router";
import { ProductCard } from "@/components/ProductCard";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/accessories")({
  head: () => ({
    meta: [
      { title: "Accessories — Premium Mobile Accessories | City Mobile" },
      { name: "description", content: "AirPods, smart watches, chargers, covers, speakers and more — original premium accessories at City Mobile." },
    ],
  }),
  loader: async () => {
    const { data: products } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .not('category', 'in', '("New Mobile","Used Mobile","Used Mobiles","Tablet","new-mobile","used-mobile")');
    return { products: products || [] };
  },
  component: AccessoriesPage,
});

function AccessoriesPage() {
  const { products } = Route.useLoaderData();
  return (
    <div className="pt-28 pb-16">
      <div className="mx-auto max-w-6xl px-4">
        <p className="text-[10px] font-black uppercase tracking-widest text-cyan-500">Catalog</p>
        <h1 className="mt-2 font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-[#001C4B]">Premium <span className="text-cyan-500">Accessories</span></h1>
        <p className="mt-3 text-slate-500 max-w-xl text-sm font-medium">Audio, charging, protection and lifestyle accessories — only originals, sourced from authorized partners.</p>
        
        {products.length === 0 ? (
          <div className="mt-20 text-center py-20 bg-slate-50 rounded-[3rem] border border-slate-100">
             <h3 className="text-xl font-bold text-[#001C4B]">New Accessories Coming Soon</h3>
             <p className="text-slate-400 mt-2">We're updating our collection. Stay tuned!</p>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-in fade-in duration-500">
            {products.map((p: any, i: number) => <ProductCard key={p.id} p={p} index={i} />)}
          </div>
        )}
      </div>
    </div>
  );
}
