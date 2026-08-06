import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type HighlightStatTone = "error" | "warning" | "success" | "info";

const VALUE_TONE_CLASSES: Record<HighlightStatTone, string> = {
  error: "text-brand",
  warning: "text-[#8A5A00]",
  success: "text-brand-success",
  info: "text-brand-info",
};

export interface HighlightStatCardProps {
  title: string;
  subtitle?: string;
  value: string;
  valueCaption?: string;
  tone?: HighlightStatTone;
  description?: string;
  className?: string;
}

/**
 * Callout card — one pinned headline stat top-right, a description
 * paragraph below. Mirrors "Asset value at risk right now" in
 * fm_matrix_phase10 (29).html. No existing card covered a single-stat
 * callout (StatListCard is for label→value/badge rows; StatHeroCard is a
 * compact tinted tile without a description paragraph).
 */
export function HighlightStatCard({
  title,
  subtitle,
  value,
  valueCaption,
  tone = "error",
  description,
  className,
}: HighlightStatCardProps) {
  return (
    <Card className={cn("border-brand-border", className)}>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-brand-body-3 font-bold text-brand-text">{title}</h3>
            {subtitle && <p className="text-brand-body-5 text-brand-text-light mt-0.5">{subtitle}</p>}
          </div>
          <div className="text-right flex-shrink-0">
            <div className={cn("text-brand-h1 font-bold leading-none", VALUE_TONE_CLASSES[tone])}>{value}</div>
            {valueCaption && <div className="text-brand-caption text-brand-text-light mt-1">{valueCaption}</div>}
          </div>
        </div>
        {description && <p className="text-brand-body-5 text-brand-text-light leading-relaxed mt-3">{description}</p>}
      </CardContent>
    </Card>
  );
}
