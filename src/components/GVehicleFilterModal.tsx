
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FormControl, Select as MuiSelect, MenuItem } from '@mui/material';
import { X } from 'lucide-react';

interface GVehicleFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const fieldStyles = {
  height: '45px',
  backgroundColor: '#fff',
  borderRadius: '4px',
  '& .MuiOutlinedInput-root': {
    height: '45px',
    '& fieldset': {
      borderColor: '#ddd',
    },
    '&:hover fieldset': {
      borderColor: '#C72030',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#C72030',
    },
  },
  '& .MuiInputLabel-root': {
    '&.Mui-focused': {
      color: '#C72030',
    },
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

export const GVehicleFilterModal = ({ isOpen, onClose }: GVehicleFilterModalProps) => {
  const [personToMeet, setPersonToMeet] = useState('');
  const [inDate, setInDate] = useState('');

  const handleApply = () => {
    // Handle filter application
    console.log('Apply filters:', { personToMeet, inDate });
    onClose();
  };

  const handleReset = () => {
    setPersonToMeet('');
    setInDate('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-white [&>button]:hidden">
        <DialogHeader className="flex flex-row items-center justify-between border-b pb-4">
          <DialogTitle className="text-lg font-semibold">FILTER BY</DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Select Person To Meet */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Select Person To Meet
              </label>
              <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }}>
                <MuiSelect
                  displayEmpty
                  notched
                  value={personToMeet}
                  onChange={(e) => setPersonToMeet(e.target.value)}
                  renderValue={(value) => value ? (value as string) : <em style={{ color: '#9ca3af', fontStyle: 'normal' }}>Select Person To Meet</em>}
                  MenuProps={selectMenuProps}
                >
                  <MenuItem value="">
                    <em>Select Person To Meet</em>
                  </MenuItem>
                  <MenuItem value="person1">Person 1</MenuItem>
                  <MenuItem value="person2">Person 2</MenuItem>
                  <MenuItem value="person3">Person 3</MenuItem>
                </MuiSelect>
              </FormControl>
            </div>

            {/* In Date */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                In Date
              </label>
              <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }}>
                <MuiSelect
                  displayEmpty
                  notched
                  value={inDate}
                  onChange={(e) => setInDate(e.target.value)}
                  renderValue={(value) => value ? (value as string) : <em style={{ color: '#9ca3af', fontStyle: 'normal' }}>Select Created Date</em>}
                  MenuProps={selectMenuProps}
                >
                  <MenuItem value="">
                    <em>Select Created Date</em>
                  </MenuItem>
                  <MenuItem value="today">Today</MenuItem>
                  <MenuItem value="yesterday">Yesterday</MenuItem>
                  <MenuItem value="last7days">Last 7 Days</MenuItem>
                  <MenuItem value="last30days">Last 30 Days</MenuItem>
                </MuiSelect>
              </FormControl>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              onClick={handleReset}
              variant="ghost"
              className="fm-button-fix fm-button-brand px-4 py-2"
            >
              Reset
            </Button>
            <Button
              onClick={handleApply}
              style={{ backgroundColor: '#C72030' }}
              className="hover:bg-[#C72030]/90 text-white px-8 py-2"
            >
              Apply
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
