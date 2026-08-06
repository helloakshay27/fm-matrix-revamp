import type { ReactNode } from "react";
import { ArrowUp, ArrowDown, Minus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type TableBadgeTone = "red" | "amber" | "green" | "blue" | "grey" | "terra";

const BADGE_TONE_STYLE: Record<TableBadgeTone, React.CSSProperties> = {
  red: { backgroundColor: "rgba(218, 119, 86, 0.125)", color: "#C0303D" },
  amber: { backgroundColor: "rgba(237, 196, 136, 0.145)", color: "#B8860B" },
  green: { backgroundColor: "rgba(16, 140, 114, 0.082)", color: "#108C72" },
  blue: { backgroundColor: "rgba(107, 155, 204, 0.125)", color: "#2a5f8f" },
  grey: { backgroundColor: "rgba(121, 140, 94, 0.125)", color: "#798C5E" },
  terra: { backgroundColor: "rgba(218, 119, 86, 0.125)", color: "#B8694A" },
};

/** Small rounded status pill — mirrors ".badge" (.b-err/.b-warn/.b-ok/...) in fm_matrix_phase10 (29).html. */
export function TableBadge({ tone, children }: { tone: TableBadgeTone; children: ReactNode }) {
  return (
    <span
      className="inline-flex items-center text-[9px] font-semibold px-2 py-0.5 rounded-full tracking-wide"
      style={BADGE_TONE_STYLE[tone]}
    >
      {children}
    </span>
  );
}

/** Up/down/flat trend label — green for "good" direction, red for "bad", per the `good` flag. */
export function TrendLabel({ delta, good }: { delta: string; good?: boolean }) {
  const isFlat = delta.trim().startsWith("0") || delta.trim() === "·";
  const Icon = isFlat ? Minus : delta.trim().startsWith("-") ? ArrowDown : ArrowUp;
  const colorClass = isFlat ? "text-brand-text-light" : good ? "text-brand-success" : "text-brand";
  return (
    <span className={cn("inline-flex items-center gap-0.5 text-brand-body-5 font-medium", colorClass)}>
      <Icon className="w-3 h-3" />
      {delta}
    </span>
  );
}

export interface DataTableColumn<T> {
  key: string;
  header: string;
  align?: "left" | "right" | "center";
  render: (row: T) => ReactNode;
}

export interface DataTableCardProps<T> {
  title: string;
  subtitle?: string;
  columns: DataTableColumn<T>[];
  data: T[];
  getRowKey: (row: T) => string | number;
  onRowClick?: (row: T) => void;
  insight?: string;
  className?: string;
}

/**
 * Presentational analytics summary table — rounded bordered frame, coral
 * header row, zebra-striped body — mirrors the "Summary Table" structure in
 * src/components/ResolutionTATCard.tsx (the established report-table pattern
 * already used elsewhere in this codebase). Distinct from the shared
 * EnhancedTable, which targets operational CRUD tables (sort, select, export,
 * pagination); this is a static, read-only comparison table.
 */
export function DataTableCard<T>({
  title,
  subtitle,
  columns,
  data,
  getRowKey,
  onRowClick,
  insight,
  className,
}: DataTableCardProps<T>) {
  return (
    <Card className={cn("border-brand-border", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-brand-body-3 font-semibold text-brand-text">{title}</CardTitle>
        {subtitle && <p className="text-brand-body-5 text-brand-text-light">{subtitle}</p>}
      </CardHeader>
      <CardContent>
        <div className="rounded-xl overflow-hidden border border-brand-border">
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr>
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      className="analytics-header bg-brand text-white font-semibold text-xs px-4 py-3 whitespace-nowrap text-center"
                    >
                      {col.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, rowIndex) => (
                  <tr
                    key={getRowKey(row)}
                    onClick={() => onRowClick?.(row)}
                    className={cn(rowIndex % 2 === 1 && "bg-brand-bg", onRowClick && "cursor-pointer hover:bg-brand-light")}
                  >
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className={cn(
                          "px-4 py-3 align-middle border-b border-brand-border",
                          col.align === "right" ? "text-right" : col.align === "center" ? "text-center" : "text-left"
                        )}
                      >
                        {col.render(row)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {insight && <p className="text-brand-body-5 text-brand-green leading-relaxed mt-3">{insight}</p>}
      </CardContent>
    </Card>
  );
}
