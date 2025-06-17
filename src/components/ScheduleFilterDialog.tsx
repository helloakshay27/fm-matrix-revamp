
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from 'lucide-react';

interface ScheduleFilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ScheduleFilterDialog: React.FC<ScheduleFilterDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const [activityName, setActivityName] = useState('');
  const [type, setType] = useState('');
  const [category, setCategory] = useState('');

  const handleApply = () => {
    console.log('Applying filters:', { activityName, type, category });
    onOpenChange(false);
  };

  const handleReset = () => {
    setActivityName('');
    setType('');
    setCategory('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold">FILTER BY</DialogTitle>
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
          {/* Activity Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Activity Name</label>
            <Input
              placeholder="Enter Activity Name"
              value={activityName}
              onChange={(e) => setActivityName(e.target.value)}
            />
          </div>

          {/* Select Type */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Type</label>
            <Select value={type} onValueChange={setType}>
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

          {/* Select Category */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Category</label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Technical">Technical</SelectItem>
                <SelectItem value="Non Technical">Non Technical</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button 
              onClick={handleApply}
              style={{ backgroundColor: '#C72030' }}
              className="text-white hover:bg-[#C72030]/90 flex-1"
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
        </div>
      </DialogContent>
    </Dialog>
  );
};
