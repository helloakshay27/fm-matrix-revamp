
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { X } from "lucide-react";

interface ShiftData {
  id: number;
  timings: string;
  totalHours: number;
  checkInMargin: string;
  createdOn: string;
  createdBy: string;
}

interface EditShiftDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shift: ShiftData | null;
}

export const EditShiftDialog = ({ open, onOpenChange, shift }: EditShiftDialogProps) => {
  const [fromHour, setFromHour] = useState<string>("");
  const [fromMinute, setFromMinute] = useState<string>("");
  const [toHour, setToHour] = useState<string>("");
  const [toMinute, setToMinute] = useState<string>("");
  const [checkInMargin, setCheckInMargin] = useState<boolean>(false);

  const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
  const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));

  // Parse shift timings when dialog opens
  useEffect(() => {
    if (shift && open) {
      // Parse timings like "08:00 AM to 05:00 PM"
      const timingParts = shift.timings.split(' to ');
      if (timingParts.length === 2) {
        const fromTime = timingParts[0].trim();
        const toTime = timingParts[1].trim();
        
        // Convert from 12-hour to 24-hour format
        const parseTime = (timeStr: string) => {
          const [time, period] = timeStr.split(' ');
          const [hours, minutes] = time.split(':');
          let hour24 = parseInt(hours);
          
          if (period === 'PM' && hour24 !== 12) {
            hour24 += 12;
          } else if (period === 'AM' && hour24 === 12) {
            hour24 = 0;
          }
          
          return {
            hour: String(hour24).padStart(2, '0'),
            minute: minutes
          };
        };
        
        const fromParsed = parseTime(fromTime);
        const toParsed = parseTime(toTime);
        
        setFromHour(fromParsed.hour);
        setFromMinute(fromParsed.minute);
        setToHour(toParsed.hour);
        setToMinute(toParsed.minute);
      }
      
      // Set check in margin based on the value
      setCheckInMargin(shift.checkInMargin !== "0h0m");
    }
  }, [shift, open]);

  const handleUpdate = () => {
    console.log("Updating shift:", {
      id: shift?.id,
      from: `${fromHour}:${fromMinute}`,
      to: `${toHour}:${toMinute}`,
      checkInMargin
    });
    onOpenChange(false);
  };

  const handleClose = () => {
    onOpenChange(false);
    // Reset form when closing
    setFromHour("");
    setFromMinute("");
    setToHour("");
    setToMinute("");
    setCheckInMargin(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Edit Shift
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
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
                  <SelectValue placeholder="08" />
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
                  <SelectValue placeholder="17" />
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
              id="check-in-margin-edit" 
              checked={checkInMargin}
              onCheckedChange={(checked) => setCheckInMargin(checked as boolean)}
            />
            <label 
              htmlFor="check-in-margin-edit" 
              className="text-sm font-medium text-gray-700"
            >
              Check In Margin
            </label>
          </div>

          {/* Update Button */}
          <div className="flex justify-center pt-4">
            <Button 
              onClick={handleUpdate}
              className="bg-[#8B4D6B] hover:bg-[#8B4D6B]/90 text-white px-8"
            >
              Update
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
