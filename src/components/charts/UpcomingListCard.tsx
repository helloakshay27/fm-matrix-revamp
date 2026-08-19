import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface UpcomingItem {
  day: string;
  month: string;
  title: string;
  time: string;
}

export interface UpcomingMiniStat {
  label: string;
  value: string | number;
  tone: "warning" | "info" | "error";
}

export interface UpcomingListCardProps {
  title: string;
  items: UpcomingItem[];
  miniStats?: UpcomingMiniStat[];
  className?: string;
}

const MINI_TONE_CLASSES: Record<UpcomingMiniStat["tone"], string> = {
  warning: "text-[#8A5A00]",
  info: "text-brand-info",
  error: "text-brand",
};

/**
 * Date-tile + title/time rows, with an optional bottom row of mini stat
 * tiles — mirrors ".crm-up-item"/".crm-mini-row" under "Upcoming 7 Days" in
 * fm_matrix_phase10 (29).html. No existing card pairs a date block with a
 * title/time list.
 */
export function UpcomingListCard({ title, items, miniStats, className }: UpcomingListCardProps) {
  return (
    <Card className={cn("border-brand-border h-full overflow-auto", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-brand-body-3 font-semibold text-brand-text">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {items.map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-brand flex flex-col items-center justify-center text-white">
                <span className="text-[11px] font-bold leading-none">{item.day}</span>
                <span className="text-[7px] uppercase leading-none mt-0.5">{item.month}</span>
              </div>
              <div className="min-w-0">
                <div className="text-brand-body-4 font-medium text-brand-text truncate">{item.title}</div>
                <div className="text-brand-body-5 text-brand-text-light">{item.time}</div>
              </div>
            </div>
          ))}
        </div>

        {miniStats && miniStats.length > 0 && (
          <div className="grid gap-2 mt-4" style={{ gridTemplateColumns: `repeat(${miniStats.length}, minmax(0, 1fr))` }}>
            {miniStats.map((stat) => (
              <div key={stat.label} className="rounded-lg bg-brand-bg border border-brand-border text-center py-2.5">
                <div className={cn("text-lg font-bold leading-none", MINI_TONE_CLASSES[stat.tone])}>{stat.value}</div>
                <div className="text-brand-caption text-brand-text-light uppercase tracking-wide mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
