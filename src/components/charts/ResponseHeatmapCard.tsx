import type { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface ResponseHeatmapProps {
  title: string;
  subtitle?: string;
  /** Extra control rendered under the title (e.g. period tabs). */
  headerExtra?: ReactNode;
  /** Row labels, top to bottom (hours of day). */
  rows: { label: string }[];
  /** Column labels, left to right (dates / buckets). */
  columns: { label: string }[];
  /** matrix[rowIndex][columnIndex] */
  matrix: number[][];
  /** Count thresholds → shade; breaks [0,1,3,5] with 3 classes = none / light / dark. */
  scale?: { breaks: number[]; classes: string[] };
  className?: string;
}

/** Shade index for a count: 0 = empty, higher = darker. */
function shadeIndex(value: number, scale: ResponseHeatmapProps["scale"], maxValue: number): number {
  if (!value) return 0;
  if (scale && scale.classes.length > 1) {
    const reached = scale.breaks.slice(1).filter((b) => value >= b).length;
    return Math.min(Math.max(reached, 1), scale.classes.length - 1);
  }
  return value >= maxValue * 0.5 ? 2 : 1;
}

// Brand tokens (theme.css) — empty cells stay white, shades step up through the primary colour.
const SHADE_STYLE: React.CSSProperties[] = [
  {},
  { backgroundColor: "var(--color-primary-light)" },
  { backgroundColor: "var(--color-primary)", color: "#fff" },
];

const CELL_W = "min-w-[96px] w-24";
const ROW_H = "h-7";

/**
 * Hour-of-day × date heat map. Hour labels stay pinned on the left, the date columns scroll
 * horizontally, and the date labels sit under the grid — same structure as the survey response
 * "Heat Map" on the survey details page, restyled with the revamp dashboard's brand tokens.
 */
export function ResponseHeatmapCard({
  title,
  subtitle,
  headerExtra,
  rows,
  columns,
  matrix,
  scale,
  className,
}: ResponseHeatmapProps) {
  const maxValue = Math.max(1, ...matrix.flat().map((n) => Number(n) || 0));

  return (
    <Card className={cn("border-brand-border", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-brand-body-3 font-semibold text-brand-text">{title}</CardTitle>
        {subtitle && <p className="text-brand-body-5 text-brand-text-light">{subtitle}</p>}
        {headerExtra && <div className="pt-2">{headerExtra}</div>}
      </CardHeader>
      <CardContent>
        <div className="flex rounded-xl border border-brand-border bg-white">
          {/* Pinned hour labels */}
          <div className="flex-shrink-0 border-r border-brand-border">
            {rows.map((row) => (
              <div
                key={row.label}
                className={cn(ROW_H, "flex w-14 items-center justify-end px-2 text-brand-caption text-brand-text-light whitespace-nowrap border-b border-brand-border/60")}
              >
                {row.label}
              </div>
            ))}
            <div className="h-8" />
          </div>

          {/* no-drag: lets the scrollbar be grabbed without dragging the grid card. */}
          <div className="no-drag min-w-0 flex-1 overflow-x-auto">
            <div className="min-w-max">
              {rows.map((row, r) => (
                <div key={row.label} className="flex">
                  {columns.map((col, c) => {
                    const value = Number(matrix[r]?.[c]) || 0;
                    return (
                      <div
                        key={`${row.label}-${col.label}`}
                        title={`${row.label} · ${col.label}: ${value} response${value === 1 ? "" : "s"}`}
                        className={cn(
                          CELL_W,
                          ROW_H,
                          "flex items-center justify-center border-b border-r border-brand-border/60 text-brand-caption font-medium text-brand-text"
                        )}
                        style={SHADE_STYLE[shadeIndex(value, scale, maxValue)]}
                      >
                        {value > 0 ? value : ""}
                      </div>
                    );
                  })}
                </div>
              ))}
              <div className="flex h-8">
                {columns.map((col) => (
                  <div
                    key={col.label}
                    className={cn(CELL_W, "flex items-center justify-center text-brand-caption text-brand-text-light whitespace-nowrap")}
                  >
                    {col.label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* legend */}
        <div className="mt-3 flex items-center gap-3 text-brand-caption text-brand-text-light">
          <span>Responses:</span>
          <span className="flex items-center gap-1"><i className="inline-block h-3 w-3 rounded-sm border border-brand-border bg-white" />None</span>
          <span className="flex items-center gap-1"><i className="inline-block h-3 w-3 rounded-sm" style={SHADE_STYLE[1]} />Low</span>
          <span className="flex items-center gap-1"><i className="inline-block h-3 w-3 rounded-sm" style={SHADE_STYLE[2]} />High</span>
        </div>
      </CardContent>
    </Card>
  );
}
