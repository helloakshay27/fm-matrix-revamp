
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  FormControl as MuiFormControl,
  Select as MuiSelect,
  MenuItem,
} from '@mui/material';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { X } from 'lucide-react';

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

interface ScheduleSelectProps {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}

const ScheduleSelect: React.FC<ScheduleSelectProps> = ({
  id,
  label,
  placeholder,
  value,
  onChange,
  options,
}) => (
  <div>
    <Label htmlFor={id} className="text-sm font-medium">{label}</Label>
    <MuiFormControl fullWidth size="small" className="mt-1">
      <MuiSelect
        id={id}
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

interface CreateScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export const CreateScheduleModal = ({ isOpen, onClose, onSubmit }: CreateScheduleModalProps) => {
  const [formData, setFormData] = useState({
    flat: '',
    category: '',
    subCategory: '',
    scheduleDate: '',
    paymentMethod: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    onSubmit(formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader className="flex flex-row items-center justify-between pb-4">
          <DialogTitle className="text-lg font-semibold">Create Schedule</DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="p-1"
          >
            <X className="w-4 h-4 text-red-500" />
          </Button>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <ScheduleSelect
              id="flat"
              label="Select Flat"
              placeholder="select"
              value={formData.flat}
              onChange={(value) => handleInputChange('flat', value)}
              options={[
                { value: 'a-101', label: 'A-101' },
                { value: 'a-102', label: 'A-102' },
                { value: 'a-103', label: 'A-103' },
                { value: 'a-104', label: 'A-104' },
              ]}
            />

            <ScheduleSelect
              id="category"
              label="Select Category"
              placeholder="select Category"
              value={formData.category}
              onChange={(value) => handleInputChange('category', value)}
              options={[
                { value: 'pest-control', label: 'Pest Control' },
                { value: 'deep-cleaning', label: 'Deep Cleaning' },
                { value: 'civil-mason', label: 'Civil & Mason Works' },
                { value: 'invisible-grill', label: 'Invisible Grill' },
                { value: 'mosquito-mesh', label: 'Mosquito Mesh' },
              ]}
            />
          </div>

          <ScheduleSelect
            id="subCategory"
            label="Select Sub Category"
            placeholder=""
            value={formData.subCategory}
            onChange={(value) => handleInputChange('subCategory', value)}
            options={[
              { value: 'standard-cockroach', label: 'Standard Cockroach Control' },
              { value: '4d-cockroach', label: '4D Cockroach Control' },
              { value: 'bathroom-cleaning', label: 'Bathroom Cleaning' },
              { value: 'sofa-cleaning', label: 'Sofa Cleaning' },
              { value: 'grouting-tiles', label: 'Grouting Of Tiles' },
              { value: 'residential-apartment', label: 'Residential Apartment' },
            ]}
          />

          <div>
            <Label className="text-sm font-medium text-gray-900 block mb-2">Schedule Visit</Label>
            <div>
              <Label htmlFor="scheduleDate" className="text-sm font-medium">Select Date</Label>
              <Input
                id="scheduleDate"
                type="date"
                value={formData.scheduleDate}
                onChange={(e) => handleInputChange('scheduleDate', e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          <ScheduleSelect
            id="paymentMethod"
            label="Select Payment method"
            placeholder="Card"
            value={formData.paymentMethod}
            onChange={(value) => handleInputChange('paymentMethod', value)}
            options={[
              { value: 'card', label: 'Card' },
              { value: 'cash', label: 'Cash' },
              { value: 'bank-transfer', label: 'Bank Transfer' },
              { value: 'upi', label: 'UPI' },
            ]}
          />

          <div className="bg-gray-50 p-3 rounded text-xs text-gray-600">
            <strong>Disclaimer:</strong> The Services include the provision of the Platform that enables you to arrange and
            schedule different home-based services with independent third-party service provider of those
            services ("Service Professionals").
          </div>

          <div className="flex justify-center pt-2">
            <Button
              onClick={handleSubmit}
              className="fm-button-fix fm-button-brand px-4 py-2"
              variant="ghost"
            >
              Pay {localStorage.getItem('currency')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
