import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { MaterialDatePicker } from '@/components/ui/material-date-picker';
import { format, parse } from 'date-fns';

interface TaskAnalyticsFilterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (startDate: string, endDate: string) => void;
  currentStartDate?: string; // Current applied start date in YYYY-MM-DD format
  currentEndDate?: string;   // Current applied end date in YYYY-MM-DD format
}

export const TaskAnalyticsFilterDialog: React.FC<TaskAnalyticsFilterDialogProps> = ({
  isOpen,
  onClose,
  onApplyFilters,
  currentStartDate,
  currentEndDate,
}) => {
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const convertFromApiFormat = (dateString: string): string => {
    // Convert from YYYY-MM-DD to DD/MM/YYYY
    const date = parse(dateString, 'yyyy-MM-dd', new Date());
    return format(date, 'dd/MM/yyyy');
  };

  const convertToApiFormat = (dateString: string): string => {
    // Convert from DD/MM/YYYY to YYYY-MM-DD
    const date = parse(dateString, 'dd/MM/yyyy', new Date());
    return format(date, 'yyyy-MM-dd');
  };

  useEffect(() => {
    if (isOpen) {
      if (currentStartDate && currentEndDate) {
        // Use current applied filter dates
        setStartDate(convertFromApiFormat(currentStartDate));
        setEndDate(convertFromApiFormat(currentEndDate));
      } else {
        // Set default dates (last year to today) only if no current dates
        const today = new Date();
        const lastYear = new Date(today);
        lastYear.setFullYear(today.getFullYear() - 1);
        
        setStartDate(format(lastYear, 'dd/MM/yyyy'));
        setEndDate(format(today, 'dd/MM/yyyy'));
      }
    }
  }, [isOpen, currentStartDate, currentEndDate]);

  const handleSubmit = () => {
    if (startDate && endDate) {
      onApplyFilters(convertToApiFormat(startDate), convertToApiFormat(endDate));
      onClose();
    } else {
      // If dates are empty, close without applying (effectively clearing the filter)
      onClose();
    }
  };

  const handleReset = () => {
    // Reset to empty/null values to clear the data
    setStartDate('');
    setEndDate('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Filter Task Analytics</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Start Date</label>
            <MaterialDatePicker
              value={startDate}
              onChange={setStartDate}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">End Date</label>
            <MaterialDatePicker
              value={endDate}
              onChange={setEndDate}
            />
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 pt-6">
          <Button 
            onClick={handleSubmit}
            className="flex-1 h-11"
          >
            Apply Filters
          </Button>
          <Button 
            variant="outline" 
            onClick={onClose}
            className="flex-1 h-11"
          >
            Cancel
          </Button>
          <Button 
            variant="outline" 
            onClick={handleReset}
            className="flex-1 h-11"
          >
            Reset
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};