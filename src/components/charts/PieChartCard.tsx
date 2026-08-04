import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  type TooltipProps,
  type LegendProps,
} from "recharts";
import { PieChart as PieChartIcon, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ANALYTICS_PALETTE } from "@/styles/chartPalette";
import { cn } from "@/lib/utils";

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

interface PieTooltipPayloadItem {
  name: string;
  value: number;
  color: string;
}

function PieTooltip({ active, payload, total }: TooltipProps<number, string> & { total: number }) {
  if (!active || !payload?.length) return null;
  const item = payload[0] as unknown as PieTooltipPayloadItem;
  const percent = total > 0 ? Math.round((item.value / total) * 100) : 0;
  return (
    <div className="bg-white border border-brand-border rounded-md shadow-md px-3 py-2 min-w-[140px]">
      <div className="flex items-center gap-2 text-brand-body-4 font-medium text-brand-text">
        <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: item.color }} />
        {item.name}
      </div>
      <div className="text-brand-body-5 text-brand-text-light mt-0.5">
        {item.value.toLocaleString()} ({percent}%)
      </div>
    </div>
  );
}

function PieLegend({ payload }: LegendProps) {
  if (!payload?.length) return null;
  return (
    <div className="flex flex-wrap justify-center gap-x-4 gap-y-1.5 mt-3">
      {payload.map((entry) => (
        <span key={entry.value} className="flex items-center gap-1.5 text-brand-body-5 text-brand-text">
          <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: entry.color }} />
          {entry.value}
        </span>
      ))}
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
  /** Override the default ANALYTICS_PALETTE-by-index colors — use when slices carry a
   * fixed status meaning (e.g. In Use/Breakdown/Allocated) rather than an arbitrary category. */
  colors?: string[];
  showInfoIcon?: boolean;
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
  colors,
  showInfoIcon = false,
  height = 240,
  className,
}: PieChartCardProps) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  const palette = colors ?? ANALYTICS_PALETTE;
  const coloredData = data.map((d, index) => ({
    ...d,
    color: palette[index % palette.length],
  }));

  const donut = (
    <div className="relative" style={{ height, width: legendPosition === "right" ? 180 : "100%" }}>
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={coloredData}
            dataKey="value"
            nameKey="name"
            innerRadius="58%"
            outerRadius="85%"
            paddingAngle={2}
            strokeWidth={2}
            stroke="var(--color-card-white)"
            label={({ percent }) => (percent && percent >= 0.08 ? `${Math.round(percent * 100)}%` : "")}
            labelLine={false}
          >
            {coloredData.map((d, index) => (
              <Cell key={index} fill={d.color} />
            ))}
          </Pie>
          <Tooltip content={<PieTooltip total={total} />} />
          {legendPosition === "bottom" && <Legend content={<PieLegend />} />}
        </PieChart>
      </ResponsiveContainer>
      {centerLabel && (
        <div
          className="absolute inset-x-0 top-0 flex items-center justify-center pointer-events-none"
          style={{ height: legendPosition === "bottom" ? height - 40 : height }}
        >
          <div className="text-center">
            <div className="text-brand-h2 font-bold text-brand-text">{centerLabel}</div>
            <div className="text-brand-caption text-brand-text-light">Total</div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <Card className={cn("border-brand-border relative", className)}>
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
          <div className="grid grid-cols-[auto_1fr] gap-4 items-center">
            {donut}
            <div>
              {coloredData.map((d, index) => {
                const percent = total > 0 ? ((d.value / total) * 100).toFixed(1) : "0";
                return (
                  <div
                    key={d.name}
                    className={cn(
                      "flex items-center justify-between py-2 text-brand-body-4",
                      index < coloredData.length - 1 && "border-b border-brand-border"
                    )}
                  >
                    <span className="flex items-center gap-2 text-brand-text">
                      <span className="w-2 h-2 rounded-sm flex-shrink-0" style={{ background: d.color }} />
                      {d.name}
                    </span>
                    <span className="font-bold text-brand-text">
                      {d.value.toLocaleString()} · {percent}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          donut
        )}

        {insight && insightVariant === "plain" && (
          <p className="text-brand-body-5 text-brand-green leading-relaxed mt-3">{insight}</p>
        )}
      </CardContent>
    </Card>
  );
}
