
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from 'lucide-react';

interface TaskAdvancedFilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApply: (filters: any) => void;
}

export const TaskAdvancedFilterDialog: React.FC<TaskAdvancedFilterDialogProps> = ({
  open,
  onOpenChange,
  onApply,
}) => {
  const [filters, setFilters] = useState({
    type: '',
    scheduleType: '',
    scheduleFor: '',
    group: '',
    subGroup: '',
    assignedTo: '',
    supplier: ''
  });

  const handleApply = () => {
    console.log('Applying Advanced filters:', filters);
    onApply(filters);
    onOpenChange(false);
  };

  const handleReset = () => {
    setFilters({
      type: '',
      scheduleType: '',
      scheduleFor: '',
      group: '',
      subGroup: '',
      assignedTo: '',
      supplier: ''
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold">Advanced Filter</DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* First Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Type</label>
              <Select value={filters.type} onValueChange={(value) => setFilters({ ...filters, type: value })}>
                <SelectTrigger className="text-sm">
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ppm">PPM</SelectItem>
                  <SelectItem value="breakdown">Breakdown</SelectItem>
                  <SelectItem value="preventive">Preventive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Schedule Type</label>
              <Select value={filters.scheduleType} onValueChange={(value) => setFilters({ ...filters, scheduleType: value })}>
                <SelectTrigger className="text-sm">
                  <SelectValue placeholder="Select Schedule Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Second Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Schedule For</label>
              <Input
                placeholder=""
                value={filters.scheduleFor}
                onChange={(e) => setFilters({ ...filters, scheduleFor: e.target.value })}
                className="text-sm"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Group</label>
              <Select value={filters.group} onValueChange={(value) => setFilters({ ...filters, group: value })}>
                <SelectTrigger className="text-sm">
                  <SelectValue placeholder="Select Group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cleaning">Cleaning</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="security">Security</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Third Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Sub Group</label>
              <Select value={filters.subGroup} onValueChange={(value) => setFilters({ ...filters, subGroup: value })}>
                <SelectTrigger className="text-sm">
                  <SelectValue placeholder="Select Sub Group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="washroom">Washroom</SelectItem>
                  <SelectItem value="lobby">Lobby</SelectItem>
                  <SelectItem value="lift">Lift</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Assigned To</label>
              <Select value={filters.assignedTo} onValueChange={(value) => setFilters({ ...filters, assignedTo: value })}>
                <SelectTrigger className="text-sm">
                  <SelectValue placeholder="Select Assigned To" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vinayak-mane">Vinayak Mane</SelectItem>
                  <SelectItem value="john-doe">John Doe</SelectItem>
                  <SelectItem value="jane-smith">Jane Smith</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Fourth Row */}
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Supplier</label>
              <Select value={filters.supplier} onValueChange={(value) => setFilters({ ...filters, supplier: value })}>
                <SelectTrigger className="text-sm">
                  <SelectValue placeholder="Select Supplier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="supplier-1">Supplier 1</SelectItem>
                  <SelectItem value="supplier-2">Supplier 2</SelectItem>
                  <SelectItem value="supplier-3">Supplier 3</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button 
            onClick={handleApply}
            style={{ backgroundColor: '#00C851' }}
            className="text-white hover:bg-green-600 px-8"
          >
            Apply
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
