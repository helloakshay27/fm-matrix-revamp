import React, { useState } from 'react';
import { CalendarIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TextField } from '@mui/material';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface DateRange {
  from?: Date;
  to?: Date;
}

interface UnifiedDateRangeFilterProps {
  dateRange: DateRange | undefined;
  onDateRangeChange: (range: DateRange | undefined) => void;
}

const fieldStyles = {
  height: { xs: 28, sm: 36, md: 45 },
  "& .MuiInputBase-input": {
    padding: { xs: "8px", sm: "10px", md: "12px" },
  },
};

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
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEndDate(value);
  };

  const handleApply = () => {
    const fromDate = parseHTMLDate(startDate);
    const toDate = parseHTMLDate(endDate);
    
    if (fromDate && toDate) {
      onDateRangeChange({
        from: fromDate,
        to: toDate
      });
      setIsOpen(false);
      toast.success('Date range applied successfully');
    } else {
      toast.error('Please select both start and end dates');
    }
  };

  const handleClear = () => {
    setStartDate('');
    setEndDate('');
    onDateRangeChange(undefined);
    setIsOpen(false);
    toast.success('Date range cleared successfully');
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
    // Calculate from local state (startDate and endDate inputs)
    const fromDate = parseHTMLDate(startDate);
    const toDate = parseHTMLDate(endDate);
    
    if (fromDate && toDate) {
      const diffTime = toDate.getTime() - fromDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end days
      return diffDays;
    }
    return 0;
  };

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setIsOpen(true)}
        className={cn(
          'h-10 min-w-0 flex-1 justify-start text-left font-normal border-gray-300 hover:bg-gray-50',
          !dateRange?.from && 'text-gray-500'
        )}
      >
        <CalendarIcon className="mr-2 h-4 w-4 flex-shrink-0" />
        <span className="truncate">{formatDateRange()}</span>
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen} modal={false}>
        <DialogContent className="max-w-2xl bg-white z-50" aria-describedby="date-range-filter-description">
          <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <DialogTitle className="text-lg font-semibold text-gray-900">
              FILTER DATE RANGE
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="h-6 w-6 p-0 hover:bg-gray-100"
            >
              <X className="h-4 w-4" />
            </Button>
            <div id="date-range-filter-description" className="sr-only">
              Select date range for dashboard analytics
            </div>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* Date Range Section */}
            <div>
              <h3 className="text-sm font-medium text-[#C72030] mb-4">Date Range</h3>
              <div className="grid grid-cols-2 gap-6">
                <TextField
                  label="Start Date"
                  type="date"
                  value={startDate}
                  onChange={handleStartDateChange}
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ sx: fieldStyles }}
                />
                <TextField
                  label="End Date"
                  type="date"
                  value={endDate}
                  onChange={handleEndDateChange}
                  inputProps={{ min: startDate }}
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ sx: fieldStyles }}
                />
              </div>
              
              {/* Days Selected Info */}
              {startDate && endDate && (
                <div className="mt-4 text-sm text-gray-600">
                  {calculateDaysSelected()} days selected
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
            <Button 
              onClick={handleApply} 
              disabled={!startDate || !endDate}
              className="bg-[#C72030] text-white hover:bg-[#C72030]/90 flex-1 h-11"
            >
              Apply Filter
            </Button>
            <Button 
              variant="outline" 
              onClick={handleClear} 
              className="flex-1 h-11"
            >
              Clear All
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};