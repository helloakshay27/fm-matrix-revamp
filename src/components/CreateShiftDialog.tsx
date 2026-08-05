import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { X, Loader2 } from "lucide-react";
import { toast } from 'sonner';
import { API_CONFIG, getAuthHeader } from "@/config/apiConfig";
import { FormControl, InputLabel, MenuItem, Select as MuiSelect } from '@mui/material';

interface CreateShiftDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onShiftCreated?: () => void;
}

const fieldStyles = {
  height: { xs: 36, sm: 40, md: 45 },
  '& .MuiInputBase-input, & .MuiSelect-select': {
    padding: { xs: '8px 12px', sm: '10px 14px', md: '12px 14px' },
  },
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'white',
  },
};

const selectMenuProps = {
  PaperProps: {
    style: {
      maxHeight: 224,
      backgroundColor: 'white',
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      zIndex: 9999,
    },
  },
  disablePortal: false,
  disableAutoFocus: true,
  disableEnforceFocus: true,
};

export const CreateShiftDialog = ({ open, onOpenChange, onShiftCreated }: CreateShiftDialogProps) => {
  const [fromHour, setFromHour] = useState<string>("");
  const [fromMinute, setFromMinute] = useState<string>("");
  const [fromAmPm, setFromAmPm] = useState<string>("AM");
  const [toHour, setToHour] = useState<string>("");
  const [toMinute, setToMinute] = useState<string>("");
  const [toAmPm, setToAmPm] = useState<string>("PM");
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
    if (!fromHour || !fromMinute || !fromAmPm || !toHour || !toMinute || !toAmPm) {
      toast.error("Please fill in all time fields");
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

      toast.success('Shift created successfully!');
      
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
      toast.error(`Failed to create shift: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFromHour("");
    setFromMinute("");
    setFromAmPm("AM");
    setToHour("");
    setToMinute("");
    setToAmPm("PM");
    setCheckInMargin(false);
    setHourMargin("0");
    setMinMargin("0");
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal={false}>
      <DialogContent
        className="sm:max-w-lg bg-white overflow-visible"
        onPointerDownOutside={(e) => {
          if ((e.target as HTMLElement).closest('.MuiPopover-root, .MuiModal-root, .MuiMenu-root')) {
            e.preventDefault();
          }
        }}
        onInteractOutside={(e) => {
          if ((e.target as HTMLElement).closest('.MuiPopover-root, .MuiModal-root, .MuiMenu-root')) {
            e.preventDefault();
          }
        }}
      >
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
            <div className="flex gap-2 items-center">
              <div className="flex-1">
                <FormControl fullWidth variant="outlined" sx={fieldStyles}>
                  <InputLabel id="from-hour-label">Hr</InputLabel>
                  <MuiSelect
                    labelId="from-hour-label"
                    label="Hr"
                    value={fromHour}
                    onChange={(e) => setFromHour(e.target.value)}
                    sx={fieldStyles}
                    MenuProps={selectMenuProps}
                  >
                    <MenuItem value=""><em>--</em></MenuItem>
                    {['12', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11'].map((hour) => (
                      <MenuItem key={hour} value={hour}>
                        {hour}
                      </MenuItem>
                    ))}
                  </MuiSelect>
                </FormControl>
              </div>
              <span className="flex items-center text-gray-500 px-1">:</span>
              <div className="flex-1">
                <FormControl fullWidth variant="outlined" sx={fieldStyles}>
                  <InputLabel id="from-minute-label">mm</InputLabel>
                  <MuiSelect
                    labelId="from-minute-label"
                    label="mm"
                    value={fromMinute}
                    onChange={(e) => setFromMinute(e.target.value)}
                    sx={fieldStyles}
                    MenuProps={selectMenuProps}
                  >
                    <MenuItem value=""><em>--</em></MenuItem>
                    {minutes.map((minute) => (
                      <MenuItem key={minute} value={minute}>
                        {minute}
                      </MenuItem>
                    ))}
                  </MuiSelect>
                </FormControl>
              </div>
              <div className="w-20">
                <FormControl fullWidth variant="outlined" sx={fieldStyles}>
                  <MuiSelect
                    value={fromAmPm}
                    onChange={(e) => setFromAmPm(e.target.value)}
                    sx={fieldStyles}
                    MenuProps={selectMenuProps}
                  >
                    <MenuItem value="AM">AM</MenuItem>
                    <MenuItem value="PM">PM</MenuItem>
                  </MuiSelect>
                </FormControl>
              </div>
            </div>
          </div>

          {/* Shift Timings To */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Shift Timings To <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2 items-center">
              <div className="flex-1">
                <FormControl fullWidth variant="outlined" sx={fieldStyles}>
                  <InputLabel id="to-hour-label">Hr</InputLabel>
                  <MuiSelect
                    labelId="to-hour-label"
                    label="Hr"
                    value={toHour}
                    onChange={(e) => setToHour(e.target.value)}
                    sx={fieldStyles}
                    MenuProps={selectMenuProps}
                  >
                    <MenuItem value=""><em>--</em></MenuItem>
                    {['12', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11'].map((hour) => (
                      <MenuItem key={hour} value={hour}>
                        {hour}
                      </MenuItem>
                    ))}
                  </MuiSelect>
                </FormControl>
              </div>
              <span className="flex items-center text-gray-500 px-1">:</span>
              <div className="flex-1">
                <FormControl fullWidth variant="outlined" sx={fieldStyles}>
                  <InputLabel id="to-minute-label">mm</InputLabel>
                  <MuiSelect
                    labelId="to-minute-label"
                    label="mm"
                    value={toMinute}
                    onChange={(e) => setToMinute(e.target.value)}
                    sx={fieldStyles}
                    MenuProps={selectMenuProps}
                  >
                    <MenuItem value=""><em>--</em></MenuItem>
                    {minutes.map((minute) => (
                      <MenuItem key={minute} value={minute}>
                        {minute}
                      </MenuItem>
                    ))}
                  </MuiSelect>
                </FormControl>
              </div>
              <div className="w-20">
                <FormControl fullWidth variant="outlined" sx={fieldStyles}>
                  <MuiSelect
                    value={toAmPm}
                    onChange={(e) => setToAmPm(e.target.value)}
                    sx={fieldStyles}
                    MenuProps={selectMenuProps}
                  >
                    <MenuItem value="AM">AM</MenuItem>
                    <MenuItem value="PM">PM</MenuItem>
                  </MuiSelect>
                </FormControl>
              </div>
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
                  <div className="w-20">
                    <FormControl fullWidth variant="outlined" sx={fieldStyles}>
                      <MuiSelect
                        value={hourMargin}
                        onChange={(e) => setHourMargin(e.target.value)}
                        sx={fieldStyles}
                        MenuProps={selectMenuProps}
                      >
                        {Array.from({ length: 13 }, (_, i) => String(i)).map((hour) => (
                          <MenuItem key={hour} value={hour}>
                            {hour}
                          </MenuItem>
                        ))}
                      </MuiSelect>
                    </FormControl>
                  </div>
                  <span className="text-sm text-gray-500">hours</span>
                  
                  <div className="w-20">
                    <FormControl fullWidth variant="outlined" sx={fieldStyles}>
                      <MuiSelect
                        value={minMargin}
                        onChange={(e) => setMinMargin(e.target.value)}
                        sx={fieldStyles}
                        MenuProps={selectMenuProps}
                      >
                        {Array.from({ length: 60 }, (_, i) => String(i)).map((minute) => (
                          <MenuItem key={minute} value={minute}>
                            {minute}
                          </MenuItem>
                        ))}
                      </MuiSelect>
                    </FormControl>
                  </div>
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
              className="bg-brand hover:bg-brand-hover text-white px-8"
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
