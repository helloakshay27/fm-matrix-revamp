
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';

interface EVConsumptionFilterDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EVConsumptionFilterDialog = ({ isOpen, onClose }: EVConsumptionFilterDialogProps) => {
  const [dateRange, setDateRange] = useState('');

  const handleSubmit = () => {
    console.log('Filter submitted with date range:', dateRange);
    // Add your submit logic here
    onClose();
  };

  const handleExport = () => {
    console.log('Export functionality triggered');
    // Add your export logic here
  };

  const handleReset = () => {
    setDateRange('');
    console.log('Filter reset');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white p-0">
        <DialogHeader className="flex flex-row items-center justify-between p-4 border-b">
          <DialogTitle className="text-lg font-semibold">FILTER BY</DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <div className="p-6 space-y-6">
          {/* Date Range */}
          <div className="space-y-2">
            <Label htmlFor="dateRange" className="text-sm font-medium text-gray-700">
              Date Range*
            </Label>
            <Input
              id="dateRange"
              placeholder="Select Date Range"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="border-gray-300"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-3 pt-4">
            <Button
              onClick={handleSubmit}
              className="bg-[#8B4B8C] hover:bg-[#7A4077] text-white px-8 py-2 rounded"
            >
              Submit
            </Button>
            <Button
              onClick={handleExport}
              className="bg-[#8B4B8C] hover:bg-[#7A4077] text-white px-8 py-2 rounded"
            >
              Export
            </Button>
            <Button
              onClick={handleReset}
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-2 rounded"
            >
              Reset
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
