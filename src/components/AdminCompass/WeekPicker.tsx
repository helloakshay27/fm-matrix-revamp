import React, { useState } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { getWeek, format, startOfWeek, endOfWeek } from "date-fns";

interface WeekPickerProps {
  currentWeek: Date;
  onWeekChange: (date: Date) => void;
}

export const WeekPicker = ({ currentWeek, onWeekChange }: WeekPickerProps) => {
  const [popoverOpen, setPopoverOpen] = useState(false);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      onWeekChange(selectedDate);
      setPopoverOpen(false);
    }
  };

  const weekRange = currentWeek
    ? {
        from: startOfWeek(currentWeek, { weekStartsOn: 0 }), // Sunday
        to: endOfWeek(currentWeek, { weekStartsOn: 0 }),
      }
    : undefined;

  return (
    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="px-4 !bg-white !border-gray-200 !rounded-[8px] !text-gray-700 gap-2"
        >
          <CalendarIcon className="w-4 h-4 !text-gray-500" />
          {currentWeek
            ? `Week ${getWeek(currentWeek)}, ${format(currentWeek, "yyyy")}`
            : "Select Week"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="range"
          selected={weekRange}
          onDayClick={handleDateSelect}
          defaultMonth={currentWeek}
          showWeekNumber
          classNames={{
            day_range_start: "bg-primary text-primary-foreground rounded-l-md",
            day_range_end: "bg-primary text-primary-foreground rounded-r-md",
            day_range_middle: "bg-primary/90 text-primary-foreground",
            weeknumber: "text-sm text-gray-400 pt-2 pr-2 border-r",
            head_cell: "text-sm text-gray-500 font-medium w-9 h-9",
            cell: "w-9 h-9",
            day: "w-9 h-9",
          }}
        />
        <div className="flex justify-between p-2 border-t border-gray-100">
          <Button
            variant="ghost"
            size="sm"
            className="text-primary font-bold"
            onClick={() => {
              onWeekChange(new Date());
              setPopoverOpen(false);
            }}
          >
            This week
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
