import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TableBadge, type TableBadgeTone } from "./DataTableCard";

export interface TaskListRow {
  label: string;
  subtitle?: string;
  due: string;
  overdue?: boolean;
}

export interface TaskListCardProps {
  title: string;
  badge?: { tone: TableBadgeTone; label: string };
  rows: TaskListRow[];
  insight?: string;
  className?: string;
}

/**
 * Checkbox-style pending-task rows with a due-date pill — mirrors
 * ".task-item"/".task-due" under "Pending Tasks" in fm_matrix_phase10
 * (29).html. StatListCard is a plain label→value row and doesn't carry the
 * checkbox + subtitle + overdue-due-date shape this needs.
 */
export function TaskListCard({ title, badge, rows, insight, className }: TaskListCardProps) {
  return (
    <Card className={cn("border-brand-border h-full overflow-auto", className)}>
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-brand-body-3 font-semibold text-brand-text">{title}</CardTitle>
        {badge && <TableBadge tone={badge.tone}>{badge.label}</TableBadge>}
      </CardHeader>
      <CardContent>
        <div className="divide-y divide-brand-border">
          {rows.map((row) => (
            <div key={row.label} className="flex items-center gap-3 py-2.5">
              <span
                className={cn(
                  "flex-shrink-0 w-3.5 h-3.5 rounded-full border-2",
                  row.overdue ? "border-brand" : "border-brand-border"
                )}
              />
              <div className="flex-1 min-w-0">
                <div className="text-brand-body-4 font-medium text-brand-text truncate">{row.label}</div>
                {row.subtitle && <div className="text-brand-body-5 text-brand-text-light truncate">{row.subtitle}</div>}
              </div>
              <span
                className={cn(
                  "flex-shrink-0 text-brand-body-5 font-semibold",
                  row.overdue ? "text-brand" : "text-brand-text-light"
                )}
              >
                {row.due}
              </span>
            </div>
          ))}
        </div>

        {insight && (
          <div className="flex items-start gap-2 rounded-md bg-brand-light px-3 py-2 text-brand-body-5 text-brand mt-3">
            <span className="flex-shrink-0">⏰</span>
            <span className="leading-relaxed">{insight}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
