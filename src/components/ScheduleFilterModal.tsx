
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface ScheduleFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: any) => void;
}

export const ScheduleFilterModal = ({ isOpen, onClose, onApply }: ScheduleFilterModalProps) => {
  const [filters, setFilters] = useState({
    activityName: '',
    type: '',
    category: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const handleReset = () => {
    setFilters({
      activityName: '',
      type: '',
      category: ''
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>FILTER BY</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="activity-name">Activity Name</Label>
            <Input
              id="activity-name"
              placeholder="Enter Activity Name"
              value={filters.activityName}
              onChange={(e) => handleInputChange('activityName', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="select-type">Select Type</Label>
            <Select value={filters.type} onValueChange={(value) => handleInputChange('type', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PPM">PPM</SelectItem>
                <SelectItem value="Routine">Routine</SelectItem>
                <SelectItem value="AMC">AMC</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="select-category">Select Category</Label>
            <Select value={filters.category} onValueChange={(value) => handleInputChange('category', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Technical">Technical</SelectItem>
                <SelectItem value="Non Technical">Non Technical</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-between pt-4">
            <Button 
              onClick={handleApply}
              style={{ backgroundColor: '#C72030' }}
              className="text-white px-8"
            >
              Apply
            </Button>
            <Button variant="outline" onClick={handleReset}>
              Reset
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
