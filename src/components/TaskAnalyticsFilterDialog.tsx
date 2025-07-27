import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { MaterialDatePicker } from '@/components/ui/material-date-picker';

interface TaskAnalyticsFilterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (startDate: string, endDate: string) => void;
}

export const TaskAnalyticsFilterDialog: React.FC<TaskAnalyticsFilterDialogProps> = ({
  isOpen,
  onClose,
  onApplyFilters,
}) => {
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      // Set default dates (last year to today)
      const today = new Date();
      const lastYear = new Date(today);
      lastYear.setFullYear(today.getFullYear() - 1);
      
      setStartDate(lastYear.toISOString().split('T')[0]);
      setEndDate(today.toISOString().split('T')[0]);
    }
  }, [isOpen]);

  const handleSubmit = () => {
    if (startDate && endDate) {
      onApplyFilters(startDate, endDate);
      onClose();
    }
  };

  const handleReset = () => {
    const today = new Date();
    const lastYear = new Date(today);
    lastYear.setFullYear(today.getFullYear() - 1);
    
    setStartDate(lastYear.toISOString().split('T')[0]);
    setEndDate(today.toISOString().split('T')[0]);
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
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={handleReset}>
            Reset
          </Button>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            Apply Filters
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};