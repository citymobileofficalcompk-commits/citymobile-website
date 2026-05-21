import { useEffect, useState } from "react";
import { Quote, Star, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { REVIEWS } from "@/lib/site-data";
import { SectionHeader } from "./Categories";
import { query } from "@/lib/turso";

export function Reviews() {
  const [i, setI] = useState(0);
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchReviews() {
      try {
        const data = await query(
          "SELECT * FROM reviews WHERE status = 'published' ORDER BY id DESC"
        );

        if (data && data.length > 0) {
          setReviews(data);
        } else {
          setReviews(REVIEWS);
        }
      } catch (e) {
        setReviews(REVIEWS);
      } finally {
        setIsLoading(false);
      }
    }
    fetchReviews();
  }, []);

  useEffect(() => {
    if (reviews.length <= 1) return;
    const id = setInterval(() => setI((x) => (x + 1) % reviews.length), 5000);
    return () => clearInterval(id);
  }, [reviews.length]);

  if (isLoading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-cyan-500 animate-spin" />
      </div>
    );
  }

  const total = reviews.length;

  return (
    <section id="reviews" className="relative py-16 bg-gradient-to-b from-secondary/30 to-background">
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeader eyebrow="Loved by thousands" title="What Our Customers Say" subtitle="Real stories from happy buyers" />

        <div className="mt-10 relative">
          <div className="overflow-hidden rounded-3xl">
            <div className="flex transition-transform duration-700 ease-out" style={{ transform: `translateX(-${i * 100}%)` }}>
              {reviews.map((r: any, idx: number) => (
                <div key={idx} className="w-full shrink-0 px-1">
                  <div className="rounded-3xl bg-card border border-border/60 shadow-soft p-7 sm:p-10 relative overflow-hidden">
                    <Quote className="absolute top-6 right-6 h-16 w-16 text-primary/8" />
                    <div className="flex gap-1 text-[oklch(0.78_0.18_85)]">
                      {Array.from({ length: r.rating }).map((_: any, k: number) => <Star key={k} className="h-4 w-4 fill-current" />)}
                    </div>
                    <p className="mt-5 text-lg sm:text-xl font-display leading-relaxed text-foreground/90">"{r.comment || r.text}"</p>
                    <div className="mt-6 flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-neon-gradient flex items-center justify-center text-white font-bold shadow-neon">
                        {(r.customer_name || r.name).split(" ").map((s: string) => s[0]).slice(0, 2).join("")}
                      </div>
                      <div>
                        <p className="font-semibold">{r.customer_name || r.name}</p>
                        <p className="text-xs text-muted-foreground">{r.role || "Verified Buyer"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {total > 1 && (
            <div className="mt-6 flex items-center justify-center gap-3">
              <button onClick={() => setI((i - 1 + total) % total)} className="h-10 w-10 rounded-full glass border border-border/60 flex items-center justify-center hover:bg-accent" aria-label="Prev">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <div className="flex gap-1.5">
                {reviews.map((_: any, k: number) => (
                  <button key={k} onClick={() => setI(k)} className={`h-1.5 rounded-full transition-all ${k === i ? "w-8 bg-neon-gradient" : "w-1.5 bg-foreground/15"}`} aria-label={`Slide ${k + 1}`} />
                ))}
              </div>
              <button onClick={() => setI((i + 1) % total)} className="h-10 w-10 rounded-full glass border border-border/60 flex items-center justify-center hover:bg-accent" aria-label="Next">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
