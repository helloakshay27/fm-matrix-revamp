
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { TextField } from '@mui/material';

const fieldStyles = {
  height: { xs: 28, sm: 36, md: 45 },
  '& .MuiInputBase-input': {
    padding: { xs: '8px', sm: '10px', md: '12px' },
  },
};

interface InvoicesFilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApply: (filters: { invoiceNumber: string; invoiceDate: string; supplierName: string; woNumber: string; }) => void;
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
  });

  const handleInputChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleApply = () => {
    onApply(filters);
    onOpenChange(false);
  };

  const handleReset = () => {
    const empty = { invoiceNumber: '', invoiceDate: '', supplierName: '', woNumber: '' };
    setFilters(empty);
    onApply(empty);
    onOpenChange(false);
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
