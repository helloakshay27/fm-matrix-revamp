import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { MaterialDatePicker } from '@/components/ui/material-date-picker';
import { X } from 'lucide-react';
import { SolarGeneratorFilters } from '@/services/solarGeneratorAPI';

interface UtilitySolarGeneratorFilterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters?: (filters: SolarGeneratorFilters) => void;
  onResetFilters?: () => void;
}

export const UtilitySolarGeneratorFilterDialog = ({
  isOpen,
  onClose,
  onApplyFilters,
  onResetFilters
}: UtilitySolarGeneratorFilterDialogProps) => {
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const handleSubmit = () => {
    const filters: SolarGeneratorFilters = {};
    
    if (startDate && endDate) {
      // Pass date range as string in DD/MM/YYYY - DD/MM/YYYY format (will be converted in dashboard)
      filters.date_range = `${startDate} - ${endDate}`;
    }

    console.log('Filtering solar generator data with filters:', filters);
    
    if (onApplyFilters) {
      onApplyFilters(filters);
    }
    onClose();
  };

  const handleReset = () => {
    setStartDate('');
    setEndDate('');
    if (onResetFilters) {
      onResetFilters();
    }
    console.log('Resetting solar generator filters...');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Filter Solar Generator</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-4">
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