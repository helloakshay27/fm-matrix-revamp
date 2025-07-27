import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MaterialDatePicker } from '@/components/ui/material-date-picker';
import { format } from 'date-fns';

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
  const [startDate, setStartDate] = useState<string>(format(new Date(new Date().getFullYear() - 1, new Date().getMonth(), new Date().getDate()), 'dd/MM/yyyy'));
  const [endDate, setEndDate] = useState<string>(format(new Date(), 'dd/MM/yyyy'));

  useEffect(() => {
    if (isOpen) {
      const lastYear = new Date();
      lastYear.setFullYear(lastYear.getFullYear() - 1);
      setStartDate(format(lastYear, 'dd/MM/yyyy'));
      setEndDate(format(new Date(), 'dd/MM/yyyy'));
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (startDate && endDate) {
      onApplyFilters({
        startDate: startDate,
        endDate: endDate
      });
      onClose();
    }
  };

  const handleReset = () => {
    const lastYear = new Date();
    lastYear.setFullYear(lastYear.getFullYear() - 1);
    setStartDate(format(lastYear, 'dd/MM/yyyy'));
    setEndDate(format(new Date(), 'dd/MM/yyyy'));
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Filter Inventory Analytics</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Start Date</label>
              <MaterialDatePicker
                value={startDate}
                onChange={setStartDate}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">End Date</label>
              <MaterialDatePicker
                value={endDate}
                onChange={setEndDate}
              />
            </div>
          </div>
          
          <div className="flex justify-between pt-4">
            <Button type="button" variant="outline" onClick={handleReset}>
              Reset
            </Button>
            <div className="space-x-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={!startDate || !endDate}>
                Apply Filters
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};