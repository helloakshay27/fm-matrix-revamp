import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const TILE_BG_COLORS = ["#EFEFFB", "#B7DCD44D", "#E3909026", "#85BDF633", "#EFEFFB"];

export interface StatusSummaryMetric {
  label: string;
  value: string;
  color: string;
}

export interface StatusSummaryCardProps {
  title: string;
  metrics: StatusSummaryMetric[];
  progress: number;
  progressColor: string;
  caption: string;
  captionColor?: string;
  onClick?: () => void;
  className?: string;
}

/**
 * Title + 4-metric mini grid + progress bar + caption — mirrors the In-House
 * / OEM checklist summary cards in fm_matrix_phase10 (29).html. New shape:
 * no existing card combines a metric grid with a progress track underneath.
 */
export function StatusSummaryCard({
  title,
  metrics,
  progress,
  progressColor,
  caption,
  captionColor,
  onClick,
  className,
}: StatusSummaryCardProps) {
  return (
    <Card className={cn("border-brand-border h-full", onClick && "cursor-pointer", className)} onClick={onClick}>
      <CardHeader className="pb-2">
        <h3 className="text-brand-body-3 font-semibold text-brand-text">{title}</h3>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {metrics.map((metric, index) => (
            <div
              key={metric.label}
              className="text-center p-2 rounded-lg"
              style={{ backgroundColor: TILE_BG_COLORS[index % TILE_BG_COLORS.length] }}
            >
              <div className="text-brand-h2 font-bold" style={{ color: metric.color }}>
                {metric.value}
              </div>
              <div className="text-brand-caption text-black mt-1">{metric.label}</div>
            </div>
          ))}
        </div>
        <div className="h-1.5 bg-brand-bg rounded-full mt-3 overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{ width: `${Math.min(100, Math.max(0, progress))}%`, backgroundColor: progressColor }}
          />
        </div>
        <p className="text-brand-body-5 mt-1.5" style={{ color: captionColor ?? progressColor }}>
          {caption}
        </p>
      </CardContent>
    </Card>
  );
}
