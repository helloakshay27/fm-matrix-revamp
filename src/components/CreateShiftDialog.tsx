import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { X, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { API_CONFIG, getAuthHeader } from "@/config/apiConfig";
import { toast as sonnerToast } from 'sonner';

interface CreateShiftDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onShiftCreated?: () => void;
}

export const CreateShiftDialog = ({ open, onOpenChange, onShiftCreated }: CreateShiftDialogProps) => {
  const { toast } = useToast();
  const [fromHour, setFromHour] = useState<string>("");
  const [fromMinute, setFromMinute] = useState<string>("");
  const [fromAmPm, setFromAmPm] = useState<string>("");
  const [toHour, setToHour] = useState<string>("");
  const [toMinute, setToMinute] = useState<string>("");
  const [toAmPm, setToAmPm] = useState<string>("");
  const [checkInMargin, setCheckInMargin] = useState<boolean>(false);
  const [hourMargin, setHourMargin] = useState<string>("0");
  const [minMargin, setMinMargin] = useState<string>("0");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const hours = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
  const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));

  // Convert 12-hour to 24-hour format
  const convertTo24Hour = (hour: string, ampm: string) => {
    let hourNum = parseInt(hour);
    if (ampm === 'AM' && hourNum === 12) {
      hourNum = 0;
    } else if (ampm === 'PM' && hourNum !== 12) {
      hourNum += 12;
    }
    return String(hourNum).padStart(2, '0');
  };

  const validateForm = () => {
    if (!fromHour || !fromMinute || !toHour || !toMinute) {
      toast({
        title: "Validation Error",
        description: "Please fill in all time fields",
        variant: "destructive",
      });
      return false;
    }

    const fromTime24 = convertTo24Hour(fromHour, fromAmPm);
    const toTime24 = convertTo24Hour(toHour, toAmPm);
    const fromTimeMinutes = parseInt(fromTime24) * 60 + parseInt(fromMinute);
    const toTimeMinutes = parseInt(toTime24) * 60 + parseInt(toMinute);

    if (fromTimeMinutes >= toTimeMinutes) {
      toast({
        title: "Validation Error",
        description: "End time must be after start time",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleCreate = async () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);

    // Convert to 24-hour format for API
    const startHour24 = convertTo24Hour(fromHour, fromAmPm);
    const endHour24 = convertTo24Hour(toHour, toAmPm);

    // Build API payload
    const payload = {
      user_shift: {
        start_hour: startHour24,
        start_min: fromMinute,
        end_hour: endHour24,
        end_min: toMinute,
        hour_margin: checkInMargin ? hourMargin : '00',
        min_margin: checkInMargin ? minMargin : '00'
      },
      check_in_margin: checkInMargin
    };

    console.log('Create shift payload:', payload);

    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/pms/admin/user_shifts.json`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': getAuthHeader()
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Shift created successfully:', result);

      sonnerToast.success('Shift created successfully!');
      
      // Reset form
      resetForm();
      
      // Close dialog
      onOpenChange(false);
      
      // Trigger callback to refresh parent data
      if (onShiftCreated) {
        onShiftCreated();
      }

    } catch (error: any) {
      console.error('Error creating shift:', error);
      sonnerToast.error(`Failed to create shift: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFromHour("");
    setFromMinute("");
    setFromAmPm("");
    setToHour("");
    setToMinute("");
    setToAmPm("");
    setCheckInMargin(false);
    setHourMargin("0");
    setMinMargin("0");
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Create Shift
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="h-8 w-8 p-1  text-white  rounded-none shadow-none"
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
                  {['12', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11'].map((hour) => (
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
              <Select value={fromAmPm} onValueChange={setFromAmPm}>
                <SelectTrigger className="w-20 rounded-none border border-gray-300 h-10">
                  <SelectValue placeholder="AM/PM" />
                </SelectTrigger>
                <SelectContent className="bg-white rounded-none">
                  <SelectItem value="AM">AM</SelectItem>
                  <SelectItem value="PM">PM</SelectItem>
                </SelectContent>
              </Select>
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
                  {['12', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11'].map((hour) => (
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
              <Select value={toAmPm} onValueChange={setToAmPm}>
                <SelectTrigger className="w-20 rounded-none border border-gray-300 h-10">
                  <SelectValue placeholder="AM/PM" />
                </SelectTrigger>
                <SelectContent className="bg-white rounded-none">
                  <SelectItem value="AM">AM</SelectItem>
                  <SelectItem value="PM">PM</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Check In Margin */}
          <div className="space-y-3">
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
            
            {checkInMargin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Margin Time
                </label>
                <div className="flex gap-2 items-center">
                  <Select value={hourMargin} onValueChange={setHourMargin}>
                    <SelectTrigger className="w-20 rounded-none border border-gray-300 h-10">
                      <SelectValue placeholder="0" />
                    </SelectTrigger>
                    <SelectContent className="bg-white max-h-60 rounded-none">
                      {Array.from({ length: 13 }, (_, i) => String(i)).map((hour) => (
                        <SelectItem key={hour} value={hour}>
                          {hour}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <span className="text-sm text-gray-500">hours</span>
                  
                  <Select value={minMargin} onValueChange={setMinMargin}>
                    <SelectTrigger className="w-20 rounded-none border border-gray-300 h-10">
                      <SelectValue placeholder="0" />
                    </SelectTrigger>
                    <SelectContent className="bg-white max-h-60 rounded-none">
                      {Array.from({ length: 60 }, (_, i) => String(i)).map((minute) => (
                        <SelectItem key={minute} value={minute}>
                          {minute}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <span className="text-sm text-gray-500">minutes</span>
                </div>
              </div>
            )}
          </div>

          {/* Create Button */}
          <div className="flex justify-center pt-4">
            <Button 
              onClick={handleCreate}
              disabled={isSubmitting}
              className="bg-[#C72030] hover:bg-[#C72030]/90 text-white px-8 rounded-none shadow-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
