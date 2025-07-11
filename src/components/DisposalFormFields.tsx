
import React from 'react';
import { TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

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

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (value) {
      onDisposeDateChange(new Date(value));
    } else {
      onDisposeDateChange(undefined);
    }
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return '';
    return date.toISOString().split('T')[0];
  };

  return (
    <div className="grid grid-cols-2 gap-6 items-start">
      {/* Dispose Date */}
      <div className="space-y-2">
        <TextField
          label="Dispose Date"
          type="date"
          value={formatDate(disposeDate)}
          onChange={handleDateChange}
          fullWidth
          InputLabelProps={{
            shrink: true,
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              height: '45px',
            }
          }}
        />
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
