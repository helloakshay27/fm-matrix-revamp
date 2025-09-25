import React, { useMemo, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { MaterialDatePicker } from '@/components/ui/material-date-picker';
import { DialogClose } from '@radix-ui/react-dialog';
import { X } from 'lucide-react';

interface InventoryAnalyticsFilterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: { startDate: string; endDate: string }) => void;
}

export const InventoryAnalyticsFilterDialog: React.FC<InventoryAnalyticsFilterDialogProps> = ({
  isOpen,
  onClose,
  onApplyFilters
}) => {
  // Set default dates: last year to today
  const getDefaultDates = () => {
    const today = new Date();
    const lastYear = new Date();
    lastYear.setFullYear(today.getFullYear() - 1);
    
    const formatDate = (date: Date) => {
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    };
    
    return {
      startDate: formatDate(lastYear),
      endDate: formatDate(today)
    };
  };

  const defaultDates = getDefaultDates();
  const [startDate, setStartDate] = useState<string>(defaultDates.startDate);
  const [endDate, setEndDate] = useState<string>(defaultDates.endDate);
  const [error, setError] = useState<string>("");

  const parseDate = (dateStr: string): Date | null => {
    if (!dateStr) return null;
    const [day, month, year] = dateStr.split("/").map(Number);
    return new Date(year, month - 1, day);
  };

  const startDateObj = useMemo(() => parseDate(startDate), [startDate]);
  const endDateObj = useMemo(() => parseDate(endDate), [endDate]);

  const handleSubmit = () => {
    const start = parseDate(startDate);
    const end = parseDate(endDate);

    if (start && end && start > end) {
      setError("Start Date cannot be greater than End Date");
      return;
    }

    setError("");
    if (startDate && endDate) {
      onApplyFilters({ startDate, endDate });
      onClose();
    }
  };

  const handleReset = () => {
    setStartDate('');
    setEndDate('');
    setError('');
  };

  const handleClose = () => {
    setError('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogClose asChild>
          <button
            type="button"
            aria-label="Close"
            className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-md  text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-black"
          >
            <X className="h-4 w-4" />
          </button>
        </DialogClose>

        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-900">
            Filter Inventory Analytics
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="startDate" className="text-sm font-medium text-gray-700">
              Start Date
            </Label>
            <MaterialDatePicker
              value={startDate}
              onChange={setStartDate}
              placeholder="Select start date"
              className="w-full"
              maxDate={endDateObj ?? undefined}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="endDate" className="text-sm font-medium text-gray-700">
              End Date
            </Label>
            <MaterialDatePicker
              value={endDate}
              onChange={setEndDate}
              placeholder="Select end date"
              className="w-full"
              minDate={startDateObj ?? undefined}
            />
          </div>

          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            className="px-4 py-2"
          >
            Reset
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={!startDate || !endDate}
            className="px-4 py-2 bg-[#C72030] hover:bg-[#B71C2C] text-white"
          >
            Apply
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
