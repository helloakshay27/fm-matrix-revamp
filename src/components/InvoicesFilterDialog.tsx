import React, { useState } from 'react';
import { Dialog, DialogContent
  
  , DialogTitle } from "@mui/material";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem } from '@mui/material';

const fieldStyles = {
  height: { xs: 28, sm: 36, md: 45 },
  '& .MuiInputBase-input': {
    padding: { xs: '8px', sm: '10px', md: '12px' },
  },
};

interface InvoicesFilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApply: (filters: { invoiceNumber: string; invoiceDate: string; supplierName: string; woNumber: string; prType: string; }) => void;
}

export const InvoicesFilterDialog: React.FC<InvoicesFilterDialogProps> = ({
  open,
  onOpenChange,
  onApply,
}) => {
  const [filters, setFilters] = useState({
    invoiceNumber: '',
    invoiceDate: '',
    supplierName: '',
    woNumber: '',
    prType: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleApply = () => {
    onApply(filters);
    onOpenChange(false);
  };

  const handleReset = () => {
    const empty = { invoiceNumber: '', invoiceDate: '', supplierName: '', woNumber: '', prType: '' };
    setFilters(empty);
    onApply(empty);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-2xl sm:rounded-2xl">
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
              label="Invoice Number"
              placeholder="Find By Invoice Number"
              value={filters.invoiceNumber}
              onChange={(e) => handleInputChange('invoiceNumber', e.target.value)}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
              sx={{ mt: 1 }}
            />

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
          </div>

          <div className="grid grid-cols-2 gap-4">
            <TextField
              label="Invoice Date"
              type="date"
              value={filters.invoiceDate}
              onChange={(e) => handleInputChange('invoiceDate', e.target.value)}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
              sx={{ mt: 1 }}
            />

            <TextField
              label="WO Number"
              placeholder="Find By WO Number"
              value={filters.woNumber}
              onChange={(e) => handleInputChange('woNumber', e.target.value)}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
              sx={{ mt: 1 }}
            />
          </div>

          <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
            <InputLabel shrink>PR Type</InputLabel>
            <MuiSelect
              label="PR Type"
              value={filters.prType}
              onChange={(e) => handleInputChange('prType', e.target.value)}
              displayEmpty
              sx={fieldStyles}
            >
              <MenuItem value="" disabled><em>Select PR Type</em></MenuItem>
              <MenuItem value="technical">Technical</MenuItem>
              <MenuItem value="non-technical">Non-Technical</MenuItem>
              <MenuItem value="security">Security</MenuItem>
            </MuiSelect>
          </FormControl>
        </div>

        <div className="flex gap-3 pt-4 items-center justify-end">
          <Button
            onClick={handleReset}
            variant="outline"
            className="h-[42px] sm:h-[42px] px-[22px] text-[13px] font-semibold rounded-[8px]"
          >
            Reset
          </Button>
          <Button
            onClick={handleApply}
            className="fm-action-primary"
          >
            Apply
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
