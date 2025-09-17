import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { X, Loader2 } from "lucide-react";
import { toast } from "sonner";
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
  const [fromHour, setFromHour] = useState<string>("");
  const [fromMinute, setFromMinute] = useState<string>("");
  const [fromAmPm, setFromAmPm] = useState<string>("AM");
  const [toHour, setToHour] = useState<string>("");
  const [toMinute, setToMinute] = useState<string>("");
  const [toAmPm, setToAmPm] = useState<string>("AM");
  const [checkInMargin, setCheckInMargin] = useState<boolean>(false);
  const [hourMargin, setHourMargin] = useState<string>("0");
  const [minMargin, setMinMargin] = useState<string>("0");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const hours = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
  const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));

  // Convert 24-hour to 12-hour format for display
  const convertTo12Hour = (hour24: string) => {
    const hourNum = parseInt(hour24);
    if (hourNum === 0) {
      return { hour: '12', ampm: 'AM' };
    } else if (hourNum === 12) {
      return { hour: '12', ampm: 'PM' };
    } else if (hourNum < 12) {
      return { hour: String(hourNum).padStart(2, '0'), ampm: 'AM' };
    } else {
      return { hour: String(hourNum - 12).padStart(2, '0'), ampm: 'PM' };
    }
  };

  // Convert 12-hour to 24-hour format for API
  const convertTo24Hour = (hour: string, ampm: string) => {
    let hourNum = parseInt(hour);
    if (ampm === 'AM' && hourNum === 12) {
      hourNum = 0;
    } else if (ampm === 'PM' && hourNum !== 12) {
      hourNum += 12;
    }
    return String(hourNum).padStart(2, '0');
  };

  // Parse shift timings when dialog opens
  useEffect(() => {
    if (shift && open) {
      // Parse timings like "08:00 AM to 05:00 PM"
      const timingParts = shift.timings.split(' to ');
      if (timingParts.length === 2) {
        const fromTime = timingParts[0].trim();
        const toTime = timingParts[1].trim();
        
        // Parse time with AM/PM
        const parseTime = (timeStr: string) => {
          const parts = timeStr.split(' ');
          if (parts.length === 2) {
            // Format: "08:00 AM"
            const [time, period] = parts;
            const [hours, minutes] = time.split(':');
            return {
              hour: hours.padStart(2, '0'),
              minute: minutes,
              ampm: period
            };
          } else {
            // Format: "08:00" (assume 24-hour format)
            const [hours, minutes] = timeStr.split(':');
            const hour24 = hours.padStart(2, '0');
            const converted = convertTo12Hour(hour24);
            return {
              hour: converted.hour,
              minute: minutes,
              ampm: converted.ampm
            };
          }
        };
        
        const fromParsed = parseTime(fromTime);
        const toParsed = parseTime(toTime);
        
        setFromHour(fromParsed.hour);
        setFromMinute(fromParsed.minute);
        setFromAmPm(fromParsed.ampm);
        setToHour(toParsed.hour);
        setToMinute(toParsed.minute);
        setToAmPm(toParsed.ampm);
      }
      
      // Parse check in margin - handle formats like "3h:0m", "3h0m", "0h:0m"
      const hasMargin = shift.checkInMargin && shift.checkInMargin !== "0h:0m" && shift.checkInMargin !== "0h0m";
      setCheckInMargin(hasMargin);
      
      if (hasMargin && shift.checkInMargin) {
        // Handle multiple formats: "3h:0m", "3h0m", "1h:30m"
        const marginMatch = shift.checkInMargin.match(/(\d+)h:?(\d+)m?/);
        if (marginMatch) {
          setHourMargin(marginMatch[1]);
          setMinMargin(marginMatch[2]);
        }
      } else {
        setHourMargin("0");
        setMinMargin("0");
      }
    }
  }, [shift, open]);

  const validateForm = () => {
    if (!fromHour || !fromMinute || !toHour || !toMinute) {
      toast.error("Please fill in all time fields");
      return false;
    }

    const fromTime24 = convertTo24Hour(fromHour, fromAmPm);
    const toTime24 = convertTo24Hour(toHour, toAmPm);
    const fromTimeMinutes = parseInt(fromTime24) * 60 + parseInt(fromMinute);
    const toTimeMinutes = parseInt(toTime24) * 60 + parseInt(toMinute);

    // if (fromTimeMinutes >= toTimeMinutes) {
    //   toast.error("End time must be after start time");
    //   return false;
    // }

    return true;
  };

  const handleUpdate = async () => {
    if (!validateForm() || !shift) return;
    
    setIsLoading(true);

    // Convert to 24-hour format for API
    const startHour24 = convertTo24Hour(fromHour, fromAmPm);
    const endHour24 = convertTo24Hour(toHour, toAmPm);

    try {
      // Prepare the payload according to the API format
      const payload = {
        user_shift: {
          start_hour: startHour24,
          start_min: fromMinute.padStart(2, '0'),
          end_hour: endHour24,
          end_min: toMinute.padStart(2, '0'),
          hour_margin: checkInMargin ? hourMargin.padStart(2, '0') : "00",
          min_margin: checkInMargin ? minMargin.padStart(2, '0') : "00"
        },
        check_in_margin: checkInMargin
      };

      console.log('🎯 Edit API Payload:', JSON.stringify(payload, null, 2));

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

      toast.success("Shift updated successfully");

      // Call the callback to refresh the data
      if (onShiftUpdated) {
        onShiftUpdated();
      }

      onOpenChange(false);

    } catch (error) {
      console.error('Error updating shift:', error);
      toast.error("Failed to update shift. Please try again.");
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
    setFromAmPm("AM");
    setToHour("");
    setToMinute("");
    setToAmPm("AM");
    setCheckInMargin(false);
    setHourMargin("0");
    setMinMargin("0");
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
                  {['12', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11'].map((hour) => (
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
              <Select value={fromAmPm} onValueChange={setFromAmPm} disabled={isLoading}>
                <SelectTrigger className="w-20 rounded-none border border-gray-300 h-10">
                  <SelectValue placeholder="AM" />
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
              <Select value={toHour} onValueChange={setToHour} disabled={isLoading}>
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
              <Select value={toAmPm} onValueChange={setToAmPm} disabled={isLoading}>
                <SelectTrigger className="w-20 rounded-none border border-gray-300 h-10">
                  <SelectValue placeholder="AM" />
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
                      {Array.from({ length: 13 }, (_, i) => String(i)).map((hour) => (
                        <SelectItem key={hour} value={hour}>
                          {hour}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <span className="text-sm text-gray-500">hours</span>
                  
                  <Select value={minMargin} onValueChange={setMinMargin} disabled={isLoading}>
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
