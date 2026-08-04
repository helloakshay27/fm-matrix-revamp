import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, type TooltipProps, type LegendProps } from "recharts";
import { Info, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { ChartInsightTone } from "./PieChartCard";

export interface AreaSeriesConfig {
  dataKey: string;
  name: string;
  color: string;
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

function MultiAreaTooltip({ active, payload, label, unit }: TooltipProps<number, string> & { unit?: string }) {
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

function MultiAreaLegend({ payload }: LegendProps) {
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

export interface MultiAreaTrendChartCardProps {
  title: string;
  subtitle?: string;
  data: Record<string, string | number>[];
  categoryKey: string;
  series: AreaSeriesConfig[];
  unit?: string;
  insight?: string;
  insightTone?: ChartInsightTone;
  insightVariant?: "banner" | "plain";
  showInfoIcon?: boolean;
  height?: number;
  className?: string;
}

/**
 * Multi-series filled trend — mirrors "Monthly Completion Trend" (Completed vs
 * Pending) in fm_matrix_phase10 (29).html. New chart form: AreaTrendChartCard
 * only plots one series; this compares several counts sharing the same axis.
 */
export function MultiAreaTrendChartCard({
  title,
  subtitle,
  data,
  categoryKey,
  series,
  unit,
  insight,
  insightTone = "info",
  insightVariant = "banner",
  showInfoIcon = false,
  height = 200,
  className,
}: MultiAreaTrendChartCardProps) {
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
        {data.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-10 text-brand-text-light">
            <TrendingUp className="w-8 h-8 opacity-40" />
            <span className="text-brand-body-5">No data available</span>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={height}>
            <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <defs>
                {series.map((s) => (
                  <linearGradient key={s.dataKey} id={`multi-area-gradient-${s.dataKey}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={s.color} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={s.color} stopOpacity={0.02} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border-subtle)" />
              <XAxis dataKey={categoryKey} axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "var(--color-text-light)" }} />
              <YAxis axisLine={false} tickLine={false} width={36} tick={{ fontSize: 11, fill: "var(--color-text-light)" }} />
              <Tooltip content={<MultiAreaTooltip unit={unit} />} />
              <Legend content={<MultiAreaLegend />} />
              {series.map((s) => (
                <Area
                  key={s.dataKey}
                  type="monotone"
                  dataKey={s.dataKey}
                  name={s.name}
                  stroke={s.color}
                  strokeWidth={2}
                  fill={`url(#multi-area-gradient-${s.dataKey})`}
                  dot={{ r: 3, fill: s.color }}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        )}

        {insight && insightVariant === "plain" && <p className="text-brand-body-5 text-brand-green leading-relaxed mt-3">{insight}</p>}
      </CardContent>
    </Card>
  );
}
