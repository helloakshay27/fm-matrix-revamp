// new comment //
import React, { useState } from 'react';
import { CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface DateRange {
  from?: Date;
  to?: Date;
}

interface UnifiedDateRangeFilterProps {
  dateRange: DateRange | undefined;
  onDateRangeChange: (range: DateRange | undefined) => void;
}

export const UnifiedDateRangeFilter: React.FC<UnifiedDateRangeFilterProps> = ({
  dateRange,
  onDateRangeChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  // Format date to DD/MM/YYYY
  const formatDateToDDMMYYYY = (date: Date): string => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Update local state when dateRange prop changes
  React.useEffect(() => {
    setStartDate(dateRange?.from || null);
    setEndDate(dateRange?.to || null);
  }, [dateRange]);

  const handleDateChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
    
    if (start && end) {
      onDateRangeChange({
        from: start,
        to: end
      });
    } else if (start) {
      onDateRangeChange({
        from: start,
        to: undefined
      });
    }
  };

  const handleClear = () => {
    setStartDate(null);
    setEndDate(null);
    onDateRangeChange(undefined);
    setIsOpen(false);
  };

  const handleApply = () => {
    setIsOpen(false);
  };

  const formatDateRange = () => {
    if (!dateRange?.from) {
      return 'Pick a date range';
    }
    
    if (dateRange.to) {
      return `${formatDateToDDMMYYYY(dateRange.from)} - ${formatDateToDDMMYYYY(dateRange.to)}`;
    }
    return formatDateToDDMMYYYY(dateRange.from);
  };

  const calculateDaysSelected = () => {
    if (dateRange?.from && dateRange?.to) {
      const diffTime = dateRange.to.getTime() - dateRange.from.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      return diffDays;
    }
    return 0;
  };

  const renderCustomHeader = ({
    date,
    changeYear,
    changeMonth,
    decreaseMonth,
    increaseMonth,
    prevMonthButtonDisabled,
    nextMonthButtonDisabled,
  }: any) => {
    const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - 50 + i);
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    return (
      <div className="flex flex-col gap-2 px-3 py-2 bg-gray-50 border-b">
        {/* Title */}
        <div className="flex items-center justify-center">
          <h3 className="text-base font-semibold text-gray-900">
            {months[date.getMonth()]} {date.getFullYear()}
          </h3>
        </div>
        
        {/* Dropdowns */}
        <div className="flex items-center justify-center gap-2">
          <select
            value={months[date.getMonth()]}
            onChange={({ target: { value } }) => changeMonth(months.indexOf(value))}
            className="text-sm font-medium px-3 py-1.5 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            {months.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
          
          <select
            value={date.getFullYear()}
            onChange={({ target: { value } }) => changeYear(parseInt(value))}
            className="text-sm font-medium px-3 py-1.5 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>
    );
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'h-10 min-w-0 flex-1 justify-start text-left font-normal border-analytics-border hover:bg-analytics-secondary/50',
            !dateRange?.from && 'text-analytics-muted'
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 flex-shrink-0" />
          <span className="truncate">{formatDateRange()}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-background border-analytics-border" align="start" side="bottom">
        <div className="custom-datepicker">
          <DatePicker
            selected={startDate}
            onChange={handleDateChange}
            startDate={startDate}
            endDate={endDate}
            selectsRange
            inline
            monthsShown={2}
            renderCustomHeader={renderCustomHeader}
            dateFormat="dd/MM/yyyy"
            calendarStartDay={1}
            todayButton="Today"
          />
        </div>
        
        <div className="p-3 border-t border-analytics-border bg-analytics-background">
          <div className="flex items-center justify-between">
            <span className="text-sm text-analytics-muted">
              {dateRange?.from && dateRange?.to 
                ? `${calculateDaysSelected()} days selected`
                : 'Select date range'
              }
            </span>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClear}
                className="text-analytics-muted hover:text-analytics-text"
              >
                Clear
              </Button>
              <Button
                size="sm"
                onClick={handleApply}
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