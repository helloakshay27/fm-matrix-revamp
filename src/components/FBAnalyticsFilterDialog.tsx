import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';
import { TextField } from '@mui/material';
import { toast } from 'sonner';

interface FBAnalyticsFilterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (startDate: string, endDate: string) => void;
  currentStartDate?: Date;
  currentEndDate?: Date;
}

export const FBAnalyticsFilterDialog: React.FC<FBAnalyticsFilterDialogProps> = ({
  isOpen,
  onClose,
  onApplyFilters,
  currentStartDate,
  currentEndDate
}) => {
  // Helper function to format date as YYYY-MM-DD (using local date components to avoid timezone issues)
  const formatDateForInput = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Function to get default date range (last 7 days to today)
  const getDefaultDates = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const sevenDaysAgo = new Date(today);
    // Include today + previous 6 days = past 7 days
    sevenDaysAgo.setDate(today.getDate() - 6);

    return {
      startDate: formatDateForInput(sevenDaysAgo),
      endDate: formatDateForInput(today),
    };
  };

  const defaultsOnMount = getDefaultDates();
  const [startDate, setStartDate] = useState(defaultsOnMount.startDate);
  const [endDate, setEndDate] = useState(defaultsOnMount.endDate);

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

    onApplyFilters(startDate, endDate);
    onClose();
    toast.success('Filters applied successfully');
  };

  const handleReset = () => {
    // Always reset to default dates (last 7 days)
    const defaults = getDefaultDates();
    setStartDate(defaults.startDate);
    setEndDate(defaults.endDate);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold">F&B Analytics Filter</DialogTitle>
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

