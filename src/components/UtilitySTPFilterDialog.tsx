
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
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
  options: { value: string; label: string }[];
}

// Uncontrolled, matching the shadcn selects this replaced — nothing reads these
// values yet, so they keep their own internal state via defaultValue.
const FilterSelect: React.FC<FilterSelectProps> = ({ label, placeholder, options }) => (
  <div className="space-y-2">
    <Label>{label}</Label>
    <MuiFormControl fullWidth size="small">
      <MuiSelect
        defaultValue=""
        displayEmpty
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

interface UtilitySTPFilterDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UtilitySTPFilterDialog = ({ isOpen, onClose }: UtilitySTPFilterDialogProps) => {
  const handleSubmit = () => {
    console.log('Filtering STP assets...');
    onClose();
  };

  const handleExport = () => {
    // Create and download CSV file for filtered results
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Asset Name,Asset ID,Asset Code,Asset No.,Asset Status,Equipment Id,Site,Building,Wing,Floor,Area,Room,Meter Type,Asset Type\n" +
      "Sample STP Asset,STP001,STP-001,001,In Use,EQ001,Main Site,Building A,East Wing,Ground Floor,Treatment Area,Room 101,Flow Meter,STP Equipment";
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "stp_filtered_assets.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log('Exporting filtered STP assets...');
    onClose();
  };

  const handleReset = () => {
    console.log('Resetting STP filters...');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg [&>button]:hidden">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold">FILTER BY</DialogTitle>
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

        <div className="space-y-6 py-4">
          {/* Asset Details */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-[#C72030]">Asset Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Asset Name</Label>
                <Input placeholder="Enter Asset Name" className="rounded-none" />
              </div>
              <div className="space-y-2">
                <Label>Date Range*</Label>
                <Input placeholder="Select Date Range" className="rounded-none" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FilterSelect
                label="Group"
                placeholder="Select Category"
                options={[
                  { value: 'stp', label: 'STP Equipment' },
                  { value: 'water', label: 'Water Treatment' },
                  { value: 'waste', label: 'Waste Management' },
                ]}
              />
              <FilterSelect
                label="Subgroup"
                placeholder="Select Sub Group"
                options={[
                  { value: 'primary', label: 'Primary Treatment' },
                  { value: 'secondary', label: 'Secondary Treatment' },
                  { value: 'tertiary', label: 'Tertiary Treatment' },
                ]}
              />
            </div>
          </div>

          {/* Location Details */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-[#C72030]">Location Details</h3>
            <div className="grid grid-cols-3 gap-4">
              <FilterSelect
                label="Building"
                placeholder="Select Building"
                options={[
                  { value: 'building-a', label: 'Building A' },
                  { value: 'building-b', label: 'Building B' },
                  { value: 'building-c', label: 'Building C' },
                ]}
              />
              <FilterSelect
                label="Wing"
                placeholder="Select Wing"
                options={[
                  { value: 'east', label: 'East Wing' },
                  { value: 'west', label: 'West Wing' },
                  { value: 'north', label: 'North Wing' },
                  { value: 'south', label: 'South Wing' },
                ]}
              />
              <FilterSelect
                label="Area"
                placeholder="Select Area"
                options={[
                  { value: 'treatment', label: 'Treatment Area' },
                  { value: 'storage', label: 'Storage Area' },
                  { value: 'maintenance', label: 'Maintenance Area' },
                ]}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FilterSelect
                label="Floor"
                placeholder="Select Floor"
                options={[
                  { value: 'ground', label: 'Ground Floor' },
                  { value: 'first', label: 'First Floor' },
                  { value: 'second', label: 'Second Floor' },
                ]}
              />
              <FilterSelect
                label="Room"
                placeholder="Select Room"
                options={[
                  { value: 'room-101', label: 'Room 101' },
                  { value: 'room-102', label: 'Room 102' },
                  { value: 'room-103', label: 'Room 103' },
                ]}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-4 pt-4">
          <Button 
            onClick={handleSubmit}
            className="bg-brand hover:bg-brand-hover text-white px-8"
          >
            Submit
          </Button>
          <Button 
            onClick={handleExport}
            variant="outline"
            className="bg-white border-brand text-brand hover:bg-brand-selected hover:text-brand px-8"
          >
            Export
          </Button>
          <Button 
            onClick={handleReset}
            variant="outline"
            className="bg-white border-brand text-brand hover:bg-brand-selected hover:text-brand px-8"
          >
            Reset
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
