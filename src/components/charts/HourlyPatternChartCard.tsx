import { ScatterChart, Scatter, XAxis, YAxis, Tooltip, ResponsiveContainer, type TooltipProps } from "recharts";
import { Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { ChartInsightTone } from "./PieChartCard";

export interface HourlyPatternPoint {
  hour: string;
  value: number;
}

const INSIGHT_TONE_CLASSES: Record<ChartInsightTone, string> = {
  info: "text-[#2a5f8f]",
  warning: "bg-brand-warning-light text-[#8A5A00]",
  success: "bg-brand-success-bg text-brand-success",
  error: "bg-brand-error-bg text-brand-error",
};

const INSIGHT_TONE_STYLE: Partial<Record<ChartInsightTone, React.CSSProperties>> = {
  info: { backgroundColor: "rgba(var(--color-info-rgb), 0.08)" },
};

interface PlotPoint {
  x: number;
  y: number;
  hour: string;
  value: number;
}

function bubbleColor(value: number, highThreshold: number, medThreshold: number, colors: { high: string; med: string; low: string }) {
  if (value > highThreshold) return colors.high;
  if (value > medThreshold) return colors.med;
  return colors.low;
}

function HourlyTooltip({ active, payload }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload as PlotPoint;
  return (
    <div className="bg-white border border-brand-border rounded-md shadow-md px-3 py-2 min-w-[100px]">
      <div className="text-brand-body-5 font-semibold text-brand-text">{point.hour}</div>
      <div className="text-brand-body-5 text-brand-text-light">{point.value} responses</div>
    </div>
  );
}

export interface HourlyPatternChartCardProps {
  title: string;
  subtitle?: string;
  data: HourlyPatternPoint[];
  highThreshold?: number;
  medThreshold?: number;
  colors?: { high: string; med: string; low: string };
  insight?: string;
  insightTone?: ChartInsightTone;
  insightVariant?: "banner" | "plain";
  showInfoIcon?: boolean;
  height?: number;
  className?: string;
}

/**
 * Single-row bubble chart along hour-of-day, bubble radius and color both
 * driven by value — mirrors "Response timing — hour of day" in
 * fm_matrix_phase10 (29).html. New chart form: existing scatter card
 * (ScatterTimelineChartCard) plots categorical status across day offsets from
 * "today"; this plots one continuous value across a fixed 24h axis.
 */
export function HourlyPatternChartCard({
  title,
  subtitle,
  data,
  highThreshold = 10,
  medThreshold = 6,
  colors = { high: "#E7848E", med: "#EDC488", low: "#108C72" },
  insight,
  insightTone = "info",
  insightVariant = "banner",
  showInfoIcon = false,
  height = 140,
  className,
}: HourlyPatternChartCardProps) {
  const points: PlotPoint[] = data.map((d, i) => ({ x: i, y: 0, hour: d.hour, value: d.value }));

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
          <div className={cn("rounded-md px-3 py-2 text-brand-body-5 leading-relaxed", INSIGHT_TONE_CLASSES[insightTone])} style={INSIGHT_TONE_STYLE[insightTone]}>
            {insight}
          </div>
        )}
        <CardTitle className="text-brand-body-3 font-semibold text-brand-text">{title}</CardTitle>
        {subtitle && <p className="text-brand-body-5 text-brand-text-light">{subtitle}</p>}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <ScatterChart margin={{ top: 16, right: 12, left: 0, bottom: 0 }}>
            <XAxis
              type="number"
              dataKey="x"
              domain={[-0.5, points.length - 0.5]}
              ticks={points.map((_, i) => i)}
              tickFormatter={(v: number) => points[v]?.hour ?? ""}
              tick={{ fontSize: 10, fill: "var(--color-text-light)" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis type="number" dataKey="y" domain={[-1, 1]} hide />
            <Tooltip content={<HourlyTooltip />} cursor={false} />
            <Scatter
              data={points}
              shape={(props: { cx?: number; cy?: number; payload?: PlotPoint }) => {
                const { cx = 0, cy = 0, payload } = props;
                const value = payload?.value ?? 0;
                return (
                  <circle
                    cx={cx}
                    cy={cy}
                    r={4 + value / 2}
                    fill={bubbleColor(value, highThreshold, medThreshold, colors)}
                  />
                );
              }}
            />
          </ScatterChart>
        </ResponsiveContainer>

        {insight && insightVariant === "plain" && <p className="text-brand-body-5 text-brand-green leading-relaxed mt-3">{insight}</p>}
      </CardContent>
    </Card>
  );
}
