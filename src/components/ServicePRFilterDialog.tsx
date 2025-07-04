
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem } from '@mui/material';

const fieldStyles = {
  height: { xs: 28, sm: 36, md: 45 },
  '& .MuiInputBase-input, & .MuiSelect-select': {
    padding: { xs: '8px', sm: '10px', md: '12px' },
  },
};

interface ServicePRFilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ServicePRFilterDialog: React.FC<ServicePRFilterDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const [filters, setFilters] = useState({
    referenceNumber: '',
    prNumber: '',
    supplierName: '',
    approvalStatus: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleApply = () => {
    console.log('Applying filters:', filters);
    onOpenChange(false);
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <DialogTitle className="text-lg font-semibold">FILTER BY</DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <TextField
              label="Reference Number"
              placeholder="Find By PR Number"
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
              placeholder="Enter Reference Number"
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
              <MenuItem value=""><em>Select Status</em></MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="approved">Approved</MenuItem>
              <MenuItem value="rejected">Rejected</MenuItem>
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
