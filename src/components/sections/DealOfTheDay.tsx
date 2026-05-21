import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Flame, Zap, Loader2 } from "lucide-react";
import { querySingle } from "@/lib/turso";

function useCountdown(targetIso: string | null) {
  const [t, setT] = useState({ d: 0, h: 0, m: 0, s: 0, expired: false });

  useEffect(() => {
    if (!targetIso) return;
    const target = new Date(targetIso);

    const tick = () => {
      const now = new Date().getTime();
      const distance = target.getTime() - now;

      if (distance < 0) {
        setT({ d: 0, h: 0, m: 0, s: 0, expired: true });
        return;
      }

      const d = Math.floor(distance / (1000 * 60 * 60 * 24));
      const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((distance % (1000 * 60)) / 1000);

      setT({ d, h, m, s, expired: false });
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetIso]);

  return t;
}

export function DealOfTheDay() {
  const [activeOffer, setActiveOffer] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchActiveOffer = async () => {
      try {
        const data = await querySingle(
          "SELECT * FROM offers WHERE is_active = 1 AND id IS NOT NULL AND end_date IS NOT NULL ORDER BY created_at DESC LIMIT 1"
        );
        if (data && data.id) {
          setActiveOffer(data);
        } else {
          setActiveOffer(null);
        }
      } catch (err) {
        console.error("Error fetching offer:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchActiveOffer();
  }, []);

  const targetDateIso = activeOffer?.end_date || null;
  const t = useCountdown(targetDateIso);

  if (isLoading) return (
    <div className="py-20 flex justify-center">
      <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
    </div>
  );

  if (!activeOffer || t.expired) return null;

  const cells = [
    { v: t.d, l: "Days" },
    { v: t.h, l: "Hours" },
    { v: t.m, l: "Mins" },
    { v: t.s, l: "Secs" },
  ];

  return (
    <section className="relative py-12">
      <div className="mx-auto max-w-6xl px-4">
        <div className="relative overflow-hidden rounded-[3rem] bg-[#001C4B] text-white p-8 sm:p-12 shadow-2xl shadow-blue-950/20">
          {/* Dynamic Background Image with Overlay */}
          {activeOffer.image_url && (
            <div className="absolute inset-0">
              <img
                src={activeOffer.image_url}
                className="w-full h-full object-cover opacity-30"
                alt="Promo background"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#001C4B] via-[#001C4B]/80 to-transparent" />
            </div>
          )}

          <div className="absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-cyan-500 blur-[120px] opacity-20" />

          <div className="relative grid gap-10 md:grid-cols-2 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-cyan-400/10 border border-cyan-400/20 px-4 py-2 text-xs font-black tracking-widest text-cyan-400 uppercase">
                <Flame className="h-4 w-4 fill-current" /> FLASH SALE
              </div>

              <h2 className="font-display text-4xl sm:text-5xl font-black leading-[1.1]">
                {activeOffer.discount_text && (
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 block mb-2">
                    {activeOffer.discount_text}
                  </span>
                )}
                {activeOffer.title}
              </h2>

              <p className="text-lg text-slate-300 max-w-md font-medium">
                {activeOffer.subtitle || "Limited stock available. Grab yours before the timer hits zero!"}
              </p>

              <Link
                to="/offers/$id"
                params={{ id: activeOffer.id }}
                className="inline-flex items-center gap-3 h-14 px-8 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-bold shadow-xl shadow-cyan-500/20 hover:scale-[1.05] transition-all group"
              >
                <Zap className="h-5 w-5 fill-current group-hover:animate-pulse" />
                Shop the Deals
              </Link>
            </div>

            <div className="grid grid-cols-4 gap-3 sm:gap-4">
              {cells.map((c) => (
                <div key={c.l} className="rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 p-4 sm:p-6 text-center shadow-lg transition-transform hover:-translate-y-1">
                  <div className="font-display text-3xl sm:text-5xl font-black tabular-nums tracking-tighter text-cyan-400">
                    {String(c.v).padStart(2, "0")}
                  </div>
                  <div className="mt-2 text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                    {c.l}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
