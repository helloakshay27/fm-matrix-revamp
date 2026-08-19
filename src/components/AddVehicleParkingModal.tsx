
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem } from '@mui/material';
import { useVehicleEvents } from '@/components/PostHogSecurityEvents';

interface AddVehicleParkingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Field styles for Material-UI components — mirrors AddTicketDashboard.tsx
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

// Portals to document.body so the menu anchors under the field instead of
// inheriting the Radix Dialog's translate transform (which mispositions it).
const selectMenuProps = {
  // Radix's modal Dialog sets `pointer-events: none` on <body>, which the
  // portaled menu inherits — without this the backdrop never receives the
  // click that closes the menu.
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

export const AddVehicleParkingModal = ({ isOpen, onClose }: AddVehicleParkingModalProps) => {
  const { onVehicleAdded } = useVehicleEvents();

  const handleSave = () => {
    onVehicleAdded({ is_bulk_import: false, category: 'car', type: 'sedan', is_approved: true });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-white">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-lg font-semibold">Add</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 mt-4">
          {/* Slot Number */}
          <TextField
            label="Slot Number"
            placeholder="Enter slot number"
            fullWidth
            variant="outlined"
            slotProps={{ inputLabel: { shrink: true } }}
            InputProps={{ sx: fieldStyles }}
          />

          {/* Vehicle Category */}
          <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }}>
            <InputLabel shrink>Vehicle Category</InputLabel>
            <MuiSelect displayEmpty label="Vehicle Category" notched defaultValue="" MenuProps={selectMenuProps}>
              <MenuItem value="">
                <em>Select Vehicle Category</em>
              </MenuItem>
              <MenuItem value="car">Car</MenuItem>
              <MenuItem value="bike">Bike</MenuItem>
              <MenuItem value="truck">Truck</MenuItem>
            </MuiSelect>
          </FormControl>

          {/* Vehicle Type */}
          <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }}>
            <InputLabel shrink>Vehicle Type</InputLabel>
            <MuiSelect displayEmpty label="Vehicle Type" notched defaultValue="" MenuProps={selectMenuProps}>
              <MenuItem value="">
                <em>Select Vehicle Type</em>
              </MenuItem>
              <MenuItem value="sedan">Sedan</MenuItem>
              <MenuItem value="suv">SUV</MenuItem>
              <MenuItem value="hatchback">Hatchback</MenuItem>
            </MuiSelect>
          </FormControl>

          {/* Sticker Number */}
          <TextField
            label="Sticker Number"
            placeholder="Enter sticker number"
            fullWidth
            variant="outlined"
            slotProps={{ inputLabel: { shrink: true } }}
            InputProps={{ sx: fieldStyles }}
          />

          {/* Registration Number */}
          <TextField
            label="Registration Number"
            placeholder="Enter registration number"
            fullWidth
            variant="outlined"
            slotProps={{ inputLabel: { shrink: true } }}
            InputProps={{ sx: fieldStyles }}
          />

          {/* Insurance Number */}
          <TextField
            label="Insurance Number"
            placeholder="Enter insurance number"
            fullWidth
            variant="outlined"
            slotProps={{ inputLabel: { shrink: true } }}
            InputProps={{ sx: fieldStyles }}
          />

          {/* Insurance Valid Till */}
          <TextField
            label="Insurance Valid Till"
            placeholder="Enter insurance valid till"
            fullWidth
            variant="outlined"
            slotProps={{ inputLabel: { shrink: true } }}
            InputProps={{ sx: fieldStyles }}
          />

          {/* Category */}
          <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }}>
            <InputLabel shrink>Category</InputLabel>
            <MuiSelect displayEmpty label="Category" notched defaultValue="" MenuProps={selectMenuProps}>
              <MenuItem value="">
                <em>Select Category</em>
              </MenuItem>
              <MenuItem value="resident">Resident</MenuItem>
              <MenuItem value="visitor">Visitor</MenuItem>
              <MenuItem value="staff">Staff</MenuItem>
            </MuiSelect>
          </FormControl>

          {/* Vehicle Number */}
          <TextField
            label="Vehicle Number"
            placeholder="Enter vehicle number"
            fullWidth
            variant="outlined"
            slotProps={{ inputLabel: { shrink: true } }}
            InputProps={{ sx: fieldStyles }}
          />

          {/* Unit */}
          <FormControl fullWidth variant="outlined" className="col-span-2" sx={{ '& .MuiInputBase-root': fieldStyles }}>
            <InputLabel shrink>Unit</InputLabel>
            <MuiSelect displayEmpty label="Unit" notched defaultValue="" MenuProps={selectMenuProps}>
              <MenuItem value="">
                <em>Select unit</em>
              </MenuItem>
              <MenuItem value="unit1">Unit 1</MenuItem>
              <MenuItem value="unit2">Unit 2</MenuItem>
              <MenuItem value="unit3">Unit 3</MenuItem>
            </MuiSelect>
          </FormControl>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <Button
            variant="ghost"
            onClick={onClose}
            className="fm-button-fix fm-button-brand px-4 py-2"
          >
            Close
          </Button>
          <Button
            className="px-6 py-2 !bg-[#DA7756] hover:!bg-[#C45F40]"
            onClick={handleSave}
          >
            <span className="!text-white font-medium">Save</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
