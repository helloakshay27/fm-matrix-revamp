
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from "lucide-react";

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
    location: 'Jyoti Tower',
    floor: 'Ground Floor - - Jyoti',
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
      <DialogContent className="sm:max-w-lg">
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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Location</label>
              <Select value={filters.location} onValueChange={(value) => setFilters({ ...filters, location: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Jyoti Tower">Jyoti Tower</SelectItem>
                  <SelectItem value="Main Building">Main Building</SelectItem>
                  <SelectItem value="Annex Building">Annex Building</SelectItem>
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
                  <SelectItem value="Ground Floor - - Jyoti">Ground Floor - - Jyoti</SelectItem>
                  <SelectItem value="1st Floor - - Jyoti">1st Floor - - Jyoti</SelectItem>
                  <SelectItem value="2nd Floor - - Jyoti">2nd Floor - - Jyoti</SelectItem>
                  <SelectItem value="3rd Floor - - Jyoti">3rd Floor - - Jyoti</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Start Date</label>
              <Input
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                className="text-sm"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">End Date</label>
              <Input
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
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
            className="flex-1 bg-[#007BFF] hover:bg-[#0056b3] text-white"
          >
            Apply
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
