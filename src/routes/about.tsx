import { createFileRoute, Link } from "@tanstack/react-router";
import { Award, BadgeCheck, Heart, ShieldCheck, Sparkles, Users, Phone } from "lucide-react";
import owner from "@/assets/owner.jpg";
import { Logo } from "@/components/Logo";
import { WHATSAPP } from "@/lib/site-data";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About City Mobile — Our Story, Mission & Founder" },
      { name: "description", content: "Learn about City Mobile — Pakistan's trusted premium mobile store, founded by Farrukh Ishaq Mastoi. Quality , trust and customer-first service in Multan & DG Khan." },
      { property: "og:title", content: "About City Mobile" },
      { property: "og:description", content: "The story, mission and people behind City Mobile." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="pt-20 pb-32">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-hero" />
        <div className="absolute inset-0 bg-glow opacity-60" />
        <div className="relative mx-auto max-w-6xl px-5 py-16 sm:py-24 text-white">
          <div className="flex justify-center mb-6"><Logo size="lg" variant="light" showText={false} /></div>
          <p className="text-center text-xs font-bold uppercase tracking-[0.3em] text-white/70">About Us</p>
          <h1 className="mt-3 text-center font-display text-4xl sm:text-6xl font-extrabold tracking-tight">
            Built on <span className="text-gradient">TRUST</span>.<br className="hidden sm:block" /> Driven by service.
          </h1>
          <p className="mt-5 mx-auto max-w-2xl text-center text-white/80 leading-relaxed">
            City Mobile is a premium mobile and accessories destination serving thousands of happy customers across South Punjab — combining genuine products, fair pricing and after-sales care that earns lifelong loyalty.
          </p>
        </div>
      </section>

      {/* Founder */}
      <section className="relative py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-5 grid gap-12 lg:grid-cols-2 items-center">
          <div className="relative animate-scale-in">
            <div className="absolute -inset-6 bg-neon-gradient blur-3xl opacity-25 rounded-full" />
            <div className="relative rounded-3xl overflow-hidden shadow-elevated max-w-md mx-auto ring-1 ring-border">
              <img src={owner} alt="Farrukh Ishaq Mastoi — Founder & CEO of City Mobile" loading="lazy" className="w-full aspect-[4/5] object-cover" />
              <div className="absolute bottom-4 inset-x-4 rounded-2xl glass p-4">
                <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Founder & CEO</p>
                <p className="font-display text-lg font-bold">Farrukh Ishaq Mastoi</p>
                <p className="mt-0.5 text-xs text-muted-foreground">Multan · DG Khan</p>
              </div>
            </div>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary/80">Meet the founder</p>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl font-extrabold tracking-tight">A decade of trust in mobile retail</h2>
            <p className="mt-5 text-muted-foreground leading-relaxed">
              Founded by <strong className="text-foreground">Farrukh Ishaq Mastoi</strong>, City Mobile started with a simple promise — sell only original products and treat every customer like family. Today, that promise has built a brand that serves thousands of buyers across <strong className="text-foreground">Multan</strong> and <strong className="text-foreground">DG Khan</strong>.
            </p>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              From flagship smartphones to certified accessories and expert mobile repair — every product and service at City Mobile is backed by personal accountability and a genuine commitment to quality.
            </p>
            <div className="mt-6 grid grid-cols-3 gap-3">
              {[
                { i: Award, t: "10+ Yrs", s: "Experience" },
                { i: Users, t: "10K+", s: "Happy Buyers" },
                { i: Heart, t: "4.8★", s: "Customer Love" },
              ].map((x) => (
                <div key={x.s} className="rounded-2xl glass p-4 text-center">
                  <x.i className="mx-auto h-5 w-5 text-primary" />
                  <p className="mt-2 font-display font-extrabold">{x.t}</p>
                  <p className="text-xs text-muted-foreground">{x.s}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="relative py-16 bg-gradient-to-b from-secondary/30 to-background">
        <div className="mx-auto max-w-6xl px-5">
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary/80">Our values</p>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl font-extrabold tracking-tight">What we stand for</h2>
            <p className="mt-3 text-muted-foreground">Four principles that shape every interaction at City Mobile.</p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { i: ShieldCheck, t: "100% Original", d: "Every product is genuine, PTA approved and warranty-backed." },
              { i: BadgeCheck, t: "Fair Pricing", d: "Transparent prices with no hidden charges, ever." },
              { i: Sparkles, t: "Premium Service", d: "From first hello to after-sales support — we go the extra mile." },
              { i: Heart, t: "Customer First", d: "Lifelong relationships matter more than a single sale." },
            ].map((v, i) => (
              <div key={v.t} className="rounded-3xl bg-card border border-border/60 p-6 shadow-soft hover:shadow-elevated hover:-translate-y-1 transition-all animate-fade-up" style={{ animationDelay: `${i * 80}ms` }}>
                <div className="h-12 w-12 rounded-2xl bg-neon-gradient/15 bg-primary/10 flex items-center justify-center text-primary">
                  <v.i className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-display font-bold text-lg">{v.t}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{v.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="relative py-16">
        <div className="mx-auto max-w-4xl px-5 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary/80">Our mission</p>
          <h2 className="mt-2 font-display text-3xl sm:text-4xl font-extrabold tracking-tight">Premium mobile experience, for everyone.</h2>
          <p className="mt-5 text-muted-foreground leading-relaxed text-base sm:text-lg">
            We believe owning a great phone shouldn't be complicated. Our mission is to make premium smartphones, accessories and expert service accessible — backed by trust, transparency and a smile every time you visit.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/mobiles" className="h-12 px-6 rounded-2xl bg-foreground text-background font-semibold inline-flex items-center gap-2 hover:scale-[1.03] active:scale-95 transition-transform shadow-soft">
              Browse Mobiles
            </Link>
            <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noreferrer" className="h-12 px-6 rounded-2xl bg-neon-gradient text-white font-semibold inline-flex items-center gap-2 shadow-neon hover:scale-[1.03] active:scale-95 transition-transform">
              <Phone className="h-4 w-4" /> Talk to Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
