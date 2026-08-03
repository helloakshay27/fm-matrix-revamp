import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LabelList,
  ResponsiveContainer,
  type TooltipProps,
  type LegendProps,
} from "recharts";
import { BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ANALYTICS_PALETTE } from "@/styles/chartPalette";
import { cn } from "@/lib/utils";
import type { ChartInsightTone } from "./PieChartCard";

export interface BarSeriesConfig {
  dataKey: string;
  name: string;
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

function BarTooltip({ active, payload, label, unit }: TooltipProps<number, string> & { unit?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-brand-border rounded-md shadow-md px-3 py-2 min-w-[140px]">
      <div className="text-brand-body-5 font-semibold text-brand-text mb-1">{label}</div>
      <div className="flex flex-col gap-1">
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center justify-between gap-4 text-brand-body-5">
            <span className="flex items-center gap-1.5 text-brand-text-light">
              <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: entry.color }} />
              {entry.name}
            </span>
            <span className="font-medium text-brand-text">
              {entry.value}
              {unit ?? ""}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function BarLegend({ payload }: LegendProps) {
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

export interface BarChartCardProps {
  title: string;
  subtitle?: string;
  data: Record<string, string | number>[];
  categoryKey: string;
  series: BarSeriesConfig[];
  insight?: string;
  insightTone?: ChartInsightTone;
  unit?: string;
  height?: number;
  className?: string;
}

/**
 * Reusable column bar-chart card — colors are drawn in a fixed order from the
 * project's brand ANALYTICS_PALETTE (src/styles/chartPalette.ts), never per-value.
 * A single series never shows a legend (the card title already names it), per
 * multi-series comparisons in fm_matrix_phase10 (29).html.
 */
export function BarChartCard({
  title,
  subtitle,
  data,
  categoryKey,
  series,
  insight,
  insightTone = "info",
  unit,
  height = 220,
  className,
}: BarChartCardProps) {
  const showLegend = series.length > 1;
  const showDirectLabels = data.length <= 6;

  return (
    <Card className={cn("border-brand-border", className)}>
      <CardHeader className="pb-2">
        {insight && (
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
            <BarChart3 className="w-8 h-8 opacity-40" />
            <span className="text-brand-body-5">No data available</span>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={height}>
            <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border-subtle)" />
              <XAxis
                dataKey={categoryKey}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "var(--color-text-light)" }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                width={32}
                tick={{ fontSize: 11, fill: "var(--color-text-light)" }}
                tickFormatter={(value) => `${value}${unit ?? ""}`}
              />
              <Tooltip cursor={{ fill: "var(--color-primary)", opacity: 0.05 }} content={<BarTooltip unit={unit} />} />
              {showLegend && <Legend content={<BarLegend />} />}
              {series.map((s, index) => (
                <Bar
                  key={s.dataKey}
                  dataKey={s.dataKey}
                  name={s.name}
                  fill={ANALYTICS_PALETTE[index % ANALYTICS_PALETTE.length]}
                  radius={[4, 4, 0, 0]}
                  maxBarSize={40}
                >
                  {showDirectLabels && (
                    <LabelList
                      dataKey={s.dataKey}
                      position="top"
                      formatter={(value: number) => `${value}${unit ?? ""}`}
                      style={{ fontSize: 11, fill: "var(--color-text)" }}
                    />
                  )}
                </Bar>
              ))}
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
