import { PieChart as PieChartIcon, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { VEDA_PIE_PALETTE } from "@/styles/vedaTheme";

/** Same geometry as the Veda HTML donut: r=54, 10px stroke, 2px gap, first slice at 12 o'clock. */
const DONUT_R = 54;
const DONUT_C = 2 * Math.PI * DONUT_R;
const DONUT_GAP = 2;

export interface PieChartDatum {
  name: string;
  value: number;
}

export type ChartInsightTone = "info" | "warning" | "success" | "error";

const INSIGHT_TONE_CLASSES: Record<ChartInsightTone, string> = {
  info: "text-[#2a5f8f]",
  warning: "bg-brand-warning-light text-[#8A5A00]",
  success: "bg-brand-success-bg text-brand-success",
  error: "bg-brand-error-bg text-brand-error",
};

const INSIGHT_TONE_STYLE: Partial<Record<ChartInsightTone, React.CSSProperties>> = {
  info: { backgroundColor: "rgba(var(--color-info-rgb), 0.08)" },
};

interface DonutSlice {
  name: string;
  value: number;
  color: string;
  seg: number;
  dashOffset: number;
}

function buildSlices(data: PieChartDatum[], total: number): DonutSlice[] {
  let offset = 0;
  return data.map((d, index) => {
    const len = total > 0 ? (d.value / total) * DONUT_C : 0;
    const slice: DonutSlice = {
      name: d.name,
      value: d.value,
      color: VEDA_PIE_PALETTE[index % VEDA_PIE_PALETTE.length],
      seg: Math.max(len - DONUT_GAP, 0.5),
      dashOffset: -offset,
    };
    offset += len;
    return slice;
  });
}

function DonutRing({ slices, centerLabel }: { slices: DonutSlice[]; centerLabel?: string }) {
  return (
    <div className="relative h-40 w-40 shrink-0">
      <svg viewBox="0 0 140 140" className="h-full w-full -rotate-90">
        <circle cx="70" cy="70" r={DONUT_R} fill="none" stroke="#FFFFFF" strokeWidth="10" />
        {slices.map((slice) => (
          <circle
            key={slice.name}
            cx="70"
            cy="70"
            r={DONUT_R}
            fill="none"
            stroke={slice.color}
            strokeWidth="10"
            strokeDasharray={`${slice.seg} ${DONUT_C - slice.seg}`}
            strokeDashoffset={slice.dashOffset}
          >
            <title>
              {slice.name}: {slice.value.toLocaleString()}
            </title>
          </circle>
        ))}
      </svg>
      {centerLabel && (
        <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
          <div>
            <div className="text-brand-h2 font-bold text-brand-text">{centerLabel}</div>
            <div className="text-brand-caption text-brand-text-light">Total</div>
          </div>
        </div>
      )}
    </div>
  );
}

export interface PieChartCardProps {
  title: string;
  subtitle?: string;
  data: PieChartDatum[];
  insight?: string;
  insightTone?: ChartInsightTone;
  /** "banner" (default) = colored callout above the chart. "plain" = small sage text below it. */
  insightVariant?: "banner" | "plain";
  centerLabel?: string;
  /** "bottom" (default) renders the recharts legend under the donut. "right" renders a
   * value+percent stat list beside it, matching the "Ticket pool composition" panel. */
  legendPosition?: "bottom" | "right";
  /** Accepted for callers. Slice colour is always the Veda palette by index. */
  colors?: string[];
  showInfoIcon?: boolean;
  /** Kept so existing callers compile. Ring size is the Veda donut (160px, 10px stroke). */
  innerRadius?: string | number;
  outerRadius?: string | number;
  height?: number;
  className?: string;
}

/**
 * Reusable donut/pie chart card — colors are drawn in a fixed order from the
 * project's brand ANALYTICS_PALETTE (src/styles/chartPalette.ts), never per-value.
 * Modeled on the "chart-card" pattern used throughout fm_matrix_phase10 (29).html.
 */
export function PieChartCard({
  title,
  subtitle,
  data,
  insight,
  insightTone = "info",
  insightVariant = "banner",
  centerLabel,
  legendPosition = "bottom",
  showInfoIcon = false,
  className,
}: PieChartCardProps) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  const nonZeroData = data.filter((d) => d.value > 0);
  const slices = buildSlices(nonZeroData, total);

  const donut = <DonutRing slices={slices} centerLabel={centerLabel} />;

  return (
    <Card className={cn("border-brand-border relative veda-donut", className)}>
      {showInfoIcon && (
        <button
          type="button"
          aria-label="How this is calculated"
          className="absolute top-4 right-4 w-[18px] h-[18px] rounded-full border border-brand-green/60 bg-brand-bg flex items-center justify-center text-brand-green z-10"
        >
          <Info className="w-3 h-3" />
        </button>
      )}
      <CardHeader className="pb-2">
        {insight && insightVariant === "banner" && (
          <div
            className={cn(
              "rounded-md px-3 py-2 text-brand-body-5 leading-relaxed",
              INSIGHT_TONE_CLASSES[insightTone]
            )}
            style={INSIGHT_TONE_STYLE[insightTone]}
          >
            {insight}
          </div>
        )}
        <CardTitle className="text-brand-body-3 font-semibold text-brand-text">{title}</CardTitle>
        {subtitle && <p className="text-brand-body-5 text-brand-text-light">{subtitle}</p>}
      </CardHeader>
      <CardContent>
        {data.length === 0 || total === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-10 text-brand-text-light">
            <PieChartIcon className="w-8 h-8 opacity-40" />
            <span className="text-brand-body-5">No data available</span>
          </div>
        ) : legendPosition === "right" ? (
          <div className="grid grid-cols-[auto_1fr] items-center gap-7">
            {donut}
            <div className="min-w-0">
              {slices.map((d, index) => {
                const percent = total > 0 ? Math.round((d.value / total) * 100) : 0;
                return (
                  <div
                    key={d.name}
                    className={cn(
                      "grid grid-cols-[12px_minmax(0,1fr)_36px_44px] items-center gap-2 py-[7px] text-[12.5px]",
                      index < slices.length - 1 && "border-b border-[rgba(26,26,24,0.06)]"
                    )}
                  >
                    <span className="h-2 w-2 rounded-[2px]" style={{ background: d.color }} />
                    <span className="truncate text-brand-text">{d.name}</span>
                    <span className="text-right font-bold tabular-nums text-brand-text">
                      {d.value.toLocaleString()}
                    </span>
                    <span className="veda-dl-pct text-right text-[11.5px] text-brand-text-light">{percent}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div>
            <div className="flex justify-center">{donut}</div>
            <div className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1.5">
              {slices.map((d) => (
                <span key={d.name} className="flex items-center gap-1.5 text-[11.5px] text-brand-text">
                  <span className="h-2 w-2 rounded-[2px]" style={{ background: d.color }} />
                  {d.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {insight && insightVariant === "plain" && (
          <p className="text-brand-body-5 text-brand-green leading-relaxed mt-3">{insight}</p>
        )}
      </CardContent>
    </Card>
  );
}
