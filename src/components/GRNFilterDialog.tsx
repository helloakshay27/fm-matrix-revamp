
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

interface GRNFilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const GRNFilterDialog: React.FC<GRNFilterDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const [filters, setFilters] = useState({
    grnNumber: '',
    poNumber: '',
    supplierName: '',
    status: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleApply = () => {
    console.log('Applying GRN filters:', filters);
    onOpenChange(false);
  };

  const handleReset = () => {
    setFilters({
      grnNumber: '',
      poNumber: '',
      supplierName: '',
      status: ''
    });
  };

  return (
    <Dialog open={open} onClose={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <div className="flex flex-row items-center justify-between space-y-0 pb-4">
          <h1 className="text-lg font-semibold">FILTER BY</h1>
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
              label="GRN Number"
              placeholder="Find By GRN Number"
              value={filters.grnNumber}
              onChange={(e) => handleInputChange('grnNumber', e.target.value)}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
              sx={{ mt: 1 }}
            />

            <TextField
              label="PO Number"
              placeholder="Find By PO Number"
              value={filters.poNumber}
              onChange={(e) => handleInputChange('poNumber', e.target.value)}
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
            <InputLabel shrink>Status</InputLabel>
            <MuiSelect
              label="Status"
              value={filters.status}
              onChange={(e) => handleInputChange('status', e.target.value)}
              displayEmpty
              sx={fieldStyles}
            >
              <MenuItem value=""><em>Select Status</em></MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="received">Received</MenuItem>
              <MenuItem value="partial">Partial</MenuItem>
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
