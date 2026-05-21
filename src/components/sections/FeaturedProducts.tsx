import { useEffect, useState } from "react";
import { ProductCard } from "../ProductCard";
import { SectionHeader } from "./Categories";
import { query } from "@/lib/turso";
import { Loader2 } from "lucide-react";

export function FeaturedProducts() {
  const [bestsellers, setBestsellers] = useState<any[]>([]);
  const [premiumPicks, setPremiumPicks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      setIsLoading(true);
      try {
        // Query bestsellers and premium picks in parallel with strict safety
        const [bestData, premData] = await Promise.all([
          query('SELECT * FROM products WHERE is_active = 1 AND is_bestseller = 1 ORDER BY created_at DESC LIMIT 8'),
          query('SELECT * FROM products WHERE is_active = 1 AND is_premium = 1 ORDER BY created_at DESC LIMIT 8')
        ]);

        setBestsellers(bestData || []);
        setPremiumPicks(premData || []);

      } catch (error) {
        console.error("Homepage Critical Fetch Error:", error);
        setBestsellers([]);
        setPremiumPicks([]);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchProducts();
  }, []);

  if (isLoading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-cyan-500 animate-spin" />
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Refreshing Inventory...</p>
      </div>
    );
  }

  return (
    <section className="relative py-14 bg-gradient-to-b from-background to-secondary/30">
      <div className="mx-auto max-w-6xl px-4">
        {/* Best Sellers Section */}
        <SectionHeader eyebrow="Must Have" title="Best Sellers" subtitle="Most popular devices this month" link="View All" to="/products" search={{ filter: "bestsellers" }} />
        <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {bestsellers?.map((p: any, i: number) => (
            <ProductCard key={p?.id || i} p={p} index={i} />
          ))}
        </div>

        {/* Premium Picks Section */}
        <div className="mt-20">
          <SectionHeader eyebrow="Elite Selection" title="Premium Picks" subtitle="The highest quality accessories" link="View All" to="/products" search={{ filter: "premium" }} />
          <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {premiumPicks?.map((p: any, i: number) => (
              <ProductCard key={p?.id || i} p={p} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
