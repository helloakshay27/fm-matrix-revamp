// new comment //
import React, { useState } from 'react';
import { CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

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
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Format date to DD/MM/YYYY
  const formatDateToDDMMYYYY = (date: Date): string => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Convert Date to YYYY-MM-DD for HTML input
  const formatDateToHTML = (date: Date): string => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Convert YYYY-MM-DD to Date
  const parseHTMLDate = (dateString: string): Date | null => {
    if (!dateString) return null;
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
  };

  // Update local state when dateRange prop changes
  React.useEffect(() => {
    if (dateRange?.from) {
      setStartDate(formatDateToHTML(dateRange.from));
    } else {
      setStartDate('');
    }
    
    if (dateRange?.to) {
      setEndDate(formatDateToHTML(dateRange.to));
    } else {
      setEndDate('');
    }
  }, [dateRange]);

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setStartDate(value);
    
    const fromDate = parseHTMLDate(value);
    const toDate = endDate ? parseHTMLDate(endDate) : null;
    
    if (fromDate) {
      onDateRangeChange({
        from: fromDate,
        to: toDate || undefined
      });
    }
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEndDate(value);
    
    const fromDate = startDate ? parseHTMLDate(startDate) : null;
    const toDate = parseHTMLDate(value);
    
    if (toDate) {
      onDateRangeChange({
        from: fromDate || undefined,
        to: toDate
      });
    }
  };

  const handleClear = () => {
    setStartDate('');
    setEndDate('');
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
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    }
    return 0;
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
      <PopoverContent className="w-80 p-0 bg-background border-analytics-border" align="start" side="bottom">
        <div className="p-4 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Start Date</label>
            <div className="relative">
              <Input
                type="date"
                value={startDate}
                onChange={handleStartDateChange}
                className="w-full"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">End Date</label>
            <div className="relative">
              <Input
                type="date"
                value={endDate}
                onChange={handleEndDateChange}
                min={startDate}
                className="w-full"
              />
            </div>
          </div>
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