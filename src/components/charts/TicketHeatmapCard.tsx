import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// Brand-coral intensity scale (matches --color-primary #DA7756), with zero
// treated as a distinct neutral "no events" state rather than the lightest
// heat color.
const HEATMAP_ZERO_COLOR = "#E3E1D9";
const HEATMAP_LEGEND = [
  { color: HEATMAP_ZERO_COLOR, label: "No tickets" },
  { color: "#F8E3DA", label: "Light" },
  { color: "#EFBBA1", label: "Moderate" },
  { color: "#DA7756", label: "Busiest" },
];
const HEATMAP_COLORS = HEATMAP_LEGEND.slice(1).map((s) => s.color);

function colorForValue(value: number, max: number): string {
  if (value <= 0 || max <= 0) return HEATMAP_ZERO_COLOR;
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
                {(data[dayIdx] ?? []).map((value, hourIdx) => (
                  <div
                    key={hourIdx}
                    title={`${day} ${hours[hourIdx]}:00 · ${value} tickets`}
                    className="aspect-square rounded-md"
                    style={{ backgroundColor: colorForValue(value, max) }}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mt-3">
          {HEATMAP_LEGEND.map((item) => (
            <div key={item.label} className="flex items-center gap-2 text-brand-caption text-brand-text-light">
              <span className="h-4 w-4 rounded-md flex-shrink-0" style={{ backgroundColor: item.color }} />
              {item.label}
            </div>
          ))}
        </div>

        {insight && <p className="text-brand-body-5 text-brand-green leading-relaxed mt-3">{insight}</p>}
      </CardContent>
    </Card>
  );
}
