import DatePicker from "react-datepicker";
import { cn } from "@/lib/utils";

interface DateRangePickerProps {
  startDate: Date | null;
  endDate: Date | null;
  onChange: (range: { startDate: Date | null; endDate: Date | null }) => void;
  className?: string;
  minDate?: Date;
  maxDate?: Date;
}

/**
 * Single inline calendar that lets the user pick a start and end date
 * as one range (click start, then click end) - styled via `.custom-datepicker`.
 */
export const DateRangePicker = ({
  startDate,
  endDate,
  onChange,
  className,
  minDate,
  maxDate,
}: DateRangePickerProps) => {
  return (
    <div className={cn("custom-datepicker", className)}>
      <DatePicker
        selectsRange
        inline
        monthsShown={1}
        startDate={startDate}
        endDate={endDate}
        minDate={minDate}
        maxDate={maxDate}
        onChange={(dates) => {
          const [start, end] = dates as [Date | null, Date | null];
          onChange({ startDate: start, endDate: end });
        }}
      />
    </div>
  );
};
