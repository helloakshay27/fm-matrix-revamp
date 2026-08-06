
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  FormControl as MuiFormControl,
  Select as MuiSelect,
  MenuItem,
} from '@mui/material';
import { MaterialDatePicker } from "@/components/ui/material-date-picker";

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

// Portals to document.body so the menu anchors under the field instead of
// inheriting the Radix Dialog's translate transform (which mispositions it).
// Radix's modal Dialog sets `pointer-events: none` on <body>, which the portaled
// menu inherits — without pointerEvents:'auto' the backdrop never receives the
// click that closes the menu.
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

const LOCATION_OPTIONS = ['HDFC Ergo Bhandup', 'Main Office', 'Branch Office'];

const FLOOR_OPTIONS = [
  'Floor 1 - Wing 1 - HDFC',
  'Floor 2 - Wing 1 - HDFC',
  'Floor 3 - Wing 1 - HDFC',
];

interface RosterCalendarFilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApply: (filters: {
    location: string;
    floor: string;
    startDate: string;
    endDate: string;
  }) => void;
}

export const RosterCalendarFilterDialog: React.FC<RosterCalendarFilterDialogProps> = ({
  open,
  onOpenChange,
  onApply,
}) => {
  const [filters, setFilters] = useState({
    location: 'HDFC Ergo Bhandup',
    floor: 'Floor 1 - Wing 1 - HDFC',
    startDate: '01/06/2025',
    endDate: '30/06/2025'
  });

  const handleApply = () => {
    console.log('Applying Roster Calendar filters:', filters);
    onApply(filters);
    onOpenChange(false);
  };

  const handleReset = () => {
    setFilters({
      location: '',
      floor: '',
      startDate: '',
      endDate: ''
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="space-y-0 pb-4">
          <DialogTitle className="text-lg font-semibold">Filter</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Location</label>
              <MuiFormControl fullWidth size="small">
                <MuiSelect
                  displayEmpty
                  value={filters.location}
                  onChange={(event) => setFilters({ ...filters, location: event.target.value })}
                  renderValue={(selected) =>
                    selected || <span className="text-gray-500">Select Location</span>
                  }
                  sx={fieldStyles}
                  MenuProps={selectMenuProps}
                >
                  {LOCATION_OPTIONS.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </MuiSelect>
              </MuiFormControl>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Floor</label>
              <MuiFormControl fullWidth size="small">
                <MuiSelect
                  displayEmpty
                  value={filters.floor}
                  onChange={(event) => setFilters({ ...filters, floor: event.target.value })}
                  renderValue={(selected) =>
                    selected || <span className="text-gray-500">Select Floor</span>
                  }
                  sx={fieldStyles}
                  MenuProps={selectMenuProps}
                >
                  {FLOOR_OPTIONS.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </MuiSelect>
              </MuiFormControl>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Start Date</label>
              <MaterialDatePicker
                value={filters.startDate}
                onChange={(value) => setFilters({ ...filters, startDate: value })}
                placeholder="Select start date"
                className="text-sm"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">End Date</label>
              <MaterialDatePicker
                value={filters.endDate}
                onChange={(value) => setFilters({ ...filters, endDate: value })}
                placeholder="Select end date"
                className="text-sm"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button 
            onClick={handleReset}
            variant="outline"
            className="flex-1"
          >
            Reset
          </Button>
          <Button 
            onClick={handleApply}
            className="flex-1 bg-brand hover:bg-brand-hover text-white"
          >
            Apply
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
