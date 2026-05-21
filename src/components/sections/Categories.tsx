import * as Icons from "lucide-react";
import { Link } from "@tanstack/react-router";
import { CATEGORIES } from "@/lib/site-data";
import { ArrowRight } from "lucide-react";

export function Categories() {
  return (
    <section className="relative py-14">
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeader eyebrow="Browse" title="Shop by Category" subtitle="Tap any category to view products" />
        <div className="mt-8 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-10 gap-3">
          {CATEGORIES.map((c, i) => {
            const Icon = (Icons as any)[c.icon] || Icons.Package;
            return (
              <Link
                key={c.slug}
                to="/category/$slug"
                params={{ slug: c.slug }}
                className="group relative flex flex-col items-center gap-2 rounded-2xl bg-card border border-border/60 p-3 hover:border-primary/30 hover:-translate-y-1 transition-all duration-300 shadow-soft animate-fade-up"
                style={{ animationDelay: `${i * 25}ms` }}
              >
                <div className="absolute inset-0 rounded-2xl bg-neon-gradient opacity-0 group-hover:opacity-10 transition-opacity" />
                <div className="relative h-12 w-12 rounded-xl bg-gradient-to-br from-primary/8 to-neon/15 flex items-center justify-center text-primary group-hover:bg-neon-gradient group-hover:text-white group-hover:shadow-neon transition-all">
                  <Icon className="h-5 w-5" strokeWidth={2} />
                </div>
                <span className="text-[11px] font-semibold text-center leading-tight">{c.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function SectionHeader({ eyebrow, title, subtitle, link, to, search }: { eyebrow?: string; title: string; subtitle?: string; link?: string; to?: string; search?: any }) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        {eyebrow && <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary/80">{eyebrow}</p>}
        <h2 className="mt-1.5 font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">{title}</h2>
        {subtitle && <p className="mt-1.5 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {link && (
        to ? (
          <Link to={to} search={search} className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-primary hover:gap-2 transition-all">
            {link} <ArrowRight className="h-4 w-4" />
          </Link>
        ) : (
          <button className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-primary hover:gap-2 transition-all">
            {link} <ArrowRight className="h-4 w-4" />
          </button>
        )
      )}
    </div>
  );
}
