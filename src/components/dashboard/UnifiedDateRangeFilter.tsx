// new comment //
import React, { useState } from 'react';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface UnifiedDateRangeFilterProps {
  dateRange: DateRange | undefined;
  onDateRangeChange: (range: DateRange | undefined) => void;
}

export const UnifiedDateRangeFilter: React.FC<UnifiedDateRangeFilterProps> = ({
  dateRange,
  onDateRangeChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleDateRangeSelect = (range: DateRange | undefined) => {
    onDateRangeChange(range);
    if (range?.from && range?.to) {
      setIsOpen(false);
    }
  };

  const formatDateRange = () => {
    if (!dateRange?.from) {
      return 'Pick a date range';
    }
    if (dateRange.to) {
      return `${format(dateRange.from, 'dd/MM/yyyy')} - ${format(dateRange.to, 'dd/MM/yyyy')}`;
    }
    return format(dateRange.from, 'dd/MM/yyyy');
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'h-10 w-72 justify-start text-left font-normal border-analytics-border hover:bg-analytics-secondary/50',
            !dateRange?.from && 'text-analytics-muted'
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {formatDateRange()}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-background border-analytics-border" align="end">
        <Calendar
          initialFocus
          mode="range"
          defaultMonth={dateRange?.from}
          selected={dateRange}
          onSelect={handleDateRangeSelect}
          numberOfMonths={2}
          className="pointer-events-auto"
        />
        <div className="p-3 border-t border-analytics-border bg-analytics-background">
          <div className="flex items-center justify-between">
            <span className="text-sm text-analytics-muted">
              {dateRange?.from && dateRange?.to 
                ? `${Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24))} days selected`
                : 'Select date range'
              }
            </span>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  onDateRangeChange(undefined);
                  setIsOpen(false);
                }}
                className="text-analytics-muted hover:text-analytics-text"
              >
                Clear
              </Button>
              <Button
                size="sm"
                onClick={() => setIsOpen(false)}
                disabled={!dateRange?.from || !dateRange?.to}
                className="bg-primary hover:bg-primary/90"
              >
                Apply
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};