import { useState } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  type TooltipProps,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ANALYTICS_PALETTE } from "@/styles/chartPalette";

const BAR_SERIES_COLORS = ["#9EC8BA", "#8E7BE0", "#DA7756", "#798C5E", "#EDC488"];

export interface IncidentTrendDatum {
  month: string;
  incidents: number;
}

type ChartType = "line" | "bar";

function TrendTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-brand-border rounded-md shadow-md px-3 py-2 text-brand-body-5">
      <span className="font-semibold text-brand-text">{label}</span>
      <span className="text-brand-text-light"> · {payload[0].value} incidents</span>
    </div>
  );
}

export interface IncidentTrendChartCardProps {
  title: string;
  subtitle?: string;
  data: IncidentTrendDatum[];
  height?: number;
  className?: string;
  /** Called with the clicked month's datum when a bar (Bar view) is clicked. */
  onBarClick?: (datum: IncidentTrendDatum) => void;
}

/**
 * Incident Trend card with a Line/Bar toggle — mirrors the "Incident Trend"
 * chart-card in fm_matrix_phase10 (29).html, which lets the viewer switch
 * chart type via two buttons in the header. Kept as its own component
 * (rather than reusing BarChartCard) because no existing card supports both
 * a filled-area line view and a bar view behind a single toggle.
 */
export function IncidentTrendChartCard({
  title,
  subtitle,
  data,
  height = 220,
  className,
  onBarClick,
}: IncidentTrendChartCardProps) {
  const [chartType, setChartType] = useState<ChartType>("line");

  return (
    <Card className={cn("border-brand-border", className)}>
      <CardHeader className="pb-2 flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle className="text-brand-body-3 font-semibold text-brand-text">{title}</CardTitle>
          {subtitle && <p className="text-brand-body-5 text-brand-green">{subtitle}</p>}
        </div>
        <div className="no-drag flex items-center gap-2 flex-shrink-0">
          <button
            type="button"
            onClick={() => setChartType("line")}
            className={cn(
              "no-drag w-14 rounded-md py-1.5 text-brand-body-5 font-semibold border text-center transition-colors",
              chartType === "line"
                ? "bg-brand text-white border-brand"
                : "bg-white text-brand-green border-brand-border hover:bg-brand hover:text-white"
            )}
          >
            Line
          </button>
          <button
            type="button"
            onClick={() => setChartType("bar")}
            className={cn(
              "no-drag w-14 rounded-md py-1.5 text-brand-body-5 font-semibold border text-center transition-colors",
              chartType === "bar"
                ? "bg-brand text-white border-brand"
                : "bg-white text-brand-green border-brand-border hover:bg-brand hover:text-white"
            )}
          >
            Bar
          </button>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          {chartType === "line" ? (
            <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="incidentTrendFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={ANALYTICS_PALETTE[0]} stopOpacity={0.25} />
                  <stop offset="100%" stopColor={ANALYTICS_PALETTE[0]} stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border-subtle)" />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "var(--color-text-light)" }}
              />
              <YAxis axisLine={false} tickLine={false} width={28} tick={{ fontSize: 11, fill: "var(--color-text-light)" }} />
              <Tooltip content={<TrendTooltip />} />
              <Area
                type="monotone"
                dataKey="incidents"
                stroke={ANALYTICS_PALETTE[0]}
                strokeWidth={2.5}
                fill="url(#incidentTrendFill)"
                dot={{ r: 4, fill: ANALYTICS_PALETTE[0], stroke: "#fff", strokeWidth: 2 }}
                activeDot={{ r: 5 }}
              />
            </AreaChart>
          ) : (
            <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border-subtle)" />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "var(--color-text-light)" }}
              />
              <YAxis axisLine={false} tickLine={false} width={28} tick={{ fontSize: 11, fill: "var(--color-text-light)" }} />
              <Tooltip cursor={{ fill: ANALYTICS_PALETTE[0], opacity: 0.08 }} content={<TrendTooltip />} />
              <Bar
                dataKey="incidents"
                name="Incidents"
                radius={[4, 4, 0, 0]}
                maxBarSize={40}
                cursor={onBarClick ? "pointer" : undefined}
                onClick={(barData) => onBarClick?.(barData as unknown as IncidentTrendDatum)}
              >
                {data.map((_, index) => (
                  <Cell key={index} fill={BAR_SERIES_COLORS[index % BAR_SERIES_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          )}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
