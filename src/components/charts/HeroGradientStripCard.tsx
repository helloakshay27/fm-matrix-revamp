import { cn } from "@/lib/utils";

export interface HeroStripItem {
  label: string;
  value: string;
  subtitle?: string;
}

export interface HeroGradientStripCardProps {
  items: HeroStripItem[];
  /** CSS gradient string — defaults to the terra→sage brand gradient used by the CRM hero strip in fm_matrix_phase10 (29).html */
  gradient?: string;
  className?: string;
}

const DEFAULT_GRADIENT = "linear-gradient(120deg, #B8694A 0%, #DA7756 45%, #798C5E 100%)";

/**
 * Full-width gradient KPI strip — mirrors ".crm-hero"/".crm-hero-item" in
 * fm_matrix_phase10 (29).html. StatHeroCard is a tinted single tile; this is
 * a distinct wide banner of divided cells over one continuous gradient,
 * used as the top-of-module summary row.
 */
export function HeroGradientStripCard({ items, gradient = DEFAULT_GRADIENT, className }: HeroGradientStripCardProps) {
  return (
    <div
      className={cn("rounded-xl px-1 py-3.5 flex flex-wrap", className)}
      style={{ background: gradient }}
    >
      {items.map((item, index) => (
        <div
          key={item.label}
          className={cn(
            "flex-1 min-w-[140px] text-center px-3",
            index !== items.length - 1 && "border-r border-white/20"
          )}
        >
          <div className="text-[8.5px] font-semibold uppercase tracking-wide text-white/80">{item.label}</div>
          <div className="leading-tight mt-1" style={{ color: "#ffffff", fontSize: "18px", fontWeight: 700 }}>
            {item.value}
          </div>
          {item.subtitle && <div className="text-[9px] text-white/70 mt-0.5">{item.subtitle}</div>}
        </div>
      ))}
    </div>
  );
}
