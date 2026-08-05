import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceLine,
  Tooltip,
  ResponsiveContainer,
  type TooltipProps,
} from "recharts";
import { Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { ChartInsightTone } from "./PieChartCard";

export interface TimelinePoint {
  day: number;
  status: string;
}

export interface TimelineLane {
  label: string;
  points: TimelinePoint[];
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

interface FlatPoint {
  day: number;
  laneY: number;
  status: string;
}

function TimelineTooltip({ active, payload, lanes }: TooltipProps<number, string> & { lanes: TimelineLane[] }) {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload as FlatPoint;
  const dayLabel = point.day === 0 ? "Today" : point.day > 0 ? `+${point.day}d` : `${Math.abs(point.day)}d ago`;
  return (
    <div className="bg-white border border-brand-border rounded-md shadow-md px-3 py-2 min-w-[140px]">
      <div className="text-brand-body-5 font-semibold text-brand-text">{dayLabel}</div>
      {lanes.length > 1 && <div className="text-brand-body-5 text-brand-text-light">{lanes[point.laneY]?.label}</div>}
      <div className="text-brand-body-5 text-brand-text-light capitalize">{point.status}</div>
    </div>
  );
}

export interface ScatterTimelineChartCardProps {
  title: string;
  subtitle?: string;
  lanes: TimelineLane[];
  domain: [number, number];
  ticks?: number[];
  statusColors: Record<string, string>;
  statusLabels?: Record<string, string>;
  annotation?: { text: string; tone: ChartInsightTone };
  insight?: string;
  insightTone?: ChartInsightTone;
  insightVariant?: "banner" | "plain";
  showInfoIcon?: boolean;
  height?: number;
  className?: string;
}

/**
 * Swimlane scatter timeline with a "today" reference line — mirrors
 * "AMC contract expiry timeline" / "Expiry urgency vs asset criticality" in
 * fm_matrix_phase10 (29).html. New chart form: no existing card plots dated
 * points relative to "now" across one or more category rows.
 */
export function ScatterTimelineChartCard({
  title,
  subtitle,
  lanes,
  domain,
  ticks,
  statusColors,
  statusLabels,
  annotation,
  insight,
  insightTone = "info",
  insightVariant = "banner",
  showInfoIcon = false,
  height = 180,
  className,
}: ScatterTimelineChartCardProps) {
  const statuses = Object.keys(statusColors);
  const flatByStatus: Record<string, FlatPoint[]> = {};
  statuses.forEach((s) => (flatByStatus[s] = []));
  lanes.forEach((lane, laneY) => {
    lane.points.forEach((p) => {
      flatByStatus[p.status]?.push({ day: p.day, laneY, status: p.status });
    });
  });

  const tickFormatter = (day: number) => (day === 0 ? "today" : day > 0 ? `+${day}d` : `${Math.abs(day)}d ago`);

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
            className={cn("rounded-md px-3 py-2 text-brand-body-5 leading-relaxed", INSIGHT_TONE_CLASSES[insightTone])}
            style={INSIGHT_TONE_STYLE[insightTone]}
          >
            {insight}
          </div>
        )}
        <CardTitle className="text-brand-body-3 font-semibold text-brand-text">{title}</CardTitle>
        {subtitle && <p className="text-brand-body-5 text-brand-text-light">{subtitle}</p>}
      </CardHeader>
      <CardContent>
        {annotation && (
          <div
            className={cn(
              "text-brand-body-5 font-bold mb-1",
              annotation.tone === "error" && "text-brand-error",
              annotation.tone === "warning" && "text-[#8A5A00]",
              annotation.tone === "success" && "text-brand-success",
              annotation.tone === "info" && "text-[#2a5f8f]"
            )}
          >
            {annotation.text}
          </div>
        )}
        <ResponsiveContainer width="100%" height={height}>
          <ScatterChart margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-subtle)" />
            <XAxis
              type="number"
              dataKey="day"
              domain={domain}
              ticks={ticks}
              tickFormatter={tickFormatter}
              tick={{ fontSize: 11, fill: "var(--color-text-light)" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              type="number"
              dataKey="laneY"
              domain={[-0.5, lanes.length - 0.5]}
              ticks={lanes.length > 1 ? lanes.map((_, i) => i) : []}
              tickFormatter={(v: number) => lanes[v]?.label ?? ""}
              tick={{ fontSize: 11, fill: "var(--color-text)" }}
              axisLine={false}
              tickLine={false}
              width={lanes.length > 1 ? 80 : 0}
              reversed
            />
            <ReferenceLine x={0} stroke="var(--color-text)" strokeWidth={1.5} label={{ value: "today", position: "top", fontSize: 10, fill: "var(--color-text)" }} />
            <Tooltip content={<TimelineTooltip lanes={lanes} />} cursor={{ strokeDasharray: "3 3" }} />
            {statuses.map((status) => (
              <Scatter key={status} data={flatByStatus[status]} fill={statusColors[status]} />
            ))}
          </ScatterChart>
        </ResponsiveContainer>
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1.5 mt-2">
          {statuses.map((status) => (
            <span key={status} className="flex items-center gap-1.5 text-brand-body-5 text-brand-text">
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: statusColors[status] }} />
              {statusLabels?.[status] ?? status}
            </span>
          ))}
        </div>

        {insight && insightVariant === "plain" && (
          <p className="text-brand-body-5 text-brand-green leading-relaxed mt-3">{insight}</p>
        )}
      </CardContent>
    </Card>
  );
}
