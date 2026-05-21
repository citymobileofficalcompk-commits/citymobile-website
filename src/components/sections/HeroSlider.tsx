import { useEffect, useRef, useState, useCallback } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { query } from "@/lib/turso";
import slide1 from "@/assets/hero-slide-1.jpg";
import slide2 from "@/assets/hero-slide-2.jpg";
import slide3 from "@/assets/hero-slide-3.jpg";

type Slide = {
  image: string;
  eyebrow: string;
  title: string;
  highlight: string;
  tag?: string;
  cta?: { label: string; to: string; params?: any };
  align?: "left" | "right";
  overlay?: string;
};


const DEFAULT_SLIDES: Slide[] = [
  {
    image: slide1,
    eyebrow: "City Mobile · Flagship Edition",
    title: "Pure Power.",
    highlight: "Crafted Premium.",
    tag: "Featured Drop",
    cta: { label: "Explore Now", to: "/mobiles" },
    align: "left",
    overlay: "from-black/85 via-black/40 to-transparent",
  },
  {
    image: slide2,
    eyebrow: "Sound · Style · Signal",
    title: "Premium Accessories.",
    highlight: "Cinematic Sound.",
    tag: "Curated Collection",
    align: "right",
    overlay: "from-black/30 via-black/10 to-black/70",
  },
  {
    image: slide3,
    eyebrow: "Limited Time",
    title: "Mega Deals.",
    highlight: "Up to 30% OFF",
    tag: "Hot Sale",
    cta: { label: "View Offers", to: "/offers" },
    align: "left",
    overlay: "from-black/80 via-black/35 to-transparent",
  },
];

let cachedSlides: Slide[] | null = null;

export function HeroSlider() {
  const [slides, setSlides] = useState<Slide[]>(cachedSlides || DEFAULT_SLIDES);
  const [isLoading, setIsLoading] = useState(!cachedSlides);
  const [idx, setIdx] = useState(0);
  const touchX = useRef<number | null>(null);
  const pause = useRef(false);

  const fetchOffers = async () => {
    if (!cachedSlides) {
      setIsLoading(true);
    }
    try {
      const data = await query("SELECT * FROM offers WHERE is_active = 1 AND id IS NOT NULL ORDER BY id DESC");

      const validOffers = (data || []).filter((offer: any) => offer.id);
      if (validOffers.length > 0) {
        const mappedSlides: Slide[] = validOffers.map((offer: any, i: number) => ({
          image: offer.image_url || slide1,
          eyebrow: offer.subtitle || "City Mobile Special",
          title: offer.title || "Special Offer",
          highlight: offer.discount_text || "",
          tag: offer.discount_badge || undefined,
          cta: { label: "Explore Campaign", to: "/offers/$id", params: { id: offer.id } },
          align: i % 2 === 0 ? "left" : "right",
          overlay: i % 2 === 0
            ? "from-black/85 via-black/40 to-transparent"
            : "from-black/30 via-black/10 to-black/70",
        }));

        cachedSlides = mappedSlides;
        setSlides(mappedSlides);
      } else {
        cachedSlides = DEFAULT_SLIDES;
        setSlides(DEFAULT_SLIDES);
      }
    } catch (err) {
      console.error("Failed to fetch promotional offers:", err);
      cachedSlides = DEFAULT_SLIDES;
      setSlides(DEFAULT_SLIDES);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const total = slides.length;

  const next = useCallback(() => {
    if (total > 0) setIdx((i) => (i + 1) % total);
  }, [total]);

  const prev = useCallback(() => {
    if (total > 0) setIdx((i) => (i - 1 + total) % total);
  }, [total]);

  useEffect(() => {
    if (total <= 1) return;
    const id = setInterval(() => { if (!pause.current) next(); }, 5500);
    return () => clearInterval(id);
  }, [next, total]);

  const onTouchStart = (e: React.TouchEvent) => { touchX.current = e.touches[0].clientX; pause.current = true; };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    if (Math.abs(dx) > 40) (dx < 0 ? next : prev)();
    touchX.current = null;
    setTimeout(() => (pause.current = false), 1200);
  };

  if (isLoading) {
    return (
      <section className="relative pt-20 pb-6 overflow-hidden">
        <div className="mx-auto max-w-6xl px-3 sm:px-4">
          <div className="relative h-[380px] xs:h-[420px] sm:h-[520px] md:h-[560px] rounded-2xl sm:rounded-[28px] overflow-hidden bg-slate-900 animate-pulse flex items-end p-6 sm:p-12 border border-white/5">
            <div className="space-y-4 max-w-xl w-full">
              <div className="h-6 w-32 bg-white/10 rounded-full"></div>
              <div className="h-4 w-48 bg-white/15 rounded"></div>
              <div className="h-12 w-3/4 sm:w-96 bg-white/20 rounded"></div>
              <div className="h-10 w-36 bg-white/25 rounded-2xl"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (total === 0) return null;

  return (
    <section className="relative pt-20 pb-6 overflow-hidden">
      <div className="mx-auto max-w-6xl px-3 sm:px-4">
        <div
          className="relative h-[380px] xs:h-[420px] sm:h-[520px] md:h-[560px] rounded-2xl sm:rounded-[28px] overflow-hidden shadow-elevated ring-1 ring-white/10 bg-slate-950"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          onMouseEnter={() => (pause.current = true)}
          onMouseLeave={() => (pause.current = false)}
        >
          {slides.map((s, i) => {
            const active = i === idx;
            const isRight = s.align === "right";
            return (
              <div
                key={i}
                className={`absolute inset-0 transition-all duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${active ? "opacity-100 scale-100" : "opacity-0 scale-[1.06] pointer-events-none"}`}
              >
                {/* Background image */}
                <img
                  src={s.image}
                  alt=""
                  className={`absolute inset-0 w-full h-full object-cover transition-transform duration-[8000ms] ease-out ${active ? "scale-110" : "scale-100"}`}
                />

                {/* Cinematic gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-r ${s.overlay}`} />
                <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_30%_20%,rgba(255,255,255,0.12),transparent_60%)]" />

                {/* Floating glow accents */}
                <div className="absolute -top-20 -left-20 h-64 w-64 rounded-full bg-cyan-400/20 blur-3xl animate-glow pointer-events-none" />
                <div className="absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-fuchsia-500/20 blur-3xl animate-glow pointer-events-none" style={{ animationDelay: "1.2s" }} />

                {/* Content */}
                <div className={`relative h-full flex flex-col justify-end sm:justify-center p-6 sm:p-12 text-white ${isRight ? "items-end text-right" : ""}`}>
                  <div className={`max-w-xl w-full ${isRight ? "ml-auto" : ""}`}>
                    {s.tag && active && (
                      <div className="mb-4 animate-fade-up">
                        <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full glass-dark text-[10px] font-bold uppercase tracking-[0.18em] text-white border border-white/20">
                          <Sparkles className="h-3 w-3 text-cyan-300" />
                          {s.tag}
                        </span>
                      </div>
                    )}

                    {active && (
                      <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-white/80 animate-fade-up" style={{ animationDelay: "60ms" }}>
                        {s.eyebrow}
                      </p>
                    )}

                    <h1
                      className={`mt-3 font-display text-[28px] leading-[1.05] xs:text-[34px] sm:text-5xl md:text-6xl font-extrabold tracking-tight break-words ${active ? "animate-fade-up" : ""}`}
                      style={{ animationDelay: "120ms" }}
                    >
                      {s.title}{" "}
                      {s.highlight && (
                        <span className="block bg-gradient-to-r from-cyan-300 via-white to-fuchsia-300 bg-clip-text text-transparent">
                          {s.highlight}
                        </span>
                      )}
                    </h1>

                    {s.cta && active && (
                      <div className="mt-7 animate-fade-up" style={{ animationDelay: "200ms" }}>
                        <Link
                          to={s.cta.to as any}
                          params={s.cta.params}
                          className="group inline-flex items-center gap-2 h-12 px-7 rounded-2xl bg-white text-slate-900 font-semibold shadow-elevated hover:scale-[1.04] active:scale-95 transition-transform duration-150"
                        >
                          {s.cta.label}
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                      </div>
                    )}

                  </div>
                </div>
              </div>
            );
          })}

          {/* Arrows (desktop) */}
          {total > 1 && (
            <>
              <button onClick={prev} aria-label="Previous" className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 z-10 h-11 w-11 rounded-full glass-dark text-white items-center justify-center hover:scale-110 transition border border-white/20">
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button onClick={next} aria-label="Next" className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 z-10 h-11 w-11 rounded-full glass-dark text-white items-center justify-center hover:scale-110 transition border border-white/20">
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}

          {/* Dots */}
          {total > 1 && (
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIdx(i)}
                  aria-label={`Slide ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-500 ${i === idx ? "w-10 bg-white" : "w-1.5 bg-white/50"}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

