import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LabelList,
  Cell,
  ResponsiveContainer,
  type TooltipProps,
  type LegendProps,
} from "recharts";
import { BarChart3, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { ChartInsightTone } from "./PieChartCard";

export interface BarSeriesConfig {
  dataKey: string;
  name: string;
}

const BAR_SERIES_COLORS = ["#9EC8BA", "#8E7BE0", "#DA7756", "#798C5E", "#EDC488"];

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
  /** "banner" (default) = colored callout above the chart. "plain" = small sage text below it. */
  insightVariant?: "banner" | "plain";
  showInfoIcon?: boolean;
  unit?: string;
  /** "vertical" (default) = columns growing up. "horizontal" = rows growing sideways (e.g. category comparisons). */
  orientation?: "vertical" | "horizontal";
  /** Stack all series into one bar per category instead of grouping them side by side. */
  stacked?: boolean;
  /** Override per-bar color by category index instead of by series (only for a single series). */
  categoryColors?: string[];
  /** Override the default per-series color order (only meaningful when series.length > 1). */
  seriesColors?: string[];
  valueDomain?: [number, number];
  valueTicks?: number[];
  /** Override the direct bar label text (e.g. "4/10" instead of the plotted "40%"). */
  labelFormatter?: (value: number, index: number) => string;
  height?: number;
  className?: string;
}

/**
 * Reusable bar-chart card — colors are drawn in a fixed order from the
 * project's brand ANALYTICS_PALETTE (src/styles/chartPalette.ts), never per-value.
 * A single series never shows a legend (the card title already names it), per
 * the comparison charts in fm_matrix_phase10 (29).html.
 */
export function BarChartCard({
  title,
  subtitle,
  data,
  categoryKey,
  series,
  insight,
  insightTone = "info",
  insightVariant = "banner",
  showInfoIcon = false,
  unit,
  orientation = "vertical",
  stacked = false,
  categoryColors,
  seriesColors,
  valueDomain,
  valueTicks,
  labelFormatter,
  height = 220,
  className,
}: BarChartCardProps) {
  const showLegend = series.length > 1;
  const showDirectLabels = data.length <= 6 && !stacked;
  const isHorizontal = orientation === "horizontal";
  const isSingleSeries = series.length === 1 && !stacked;
  const resolvedCategoryColors = isSingleSeries ? categoryColors ?? BAR_SERIES_COLORS : categoryColors;
  const resolvedSeriesColors = seriesColors ?? BAR_SERIES_COLORS;

  const valueAxis = (
    <XAxis
      type={isHorizontal ? "number" : "category"}
      dataKey={isHorizontal ? undefined : categoryKey}
      axisLine={false}
      tickLine={false}
      domain={isHorizontal ? valueDomain ?? [0, "auto"] : undefined}
      ticks={isHorizontal ? valueTicks : undefined}
      tick={{ fontSize: 11, fill: "var(--color-text-light)" }}
      tickFormatter={isHorizontal ? (value: number) => `${value}${unit ?? ""}` : undefined}
    />
  );

  const categoryAxis = (
    <YAxis
      type={isHorizontal ? "category" : "number"}
      dataKey={isHorizontal ? categoryKey : undefined}
      axisLine={false}
      tickLine={false}
      width={isHorizontal ? 140 : 32}
      domain={isHorizontal ? undefined : valueDomain}
      ticks={isHorizontal ? undefined : valueTicks}
      tick={{ fontSize: 11, fill: "var(--color-text-light)" }}
      tickFormatter={isHorizontal ? undefined : (value: number) => `${value}${unit ?? ""}`}
    />
  );

  return (
    <>
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
            <BarChart3 className="w-8 h-8 opacity-40" />
            <span className="text-brand-body-5">No data available</span>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={height}>
            <BarChart
              data={data}
              layout={isHorizontal ? "vertical" : "horizontal"}
              margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
              barGap={4}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                horizontal={!isHorizontal}
                vertical={isHorizontal}
                stroke="var(--color-border-subtle)"
              />
              {valueAxis}
              {categoryAxis}
              <Tooltip cursor={{ fill: "var(--color-primary)", opacity: 0.05 }} content={<BarTooltip unit={unit} />} />
              {showLegend && <Legend content={<BarLegend />} />}
              {series.map((s, seriesIndex) => (
                <Bar
                  key={s.dataKey}
                  dataKey={s.dataKey}
                  name={s.name}
                  fill={resolvedSeriesColors[seriesIndex % resolvedSeriesColors.length]}
                  radius={isHorizontal ? [0, 4, 4, 0] : [4, 4, 0, 0]}
                  maxBarSize={isHorizontal ? 22 : 40}
                  stackId={stacked ? "stack" : undefined}
                >
                  {isSingleSeries
                    ? data.map((_, categoryIndex) => (
                        <Cell
                          key={categoryIndex}
                          fill={resolvedCategoryColors![categoryIndex % resolvedCategoryColors!.length]}
                        />
                      ))
                    : null}
                  {showDirectLabels && labelFormatter && (
                    <LabelList
                      dataKey={s.dataKey}
                      position={isHorizontal ? "right" : "top"}
                      content={(props: { x?: number; y?: number; width?: number; height?: number; value?: number; index?: number }) => {
                        const { x = 0, y = 0, width = 0, height: barHeight = 0, value, index = 0 } = props;
                        const labelX = isHorizontal ? x + width + 4 : x + width / 2;
                        const labelY = isHorizontal ? y + barHeight / 2 + 4 : y - 6;
                        return (
                          <text x={labelX} y={labelY} fontSize={11} fill="var(--color-text)" textAnchor={isHorizontal ? "start" : "middle"}>
                            {labelFormatter(Number(value), index)}
                          </text>
                        );
                      }}
                    />
                  )}
                  {showDirectLabels && !labelFormatter && (
                    <LabelList
                      dataKey={s.dataKey}
                      position={isHorizontal ? "right" : "top"}
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

    {insight && insightVariant === "plain" && (
      <p className="text-brand-body-5 text-brand-green leading-relaxed mt-3">{insight}</p>
    )}
    </>
  );
}
