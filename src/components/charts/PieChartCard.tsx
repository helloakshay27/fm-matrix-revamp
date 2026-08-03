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
import { PieChart as PieChartIcon } from "lucide-react";
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
  centerLabel?: string;
  height?: number;
  className?: string;
}

/**
 * Reusable donut/pie chart card — colors are drawn in a fixed order from the
 * project's brand ANALYTICS_PALETTE (src/styles/chartPalette.ts), never per-value.
 * Modeled on the "chart-card" + insight-callout pattern used throughout
 * fm_matrix_phase10 (29).html.
 */
export function PieChartCard({
  title,
  subtitle,
  data,
  insight,
  insightTone = "info",
  centerLabel,
  height = 240,
  className,
}: PieChartCardProps) {
  const total = data.reduce((sum, d) => sum + d.value, 0);

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
        {data.length === 0 || total === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-10 text-brand-text-light">
            <PieChartIcon className="w-8 h-8 opacity-40" />
            <span className="text-brand-body-5">No data available</span>
          </div>
        ) : (
          <div className="relative">
            <ResponsiveContainer width="100%" height={height}>
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  innerRadius="58%"
                  outerRadius="85%"
                  paddingAngle={2}
                  strokeWidth={2}
                  stroke="var(--color-card-white)"
                  label={({ percent }) =>
                    percent && percent >= 0.08 ? `${Math.round(percent * 100)}%` : ""
                  }
                  labelLine={false}
                >
                  {data.map((_, index) => (
                    <Cell key={index} fill={ANALYTICS_PALETTE[index % ANALYTICS_PALETTE.length]} />
                  ))}
                </Pie>
                <Tooltip content={<PieTooltip total={total} />} />
                <Legend content={<PieLegend />} />
              </PieChart>
            </ResponsiveContainer>
            {centerLabel && (
              <div
                className="absolute inset-x-0 top-0 flex items-center justify-center pointer-events-none"
                style={{ height: height - 40 }}
              >
                <span className="text-brand-h2 font-bold text-brand-text">{centerLabel}</span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
