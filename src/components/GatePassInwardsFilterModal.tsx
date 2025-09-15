import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { API_CONFIG } from '@/config/apiConfig';
import { FormControl, InputLabel, Select as MuiSelect, TextField } from '@mui/material';

interface GatePassInwardsFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: any;
  setFilters: (filters: any) => void;
}

export const GatePassInwardsFilterModal = ({ isOpen, onClose, filters, setFilters }: GatePassInwardsFilterModalProps) => {
  // Provide default filters if undefined
  const defaultFilters = {
    gateNumber: '',
    createdBy: '',
    materialName: '',
    supplierName: '',
    materialType: '',
    expectedReturnDate: '',
  };
  const safeFilters = filters || defaultFilters;

  const [vendors, setVendors] = useState<{ id: number; name: string }[]>([]);
  // Local state for modal filter changes
  const [localFilters, setLocalFilters] = useState(safeFilters);

  // Sync localFilters with filters when modal opens
  React.useEffect(() => {
    if (isOpen) setLocalFilters(safeFilters);
    // eslint-disable-next-line
  }, [isOpen]);

  React.useEffect(() => {
    fetch(`${API_CONFIG.BASE_URL}/pms/suppliers/get_suppliers.json`, {
      headers: {
        'Authorization': `Bearer ${API_CONFIG.TOKEN}`,
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(data => setVendors(data || []))
      .catch(() => setVendors([]));
  }, []);

  // Update localFilters only
  const handleChange = (field: string, value: string) => {
    setLocalFilters(prev => ({ ...prev, [field]: value }));
  };

  // Apply localFilters to parent state
  const handleApply = () => {
    setFilters(localFilters);
    onClose();
  };

  // Reset localFilters to default and update parent filters
  const handleReset = () => {
    setLocalFilters(defaultFilters);
    setFilters(defaultFilters); // <-- update parent filters so table resets
  };

  const fieldStyles = {
    width: '100%',
    '& .MuiOutlinedInput-root': {
      height: { xs: '36px', md: '45px' },
      borderRadius: '8px',
      backgroundColor: '#FFFFFF',
      '& fieldset': {
        borderColor: '#E0E0E0',
      },
      '&:hover fieldset': {
        borderColor: '#1A1A1A',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#C72030',
        borderWidth: 2,
      },
    },
    '& .MuiInputLabel-root': {
      color: '#666666',
      fontSize: '14px',
      '&.Mui-focused': {
        color: '#C72030',
      },
      '&.MuiInputLabel-shrink': {
        transform: 'translate(14px, -9px) scale(0.75)',
        backgroundColor: '#FFFFFF',
        padding: '0 4px',
      },
    },
    '& .MuiOutlinedInput-input, & .MuiSelect-select': {
      color: '#1A1A1A',
      fontSize: '14px',
      padding: { xs: '8px 14px', md: '12px 14px' },
      height: 'auto',
      '&::placeholder': {
        color: '#999999',
        opacity: 1,
      },
    },
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">FILTER</DialogTitle>
        </DialogHeader>
        <div className="">
          {/* Gate Number Input */}
          <div className="mb-4">
            <TextField
              label="Gate Number"
              placeholder="Enter Gate Number"
              value={localFilters.gateNumber}
              onChange={e => handleChange('gateNumber', e.target.value)}
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              sx={fieldStyles}
            />
          </div>
          {/* Created By */}
          <div className="mb-4">
            <TextField
              label="Created By"
              placeholder="Enter Created By"
              value={localFilters.createdBy}
              onChange={e => handleChange('createdBy', e.target.value)}
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              sx={fieldStyles}
            />
          </div>
          {/* Supplier Name (Vendor Dropdown) */}
          <div className="mb-4">
            <FormControl variant="outlined" sx={fieldStyles}>
              <InputLabel id="supplierName-label" shrink>Vendor</InputLabel>
              <MuiSelect
                native
                labelId="supplierName-label"
                label="Vendor"
                displayEmpty
                value={localFilters.supplierName}
                onChange={e => handleChange('supplierName', e.target.value)}
              >
                <option value="">Select vendor</option>
                {vendors.map(vendor => (
                  <option key={vendor.id} value={vendor.name}>{vendor.name}</option>
                ))}
              </MuiSelect>
            </FormControl>
          </div>
          {/* Expected Return Date */}
          {/* <div className="mb-4">
            <TextField
              label="Expected Return Date"
              type="date"
              value={localFilters.expectedReturnDate}
              onChange={e => handleChange('expectedReturnDate', e.target.value)}
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              sx={fieldStyles}
              inputProps={{ min: '', max: '' }}
            />
          </div> */}
          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              onClick={handleReset}
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-2 rounded-none"
            >
              Reset
            </Button>
            <Button
              onClick={handleApply}
              style={{ backgroundColor: '#F2EEE9', color: '#BF213E' }}
              className="hover:bg-[#F2EEE9]/90 px-6 py-2 rounded-none"
            >
              Apply
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
