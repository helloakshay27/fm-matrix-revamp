import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { MaterialDatePicker } from '@/components/ui/material-date-picker';
import { format } from 'date-fns';

interface TicketAnalyticsFilterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: { startDate: string; endDate: string }) => void;
}

export const TicketAnalyticsFilterDialog: React.FC<TicketAnalyticsFilterDialogProps> = ({
  isOpen,
  onClose,
  onApplyFilters
}) => {
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const handleSubmit = () => {
    if (startDate && endDate) {
      onApplyFilters({ startDate, endDate });
      onClose();
    }
  };

  const handleReset = () => {
    setStartDate('');
    setEndDate('');
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-900">
            Filter Ticket Analytics
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
            />
          </div>
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