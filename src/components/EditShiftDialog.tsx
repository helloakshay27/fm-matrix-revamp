import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { X, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { API_CONFIG, getAuthHeader } from "@/config/apiConfig";

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
  onShiftUpdated?: () => void;
}

export const EditShiftDialog = ({ open, onOpenChange, shift, onShiftUpdated }: EditShiftDialogProps) => {
  const { toast } = useToast();
  const [fromHour, setFromHour] = useState<string>("");
  const [fromMinute, setFromMinute] = useState<string>("");
  const [toHour, setToHour] = useState<string>("");
  const [toMinute, setToMinute] = useState<string>("");
  const [checkInMargin, setCheckInMargin] = useState<boolean>(false);
  const [hourMargin, setHourMargin] = useState<string>("0");
  const [minMargin, setMinMargin] = useState<string>("30");
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
      const hasMargin = shift.checkInMargin !== "0h0m";
      setCheckInMargin(hasMargin);
      
      // Parse margin if it exists (e.g., "3h0m" -> hour: "3", min: "0")
      if (hasMargin && shift.checkInMargin) {
        const marginMatch = shift.checkInMargin.match(/(\d+)h(\d+)m/);
        if (marginMatch) {
          setHourMargin(marginMatch[1]);
          setMinMargin(marginMatch[2]);
        }
      } else {
        setHourMargin("0");
        setMinMargin("30");
      }
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

  const handleUpdate = async () => {
    if (!validateForm() || !shift) return;
    
    setIsLoading(true);

    try {
      // Prepare the payload according to the API format
      const payload = {
        user_shift: {
          start_hour: fromHour.padStart(2, '0'),
          start_min: fromMinute.padStart(2, '0'),
          end_hour: toHour.padStart(2, '0'),
          end_min: toMinute.padStart(2, '0'),
          hour_margin: checkInMargin ? (hourMargin === "0" ? "" : hourMargin.padStart(2, '0')) : "",
          min_margin: checkInMargin ? minMargin.padStart(2, '0') : ""
        },
        check_in_margin: checkInMargin ? "true" : "false"
      };

      console.log('🎯 API Payload:', JSON.stringify(payload, null, 2));

      // Make the API call
      const response = await fetch(`${API_CONFIG.BASE_URL}/pms/admin/user_shifts/${shift.id}.json`, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': getAuthHeader()
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();
      console.log('API Response:', responseData);

      toast({
        title: "Success",
        description: "Shift updated successfully",
      });

      // Call the callback to refresh the data
      if (onShiftUpdated) {
        onShiftUpdated();
      }

      onOpenChange(false);

    } catch (error) {
      console.error('Error updating shift:', error);
      toast({
        title: "Error",
        description: "Failed to update shift. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (isLoading) return; // Prevent closing while loading
    
    onOpenChange(false);
    // Reset form when closing
    setFromHour("");
    setFromMinute("");
    setToHour("");
    setToMinute("");
    setCheckInMargin(false);
    setHourMargin("0");
    setMinMargin("30");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Edit Shift
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
              <Select value={fromHour} onValueChange={setFromHour} disabled={isLoading}>
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
              <Select value={fromMinute} onValueChange={setFromMinute} disabled={isLoading}>
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
             
            </div>
          </div>

          {/* Shift Timings To */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Shift Timings To <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              <Select value={toHour} onValueChange={setToHour} disabled={isLoading}>
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
              <Select value={toMinute} onValueChange={setToMinute} disabled={isLoading}>
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
           
            </div>
          </div>

          {/* Check In Margin */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="check-in-margin-edit" 
                checked={checkInMargin}
                onCheckedChange={(checked) => setCheckInMargin(checked as boolean)}
                disabled={isLoading}
              />
              <label 
                htmlFor="check-in-margin-edit" 
                className="text-sm font-medium text-gray-700"
              >
                Check In Margin
              </label>
            </div>
            
            {/* Margin Time Inputs - Only show when check in margin is enabled */}
            {checkInMargin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Margin Time
                </label>
                <div className="flex gap-2 items-center">
                  <Select value={hourMargin} onValueChange={setHourMargin} disabled={isLoading}>
                    <SelectTrigger className="w-20 rounded-none border border-gray-300 h-10">
                      <SelectValue placeholder="0" />
                    </SelectTrigger>
                    <SelectContent className="bg-white max-h-60 rounded-none">
                      <SelectItem value="0">0</SelectItem>
                      {hours.slice(0, 12).map((hour) => (
                        <SelectItem key={hour} value={hour}>
                          {parseInt(hour)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <span className="text-sm text-gray-500">hours</span>
                  
                  <Select value={minMargin} onValueChange={setMinMargin} disabled={isLoading}>
                    <SelectTrigger className="w-20 rounded-none border border-gray-300 h-10">
                      <SelectValue placeholder="30" />
                    </SelectTrigger>
                    <SelectContent className="bg-white max-h-60 rounded-none">
                      {['0', '15', '30', '45'].map((minute) => (
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

          {/* Update Button */}
          <div className="flex justify-center pt-4">
            <Button 
              onClick={handleUpdate}
              disabled={isLoading}
              className="bg-[#C72030] hover:bg-[#C72030]/90 text-white px-8 rounded-none shadow-none"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
