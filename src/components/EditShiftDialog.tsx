import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();
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

  const validateForm = () => {
    if (!fromHour || !fromMinute || !toHour || !toMinute) {
      toast({
        title: "Validation Error",
        description: "Please fill in all time fields",
        variant: "destructive",
      });
      return false;
    }

    const fromTime = parseInt(fromHour) * 60 + parseInt(fromMinute);
    const toTime = parseInt(toHour) * 60 + parseInt(toMinute);

    if (fromTime >= toTime) {
      toast({
        title: "Validation Error",
        description: "End time must be after start time",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleUpdate = () => {
    if (!validateForm()) return;

    const formatTime = (hour: string, minute: string) => {
      const h = parseInt(hour);
      const m = parseInt(minute);
      const period = h >= 12 ? 'PM' : 'AM';
      const displayHour = h === 0 ? 12 : h > 12 ? h - 12 : h;
      return `${String(displayHour).padStart(2, '0')}:${minute} ${period}`;
    };

    const fromTime = formatTime(fromHour, fromMinute);
    const toTime = formatTime(toHour, toMinute);
    
    const totalHours = Math.abs(
      (parseInt(toHour) * 60 + parseInt(toMinute)) - 
      (parseInt(fromHour) * 60 + parseInt(fromMinute))
    ) / 60;

    console.log("Updating shift:", {
      id: shift?.id,
      timings: `${fromTime} to ${toTime}`,
      totalHours: Math.round(totalHours),
      checkInMargin: checkInMargin ? "1h0m" : "0h0m"
    });

    toast({
      title: "Success",
      description: "Shift updated successfully",
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
              Shift Timings From <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              <Select value={fromHour} onValueChange={setFromHour}>
                <SelectTrigger className="flex-1 rounded-none border border-gray-300 h-10">
                  <SelectValue placeholder="HH" />
                </SelectTrigger>
                <SelectContent className="bg-white max-h-60 rounded-none">
                  {hours.map((hour) => (
                    <SelectItem key={hour} value={hour}>
                      {hour}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span className="flex items-center text-gray-500">:</span>
              <Select value={fromMinute} onValueChange={setFromMinute}>
                <SelectTrigger className="flex-1 rounded-none border border-gray-300 h-10">
                  <SelectValue placeholder="MM" />
                </SelectTrigger>
                <SelectContent className="bg-white max-h-60 rounded-none">
                  {minutes.map((minute) => (
                    <SelectItem key={minute} value={minute}>
                      {minute}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button 
                className="bg-red-600 text-white px-3 py-1 rounded-none text-xs h-10 min-w-[40px]"
                disabled
              >
                AM
              </Button>
            </div>
          </div>

          {/* Shift Timings To */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Shift Timings To <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              <Select value={toHour} onValueChange={setToHour}>
                <SelectTrigger className="flex-1 rounded-none border border-gray-300 h-10">
                  <SelectValue placeholder="HH" />
                </SelectTrigger>
                <SelectContent className="bg-white max-h-60 rounded-none">
                  {hours.map((hour) => (
                    <SelectItem key={hour} value={hour}>
                      {hour}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span className="flex items-center text-gray-500">:</span>
              <Select value={toMinute} onValueChange={setToMinute}>
                <SelectTrigger className="flex-1 rounded-none border border-gray-300 h-10">
                  <SelectValue placeholder="MM" />
                </SelectTrigger>
                <SelectContent className="bg-white max-h-60 rounded-none">
                  {minutes.map((minute) => (
                    <SelectItem key={minute} value={minute}>
                      {minute}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button 
                className="bg-red-600 text-white px-3 py-1 rounded-none text-xs h-10 min-w-[40px]"
                disabled
              >
                PM
              </Button>
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
              className="bg-[#C72030] hover:bg-[#C72030]/90 text-white px-8 rounded-none"
            >
              Update
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
