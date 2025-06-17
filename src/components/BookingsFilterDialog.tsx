
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
    status: string;
    scheduledOn: string;
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
    status: '',
    scheduledOn: '',
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
      status: '',
      scheduledOn: '',
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
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Search by Name or Email</label>
              <Input
                placeholder="Search by Name or Email"
                value={filters.searchByNameOrEmail}
                onChange={(e) => setFilters({ ...filters, searchByNameOrEmail: e.target.value })}
                className="text-sm h-10 bg-gray-50"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Category</label>
              <Select value={filters.category} onValueChange={(value) => setFilters({ ...filters, category: value })}>
                <SelectTrigger className="text-sm h-10 bg-gray-50">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="angular-war">Angular War</SelectItem>
                  <SelectItem value="cubical">Cubical</SelectItem>
                  <SelectItem value="fixed-desk">Fixed Desk</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Scheduled On</label>
              <Input
                placeholder="Scheduled on"
                value={filters.scheduledOn}
                onChange={(e) => setFilters({ ...filters, scheduledOn: e.target.value })}
                className="text-sm h-10 bg-gray-50"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Status</label>
              <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
                <SelectTrigger className="text-sm h-10 bg-gray-50">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Booked On</label>
            <Input
              placeholder="Booked on"
              value={filters.bookedOn}
              onChange={(e) => setFilters({ ...filters, bookedOn: e.target.value })}
              className="text-sm h-10 bg-gray-50"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              onClick={handleApply}
              className="flex-1 bg-[#8B4A9C] hover:bg-[#7A4089] text-white h-12"
            >
              Apply
            </Button>
            <Button 
              onClick={handleReset}
              variant="outline"
              className="flex-1 h-12 border-gray-300"
            >
              Reset
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
