
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FormControl, InputLabel, Select as MuiSelect, MenuItem } from '@mui/material';
import { X } from "lucide-react";

interface RuleFilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const fieldStyles = {
  height: { xs: 36, sm: 40, md: 45 },
  '& .MuiInputBase-input, & .MuiSelect-select': {
    padding: { xs: '8px 12px', sm: '10px 14px', md: '12px 14px' },
  },
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'white',
  },
};

// Portals to document.body so the menu anchors under the field instead of
// inheriting the Radix Dialog's translate transform (which mispositions it).
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

export const RuleFilterDialog = ({ open, onOpenChange }: RuleFilterDialogProps) => {
  const [masterAttribute, setMasterAttribute] = useState('');
  const [subAttribute, setSubAttribute] = useState('');

  const handleSubmit = () => {
    console.log('Filter submitted:', { masterAttribute, subAttribute });
    onOpenChange(false);
  };

  const handleCancel = () => {
    setMasterAttribute('');
    setSubAttribute('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal={false}>
      <DialogContent
        className="w-full sm:max-w-[500px] bg-white overflow-visible p-0"
        onPointerDownOutside={(e) => {
          // Keep dialog open when interacting with the MUI select menu
          if ((e.target as HTMLElement).closest('.MuiPopover-root, .MuiModal-root, .MuiMenu-root')) {
            e.preventDefault();
          }
        }}
        onInteractOutside={(e) => {
          if ((e.target as HTMLElement).closest('.MuiPopover-root, .MuiModal-root, .MuiMenu-root')) {
            e.preventDefault();
          }
        }}
      >
        {/* Header */}
        <DialogHeader className="flex flex-row items-center justify-between p-4 border-b border-gray-200">
          <DialogTitle className="text-lg font-medium text-gray-900">Filter By</DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="h-6 w-6 p-0 hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Attributes Section */}
          <div>
            <h3 className="text-sm font-medium text-[#C72030] mb-4">Attributes</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Master Attribute */}
              <FormControl fullWidth variant="outlined">
                <InputLabel id="master-attribute-label">Master Attribute *</InputLabel>
                <MuiSelect
                  labelId="master-attribute-label"
                  label="Master Attribute *"
                  value={masterAttribute}
                  onChange={(e) => setMasterAttribute(e.target.value)}
                  sx={fieldStyles}
                  MenuProps={selectMenuProps}
                >
                  <MenuItem value=""><em>Select Master Attribute</em></MenuItem>
                  <MenuItem value="purchase-amount">Purchase Amount</MenuItem>
                  <MenuItem value="customer-tier">Customer Tier</MenuItem>
                  <MenuItem value="product-category">Product Category</MenuItem>
                  <MenuItem value="frequency">Purchase Frequency</MenuItem>
                </MuiSelect>
              </FormControl>

              {/* Sub Attribute */}
              <FormControl fullWidth variant="outlined">
                <InputLabel id="sub-attribute-label">Sub Attribute *</InputLabel>
                <MuiSelect
                  labelId="sub-attribute-label"
                  label="Sub Attribute *"
                  value={subAttribute}
                  onChange={(e) => setSubAttribute(e.target.value)}
                  sx={fieldStyles}
                  MenuProps={selectMenuProps}
                >
                  <MenuItem value=""><em>Select Sub Attribute</em></MenuItem>
                  <MenuItem value="minimum-spend">Minimum Spend</MenuItem>
                  <MenuItem value="maximum-spend">Maximum Spend</MenuItem>
                  <MenuItem value="gold-tier">Gold Tier</MenuItem>
                  <MenuItem value="silver-tier">Silver Tier</MenuItem>
                </MuiSelect>
              </FormControl>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4 pt-4">
            <Button
              onClick={handleSubmit}
              className="bg-[#8B4B6B] hover:bg-[#7A4260] text-white px-8 py-2"
            >
              Submit
            </Button>
            <Button
              onClick={handleCancel}
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-2"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
