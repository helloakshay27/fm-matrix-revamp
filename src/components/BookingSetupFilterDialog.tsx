
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from "lucide-react";

interface BookingSetupFilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApply: (filters: {
    dateRange: string;
    facilityType: string;
    bookingMethod: string;
  }) => void;
}

export const BookingSetupFilterDialog: React.FC<BookingSetupFilterDialogProps> = ({
  open,
  onOpenChange,
  onApply,
}) => {
  const [filters, setFilters] = useState({
    dateRange: '',
    facilityType: '',
    bookingMethod: ''
  });

  const handleApply = () => {
    console.log('Applying Booking Setup filters:', filters);
    onApply(filters);
    onOpenChange(false);
  };

  const handleReset = () => {
    setFilters({
      dateRange: '',
      facilityType: '',
      bookingMethod: ''
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <DialogTitle className="text-lg font-semibold">Filter</DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Select date range</label>
            <Input
              placeholder="Select Date Range"
              value={filters.dateRange}
              onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
              className="text-sm"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium mb-2 block">Facility Type</label>
            <Input
              placeholder=""
              value={filters.facilityType}
              onChange={(e) => setFilters({ ...filters, facilityType: e.target.value })}
              className="text-sm"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Booking Method</label>
            <Input
              placeholder=""
              value={filters.bookingMethod}
              onChange={(e) => setFilters({ ...filters, bookingMethod: e.target.value })}
              className="text-sm"
            />
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button 
            onClick={handleApply}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
          >
            Apply Filters
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
