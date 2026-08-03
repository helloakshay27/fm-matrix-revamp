import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  type TooltipProps,
  type LegendProps,
} from "recharts";
import { LineChart as LineChartIcon, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ANALYTICS_PALETTE } from "@/styles/chartPalette";
import { cn } from "@/lib/utils";
import type { ChartInsightTone } from "./PieChartCard";

const INSIGHT_TONE_CLASSES: Record<ChartInsightTone, string> = {
  info: "text-[#2a5f8f]",
  warning: "bg-brand-warning-light text-[#8A5A00]",
  success: "bg-brand-success-bg text-brand-success",
  error: "bg-brand-error-bg text-brand-error",
};

const INSIGHT_TONE_STYLE: Partial<Record<ChartInsightTone, React.CSSProperties>> = {
  info: { backgroundColor: "rgba(var(--color-info-rgb), 0.08)" },
};

function ComboTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-brand-border rounded-md shadow-md px-3 py-2 min-w-[160px]">
      <div className="text-brand-body-5 font-semibold text-brand-text mb-1">{label}</div>
      <div className="flex flex-col gap-1">
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center justify-between gap-4 text-brand-body-5">
            <span className="flex items-center gap-1.5 text-brand-text-light">
              <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: entry.color }} />
              {entry.name}
            </span>
            <span className="font-medium text-brand-text">{entry.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ComboLegend({ payload }: LegendProps) {
  if (!payload?.length) return null;
  return (
    <div className="flex flex-wrap justify-center gap-x-4 gap-y-1.5 mt-2">
      {payload.map((entry) => (
        <span key={entry.value} className="flex items-center gap-1.5 text-brand-body-5 text-brand-text">
          <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: entry.color }} />
          {entry.value}
        </span>
      ))}
    </div>
  );
}

export interface ComboSeriesConfig {
  dataKey: string;
  name: string;
  unit?: string;
}

export interface ComboBarLineChartCardProps {
  title: string;
  subtitle?: string;
  data: Record<string, string | number>[];
  categoryKey: string;
  bar: ComboSeriesConfig;
  line: ComboSeriesConfig;
  insight?: string;
  insightTone?: ChartInsightTone;
  insightVariant?: "banner" | "plain";
  showInfoIcon?: boolean;
  height?: number;
  className?: string;
}

/**
 * Bar + line combo with independent left/right axes — for comparisons of two
 * differently-scaled measures over the same categories (e.g. reply hours vs.
 * resolution days), matching "First Reply vs Resolution Time" in
 * fm_matrix_phase10 (29).html. This is a deliberate, labeled exception to the
 * general single-axis rule: the two measures share no common unit, and each
 * axis is explicitly tied to one series via color + legend, so the reader is
 * never left guessing which scale a mark belongs to.
 */
export function ComboBarLineChartCard({
  title,
  subtitle,
  data,
  categoryKey,
  bar,
  line,
  insight,
  insightTone = "info",
  insightVariant = "banner",
  showInfoIcon = false,
  height = 240,
  className,
}: ComboBarLineChartCardProps) {
  const barColor = ANALYTICS_PALETTE[2];
  const lineColor = ANALYTICS_PALETTE[6];

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
        {data.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-10 text-brand-text-light">
            <LineChartIcon className="w-8 h-8 opacity-40" />
            <span className="text-brand-body-5">No data available</span>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={height}>
            <ComposedChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border-subtle)" />
              <XAxis
                dataKey={categoryKey}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "var(--color-text-light)" }}
              />
              <YAxis
                yAxisId="bar"
                axisLine={false}
                tickLine={false}
                width={32}
                tick={{ fontSize: 11, fill: barColor }}
                label={{ value: bar.unit, angle: -90, position: "insideLeft", fontSize: 10, fill: barColor }}
              />
              <YAxis
                yAxisId="line"
                orientation="right"
                axisLine={false}
                tickLine={false}
                width={32}
                tick={{ fontSize: 11, fill: lineColor }}
                label={{ value: line.unit, angle: 90, position: "insideRight", fontSize: 10, fill: lineColor }}
              />
              <Tooltip content={<ComboTooltip />} />
              <Legend content={<ComboLegend />} />
              <Bar yAxisId="bar" dataKey={bar.dataKey} name={bar.name} fill={barColor} radius={[4, 4, 0, 0]} maxBarSize={28} />
              <Line
                yAxisId="line"
                type="monotone"
                dataKey={line.dataKey}
                name={line.name}
                stroke={lineColor}
                strokeWidth={2}
                dot={{ r: 3, fill: lineColor }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        )}

        {insight && insightVariant === "plain" && (
          <p className="text-brand-body-5 text-brand-green leading-relaxed mt-3">{insight}</p>
        )}
      </CardContent>
    </Card>
  );
}
