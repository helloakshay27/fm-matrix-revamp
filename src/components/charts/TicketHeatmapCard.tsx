import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const HEATMAP_COLORS = ["#F6EAEC", "#F0CCD1", "#E7848E", "#C0303D", "#8B0000"];

function colorForValue(value: number, max: number): string {
  if (max <= 0) return HEATMAP_COLORS[0];
  const ratio = value / max;
  const bucket = Math.min(HEATMAP_COLORS.length - 1, Math.floor(ratio * HEATMAP_COLORS.length));
  return HEATMAP_COLORS[bucket];
}

export interface TicketHeatmapCardProps {
  title: string;
  subtitle?: string;
  days: string[];
  hours: number[];
  data: number[][];
  insight?: string;
  className?: string;
}

/**
 * Hour × day ticket-volume heatmap — mirrors the "Ticket volume · hour × day"
 * canvas grid in fm_matrix_phase10 (29).html. Built as a plain CSS grid since
 * no existing chart card covers a calendar-style heatmap.
 */
export function TicketHeatmapCard({
  title,
  subtitle,
  days,
  hours,
  data,
  insight,
  className,
}: TicketHeatmapCardProps) {
  const max = Math.max(1, ...data.flat());

  return (
    <Card className={cn("border-brand-border", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-brand-body-3 font-semibold text-brand-text">{title}</CardTitle>
        {subtitle && <p className="text-brand-body-5 text-brand-text-light">{subtitle}</p>}
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="min-w-[640px]">
            <div
              className="grid gap-[2px] mb-1"
              style={{ gridTemplateColumns: `36px repeat(${hours.length}, minmax(0,1fr))` }}
            >
              <span />
              {hours.map((h) => (
                <span key={h} className="text-[9px] text-brand-text-light text-center">
                  {h % 3 === 0 ? String(h).padStart(2, "0") : ""}
                </span>
              ))}
            </div>
            {days.map((day, dayIdx) => (
              <div
                key={day}
                className="grid gap-[2px] mb-[2px]"
                style={{ gridTemplateColumns: `36px repeat(${hours.length}, minmax(0,1fr))` }}
              >
                <span className="text-brand-body-5 text-brand-text-light flex items-center">{day}</span>
                {data[dayIdx].map((value, hourIdx) => (
                  <div
                    key={hourIdx}
                    title={`${day} ${hours[hourIdx]}:00 · ${value} tickets`}
                    className="aspect-square rounded-sm"
                    style={{ backgroundColor: colorForValue(value, max) }}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-1.5 mt-3 text-brand-caption text-brand-text-light">
          <span>Low</span>
          <div className="flex h-2 w-24 rounded overflow-hidden">
            {HEATMAP_COLORS.map((c) => (
              <div key={c} className="flex-1" style={{ backgroundColor: c }} />
            ))}
          </div>
          <span>High</span>
          <span className="ml-1.5">— ticket volume by day &amp; hour</span>
        </div>

        {insight && <p className="text-brand-body-5 text-brand-green leading-relaxed mt-3">{insight}</p>}
      </CardContent>
    </Card>
  );
}
