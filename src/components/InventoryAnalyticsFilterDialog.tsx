import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';
import { TextField } from '@mui/material';
import { toast } from 'sonner';

interface InventoryAnalyticsFilterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: { startDate: string; endDate: string }) => void;
  currentStartDate?: Date;
  currentEndDate?: Date;
}

export const InventoryAnalyticsFilterDialog: React.FC<InventoryAnalyticsFilterDialogProps> = ({
  isOpen,
  onClose,
  onApplyFilters,
  currentStartDate,
  currentEndDate
}) => {
  // Helper to format date as YYYY-MM-DD (using local date components to avoid timezone issues)
  const formatDateForInput = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Function to get default date range (last 7 days to today)
  const getDefaultDates = () => {
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7);
    
    return {
      startDate: formatDateForInput(sevenDaysAgo),
      endDate: formatDateForInput(today)
    };
  };

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Set default dates when dialog opens - use current dates if provided, otherwise use defaults
  useEffect(() => {
    if (isOpen) {
      if (currentStartDate && currentEndDate) {
        // Use current applied dates
        setStartDate(formatDateForInput(currentStartDate));
        setEndDate(formatDateForInput(currentEndDate));
      } else {
        // Use default dates (last 7 days)
        const defaults = getDefaultDates();
        setStartDate(defaults.startDate);
        setEndDate(defaults.endDate);
      }
    }
  }, [isOpen, currentStartDate, currentEndDate]);

  const handleSubmit = () => {
    if (!startDate || !endDate) {
      toast.error('Please select both start and end dates');
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      toast.error('Start date cannot be after end date');
      return;
    }

    // Convert YYYY-MM-DD to DD/MM/YYYY for the parent component
    const formatToDisplayDate = (dateStr: string) => {
      const [year, month, day] = dateStr.split('-');
      return `${day}/${month}/${year}`;
    };

    onApplyFilters({
      startDate: formatToDisplayDate(startDate),
      endDate: formatToDisplayDate(endDate)
    });
    onClose();
    toast.success('Filters applied successfully');
  };

  const handleReset = () => {
    if (currentStartDate && currentEndDate) {
      // Reset to current applied dates
      setStartDate(formatDateForInput(currentStartDate));
      setEndDate(formatDateForInput(currentEndDate));
    } else {
      // Reset to default dates (last 7 days)
      const defaults = getDefaultDates();
      setStartDate(defaults.startDate);
      setEndDate(defaults.endDate);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold">Analytics Filter</DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="startDate">Start Date</Label>
            <TextField
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  height: '45px',
                },
              }}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="endDate">End Date</Label>
            <TextField
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  height: '45px',
                },
              }}
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
          <Button 
            onClick={handleSubmit}
            className="bg-[#C72030] hover:bg-[#C72030]/90 text-white"
          >
            Apply Filters
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
