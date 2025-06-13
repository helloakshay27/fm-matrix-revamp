
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';

interface GVehicleFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GVehicleFilterModal = ({ isOpen, onClose }: GVehicleFilterModalProps) => {
  const [personToMeet, setPersonToMeet] = useState('');
  const [inDate, setInDate] = useState('');

  const handleApply = () => {
    console.log('Filter applied:', { personToMeet, inDate });
    onClose();
  };

  const handleReset = () => {
    setPersonToMeet('');
    setInDate('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-white">
        <DialogHeader className="flex flex-row items-center justify-between border-b pb-4">
          <DialogTitle className="text-lg font-semibold">FILTER BY</DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Select Person To Meet */}
            <div className="space-y-2">
              <Label htmlFor="personToMeet" className="text-sm font-medium">
                Select Person To Meet
              </Label>
              <Select value={personToMeet} onValueChange={setPersonToMeet}>
                <SelectTrigger className="border-gray-300">
                  <SelectValue placeholder="Select Person To Meet" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="person1">Person 1</SelectItem>
                  <SelectItem value="person2">Person 2</SelectItem>
                  <SelectItem value="person3">Person 3</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* In Date */}
            <div className="space-y-2">
              <Label htmlFor="inDate" className="text-sm font-medium">
                In Date
              </Label>
              <Select value={inDate} onValueChange={setInDate}>
                <SelectTrigger className="border-gray-300">
                  <SelectValue placeholder="Select Created Date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="yesterday">Yesterday</SelectItem>
                  <SelectItem value="lastWeek">Last Week</SelectItem>
                  <SelectItem value="lastMonth">Last Month</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              onClick={handleReset}
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-2"
            >
              Reset
            </Button>
            <Button
              onClick={handleApply}
              className="bg-[#8B4B8C] hover:bg-[#7A4077] text-white px-6 py-2"
            >
              Apply
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
