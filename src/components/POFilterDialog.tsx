
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem, Dialog, DialogContent } from '@mui/material';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { getSuppliers } from '@/store/slices/materialPRSlice';
import { toast } from 'sonner';
import { X } from 'lucide-react';

const fieldStyles = {
  height: { xs: 28, sm: 36, md: 45 },
  '& .MuiInputBase-input': {
    padding: { xs: '8px', sm: '10px', md: '12px' },
  },
};

interface POFilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: {
    referenceNumber: string;
    poNumber: string;
    supplierName: string;
    approvalStatus: string;
  };
  setFilters: React.Dispatch<React.SetStateAction<{
    referenceNumber: string;
    poNumber: string;
    supplierName: string;
    approvalStatus: string;
  }>>;
  onApplyFilters: (filters: {
    referenceNumber: string;
    poNumber: string;
    supplierName: string;
  }) => void;
}

export const POFilterDialog: React.FC<POFilterDialogProps> = ({
  open,
  onOpenChange,
  filters,
  setFilters,
  onApplyFilters
}) => {
  const [suppliers, setSuppliers] = useState([])

  const dispatch = useAppDispatch();
  const token = localStorage.getItem('token');
  const baseUrl = localStorage.getItem('baseUrl');

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await dispatch(getSuppliers({ baseUrl, token })).unwrap();
        setSuppliers(response.suppliers);
      } catch (error) {
        console.log(error);
        toast.dismiss();
        toast.error(error);
      }
    };

    fetchSuppliers();
  }, []);

  const handleApply = () => {
    onApplyFilters(filters); // Pass filters to parent
    onOpenChange(false); // Close dialog
  };

  const handleReset = () => {
    setFilters({
      referenceNumber: '',
      poNumber: '',
      supplierName: '',
      approvalStatus: ''
    });
  };

  return (
    <Dialog onClose={onOpenChange} open={open}>
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
              onChange={(e) => setFilters({ ...filters, referenceNumber: e.target.value })}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
              sx={{ mt: 1 }}
            />

            <TextField
              label="PO Number"
              placeholder="PO Number"
              value={filters.poNumber}
              onChange={(e) => setFilters({ ...filters, poNumber: e.target.value })}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
              sx={{ mt: 1 }}
            />
          </div>

          <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
            <InputLabel shrink>Supplier Name</InputLabel>
            <MuiSelect
              label="Supplier Name"
              value={filters.supplierName}
              onChange={(e) => setFilters({ ...filters, supplierName: e.target.value })}
              displayEmpty
              sx={fieldStyles}
            >
              <MenuItem value="" disabled><em>Select Supplier</em></MenuItem>
              {suppliers.map((supplier: any) => (
                <MenuItem key={supplier.id} value={supplier.name.split('-')[0]}>{supplier.name.split('-')[0]}</MenuItem>
              ))}
            </MuiSelect>
          </FormControl>

          <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
            <InputLabel shrink>Approval Status</InputLabel>
            <MuiSelect
              label="Approval Status"
              value={filters.approvalStatus}
              onChange={(e) => setFilters({ ...filters, approvalStatus: e.target.value })}
              displayEmpty
              sx={fieldStyles}
            >
              <MenuItem value="" disabled><em>Select Status</em></MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="approved">Approved</MenuItem>
              <MenuItem value="rejected">Rejected</MenuItem>
            </MuiSelect>
          </FormControl>

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
        </div>
      </DialogContent>
    </Dialog>
  );
};
