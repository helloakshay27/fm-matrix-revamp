import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  ReferenceLine,
  Tooltip,
  Cell,
  ResponsiveContainer,
  type TooltipProps,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface PermitTimelinePoint {
  /** Days ago the permit was raised/expired — 0 = today, positive = in the past. */
  daysAgo: number;
  status: "Expired" | "Draft" | "Open";
}

const STATUS_COLORS: Record<PermitTimelinePoint["status"], string> = {
  Expired: "#E7848E",
  Draft: "#EDC488",
  Open: "#6B9BCC",
};

function TimelineTooltip({ active, payload }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload as PermitTimelinePoint;
  return (
    <div className="bg-white border border-brand-border rounded-md shadow-md px-3 py-2 text-brand-body-5">
      <span className="font-semibold text-brand-text">{point.status}</span>
      <span className="text-brand-text-light"> · {point.daysAgo}d ago</span>
    </div>
  );
}

export interface PermitTimelineChartCardProps {
  title: string;
  subtitle?: string;
  data: PermitTimelinePoint[];
  insight?: string;
  height?: number;
  className?: string;
}

/**
 * Scatter timeline — mirrors "Permit age timeline" canvas in
 * fm_matrix_phase10 (29).html: dots plotted by days-ago with a vertical
 * "today" reference line, colored by permit status.
 */
export function PermitTimelineChartCard({
  title,
  subtitle,
  data,
  insight,
  height = 180,
  className,
}: PermitTimelineChartCardProps) {
  const jittered = data.map((d, i) => ({ ...d, jitter: (i % 5) - 2 }));

  return (
    <>
      <Card className={cn("border-brand-border", className)}>
        <CardHeader className="pb-2">
          <CardTitle className="text-brand-body-3 font-semibold text-brand-text">{title}</CardTitle>
          {subtitle && <p className="text-brand-body-5 text-brand-text-light">{subtitle}</p>}
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={height}>
            <ScatterChart margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
              <XAxis
                type="number"
                dataKey="daysAgo"
                reversed
                domain={[-20, 200]}
                ticks={[200, 150, 100, 50, 0]}
                tickFormatter={(v: number) => (v <= 0 ? (v === 0 ? "today" : `${-v}d ago`) : `${v}d ago`)}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "var(--color-text-light)" }}
              />
              <YAxis type="number" dataKey="jitter" domain={[-3, 3]} hide />
              <ZAxis range={[60, 60]} />
              <ReferenceLine x={0} stroke="var(--color-text)" strokeWidth={2} />
              <Tooltip content={<TimelineTooltip />} cursor={{ strokeDasharray: "3 3" }} />
              <Scatter data={jittered} dataKey="jitter">
                {jittered.map((d, i) => (
                  <Cell key={i} fill={STATUS_COLORS[d.status]} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {insight && <p className="text-brand-body-5 text-brand-green leading-relaxed mt-3">{insight}</p>}
    </>
  );
}
