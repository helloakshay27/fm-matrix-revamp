
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

interface EVConsumptionFilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApply: (filters: { dateRange: string }) => void;
}

export const EVConsumptionFilterDialog: React.FC<EVConsumptionFilterDialogProps> = ({ 
  open, 
  onOpenChange, 
  onApply 
}) => {
  const [dateRange, setDateRange] = useState('');

  const handleSubmit = () => {
    onApply({ dateRange });
    onOpenChange(false);
  };

  const handleReset = () => {
    setDateRange('');
  };

  const handleExport = () => {
    console.log('Export functionality triggered');
    // Add export logic here
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader className="flex flex-row items-center justify-between border-b pb-3">
          <DialogTitle className="text-lg font-semibold">FILTER BY</DialogTitle>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => onOpenChange(false)}
            className="h-6 w-6"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Date Range*</label>
            <Input 
              placeholder="Select Date Range"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full"
            />
          </div>

          <div className="flex justify-center gap-3 pt-6">
            <Button 
              onClick={handleSubmit}
              className="bg-[#C72030] hover:bg-[#A01A28] text-white px-8"
            >
              Submit
            </Button>
            <Button 
              onClick={handleExport}
              className="bg-[#C72030] hover:bg-[#A01A28] text-white px-8"
            >
              Export
            </Button>
            <Button 
              variant="outline"
              onClick={handleReset}
              className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8"
            >
              Reset
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
