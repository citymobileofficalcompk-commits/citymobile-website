import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { findCategory } from "@/lib/site-data";
import { ProductCard } from "@/components/ProductCard";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/category/$slug")({
  head: ({ params }) => {
    const c = findCategory(params.slug);
    return {
      meta: [
        { title: c ? `${c.name} — Shop Online | City Mobile` : "Category | City Mobile" },
        { name: "description", content: c ? `Browse premium ${c.name} at City Mobile — original products with fast delivery.` : "" },
      ],
    };
  },
  loader: async ({ params }) => {
    const category = findCategory(params.slug);
    if (!category) throw notFound();
    
    const catSlug = category.slug.toLowerCase();
    let query = supabase
      .from('products')
      .select('*')
      .eq('is_active', true);
      
    if (catSlug === 'mobiles') {
      query = query.or('category.ilike."new mobile",category.ilike.mobiles,category.ilike.new-mobile,category.ilike.mobile,category.ilike."new mobiles"');
    } else if (catSlug === 'used-mobiles') {
      query = query.or('category.ilike."used mobile",category.ilike."used mobiles",category.ilike.used-mobile');
    } else {
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

      query = query.or(Array.from(orParts).join(','));
    }

    const { data: products } = await query.order('created_at', { ascending: false });

    return { category, products: products || [] };
  },
  component: CategoryPage,
});

function CategoryPage() {
  const data = Route.useLoaderData() as any;
  
  if (!data) return null;
  
  const category: any = data.category;
  const products: any[] = data.products || [];
  return (
    <div className="pt-24 pb-32">
      <div className="mx-auto max-w-6xl px-4">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>
        <p className="mt-4 text-xs font-bold uppercase tracking-[0.18em] text-primary/80">Category</p>
        <h1 className="mt-2 font-display text-3xl sm:text-5xl font-extrabold tracking-tight">
          Premium <span className="text-gradient">{category.name}</span>
        </h1>
        <p className="mt-3 text-muted-foreground max-w-xl">
          Hand-picked {category.name.toLowerCase()} — original, premium quality and ready to ship.
        </p>

        {products.length > 0 ? (
          <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {products.map((p: any, i: number) => <ProductCard key={p.id} p={p} index={i} />)}
          </div>
        ) : (
          <div className="mt-12 rounded-3xl bg-card border border-border/60 p-12 text-center">
            <p className="text-lg font-bold text-foreground">Products Not Found</p>
            <p className="mt-2 text-sm text-muted-foreground">No items in this category yet. Contact us on WhatsApp for current availability.</p>
          </div>
        )}
      </div>
    </div>
  );
}
