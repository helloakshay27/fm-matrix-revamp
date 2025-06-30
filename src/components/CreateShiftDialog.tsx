import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CreateShiftDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreateShiftDialog = ({ open, onOpenChange }: CreateShiftDialogProps) => {
  const { toast } = useToast();
  const [fromHour, setFromHour] = useState<string>("");
  const [fromMinute, setFromMinute] = useState<string>("");
  const [toHour, setToHour] = useState<string>("");
  const [toMinute, setToMinute] = useState<string>("");
  const [checkInMargin, setCheckInMargin] = useState<boolean>(false);

  const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
  const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));

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

  const handleCreate = () => {
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

    console.log("Creating shift:", {
      timings: `${fromTime} to ${toTime}`,
      totalHours: Math.round(totalHours),
      checkInMargin: checkInMargin ? "1h0m" : "0h0m",
      createdOn: new Date().toLocaleDateString('en-GB'),
      createdBy: "Current User"
    });

    toast({
      title: "Success",
      description: "Shift created successfully",
    });

    // Reset form
    setFromHour("");
    setFromMinute("");
    setToHour("");
    setToMinute("");
    setCheckInMargin(false);
    
    onOpenChange(false);
  };

  const handleClose = () => {
    setFromHour("");
    setFromMinute("");
    setToHour("");
    setToMinute("");
    setCheckInMargin(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Create Shift
            <Button
              variant="icon"
              size="icon-sm"
              onClick={handleClose}
              className="h-8 w-8 p-1 bg-[#C72030] text-white hover:bg-[#C72030]/90 rounded-none shadow-none"
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
                className="bg-[#C72030] text-white px-3 py-1 rounded-none text-xs h-10 min-w-[40px] shadow-none hover:bg-[#C72030]/90"
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
                className="bg-[#C72030] text-white px-3 py-1 rounded-none text-xs h-10 min-w-[40px] shadow-none hover:bg-[#C72030]/90"
                disabled
              >
                PM
              </Button>
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
              className="bg-[#C72030] hover:bg-[#C72030]/90 text-white px-8 rounded-none shadow-none"
            >
              Create
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
