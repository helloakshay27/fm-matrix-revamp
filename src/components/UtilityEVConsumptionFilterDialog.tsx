import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { MaterialDatePicker } from '@/components/ui/material-date-picker';
import { DateRange } from 'react-day-picker';

interface FilterData {
  dateRange?: DateRange;
}

interface UtilityEVConsumptionFilterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: FilterData) => void;
  onResetFilters: () => void;
}

export const UtilityEVConsumptionFilterDialog = ({ 
  isOpen, 
  onClose, 
  onApplyFilters, 
  onResetFilters 
}: UtilityEVConsumptionFilterDialogProps) => {
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const handleSubmit = () => {
    console.log('Filtering EV consumption data with dates:', { startDate, endDate });
    
    if (startDate && endDate) {
      // Pass date range as string in DD/MM/YYYY - DD/MM/YYYY format
      const dateRangeString = `${startDate} - ${endDate}`;
      
      // Apply filters with the date range string
      onApplyFilters({
        dateRange: dateRangeString as any // Will be handled by dashboard
      });
    } else {
      // Apply empty filters if dates not selected
      onApplyFilters({});
    }
    
    onClose();
  };

  const handleReset = () => {
    setStartDate('');
    setEndDate('');
    console.log('Resetting EV consumption filters...');
    
    // Reset filters
    onResetFilters();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Filter EV Consumption</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">From Date</Label>
            <MaterialDatePicker
              value={startDate}
              onChange={setStartDate}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">To Date</Label>
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
