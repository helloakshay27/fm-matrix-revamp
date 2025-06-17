
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { X } from "lucide-react";

interface CreateShiftDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreateShiftDialog = ({ open, onOpenChange }: CreateShiftDialogProps) => {
  const [fromHour, setFromHour] = useState<string>("");
  const [fromMinute, setFromMinute] = useState<string>("");
  const [toHour, setToHour] = useState<string>("");
  const [toMinute, setToMinute] = useState<string>("");
  const [checkInMargin, setCheckInMargin] = useState<boolean>(false);

  const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
  const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));

  const handleCreate = () => {
    console.log("Creating shift:", {
      from: `${fromHour}:${fromMinute}`,
      to: `${toHour}:${toMinute}`,
      checkInMargin
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Create Shift
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Shift Timings From */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Shift Timings From
            </label>
            <div className="flex gap-2">
              <Select value={fromHour} onValueChange={setFromHour}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="00" />
                </SelectTrigger>
                <SelectContent>
                  {hours.map((hour) => (
                    <SelectItem key={hour} value={hour}>
                      {hour}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={fromMinute} onValueChange={setFromMinute}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="00" />
                </SelectTrigger>
                <SelectContent>
                  {minutes.map((minute) => (
                    <SelectItem key={minute} value={minute}>
                      {minute}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Shift Timings To */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Shift Timings To
            </label>
            <div className="flex gap-2">
              <Select value={toHour} onValueChange={setToHour}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="00" />
                </SelectTrigger>
                <SelectContent>
                  {hours.map((hour) => (
                    <SelectItem key={hour} value={hour}>
                      {hour}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={toMinute} onValueChange={setToMinute}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="00" />
                </SelectTrigger>
                <SelectContent>
                  {minutes.map((minute) => (
                    <SelectItem key={minute} value={minute}>
                      {minute}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Check In Margin */}
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="check-in-margin" 
              checked={checkInMargin}
              onCheckedChange={(checked) => setCheckInMargin(checked as boolean)}
            />
            <label 
              htmlFor="check-in-margin" 
              className="text-sm font-medium text-gray-700"
            >
              Check In Margin
            </label>
          </div>

          {/* Create Button */}
          <div className="flex justify-center pt-4">
            <Button 
              onClick={handleCreate}
              className="bg-[#8B4D6B] hover:bg-[#8B4D6B]/90 text-white px-8"
            >
              Create
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
