import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface ResponseAnalyticsFilterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (startDate: string, endDate: string) => void;
}

export const ResponseAnalyticsFilterDialog: React.FC<ResponseAnalyticsFilterDialogProps> = ({
  isOpen,
  onClose,
  onApplyFilters,
}) => {
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      // Set default dates
      setStartDate('2024-08-06');
      setEndDate('2025-08-06');
    }
  }, [isOpen]);

  const handleSubmit = () => {
    if (startDate && endDate) {
      onApplyFilters(startDate, endDate);
      onClose();
    }
  };

  const handleReset = () => {
    setStartDate('2024-08-06');
    setEndDate('2025-08-06');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px] p-0">
        {/* Header */}
        <DialogHeader className="flex flex-row items-center justify-between p-4 pb-0">
          <DialogTitle className="text-lg font-semibold">Analytics Filter</DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-6 w-6 p-0 hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        {/* Content */}
        <div className="p-4 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Start Date</label>
            <div className="relative">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">End Date</label>
            <div className="relative">
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-2 p-4 pt-0">
          <Button
            variant="outline"
            onClick={handleReset}
            className="px-6 py-2 border-[#C72030] text-[#C72030] hover:bg-[#C72030]/5"
          >
            Reset
          </Button>
          <Button
            variant="outline"
            onClick={onClose}
            className="px-6 py-2"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="px-6 py-2 bg-[#C72030] hover:bg-[#C72030]/90 text-white"
          >
            Apply Filters
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};