
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem, Dialog, DialogContent, DialogTitle } from '@mui/material';

const fieldStyles = {
  height: { xs: 28, sm: 36, md: 45 },
  '& .MuiInputBase-input, & .MuiSelect-select': {
    padding: { xs: '8px', sm: '10px', md: '12px' },
  },
};

interface MaterialPRFilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: {
    referenceNumber: string;
    prNumber: string;
    supplierName: string;
    approvalStatus: string;
  };
  setFilters: React.Dispatch<
    React.SetStateAction<{
      referenceNumber: string;
      prNumber: string;
      supplierName: string;
      approvalStatus: string;
    }>
  >;
  onApplyFilters: (filters: {
    referenceNumber: string;
    prNumber: string;
    supplierName: string;
    approvalStatus: string;
  }) => void;
}

export const MaterialPRFilterDialog: React.FC<MaterialPRFilterDialogProps> = ({
  open,
  onOpenChange,
  filters,
  setFilters,
  onApplyFilters
}) => {


  const handleInputChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleApply = () => {
    onApplyFilters(filters); // Pass filters to parent
    onOpenChange(false); // Close dialog
  };

  const handleReset = () => {
    setFilters({
      referenceNumber: '',
      prNumber: '',
      supplierName: '',
      approvalStatus: ''
    });
  };

  return (
    <Dialog open={open} onClose={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <div className="flex items-center justify-between mb-3">
          <h5 className="text-lg font-semibold">FILTER BY</h5>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <TextField
              label="Reference Number"
              placeholder="PR Number"
              value={filters.referenceNumber}
              onChange={(e) => handleInputChange('referenceNumber', e.target.value)}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
              sx={{ mt: 1 }}
            />

            <TextField
              label="PR Number"
              placeholder="Reference Number"
              value={filters.prNumber}
              onChange={(e) => handleInputChange('prNumber', e.target.value)}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
              sx={{ mt: 1 }}
            />
          </div>

          <TextField
            label="Supplier Name"
            placeholder="Supplier Name"
            value={filters.supplierName}
            onChange={(e) => handleInputChange('supplierName', e.target.value)}
            fullWidth
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            InputProps={{ sx: fieldStyles }}
            sx={{ mt: 1 }}
          />

          <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
            <InputLabel shrink>Approval Status</InputLabel>
            <MuiSelect
              label="Approval Status"
              value={filters.approvalStatus}
              onChange={(e) => handleInputChange('approvalStatus', e.target.value)}
              displayEmpty
              sx={fieldStyles}
            >
              <MenuItem value="Select" disabled><em>Select Status</em></MenuItem>
              <MenuItem value="">Pending</MenuItem>
              <MenuItem value="1">Approved</MenuItem>
              <MenuItem value="0">Rejected</MenuItem>
            </MuiSelect>
          </FormControl>
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            onClick={handleApply}
            className="flex-1 text-white"
            style={{ backgroundColor: '#C72030' }}
          >
            Apply
          </Button>
          <Button
            onClick={handleReset}
            variant="outline"
            className="flex-1"
          >
            Reset
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
