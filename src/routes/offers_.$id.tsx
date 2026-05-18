import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Flame, Sparkles, Smartphone, Gift, Calendar } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { ProductCard } from "@/components/ProductCard";

export const Route = createFileRoute("/offers_/$id")({
  component: OfferDetailsPage,
});

function OfferDetailsPage() {
  const { id } = Route.useParams();
  
  // Client-side states for campaign details and relational products data fetching
  const [offer, setOffer] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCampaignData() {
      setIsLoading(true);
      setError(null);
      try {
        // 1. Fetch single Offer record
        const { data: offerData, error: offerError } = await supabase
          .from("offers")
          .select("*")
          .eq("id", id)
          .maybeSingle();

        if (offerError) throw offerError;
        if (!offerData) {
          setError("404");
          setIsLoading(false);
          return;
        }

        setOffer(offerData);

        // 2. Fetch relationally linked Products
        let productsData: any[] = [];
        if (offerData.product_ids && offerData.product_ids.length > 0) {
          const { data: campaignProducts, error: productsError } = await supabase
            .from("products")
            .select("*")
            .in("id", offerData.product_ids)
            .eq("is_active", true);

          if (productsError) throw productsError;
          productsData = campaignProducts || [];
        }

        setProducts(productsData);
      } catch (err: any) {
        console.error("Error loading campaign details:", err);
        setError(err.message || "Failed to load campaign");
      } finally {
        setIsLoading(false);
      }
    }

    if (id) {
      loadCampaignData();
    }
  }, [id]);

  // Loading State: Display skeleton loaders for both Hero and Grid during fetching
  if (isLoading) {
    return (
      <div className="pt-24 pb-32 bg-slate-50/50 min-h-screen">
        <div className="mx-auto max-w-7xl px-4 lg:px-8 space-y-8 animate-pulse">
          {/* Back Link skeleton */}
          <div className="h-5 w-40 bg-slate-200 rounded-full" />
          
          {/* Hero Banner skeleton */}
          <div className="h-80 sm:h-96 w-full bg-slate-200 rounded-[3rem]" />
          
          {/* Product Grid Header skeleton */}
          <div className="space-y-4 pt-6">
            <div className="h-8 w-64 bg-slate-200 rounded-2xl" />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-80 bg-slate-200 rounded-[2.5rem]" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error State: 404 - Offer Not Found with button to return to the homepage
  if (error === "404" || !offer) {
    return (
      <div className="pt-32 pb-20 text-center flex flex-col items-center justify-center gap-4 bg-slate-50 min-h-screen">
        <div className="w-16 h-16 rounded-3xl bg-white flex items-center justify-center text-red-500 shadow-md">
          <Gift className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-black text-[#001C4B]">404 - Offer Not Found</h1>
        <p className="text-slate-400 text-sm font-semibold max-w-xs">
          This campaign may have expired or does not exist. Check our other promotional events!
        </p>
        <Link 
          to="/" 
          className="mt-6 px-8 py-3 bg-[#001C4B] hover:bg-[#001C4B]/95 text-white font-extrabold text-xs uppercase tracking-widest rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all"
        >
          Return to Homepage
        </Link>
      </div>
    );
  }

  const hasEndDate = offer.end_date ? new Date(offer.end_date) > new Date() : false;
  const formattedDate = offer.end_date
    ? new Date(offer.end_date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  // Parse percentage discount from campaign discount_text (e.g. "30% OFF") to reflect dynamically on product cards
  let campaignDiscountPercent = 0;
  if (offer.discount_text) {
    const match = offer.discount_text.match(/(\d+)%/);
    if (match) {
      campaignDiscountPercent = parseInt(match[1], 10);
    }
  }

  return (
    <div className="pt-24 pb-32 bg-slate-50/50 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        {/* Back Link */}
        <Link
          to="/offers"
          className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-400 hover:text-cyan-500 transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" /> All Active Campaigns
        </Link>

        {/* Hero Section (Campaign Header) */}
        <div className="relative overflow-hidden rounded-[3rem] bg-[#001C4B] text-white shadow-2xl mb-12 min-h-[300px] flex items-center">
          {/* Background image & gradient overlay */}
          <div className="absolute inset-0">
            <img
              src={offer.image_url || "https://images.unsplash.com/photo-1696446701796-da61225697cc?w=1200&h=600&fit=crop"}
              alt={offer.title}
              className="w-full h-full object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#000E26] via-[#00173D]/90 to-cyan-950/20" />
          </div>

          {/* Banner content overlay */}
          <div className="relative p-8 sm:p-16 max-w-3xl space-y-6">
            <div className="flex flex-wrap gap-2">
              <div className="inline-flex items-center gap-1.5 px-4.5 py-2 bg-cyan-400 text-[#001C4B] text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
                <Sparkles className="w-3.5 h-3.5" /> Special Event
              </div>
              {offer.discount_badge && (
                <span className="bg-pink-500 text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full shadow-lg animate-pulse">
                  {offer.discount_badge}
                </span>
              )}
              {hasEndDate && (
                <div className="inline-flex items-center gap-1.5 px-4.5 py-2 bg-white/10 backdrop-blur-md border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-cyan-300">
                  <Calendar className="w-3.5 h-3.5" /> Closes: {formattedDate}
                </div>
              )}
            </div>

            <p className="text-xs font-black uppercase tracking-widest text-cyan-400">{offer.category || "Grand Campaign"}</p>
            
            <h1 className="font-display text-4xl sm:text-6xl font-extrabold leading-[1.05] tracking-tight">
              {offer.title}
            </h1>

            <p className="max-w-xl text-slate-300 font-medium text-base sm:text-lg leading-relaxed">
              {offer.subtitle || "Exclusive campaign deals on luxury mobiles and premium accessories. Browse the selected items below."}
            </p>
          </div>
        </div>

        {/* Campaign Products Grid */}
        <div className="space-y-8">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-2xl bg-cyan-50 flex items-center justify-center text-cyan-500">
                <Flame className="w-5 h-5 fill-current animate-pulse" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-[#001C4B]">Campaign Deals</h2>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Exclusive prices available for this campaign only</p>
              </div>
            </div>
            <span className="bg-white px-4 py-2 rounded-2xl text-xs font-black text-[#001C4B] border border-slate-200 shadow-sm">
              {products.length} {products.length === 1 ? "Product" : "Products"} Available
            </span>
          </div>

          {/* Product list mapping or Empty State fallback handling */}
          {products.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-[3.5rem] border border-slate-100 shadow-xl">
              <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-[1.8rem] flex items-center justify-center mx-auto mb-6">
                <Smartphone className="w-8 h-8 animate-bounce" />
              </div>
              <h3 className="text-xl font-black text-[#001C4B]">No specific products are currently attached to this campaign. Check back soon!</h3>
              <p className="text-slate-400 font-bold text-xs uppercase tracking-wider mt-2">Check back shortly as products are being linked!</p>
              <Link
                to="/"
                className="inline-block mt-8 px-8 py-3.5 bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-extrabold rounded-full transition-all shadow-lg text-xs uppercase tracking-widest hover:scale-105 active:scale-95"
              >
                Return to Homepage
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product, idx) => {
                // Apply dynamic campaign discount to product card
                const modifiedProduct = { ...product };
                if (campaignDiscountPercent > 0) {
                  const originalPrice = product.price;
                  modifiedProduct.price = Math.round(originalPrice * (1 - campaignDiscountPercent / 100));
                  modifiedProduct.base_price = originalPrice;
                  modifiedProduct.discount_badge = offer.discount_badge || `-${campaignDiscountPercent}%`;
                }
                return <ProductCard key={product.id} p={modifiedProduct} index={idx} />;
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
