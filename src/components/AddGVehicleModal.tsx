
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { TextField, FormControl, Select as MuiSelect, MenuItem } from '@mui/material';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';

interface AddGVehicleModalProps {
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

export const AddGVehicleModal = ({ isOpen, onClose }: AddGVehicleModalProps) => {
  const [type, setType] = useState('Occupants');
  const [occupantUser, setOccupantUser] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [parkingSlot, setParkingSlot] = useState('');
  const [entryGate, setEntryGate] = useState('');

  const handleSubmit = () => {
    // Handle form submission
    console.log('Form submitted:', {
      type,
      occupantUser,
      vehicleNumber,
      parkingSlot,
      entryGate
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-white [&>button]:hidden">
        <DialogHeader className="flex flex-row items-center justify-between border-b pb-4">
          <DialogTitle className="text-lg font-semibold">Add Vehicle</DialogTitle>
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
          {/* Type Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Type</Label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="type"
                  value="Occupants"
                  checked={type === 'Occupants'}
                  onChange={(e) => setType(e.target.value)}
                  className="w-4 h-4 text-[#C72030]"
                />
                <span className="text-sm">Occupants</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="type"
                  value="Guest"
                  checked={type === 'Guest'}
                  onChange={(e) => setType(e.target.value)}
                  className="w-4 h-4 text-[#C72030]"
                />
                <span className="text-sm">Guest</span>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Occupant User */}
            <div className="space-y-2">
              <Label htmlFor="occupantUser" className="text-sm font-medium">
                Occupant User
              </Label>
              <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }}>
                <MuiSelect
                  displayEmpty
                  notched
                  value={occupantUser}
                  onChange={(e) => setOccupantUser(e.target.value)}
                  renderValue={(value) => value ? (value as string) : <em style={{ color: '#9ca3af', fontStyle: 'normal' }}>Select Name</em>}
                  MenuProps={selectMenuProps}
                >
                  <MenuItem value="">
                    <em>Select Name</em>
                  </MenuItem>
                  <MenuItem value="user1">User 1</MenuItem>
                  <MenuItem value="user2">User 2</MenuItem>
                  <MenuItem value="user3">User 3</MenuItem>
                </MuiSelect>
              </FormControl>
            </div>

            {/* Vehicle Number */}
            <div className="space-y-2">
              <Label htmlFor="vehicleNumber" className="text-sm font-medium">
                Vehicle Number
              </Label>
              <TextField
                id="vehicleNumber"
                placeholder="Vehicle Number"
                fullWidth
                variant="outlined"
                value={vehicleNumber}
                onChange={(e) => setVehicleNumber(e.target.value)}
                slotProps={{ inputLabel: { shrink: true } }}
                InputProps={{ sx: fieldStyles }}
              />
            </div>

            {/* Parking Slot */}
            <div className="space-y-2">
              <Label htmlFor="parkingSlot" className="text-sm font-medium">
                Parking Slot
              </Label>
              <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }}>
                <MuiSelect
                  displayEmpty
                  notched
                  value={parkingSlot}
                  onChange={(e) => setParkingSlot(e.target.value)}
                  renderValue={(value) => value ? (value as string) : <em style={{ color: '#9ca3af', fontStyle: 'normal' }}>Select Parking Slot</em>}
                  MenuProps={selectMenuProps}
                >
                  <MenuItem value="">
                    <em>Select Parking Slot</em>
                  </MenuItem>
                  <MenuItem value="slot1">Slot 1</MenuItem>
                  <MenuItem value="slot2">Slot 2</MenuItem>
                  <MenuItem value="slot3">Slot 3</MenuItem>
                </MuiSelect>
              </FormControl>
            </div>
          </div>

          {/* Entry Gate */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="entryGate" className="text-sm font-medium">
                Entry Gate
              </Label>
              <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }}>
                <MuiSelect
                  displayEmpty
                  notched
                  value={entryGate}
                  onChange={(e) => setEntryGate(e.target.value)}
                  renderValue={(value) => value ? (value as string) : <em style={{ color: '#9ca3af', fontStyle: 'normal' }}>Select Entry Gate</em>}
                  MenuProps={selectMenuProps}
                >
                  <MenuItem value="">
                    <em>Select Entry Gate</em>
                  </MenuItem>
                  <MenuItem value="gate1">Gate 1</MenuItem>
                  <MenuItem value="gate2">Gate 2</MenuItem>
                  <MenuItem value="gate3">Gate 3</MenuItem>
                </MuiSelect>
              </FormControl>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <Button
              onClick={handleSubmit}
              style={{ backgroundColor: '#C72030' }}
              className="hover:bg-[#C72030]/90 text-white px-8 py-2"
            >
              Submit
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
