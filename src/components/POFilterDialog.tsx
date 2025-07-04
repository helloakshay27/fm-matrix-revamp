
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TextField } from '@mui/material';

const fieldStyles = {
  height: { xs: 28, sm: 36, md: 45 },
  '& .MuiInputBase-input': {
    padding: { xs: '8px', sm: '10px', md: '12px' },
  },
};

interface POFilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const POFilterDialog: React.FC<POFilterDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const [filters, setFilters] = useState({
    referenceNumber: '',
    poNumber: '',
    supplierName: ''
  });

  const handleApply = () => {
    console.log('Applying filters:', filters);
    onOpenChange(false);
  };

  const handleReset = () => {
    setFilters({
      referenceNumber: '',
      poNumber: '',
      supplierName: ''
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">FILTER BY</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <TextField
              label="Reference Number"
              placeholder="Search By PR Number"
              value={filters.referenceNumber}
              onChange={(e) => setFilters({ ...filters, referenceNumber: e.target.value })}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
              sx={{ mt: 1 }}
            />
            
            <TextField
              label="PO Number"
              placeholder="Search By PO Number"
              value={filters.poNumber}
              onChange={(e) => setFilters({ ...filters, poNumber: e.target.value })}
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
            onChange={(e) => setFilters({ ...filters, supplierName: e.target.value })}
            fullWidth
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            InputProps={{ sx: fieldStyles }}
            sx={{ mt: 1 }}
          />
        </div>

        <div className="flex gap-3 pt-4">
          <Button 
            variant="secondary"
            onClick={handleApply}
            className="flex-1"
          >
            Apply
          </Button>
          <Button 
            variant="outline"
            onClick={handleReset}
            className="flex-1"
          >
            Reset
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
