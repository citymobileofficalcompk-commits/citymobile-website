import { createFileRoute, Link } from "@tanstack/react-router";
import { Flame, Sparkles, Tag, ArrowRight, Calendar, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { query } from "@/lib/turso";

export const Route = createFileRoute("/offers")({
  head: () => ({
    meta: [
      { title: "Exclusive Offers & Campaigns | City Mobile" },
      { name: "description", content: "Explore hot sales, campaigns, and exclusive promotional offers on premium mobiles and accessories at City Mobile Pakistan." },
    ],
  }),
  component: OffersPage,
});

function OffersPage() {
  const [offers, setOffers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOffers = async () => {
      setIsLoading(true);
      try {
        const data = await query(
          "SELECT * FROM offers WHERE is_active = 1 AND id IS NOT NULL ORDER BY created_at DESC"
        );



        const activeOffers = (data || []).filter((o: any) => o.id);
        setOffers(activeOffers);
      } catch (err) {
        console.error("Failed to fetch campaigns:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOffers();
  }, []);

  return (
    <div className="pt-28 pb-32 bg-slate-50/50 min-h-screen">
      <div className="mx-auto max-w-6xl px-4">
        {/* Header */}
        <div className="relative overflow-hidden rounded-[3rem] bg-[#001C4B] text-white p-8 sm:p-12 shadow-2xl mb-14">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-transparent" />
          <div className="absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-cyan-400 blur-3xl opacity-20" />
          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-xl border border-white/10 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-cyan-300">
              <Sparkles className="h-4 w-4" /> CAMPAIGNS & SHOPPING FESTIVALS
            </div>
            <h1 className="mt-6 font-display text-4xl sm:text-6xl font-extrabold leading-[1.05] tracking-tight">
              Mega <span className="text-cyan-400">Campaigns</span><br />& Mega Savings
            </h1>
            <p className="mt-4 max-w-md text-slate-400 font-medium text-base">
              Shop exclusive premium deals. High quality certified products with special event pricing.
            </p>
          </div>
        </div>

        {/* Dynamic States */}
        {isLoading ? (
          <div className="space-y-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-6 h-6 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-xs font-black uppercase tracking-widest text-slate-400">Loading active events...</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-md p-6 space-y-4 animate-pulse">
                  <div className="h-56 bg-slate-200 rounded-3xl w-full" />
                  <div className="space-y-2">
                    <div className="h-4 bg-slate-200 rounded-lg w-1/4" />
                    <div className="h-6 bg-slate-200 rounded-lg w-3/4" />
                    <div className="h-4 bg-slate-200 rounded-lg w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : offers.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-100/50">
            <div className="w-20 h-20 bg-slate-50 text-slate-300 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
              <Tag className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black text-[#001C4B]">No promotional offers available at the moment</h3>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-wider mt-2">Check back soon for upcoming grand campaigns!</p>
            <Link
              to="/"
              className="inline-block mt-8 px-10 py-4 bg-gradient-to-r from-cyan-400 to-blue-500 hover:scale-[1.02] hover:shadow-cyan-400/20 active:scale-[0.98] text-white font-extrabold rounded-full transition-all shadow-lg text-xs uppercase tracking-widest"
            >
              Back to Home
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {offers.map((offer, i) => {
              const hasEndDate = offer.end_date ? new Date(offer.end_date) > new Date() : false;
              const formattedDate = offer.end_date
                ? new Date(offer.end_date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
                : "";

              return (
                <div
                  key={offer.id}
                  className="group relative bg-white rounded-[2.5rem] overflow-hidden shadow-xl hover:shadow-2xl shadow-blue-900/5 border border-slate-100 transition-all hover:-translate-y-1 duration-500"
                >
                  {/* Image banner */}
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={offer.image_url}
                      alt={offer.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#001D4C]/95 via-[#001D4C]/40 to-transparent" />

                    {/* Top badging */}
                    <div className="absolute top-6 left-6 flex flex-wrap gap-2">
                      {offer.discount_badge && (
                        <span className="bg-cyan-400 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg">
                          {offer.discount_badge}
                        </span>
                      )}
                      {offer.discount_text && (
                        <span className="bg-pink-500 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg">
                          {offer.discount_text}
                        </span>
                      )}
                    </div>

                    {/* Active Timer badge */}
                    {hasEndDate && (
                      <div className="absolute top-6 right-6 inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#001C4B]/60 backdrop-blur-md border border-white/10 rounded-full text-[9px] font-black uppercase tracking-widest text-cyan-300">
                        <Calendar className="w-3.5 h-3.5" /> End: {formattedDate}
                      </div>
                    )}

                    {/* Bottom contents inside banner */}
                    <div className="absolute bottom-6 left-8 right-8 text-white">
                      <p className="text-[10px] font-black uppercase tracking-widest text-cyan-400">{offer.category || "General Campaign"}</p>
                      <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight mt-1">{offer.title}</h2>
                    </div>
                  </div>

                  {/* Body description & actions */}
                  <div className="p-8 space-y-6">
                    <p className="text-slate-500 text-sm font-medium leading-relaxed">
                      {offer.subtitle || "Enjoy exclusive pricing and limited-time deals on selected high-performance mobiles and accessories. Buy yours today!"}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                      <div className="flex flex-col">
                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">CAMPAIGN STATUS</span>
                        <span className="inline-flex items-center gap-1.5 text-emerald-500 font-bold text-xs mt-0.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" /> Active Now
                        </span>
                      </div>

                      <Link
                        to="/offers/$id"
                        params={{ id: offer.id }}
                        className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#001C4B] hover:bg-cyan-500 hover:shadow-lg hover:shadow-cyan-500/20 text-white font-extrabold rounded-full transition-all text-xs uppercase tracking-widest group/btn"
                      >
                        Explore Offers
                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
