
import React from 'react';
import { Label } from '@/components/ui/label';
import { ResponsiveDatePicker } from '@/components/ui/responsive-date-picker';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

interface DisposalFormFieldsProps {
  disposeDate?: Date;
  onDisposeDateChange: (date?: Date) => void;
  disposeReason: string;
  onDisposeReasonChange: (reason: string) => void;
}

export const DisposalFormFields: React.FC<DisposalFormFieldsProps> = ({
  disposeDate,
  onDisposeDateChange,
  disposeReason,
  onDisposeReasonChange
}) => {
  const disposeReasons = [
    'End of Life',
    'Damage Beyond Repair',
    'Obsolete Technology',
    'Cost of Repair Exceeds Value',
    'Safety Concerns',
    'Other'
  ];

  return (
    <div className="grid grid-cols-2 gap-6 items-start">
      {/* Dispose Date */}
      <div className="space-y-2">
        <Label htmlFor="dispose-date" className="text-sm font-medium text-gray-700">
          Dispose Date
        </Label>
        <div className="h-[45px]">
          <ResponsiveDatePicker
            value={disposeDate}
            onChange={onDisposeDateChange}
            placeholder="Select Date"
            className="w-full h-full"
          />
        </div>
      </div>

      {/* Dispose Reason */}
      <div className="space-y-2">
        <FormControl fullWidth>
          <InputLabel shrink>Dispose Reason *</InputLabel>
          <Select
            value={disposeReason}
            onChange={(e) => onDisposeReasonChange(e.target.value)}
            label="Dispose Reason *"
            displayEmpty
          >
            <MenuItem value="" disabled>
              Select Reason
            </MenuItem>
            {disposeReasons.map((reason) => (
              <MenuItem key={reason} value={reason}>
                {reason}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
    </div>
  );
};
