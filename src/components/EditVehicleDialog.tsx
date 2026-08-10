
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem } from '@mui/material';

interface Vehicle {
  id: number;
  vehicleNumber: string;
  parkingSlot: string;
  vehicleCategory: string;
  vehicleType: string;
  stickerNumber: string;
  category: string;
  registrationNumber: string;
  activeInactive: boolean;
  insuranceNumber: string;
  insuranceValidTill: string;
  staffName: string;
  statusCode: string;
  qrCode: string;
}

interface EditVehicleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: Vehicle | null;
  onSave: (vehicle: Vehicle) => void;
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

export const EditVehicleDialog = ({ isOpen, onClose, vehicle, onSave }: EditVehicleDialogProps) => {
  const [formData, setFormData] = useState<Vehicle | null>(null);

  useEffect(() => {
    if (vehicle) {
      setFormData({ ...vehicle });
    }
  }, [vehicle]);

  const handleInputChange = (field: keyof Vehicle, value: string | boolean) => {
    if (formData) {
      setFormData({
        ...formData,
        [field]: value
      });
    }
  };

  const handleSave = () => {
    if (formData) {
      onSave(formData);
      onClose();
    }
  };

  if (!formData) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-white">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Edit</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 mt-4">
          {/* Slot Number */}
          <TextField
            label="Slot Number"
            value={formData.parkingSlot}
            onChange={(e) => handleInputChange('parkingSlot', e.target.value)}
            fullWidth
            variant="outlined"
            slotProps={{ inputLabel: { shrink: true } }}
            InputProps={{ sx: fieldStyles }}
          />

          {/* Vehicle Category */}
          <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }}>
            <InputLabel shrink>Vehicle Category</InputLabel>
            <MuiSelect
              value={formData.vehicleCategory}
              onChange={(e) => handleInputChange('vehicleCategory', e.target.value)}
              label="Vehicle Category"
              notched
              MenuProps={selectMenuProps}
            >
              <MenuItem value="4 Wheeler">4 Wheeler</MenuItem>
              <MenuItem value="2 Wheeler">2 Wheeler</MenuItem>
            </MuiSelect>
          </FormControl>

          {/* Vehicle Type */}
          <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }}>
            <InputLabel shrink>Vehicle Type</InputLabel>
            <MuiSelect
              value={formData.vehicleType}
              onChange={(e) => handleInputChange('vehicleType', e.target.value)}
              label="Vehicle Type"
              notched
              MenuProps={selectMenuProps}
            >
              <MenuItem value="Hatchback">Hatchback</MenuItem>
              <MenuItem value="Sedan">Sedan</MenuItem>
              <MenuItem value="SUV">SUV</MenuItem>
              <MenuItem value="Scooter">Scooter</MenuItem>
              <MenuItem value="Truck">Truck</MenuItem>
            </MuiSelect>
          </FormControl>

          {/* Sticker Number */}
          <TextField
            label="Sticker Number"
            value={formData.stickerNumber}
            onChange={(e) => handleInputChange('stickerNumber', e.target.value)}
            fullWidth
            variant="outlined"
            slotProps={{ inputLabel: { shrink: true } }}
            InputProps={{ sx: fieldStyles }}
          />

          {/* Registration Number */}
          <TextField
            label="Registration Number"
            value={formData.registrationNumber}
            onChange={(e) => handleInputChange('registrationNumber', e.target.value)}
            fullWidth
            variant="outlined"
            slotProps={{ inputLabel: { shrink: true } }}
            InputProps={{ sx: fieldStyles }}
          />

          {/* Insurance Number */}
          <TextField
            label="Insurance Number"
            value={formData.insuranceNumber}
            onChange={(e) => handleInputChange('insuranceNumber', e.target.value)}
            fullWidth
            variant="outlined"
            slotProps={{ inputLabel: { shrink: true } }}
            InputProps={{ sx: fieldStyles }}
          />

          {/* Insurance Valid Till */}
          <TextField
            label="Insurance Valid Till"
            value={formData.insuranceValidTill}
            onChange={(e) => handleInputChange('insuranceValidTill', e.target.value)}
            fullWidth
            variant="outlined"
            slotProps={{ inputLabel: { shrink: true } }}
            InputProps={{ sx: fieldStyles }}
          />

          {/* Category */}
          <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }}>
            <InputLabel shrink>Category</InputLabel>
            <MuiSelect
              value={formData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              label="Category"
              notched
              MenuProps={selectMenuProps}
            >
              <MenuItem value="Owned">Owned</MenuItem>
              <MenuItem value="Staff">Staff</MenuItem>
              <MenuItem value="Workshop">Workshop</MenuItem>
            </MuiSelect>
          </FormControl>

          {/* Vehicle Number */}
          <TextField
            label="Vehicle Number"
            value={formData.vehicleNumber}
            onChange={(e) => handleInputChange('vehicleNumber', e.target.value)}
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
            onClick={onClose}
            className="px-6 py-2 !bg-[#DA7756] hover:!bg-[#C45F40]"
          >
            <span className="!text-white font-medium">Close</span>
          </Button>
          <Button
            onClick={handleSave}
            className="px-6 py-2 !bg-[#DA7756] hover:!bg-[#C45F40]"
          >
            <span className="!text-white font-medium">Save</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
