import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, type TooltipProps } from "recharts";
import { Info, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ANALYTICS_PALETTE } from "@/styles/chartPalette";
import { cn } from "@/lib/utils";
import type { ChartInsightTone } from "./PieChartCard";

const INSIGHT_TONE_CLASSES: Record<ChartInsightTone, string> = {
  info: "text-[#2a5f8f]",
  warning: "bg-brand-warning-light text-[#8A5A00]",
  success: "bg-brand-success-bg text-brand-success",
  error: "bg-brand-light text-brand",
};

const INSIGHT_TONE_STYLE: Partial<Record<ChartInsightTone, React.CSSProperties>> = {
  info: { backgroundColor: "rgba(var(--color-info-rgb), 0.08)" },
};

function AreaTooltip({ active, payload, label, unit }: TooltipProps<number, string> & { unit?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-brand-border rounded-md shadow-md px-3 py-2 min-w-[120px]">
      <div className="text-brand-body-5 font-semibold text-brand-text mb-0.5">{label}</div>
      <div className="text-brand-body-5 text-brand-text-light">
        {payload[0].value}
        {unit ?? ""}
      </div>
    </div>
  );
}

export interface AreaTrendChartCardProps {
  title: string;
  subtitle?: string;
  data: Record<string, string | number>[];
  categoryKey: string;
  valueKey: string;
  unit?: string;
  color?: string;
  insight?: string;
  insightTone?: ChartInsightTone;
  insightVariant?: "banner" | "plain";
  showInfoIcon?: boolean;
  height?: number;
  className?: string;
}

/**
 * Single-series filled trend line — mirrors "Monthly AMC Cost Trend" in
 * fm_matrix_phase10 (29).html. New chart form: BarChartCard/ComboBarLineChartCard
 * both center on bars; this is a plain line+area trend with no bar at all.
 */
export function AreaTrendChartCard({
  title,
  subtitle,
  data,
  categoryKey,
  valueKey,
  unit,
  color = ANALYTICS_PALETTE[0],
  insight,
  insightTone = "info",
  insightVariant = "banner",
  showInfoIcon = false,
  height = 200,
  className,
}: AreaTrendChartCardProps) {
  const gradientId = `area-trend-gradient-${valueKey}`;

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
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.35} />
                  <stop offset="95%" stopColor={color} stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border-subtle)" />
              <XAxis dataKey={categoryKey} axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "var(--color-text-light)" }} />
              <YAxis axisLine={false} tickLine={false} width={32} tick={{ fontSize: 11, fill: "var(--color-text-light)" }} />
              <Tooltip content={<AreaTooltip unit={unit} />} />
              <Area type="monotone" dataKey={valueKey} stroke={color} strokeWidth={2} fill={`url(#${gradientId})`} dot={{ r: 4, fill: color }} />
            </AreaChart>
          </ResponsiveContainer>
        )}

        {insight && insightVariant === "plain" && <p className="text-brand-body-5 text-brand-green leading-relaxed mt-3">{insight}</p>}
      </CardContent>
    </Card>
  );
}
