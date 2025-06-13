
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from "lucide-react";

interface OutstationFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OutstationFilterModal = ({ isOpen, onClose }: OutstationFilterModalProps) => {
  const [filters, setFilters] = useState({
    employeeName: "",
    status: "",
    bookedOn: ""
  });

  const handleApply = () => {
    console.log("Applying filters:", filters);
    onClose();
  };

  const handleReset = () => {
    setFilters({ employeeName: "", status: "", bookedOn: "" });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold">FILTER BY</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-6 w-6"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Employee Name</Label>
            <Input
              placeholder="Enter Employee Name"
              value={filters.employeeName}
              onChange={(e) => setFilters(prev => ({ ...prev, employeeName: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label>Status</Label>
            <Select 
              value={filters.status} 
              onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="requested">Requested</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Booked On</Label>
            <Input
              type="date"
              placeholder="Booked on"
              value={filters.bookedOn}
              onChange={(e) => setFilters(prev => ({ ...prev, bookedOn: e.target.value }))}
            />
          </div>
        </div>

        <div className="flex justify-center gap-4 pt-4">
          <Button 
            onClick={handleApply}
            className="bg-purple-700 hover:bg-purple-800 text-white px-8"
          >
            Apply
          </Button>
          <Button 
            variant="outline" 
            onClick={handleReset}
            className="px-8"
          >
            Reset
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
