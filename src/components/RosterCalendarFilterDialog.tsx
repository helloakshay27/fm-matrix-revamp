
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface RosterCalendarFilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApply: (filters: {
    location: string;
    floor: string;
    startDate: string;
    endDate: string;
  }) => void;
}

export const RosterCalendarFilterDialog: React.FC<RosterCalendarFilterDialogProps> = ({
  open,
  onOpenChange,
  onApply,
}) => {
  const [filters, setFilters] = useState({
    location: 'HDFC Ergo Bhandup',
    floor: 'Floor 1 - Wing 1 - HDFC',
    startDate: '01/06/2025',
    endDate: '30/06/2025'
  });

  const handleApply = () => {
    console.log('Applying Roster Calendar filters:', filters);
    onApply(filters);
    onOpenChange(false);
  };

  const handleReset = () => {
    setFilters({
      location: '',
      floor: '',
      startDate: '',
      endDate: ''
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="space-y-0 pb-4">
          <DialogTitle className="text-lg font-semibold">Filter</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Location</label>
              <Select value={filters.location} onValueChange={(value) => setFilters({ ...filters, location: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="HDFC Ergo Bhandup">HDFC Ergo Bhandup</SelectItem>
                  <SelectItem value="Main Office">Main Office</SelectItem>
                  <SelectItem value="Branch Office">Branch Office</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Floor</label>
              <Select value={filters.floor} onValueChange={(value) => setFilters({ ...filters, floor: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Floor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Floor 1 - Wing 1 - HDFC">Floor 1 - Wing 1 - HDFC</SelectItem>
                  <SelectItem value="Floor 2 - Wing 1 - HDFC">Floor 2 - Wing 1 - HDFC</SelectItem>
                  <SelectItem value="Floor 3 - Wing 1 - HDFC">Floor 3 - Wing 1 - HDFC</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Start Date</label>
              <Input
                value={filters.startDate}
                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                placeholder="dd/mm/yyyy"
                className="text-sm"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">End Date</label>
              <Input
                value={filters.endDate}
                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                placeholder="dd/mm/yyyy"
                className="text-sm"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button 
            onClick={handleReset}
            variant="outline"
            className="flex-1"
          >
            Reset
          </Button>
          <Button 
            onClick={handleApply}
            className="flex-1 bg-[#C72030] hover:bg-[#A01020] text-white"
          >
            Apply
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
