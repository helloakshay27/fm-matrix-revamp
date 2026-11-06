import { cn } from "@/lib/utils";

export interface HeroStripItem {
  label: string;
  value: string;
  subtitle?: string;
}

export interface HeroGradientStripCardProps {
  items: HeroStripItem[];
  /** Kept so existing callers compile. The strip is the Veda Gardens KPI band: grey fill, ink type, hairline dividers. */
  gradient?: string;
  className?: string;
}

/**
 * Full-width KPI strip for the CRM overview. Layout matches the phase 10
 * ".crm-hero" row; colour matches the Veda Gardens ".kpis" band — grey card,
 * ink numbers, colour reserved for status pills elsewhere.
 */
export function HeroGradientStripCard({ items, className }: HeroGradientStripCardProps) {
  return (
    <div
      className={cn("flex h-full flex-wrap items-stretch rounded-2xl", className)}
      style={{ background: "#F5F4F0" }}
    >
      {items.map((item, index) => (
        <div
          key={item.label}
          className="flex min-w-[140px] flex-1 flex-col justify-center px-5 py-3 text-center"
          style={index === 0 ? undefined : { borderLeft: "1px solid rgba(26,26,24,0.06)" }}
        >
          <div className="text-[11.5px]" style={{ color: "rgba(26,26,24,0.68)" }}>
            {item.label}
          </div>
          <div
            className="mt-0.5 leading-tight"
            style={{ color: "#1A1A18", fontSize: "20px", fontWeight: 600, letterSpacing: "-0.01em" }}
          >
            {item.value}
          </div>
          {item.subtitle && (
            <div className="mt-0.5 text-[11.5px]" style={{ color: "rgba(26,26,24,0.48)" }}>
              {item.subtitle}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
