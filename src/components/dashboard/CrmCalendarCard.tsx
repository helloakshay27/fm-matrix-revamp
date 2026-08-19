import { Calendar as CalendarIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type CrmCalendarEventType = "meeting" | "call";

export interface CrmCalendarDayTask {
  time: string;
  title: string;
}

export interface CrmCalendarCardProps {
  monthLabel: string;
  /** Calendar cells, Sunday-first, including leading/trailing days from adjacent months. */
  cells: { day: number; inMonth: boolean; isToday?: boolean }[];
  events: Record<number, CrmCalendarEventType[]>;
  selectedDay: number | null;
  onSelectDay: (day: number) => void;
  selectedDayLabel?: string;
  selectedDayTasks?: CrmCalendarDayTask[];
  className?: string;
}

const DOW = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

const EVENT_DOT_COLOR: Record<CrmCalendarEventType, string> = {
  meeting: "#DA7756",
  call: "#6B9BCC",
};

/**
 * Lightweight static month grid with meeting/call dots and a per-day task
 * list — mirrors ".cal-grid"/".cal-cell" under "Calendar & Activities" in
 * fm_matrix_phase10 (29).html. Existing calendar usage elsewhere in this
 * codebase (CustomCalender, ScheduledTaskCalendar) wraps FullCalendar/
 * react-big-calendar for full scheduling UIs — too heavy for this compact
 * read-mostly widget, so this is plain CSS grid, no library.
 */
export function CrmCalendarCard({
  monthLabel,
  cells,
  events,
  selectedDay,
  onSelectDay,
  selectedDayLabel,
  selectedDayTasks,
  className,
}: CrmCalendarCardProps) {
  return (
    <Card className={cn("border-brand-border h-full overflow-auto", className)}>
      <CardContent className="pt-5">
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <div className="flex items-center gap-2 text-brand-body-3 font-semibold text-brand-text">
            <CalendarIcon className="w-4 h-4 text-brand" />
            {monthLabel}
          </div>
          <div className="flex items-center gap-3 text-brand-body-5 text-brand-text-light">
            <span className="inline-flex items-center gap-1">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: EVENT_DOT_COLOR.meeting }} /> Meeting
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: EVENT_DOT_COLOR.call }} /> Call
            </span>
            <span className="rounded-full border border-brand-border px-2 py-0.5">Unavailable</span>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-[3px]">
          {DOW.map((d) => (
            <div key={d} className="text-center text-[10px] font-semibold text-brand-text-light uppercase py-1">
              {d}
            </div>
          ))}
          {cells.map((cell, index) => {
            const dots = cell.inMonth ? events[cell.day] ?? [] : [];
            const isSelected = cell.inMonth && cell.day === selectedDay;
            return (
              <button
                type="button"
                key={index}
                disabled={!cell.inMonth}
                onClick={() => cell.inMonth && onSelectDay(cell.day)}
                className={cn(
                  "aspect-square rounded-md flex flex-col items-center justify-center gap-0.5 text-xs relative",
                  !cell.inMonth && "opacity-40 cursor-default",
                  cell.inMonth && !cell.isToday && "bg-brand-bg hover:bg-brand-light",
                  cell.isToday && "bg-brand text-white font-bold",
                  isSelected && !cell.isToday && "border-2 border-brand"
                )}
              >
                <span>{cell.day}</span>
                {dots.length > 0 && (
                  <span className="flex gap-0.5">
                    {dots.map((type, i) => (
                      <span
                        key={i}
                        className="w-1 h-1 rounded-full"
                        style={{ backgroundColor: cell.isToday ? "white" : EVENT_DOT_COLOR[type] }}
                      />
                    ))}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {selectedDayTasks && (
          <div className="mt-4 pt-3 border-t border-brand-border">
            {selectedDayLabel && (
              <div className="text-brand-caption font-semibold text-brand-text-light uppercase tracking-wide mb-2">
                {selectedDayLabel}
              </div>
            )}
            {selectedDayTasks.length === 0 ? (
              <p className="text-brand-body-5 text-brand-text-light">No activities scheduled.</p>
            ) : (
              <div className="divide-y divide-brand-border">
                {selectedDayTasks.map((task, index) => (
                  <div key={index} className="flex items-center gap-3 py-2">
                    <span className="w-3 h-3 rounded-full border-2 border-brand-border flex-shrink-0" />
                    <div>
                      <div className="text-brand-body-4 font-medium text-brand-text">{task.title}</div>
                      <div className="text-brand-body-5 text-brand-text-light">{task.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
