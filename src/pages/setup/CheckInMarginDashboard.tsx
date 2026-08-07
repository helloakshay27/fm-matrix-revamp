
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  FormControl as MuiFormControl,
  Select as MuiSelect,
  MenuItem,
} from '@mui/material';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const fieldStyles = {
  height: '40px',
  backgroundColor: '#fff',
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: '#d1d5db',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: 'var(--color-primary)',
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: 'var(--color-primary)',
  },
  '& .MuiSelect-select': {
    fontSize: '14px',
  },
};

const selectMenuProps = {
  sx: { pointerEvents: 'auto' },
  PaperProps: {
    sx: {
      maxHeight: 224,
      backgroundColor: 'white',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      zIndex: 9999,
    },
  },
  disablePortal: false,
  disableAutoFocus: true,
  disableEnforceFocus: true,
};

const SHIFT_OPTIONS = [
  { value: 'all', label: 'All Shifts' },
  { value: 'morning', label: 'Morning Shift' },
  { value: 'evening', label: 'Evening Shift' },
  { value: 'night', label: 'Night Shift' },
];

export const CheckInMarginDashboard = () => {
  const [checkInMargin, setCheckInMargin] = useState({
    hours: '',
    minutes: '',
    shift: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Check-in margin settings:', checkInMargin);
    toast.success('Check-in margin settings updated successfully!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="text-sm text-gray-500 mb-2">Space &gt; Check-in Margin</div>
          <h1 className="text-2xl font-bold text-gray-800">CHECK-IN MARGIN</h1>
        </div>

        {/* Form Card */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-brand">Configure Check-in Margin</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="hours">Hours</Label>
                  <Input
                    id="hours"
                    type="number"
                    min="0"
                    max="23"
                    placeholder="0"
                    value={checkInMargin.hours}
                    onChange={(e) => setCheckInMargin(prev => ({ ...prev, hours: e.target.value }))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="minutes">Minutes</Label>
                  <Input
                    id="minutes"
                    type="number"
                    min="0"
                    max="59"
                    placeholder="0"
                    value={checkInMargin.minutes}
                    onChange={(e) => setCheckInMargin(prev => ({ ...prev, minutes: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="shift">Apply to Shift</Label>
                <MuiFormControl fullWidth size="small">
                  <MuiSelect
                    id="shift"
                    displayEmpty
                    value={checkInMargin.shift}
                    onChange={(event) =>
                      setCheckInMargin(prev => ({ ...prev, shift: event.target.value }))
                    }
                    renderValue={(selected) =>
                      selected ? (
                        SHIFT_OPTIONS.find((o) => o.value === selected)?.label ?? selected
                      ) : (
                        <span className="text-gray-500">Select Shift</span>
                      )
                    }
                    sx={fieldStyles}
                    MenuProps={selectMenuProps}
                  >
                    {SHIFT_OPTIONS.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </MuiSelect>
                </MuiFormControl>
              </div>

              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCheckInMargin({ hours: '', minutes: '', shift: '' })}
                >
                  Reset
                </Button>
                <Button 
                  type="submit"
                  className="bg-brand hover:bg-brand-hover text-white"
                >
                  Save Settings
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Current Settings Display */}
        <Card className="w-full mt-6">
          <CardHeader>
            <CardTitle className="text-brand">Current Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Check-in Margin:</span> {checkInMargin.hours || '0'} hours {checkInMargin.minutes || '0'} minutes</p>
              <p><span className="font-medium">Applied to:</span> {checkInMargin.shift || 'Not selected'}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
