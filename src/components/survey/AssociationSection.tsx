
import React from 'react';
import { TextField, MenuItem, Select, FormControl, InputLabel, Box, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { MapPin } from 'lucide-react';

interface AssociationSectionProps {
  startDate?: Date;
  endDate?: Date;
  onStartDateChange: (date: Date | undefined) => void;
  onEndDateChange: (date: Date | undefined) => void;
}

export const AssociationSection: React.FC<AssociationSectionProps> = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange
}) => {
  return (
    <div className="p-6 border-t border-gray-200">
      <Typography variant="h6" className="mb-4">Association</Typography>
      
      <div className="flex flex-col sm:flex-row gap-4 items-end">
        {/* Location */}
        <div className="flex-1 min-w-0">
          <Typography variant="subtitle2" className="mb-2 text-center sm:text-left">Location</Typography>
          <FormControl fullWidth size="small">
            <InputLabel>Location</InputLabel>
            <Select
              label="Location"
              defaultValue=""
            >
              <MenuItem value="location1">Location 1</MenuItem>
              <MenuItem value="location2">Location 2</MenuItem>
            </Select>
          </FormControl>
        </div>
        
        {/* Validity Dates */}
        <div className="flex-2 min-w-0">
          <Typography variant="subtitle2" className="mb-2 text-center sm:text-left">Validity</Typography>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box className="flex flex-col sm:flex-row items-center gap-2">
              <div className="flex-1 min-w-0 w-full sm:w-auto">
                <Typography variant="caption" className="text-gray-500 block">Start Date</Typography>
                <DatePicker
                  value={startDate}
                  onChange={(newValue) => onStartDateChange(newValue || undefined)}
                  format="dd/MM/yy"
                  slotProps={{
                    textField: {
                      size: 'small',
                      fullWidth: true,
                      placeholder: 'dd/mm/yy'
                    }
                  }}
                />
              </div>
              
              <span className="text-gray-500 text-sm px-2 hidden sm:inline">To</span>
              
              <div className="flex-1 min-w-0 w-full sm:w-auto">
                <Typography variant="caption" className="text-gray-500 block">End Date</Typography>
                <DatePicker
                  value={endDate}
                  onChange={(newValue) => onEndDateChange(newValue || undefined)}
                  format="dd/MM/yy"
                  slotProps={{
                    textField: {
                      size: 'small',
                      fullWidth: true,
                      placeholder: 'dd/mm/yy'
                    }
                  }}
                />
              </div>
            </Box>
          </LocalizationProvider>
        </div>
      </div>
    </div>
  );
};
