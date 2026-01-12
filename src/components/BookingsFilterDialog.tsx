
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import {
  TextField,
  FormControl,
  InputLabel,
  Select as MuiSelect,
  MenuItem,
} from '@mui/material';

interface BookingsFilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApply: (filters: {
    searchByNameOrEmail: string;
    category: string;
    scheduledOn: string;
    status: string;
    bookedOn: string;
  }) => void;
}

export const BookingsFilterDialog: React.FC<BookingsFilterDialogProps> = ({
  open,
  onOpenChange,
  onApply,
}) => {
  const [filters, setFilters] = useState({
    searchByNameOrEmail: '',
    category: '',
    scheduledOn: '',
    status: '',
    bookedOn: '',
  });

  const handleApply = () => {
    onApply(filters);
    handleClose();
  };

  const handleReset = () => {
    setFilters({
      searchByNameOrEmail: '',
      category: '',
      scheduledOn: '',
      status: '',
      bookedOn: '',
    });
  };

  const handleClose = () => {
    handleReset();
    onOpenChange(false);
  };

  const fieldStyles = {
    height: { xs: 28, sm: 36, md: 45 },
    backgroundColor: 'white',
    '& .MuiInputBase-input, & .MuiSelect-select': {
      padding: { xs: '8px', sm: '10px', md: '12px' },
      backgroundColor: 'white',
    },
    '& .MuiOutlinedInput-root': {
      backgroundColor: 'white',
    },
  };

  const menuProps = {
    PaperProps: {
      style: {
        maxHeight: 200,
        backgroundColor: 'white',
        zIndex: 9999,
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      },
    },
    disablePortal: false,
    disableAutoFocus: true,
    disableEnforceFocus: true,
  };

  return (
    <Dialog open={open} onOpenChange={(val) => { if (!val) handleClose(); }} modal={false}>
      <DialogContent className="max-w-2xl" aria-describedby="filter-dialog-description">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold">FILTER BY</DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <h3 className="text-[14px] text-[#C72030] font-medium mb-4">Booking Details</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <TextField
                  label="Search by Name or Email"
                  placeholder="Search by Name or Email"
                  value={filters.searchByNameOrEmail}
                  onChange={(e) => setFilters({ ...filters, searchByNameOrEmail: e.target.value })}
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ sx: fieldStyles }}
                  size="small"
                />

                <FormControl fullWidth variant="outlined">
                  <InputLabel shrink sx={{ backgroundColor: 'white', px: 1 }}>Category</InputLabel>
                  <MuiSelect
                    value={filters.category}
                    label="Category"
                    displayEmpty
                    onChange={(e) => setFilters({ ...filters, category: String(e.target.value) })}
                    sx={fieldStyles}
                    MenuProps={menuProps}
                  >
                    <MenuItem value="" sx={{ backgroundColor: 'white', px: 1 }}><em>Select Category</em></MenuItem>
                    <MenuItem value="angular-war">Angular War</MenuItem>
                    <MenuItem value="react-zone">React Zone</MenuItem>
                    <MenuItem value="vue-area">Vue Area</MenuItem>
                  </MuiSelect>
                </FormControl>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-4 text-[14px] text-[#C72030]">Schedule & Status</h3>
            <div className="grid grid-cols-2 gap-4">
              <TextField
                label="Scheduled On"
                type="time"
                value={filters.scheduledOn}
                placeholder="HH:MM"
                onChange={(e) => setFilters({ ...filters, scheduledOn: e.target.value })}
                variant="outlined"
                size="small"
                fullWidth
                InputLabelProps={{ shrink: true }}
                inputProps={{ step: 300 }}
                InputProps={{ sx: fieldStyles }}
              />

              <FormControl fullWidth size="small">
                <InputLabel shrink sx={{ backgroundColor: 'white', px: 1 }}>Status</InputLabel>
                <MuiSelect
                  value={filters.status}
                  label="Status"
                  displayEmpty
                  onChange={(e) => setFilters({ ...filters, status: String(e.target.value) })}
                  sx={fieldStyles}
                  MenuProps={menuProps}
                >
                  <MenuItem value="" sx={{ backgroundColor: 'white', px: 1 }}><em>Select Status</em></MenuItem>
                  <MenuItem value="confirmed">Confirmed</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                </MuiSelect>
              </FormControl>
            </div>
          </div>

          <TextField
            label="Booked On"
            placeholder="Booked on"
            value={filters.bookedOn}
            onChange={(e) => setFilters({ ...filters, bookedOn: e.target.value })}
            variant="outlined"
            size="small"
            fullWidth
            InputProps={{ sx: fieldStyles }}
            InputLabelProps={{ shrink: true }}
          />

          {/* Action buttons */}
          <div className="flex justify-end gap-4">
            <Button
              variant="outline"
              onClick={handleReset}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Reset
            </Button>
            <Button
              onClick={handleApply}
              style={{ backgroundColor: '#C72030' }}
              className="text-white hover:bg-[#C72030]/90"
            >
              Apply
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
