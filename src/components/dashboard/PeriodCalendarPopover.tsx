import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type PeriodMode = "day" | "month" | "range";

export interface PeriodRange {
  from: Date;
  to: Date;
}

interface PeriodCalendarPopoverProps {
  /** Currently applied range — shown highlighted until the user picks something new. */
  initialRange: PeriodRange;
  /** Which picker to show: a single day, a whole month, or a start/end range. */
  mode: PeriodMode;
  onApply: (range: PeriodRange) => void;
  onReset: () => void;
  onClose: () => void;
}

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const isSameDay = (a: Date, b: Date) => a.getTime() === b.getTime();

/**
 * Period picker popover — month calendar with prev/next arrows, a "Pick start date" hint, dark
 * start/end dates and a light band between them. Day applies on one click, Month on one click, and
 * Range on the second click (start, then end).
 */
export function PeriodCalendarPopover({ initialRange, mode, onApply, onReset, onClose }: PeriodCalendarPopoverProps) {
  const today = startOfDay(new Date());
  const applied = { from: startOfDay(initialRange.from), to: startOfDay(initialRange.to) };

  const [view, setView] = useState(() => new Date(applied.to.getFullYear(), applied.to.getMonth(), 1));
  // Range mode: the first click is held here until the second click completes the range.
  const [pendingStart, setPendingStart] = useState<Date | null>(null);
  const [hover, setHover] = useState<Date | null>(null);

  const apply = (range: PeriodRange) => {
    onApply(range);
    onClose();
  };

  const pickDate = (date: Date) => {
    if (date > today) return;
    if (mode === "day") {
      apply({ from: date, to: date });
      return;
    }
    if (!pendingStart) {
      setPendingStart(date);
      return;
    }
    const [from, to] = date < pendingStart ? [date, pendingStart] : [pendingStart, date];
    apply({ from, to });
  };

  const pickMonth = (monthIndex: number) => {
    const from = new Date(view.getFullYear(), monthIndex, 1);
    if (from > today) return;
    const lastDay = new Date(view.getFullYear(), monthIndex + 1, 0);
    apply({ from, to: lastDay > today ? today : lastDay });
  };

  // What's highlighted: the pending pick (with a hover preview) while choosing, else the applied range.
  const shown: PeriodRange =
    mode === "range" && pendingStart
      ? hover && hover > pendingStart
        ? { from: pendingStart, to: hover }
        : hover && hover < pendingStart
          ? { from: hover, to: pendingStart }
          : { from: pendingStart, to: pendingStart }
      : mode === "day"
        ? { from: applied.to, to: applied.to }
        : applied;

  const hint =
    mode === "month" ? "Pick a month" : mode === "day" ? "Pick a date" : pendingStart ? "Pick end date" : "Pick start date";

  const goPrev = () =>
    setView((v) => (mode === "month" ? new Date(v.getFullYear() - 1, 0, 1) : new Date(v.getFullYear(), v.getMonth() - 1, 1)));
  const goNext = () =>
    setView((v) => (mode === "month" ? new Date(v.getFullYear() + 1, 0, 1) : new Date(v.getFullYear(), v.getMonth() + 1, 1)));

  const title =
    mode === "month"
      ? String(view.getFullYear())
      : view.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  // 6 weeks starting on the Sunday on/before the 1st, so the grid height never jumps between months.
  const firstCell = new Date(view.getFullYear(), view.getMonth(), 1 - new Date(view.getFullYear(), view.getMonth(), 1).getDay());
  const cells = Array.from({ length: 42 }, (_, i) => new Date(firstCell.getFullYear(), firstCell.getMonth(), firstCell.getDate() + i));

  return (
    <div className="pc-pop" onMouseLeave={() => setHover(null)}>
      <div className="pc-head">
        <button type="button" className="pc-nav" onClick={goPrev} aria-label="Previous">
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div className="pc-title">{title}</div>
        <button type="button" className="pc-nav" onClick={goNext} aria-label="Next">
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
      <div className="pc-hint">{hint}</div>

      {mode === "month" ? (
        <div className="pc-months">
          {MONTHS.map((label, index) => {
            const monthStart = new Date(view.getFullYear(), index, 1);
            const isSelected =
              applied.from.getFullYear() === view.getFullYear() && applied.from.getMonth() === index && applied.from.getDate() === 1;
            return (
              <button
                key={label}
                type="button"
                disabled={monthStart > today}
                onClick={() => pickMonth(index)}
                className={cn("pc-month", isSelected && "edge")}
              >
                {label}
              </button>
            );
          })}
        </div>
      ) : (
        <>
          <div className="pc-grid pc-weekdays">
            {WEEKDAYS.map((d) => (
              <div key={d}>{d}</div>
            ))}
          </div>
          <div className="pc-grid">
            {cells.map((date) => {
              const outside = date.getMonth() !== view.getMonth();
              const future = date > today;
              const isEdge = isSameDay(date, shown.from) || isSameDay(date, shown.to);
              const inBand = date > shown.from && date < shown.to;
              return (
                <button
                  key={date.getTime()}
                  type="button"
                  disabled={future}
                  onClick={() => pickDate(date)}
                  onMouseEnter={() => setHover(date)}
                  className={cn(
                    "pc-cell",
                    outside && "out",
                    isEdge && "edge",
                    !isEdge && inBand && "band",
                    !isEdge && !inBand && isSameDay(date, today) && "today"
                  )}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>
        </>
      )}

      <div className="pc-foot">
        <button
          type="button"
          className="pc-reset"
          onClick={() => {
            onReset();
            onClose();
          }}
        >
          Reset
        </button>
      </div>
    </div>
  );
}
