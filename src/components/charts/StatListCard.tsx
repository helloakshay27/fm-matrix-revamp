import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TableBadge, type TableBadgeTone } from "./DataTableCard";

export interface StatListRow {
  label: string;
  /** Plain value text (right-aligned, bold) — use this OR badge, not both. */
  value?: string;
  badge?: { tone: TableBadgeTone; label: string };
  onClick?: () => void;
}

export interface StatListCardProps {
  title: string;
  subtitle?: string;
  rows: StatListRow[];
  note?: string;
  /** Colored left border, matching the ".card" border-left accent pattern in fm_matrix_phase10 (29).html. */
  borderTone?: "error" | "warning";
  className?: string;
}

const BORDER_TONE_CLASSES: Record<NonNullable<StatListCardProps["borderTone"]>, string> = {
  error: "border-l-4 border-l-brand-error",
  warning: "border-l-4 border-l-brand-warning",
};

/**
 * Simple label→value/badge list card — mirrors the repeated ".card" +
 * ".stat-line" rows pattern in fm_matrix_phase10 (29).html (Golden tickets
 * aged, Godrej Living distress, By User/Department/Tenant, Repeat
 * extensions, etc). No existing chart card covered this shape.
 */
export function StatListCard({ title, subtitle, rows, note, borderTone, className }: StatListCardProps) {
  return (
    <Card className={cn("border-brand-border", borderTone && BORDER_TONE_CLASSES[borderTone], className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-brand-body-3 font-semibold text-brand-text">{title}</CardTitle>
        {subtitle && <p className="text-brand-body-5 text-brand-text-light">{subtitle}</p>}
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {rows.map((row) => (
            <div
              key={row.label}
              onClick={row.onClick}
              className={cn(
                "flex items-center justify-between gap-3 text-brand-body-5",
                row.onClick && "cursor-pointer hover:text-brand"
              )}
            >
              <span className="text-brand-text">{row.label}</span>
              {row.badge ? (
                <TableBadge tone={row.badge.tone}>{row.badge.label}</TableBadge>
              ) : (
                <span className="font-semibold text-brand-text flex-shrink-0">{row.value}</span>
              )}
            </div>
          ))}
        </div>

        {note && <p className="text-brand-body-5 text-brand-text-light leading-relaxed mt-3">{note}</p>}
      </CardContent>
    </Card>
  );
}
