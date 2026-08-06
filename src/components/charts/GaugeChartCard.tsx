import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { ChartInsightTone } from "./PieChartCard";

export interface GaugeSegment {
  value: number;
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

export interface GaugeChartCardProps {
  title: string;
  subtitle?: string;
  /** Ordered arc segments (e.g. acceptable / caution / critical bands). */
  segments: GaugeSegment[];
  centerValue: string;
  centerLabel?: string;
  insight?: string;
  insightTone?: ChartInsightTone;
  insightVariant?: "banner" | "plain";
  showInfoIcon?: boolean;
  height?: number;
  className?: string;
}

/**
 * Semicircle gauge — mirrors the canvas gauges (e.g. "asset_breakdown_gauge")
 * in fm_matrix_phase10 (29).html. New chart form; no existing card covered
 * a half-donut band + center readout.
 */
export function GaugeChartCard({
  title,
  subtitle,
  segments,
  centerValue,
  centerLabel = "Total",
  insight,
  insightTone = "info",
  insightVariant = "banner",
  showInfoIcon = false,
  height = 200,
  className,
}: GaugeChartCardProps) {
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
        <div className="relative" style={{ height }}>
          <ResponsiveContainer width="100%" height={height}>
            <PieChart>
              <Pie
                data={segments}
                dataKey="value"
                cx="50%"
                cy="100%"
                startAngle={180}
                endAngle={0}
                innerRadius="65%"
                outerRadius="100%"
                stroke="none"
              >
                {segments.map((s, index) => (
                  <Cell key={index} fill={s.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-x-0 bottom-0 flex flex-col items-center pointer-events-none">
            <span className="text-brand-h1 font-bold text-brand-text leading-none">{centerValue}</span>
            <span className="text-brand-caption text-brand-text-light mt-1">{centerLabel}</span>
          </div>
        </div>

        {insight && insightVariant === "plain" && (
          <p className="text-brand-body-5 text-brand-green leading-relaxed mt-3">{insight}</p>
        )}
      </CardContent>
    </Card>
  );
}
