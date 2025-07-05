
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from "lucide-react";

interface BookingsFilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApply: (filters: {
    searchByNameOrEmail: string;
    category: string;
    scheduledOn: string;
    status: string;
    bookedOn: string;
  }) => void;
}

export const BookingsFilterDialog: React.FC<BookingsFilterDialogProps> = ({
  open,
  onOpenChange,
  onApply,
}) => {
  const [filters, setFilters] = useState({
    searchByNameOrEmail: '',
    category: '',
    scheduledOn: '',
    status: '',
    bookedOn: ''
  });

  const handleApply = () => {
    console.log('Applying Bookings filters:', filters);
    onApply(filters);
    onOpenChange(false);
  };

  const handleReset = () => {
    setFilters({
      searchByNameOrEmail: '',
      category: '',
      scheduledOn: '',
      status: '',
      bookedOn: ''
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md [&>button]:hidden">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <DialogTitle className="text-lg font-semibold">FILTER BY</DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Input
                label="Search by Name or Email"
                placeholder=""
                value={filters.searchByNameOrEmail}
                onChange={(e) => setFilters({ ...filters, searchByNameOrEmail: e.target.value })}
                className="border-gray-300 focus:border-[#C72030] focus:ring-1 focus:ring-[#C72030]"
              />
            </div>
            
            <div className="relative">
              <Select value={filters.category} onValueChange={(value) => setFilters({ ...filters, category: value })}>
                <SelectTrigger className="h-[36px] border-gray-300 focus:border-[#C72030] focus:ring-1 focus:ring-[#C72030]">
                  <SelectValue placeholder="" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="angular-war">Angular War</SelectItem>
                  <SelectItem value="react-zone">React Zone</SelectItem>
                  <SelectItem value="vue-area">Vue Area</SelectItem>
                </SelectContent>
              </Select>
              <label className="absolute left-[15px] -top-[10px] text-[0.9em] text-black bg-white px-1 pointer-events-none">
                Category
              </label>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Input
                label="Scheduled On"
                placeholder=""
                value={filters.scheduledOn}
                onChange={(e) => setFilters({ ...filters, scheduledOn: e.target.value })}
                className="border-gray-300 focus:border-[#C72030] focus:ring-1 focus:ring-[#C72030]"
              />
            </div>
            
            <div className="relative">
              <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
                <SelectTrigger className="h-[36px] border-gray-300 focus:border-[#C72030] focus:ring-1 focus:ring-[#C72030]">
                  <SelectValue placeholder="" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
              <label className="absolute left-[15px] -top-[10px] text-[0.9em] text-black bg-white px-1 pointer-events-none">
                Status
              </label>
            </div>
          </div>

          <div>
            <Input
              label="Booked On"
              placeholder=""
              value={filters.bookedOn}
              onChange={(e) => setFilters({ ...filters, bookedOn: e.target.value })}
              className="border-gray-300 focus:border-[#C72030] focus:ring-1 focus:ring-[#C72030]"
            />
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button 
            onClick={handleApply}
            style={{ backgroundColor: '#C72030', color: 'white' }}
            className="flex-1 hover:opacity-90 border-0"
          >
            Apply
          </Button>
          <Button 
            onClick={handleReset}
            variant="outline"
            className="flex-1"
          >
            Reset
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
