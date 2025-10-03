import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem } from '@mui/material';
import { Badge } from '@/components/ui/badge';
import { Filter, Flag, Globe, Activity, X, RotateCcw } from 'lucide-react';

export interface OrganizationFilters {
  countryId?: string;
  status?: string;
  domain?: string;
}

interface OrganizationFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: OrganizationFilters) => void;
  countriesDropdown: Array<{ id: number; name: string }>;
}

const fieldStyles = {
  height: { xs: 28, sm: 36, md: 45 },
  '& .MuiInputBase-input, & .MuiSelect-select': {
    padding: { xs: '8px', sm: '10px', md: '12px' },
  },
};

const selectMenuProps = {
  PaperProps: {
    style: {
      maxHeight: 224,
      backgroundColor: 'white',
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      zIndex: 9999,
    },
  },
  disablePortal: false,
  disableAutoFocus: true,
  disableEnforceFocus: true,
};

export const OrganizationFilterModal: React.FC<OrganizationFilterModalProps> = ({
  isOpen,
  onClose,
  onApply,
  countriesDropdown
}) => {
  const [filters, setFilters] = useState<OrganizationFilters>({});

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const handleClear = () => {
    setFilters({});
    onApply({});
    onClose();
  };

  const handleClose = () => {
    onClose();
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== undefined && value !== '');

  return (
    <Dialog open={isOpen} onOpenChange={handleClose} modal={false}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto bg-white z-50">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <DialogTitle className="text-lg font-semibold text-gray-900">FILTER ORGANIZATIONS</DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="h-6 w-6 p-0 hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <div className="p-6 space-y-6">
          {/* Country Filter */}
          <FormControl fullWidth variant="outlined">
            <InputLabel shrink>Country</InputLabel>
            <MuiSelect
              value={filters.countryId || ''}
              onChange={(e) => setFilters({ ...filters, countryId: e.target.value || undefined })}
              label="Country"
              displayEmpty
              MenuProps={selectMenuProps}
              sx={fieldStyles}
            >
              <MenuItem value="">
                <em>All Countries</em>
              </MenuItem>
              {countriesDropdown.map((country) => (
                <MenuItem key={country.id} value={country.id.toString()}>
                  {country.name}
                </MenuItem>
              ))}
            </MuiSelect>
          </FormControl>

          {/* Status Filter */}
          <FormControl fullWidth variant="outlined">
            <InputLabel shrink>Status</InputLabel>
            <MuiSelect
              value={filters.status || ''}
              onChange={(e) => setFilters({ ...filters, status: e.target.value || undefined })}
              label="Status"
              displayEmpty
              MenuProps={selectMenuProps}
              sx={fieldStyles}
            >
              <MenuItem value="">
                <em>All Status</em>
              </MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </MuiSelect>
          </FormControl>

          {/* Domain Filter */}
          <TextField
            label="Domain Name"
            placeholder="e.g., example.com"
            value={filters.domain || ''}
            onChange={(e) => setFilters({ ...filters, domain: e.target.value || undefined })}
            fullWidth
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            InputProps={{ sx: fieldStyles }}
          />

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              onClick={handleClear}
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-2 rounded-none"
            >
              Reset
            </Button>
            <Button
              onClick={handleApply}
              style={{ backgroundColor: '#C72030' }}
              className="hover:bg-[#C72030]/90 text-white px-6 py-2 rounded-none"
            >
              Apply
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
