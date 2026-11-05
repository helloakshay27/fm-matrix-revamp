import { useState } from "react";
import { createPortal } from "react-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// Grey intensity scale — light to dark, never black. "No tickets" is the lightest neutral so it still
// reads as a distinct "nothing here" state. (The previous coral #DA7756 for the busiest cells was being
// recoloured purple by the dashboard theme's legacy-colour remap, so this scale avoids that hex.)
const HEATMAP_ZERO_COLOR = "#ECEBE6";
const HEATMAP_LEGEND = [
  { color: HEATMAP_ZERO_COLOR, label: "No tickets" },
  { color: "#D9D7D0", label: "Light" },
  { color: "#B5B3AB", label: "Moderate" },
  { color: "#7E7C75", label: "Busiest" },
];
const HEATMAP_COLORS = HEATMAP_LEGEND.slice(1).map((s) => s.color);

function colorForValue(value: number, max: number): string {
  if (value <= 0 || max <= 0) return HEATMAP_ZERO_COLOR;
  const ratio = value / max;
  const bucket = Math.min(HEATMAP_COLORS.length - 1, Math.floor(ratio * HEATMAP_COLORS.length));
  return HEATMAP_COLORS[bucket];
}

// Hover tooltip: soft greys instead of the browser's near-black native tooltip. Portalled to <body>
// (the grid cards are CSS-transformed, which would break a fixed-position tooltip inside them), so it
// uses literal colours rather than theme variables.
const TOOLTIP_STYLE: React.CSSProperties = {
  position: "fixed",
  zIndex: 1000,
  transform: "translate(-50%, calc(-100% - 8px))",
  pointerEvents: "none",
  padding: "6px 10px",
  borderRadius: 8,
  background: "#E4E2DA",
  color: "#2E2D2A",
  border: "1px solid rgba(26, 26, 24, 0.12)",
  boxShadow: "0 6px 16px rgba(26, 26, 24, 0.14)",
  fontSize: 12,
  fontWeight: 500,
  whiteSpace: "nowrap",
};

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
  const [tip, setTip] = useState<{ text: string; x: number; y: number } | null>(null);

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
                    onMouseEnter={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      setTip({
                        text: `${day} ${String(hours[hourIdx]).padStart(2, "0")}:00 · ${value} ${value === 1 ? "ticket" : "tickets"}`,
                        x: rect.left + rect.width / 2,
                        y: rect.top,
                      });
                    }}
                    onMouseLeave={() => setTip(null)}
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
        {tip && createPortal(<div style={{ ...TOOLTIP_STYLE, left: tip.x, top: tip.y }}>{tip.text}</div>, document.body)}
      </CardContent>
    </Card>
  );
}
