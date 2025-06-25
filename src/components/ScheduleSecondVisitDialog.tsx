
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';

interface ScheduleSecondVisitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
}

export const ScheduleSecondVisitDialog = ({ open, onOpenChange, onSubmit }: ScheduleSecondVisitDialogProps) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [availableSlot, setAvailableSlot] = useState('');

  const handleSubmit = () => {
    onSubmit({
      selectedDate,
      availableSlot
    });
    setSelectedDate('');
    setAvailableSlot('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex flex-row items-center justify-between pb-0">
          <DialogTitle className="text-lg font-semibold">Schedule Second Visit</DialogTitle>
          <button
            onClick={() => onOpenChange(false)}
            className="text-red-500 hover:text-red-700"
          >
            <X className="h-4 w-4" />
          </button>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="selectDate" className="text-sm font-medium mb-2 block">
              Select Date
            </Label>
            <Input
              id="selectDate"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full"
            />
          </div>

          <div>
            <Label htmlFor="availableSlot" className="text-sm font-medium mb-2 block">
              Available Slot
            </Label>
            <Input
              id="availableSlot"
              placeholder="Enter available slot"
              value={availableSlot}
              onChange={(e) => setAvailableSlot(e.target.value)}
              className="w-full"
            />
          </div>
        </div>

        <div className="flex justify-center pt-4">
          <Button 
            onClick={handleSubmit}
            className="bg-green-600 hover:bg-green-700 text-white px-8"
          >
            Submit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
