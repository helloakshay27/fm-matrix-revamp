
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  FormControl as MuiFormControl,
  Select as MuiSelect,
  MenuItem,
} from '@mui/material';
import { X } from 'lucide-react';

// `rounded-none` on the old triggers is preserved via borderRadius: 0.
const fieldStyles = {
  height: '40px',
  borderRadius: 0,
  backgroundColor: '#fff',
  '& .MuiOutlinedInput-notchedOutline': {
    borderRadius: 0,
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

interface FilterSelectProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}

const FilterSelect: React.FC<FilterSelectProps> = ({
  label,
  placeholder,
  value,
  onChange,
  options,
}) => (
  <div>
    <Label className="text-sm font-medium mb-2">{label}</Label>
    <MuiFormControl fullWidth size="small">
      <MuiSelect
        displayEmpty
        value={value}
        onChange={(event) => onChange(event.target.value)}
        renderValue={(selected) =>
          selected ? (
            options.find((option) => option.value === selected)?.label ?? selected
          ) : (
            <span className="text-gray-500">{placeholder}</span>
          )
        }
        sx={fieldStyles}
        MenuProps={selectMenuProps}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </MuiSelect>
    </MuiFormControl>
  </div>
);

interface WaterFilterDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WaterFilterDialog: React.FC<WaterFilterDialogProps> = ({ isOpen, onClose }) => {
  const [filters, setFilters] = useState({
    site: '',
    building: '',
    wing: '',
    floor: '',
    area: '',
    room: '',
    assetName: '',
    assetId: '',
    status: '',
    meterType: ''
  });

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleApplyFilters = () => {
    console.log('Applying filters:', filters);
    onClose();
  };

  const handleClearFilters = () => {
    setFilters({
      site: '',
      building: '',
      wing: '',
      floor: '',
      area: '',
      room: '',
      assetName: '',
      assetId: '',
      status: '',
      meterType: ''
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto [&>button]:hidden">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Filter Water Assets</DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
          <FilterSelect
            label="Site"
            placeholder="Select Site"
            value={filters.site}
            onChange={(value) => handleFilterChange('site', value)}
            options={[
              { value: 'site1', label: 'Site 1' },
              { value: 'site2', label: 'Site 2' },
            ]}
          />

          <FilterSelect
            label="Building"
            placeholder="Select Building"
            value={filters.building}
            onChange={(value) => handleFilterChange('building', value)}
            options={[
              { value: 'building1', label: 'Building 1' },
              { value: 'building2', label: 'Building 2' },
            ]}
          />

          <FilterSelect
            label="Wing"
            placeholder="Select Wing"
            value={filters.wing}
            onChange={(value) => handleFilterChange('wing', value)}
            options={[
              { value: 'wing1', label: 'Wing 1' },
              { value: 'wing2', label: 'Wing 2' },
            ]}
          />

          <FilterSelect
            label="Floor"
            placeholder="Select Floor"
            value={filters.floor}
            onChange={(value) => handleFilterChange('floor', value)}
            options={[
              { value: 'floor1', label: 'Floor 1' },
              { value: 'floor2', label: 'Floor 2' },
            ]}
          />

          <FilterSelect
            label="Area"
            placeholder="Select Area"
            value={filters.area}
            onChange={(value) => handleFilterChange('area', value)}
            options={[
              { value: 'area1', label: 'Area 1' },
              { value: 'area2', label: 'Area 2' },
            ]}
          />

          <FilterSelect
            label="Room"
            placeholder="Select Room"
            value={filters.room}
            onChange={(value) => handleFilterChange('room', value)}
            options={[
              { value: 'room1', label: 'Room 1' },
              { value: 'room2', label: 'Room 2' },
            ]}
          />

          <div>
            <Label className="text-sm font-medium mb-2">Asset Name</Label>
            <Input
              value={filters.assetName}
              onChange={(e) => handleFilterChange('assetName', e.target.value)}
              placeholder="Enter Asset Name"
              className="rounded-none"
            />
          </div>

          <div>
            <Label className="text-sm font-medium mb-2">Asset ID</Label>
            <Input
              value={filters.assetId}
              onChange={(e) => handleFilterChange('assetId', e.target.value)}
              placeholder="Enter Asset ID"
              className="rounded-none"
            />
          </div>

          <FilterSelect
            label="Status"
            placeholder="Select Status"
            value={filters.status}
            onChange={(value) => handleFilterChange('status', value)}
            options={[
              { value: 'active', label: 'Active' },
              { value: 'inactive', label: 'Inactive' },
              { value: 'maintenance', label: 'Maintenance' },
            ]}
          />

          <FilterSelect
            label="Meter Type"
            placeholder="Select Meter Type"
            value={filters.meterType}
            onChange={(value) => handleFilterChange('meterType', value)}
            options={[
              { value: 'water', label: 'Water' },
              { value: 'flow', label: 'Flow' },
              { value: 'pressure', label: 'Pressure' },
            ]}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button 
            onClick={handleClearFilters}
            style={{ backgroundColor: '#C72030' }}
            className="text-white hover:bg-[#C72030]/90 rounded-none"
          >
            Clear All
          </Button>
          <Button 
            onClick={handleApplyFilters}
            style={{ backgroundColor: '#C72030' }}
            className="text-white hover:bg-[#C72030]/90 rounded-none"
          >
            Apply Filters
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
