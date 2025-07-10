
import React from 'react';
import { ChevronDown, ChevronUp, MapPin } from 'lucide-react';
import { FormControl, InputLabel, MenuItem, Select as MuiSelect, SelectChangeEvent } from '@mui/material';

const fieldStyles = {
  height: {
    xs: 28,
    sm: 36,
    md: 45
  },
  '& .MuiInputBase-input, & .MuiSelect-select': {
    padding: {
      xs: '8px',
      sm: '10px',
      md: '12px'
    }
  }
};

interface LocationDetailsProps {
  isExpanded: boolean;
  onToggle: () => void;
  locationData: {
    site: string;
    building: string;
    wing: string;
    area: string;
    floor: string;
    room: string;
  };
  onLocationChange: (field: string, value: string) => void;
}

export const LocationDetailsSection: React.FC<LocationDetailsProps> = ({
  isExpanded,
  onToggle,
  locationData,
  onLocationChange
}) => {
  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <div onClick={onToggle} className="cursor-pointer border-l-4 border-l-[#C72030] p-4 sm:p-6 flex justify-between items-center bg-white">
        <div className="flex items-center gap-2 text-[#C72030] text-sm sm:text-base font-semibold">
          <span className="bg-[#C72030] text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-xs sm:text-sm">
            <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
          </span>
          LOCATION DETAILS
        </div>
        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
      </div>
      {isExpanded && (
        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
            {['Site', 'Building', 'Wing', 'Area', 'Floor'].map(label => (
              <FormControl key={label} fullWidth variant="outlined" sx={{ minWidth: 120 }}>
                <InputLabel id={`${label.toLowerCase()}-select-label`} shrink>{label}</InputLabel>
                <MuiSelect
                  labelId={`${label.toLowerCase()}-select-label`}
                  label={label}
                  displayEmpty
                  value={locationData[label.toLowerCase() as keyof typeof locationData] || ''}
                  onChange={(e: SelectChangeEvent) => onLocationChange(label.toLowerCase(), e.target.value)}
                  sx={fieldStyles}
                >
                  <MenuItem value=""><em>Select {label}</em></MenuItem>
                  <MenuItem value={`${label.toLowerCase()}1`}>{label} 1</MenuItem>
                  <MenuItem value={`${label.toLowerCase()}2`}>{label} 2</MenuItem>
                </MuiSelect>
              </FormControl>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <FormControl fullWidth variant="outlined" sx={{ minWidth: 120 }}>
              <InputLabel id="room-select-label" shrink>Room</InputLabel>
              <MuiSelect
                labelId="room-select-label"
                label="Room"
                displayEmpty
                value={locationData.room || ''}
                onChange={(e: SelectChangeEvent) => onLocationChange('room', e.target.value)}
                sx={fieldStyles}
              >
                <MenuItem value=""><em>Select Room</em></MenuItem>
                <MenuItem value="room1">Room 1</MenuItem>
                <MenuItem value="room2">Room 2</MenuItem>
              </MuiSelect>
            </FormControl>
          </div>
        </div>
      )}
    </div>
  );
};
