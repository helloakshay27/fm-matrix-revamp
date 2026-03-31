import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import {
  TextField,
  FormControl,
  InputLabel,
  Select as MuiSelect,
  MenuItem,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Box,
  Typography
} from '@mui/material';

const fieldStyles = {
  height: { xs: 28, sm: 36, md: 45 },
  '& .MuiInputBase-input, & .MuiSelect-select': {
    padding: { xs: '8px', sm: '10px', md: '12px' },
  },
};

interface PaymentFilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApply: (filters: any) => void;
}

export const PaymentFilterDialog: React.FC<PaymentFilterDialogProps> = ({
  open,
  onOpenChange,
  onApply,
}) => {
  const [filters, setFilters] = useState({
    orderNumber: '',
    paymentOf: '',
    paymentStatus: '',
    paymentMethod: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleSelectChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleApply = () => {
    onApply(filters);
    onOpenChange(false);
  };

  const handleReset = () => {
    setFilters({
      orderNumber: '',
      paymentOf: '',
      paymentStatus: '',
      paymentMethod: '',
    });
  };

  return (
    <Dialog
      open={open}
      onClose={() => onOpenChange(false)}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '8px',
          padding: '8px'
        }
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.125rem', textTransform: 'uppercase' }}>
          Filter By
        </Typography>
        <IconButton
          aria-label="close"
          onClick={() => onOpenChange(false)}
          sx={{
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <X size={20} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 1 }}>
        <Box className="space-y-4" sx={{ mt: 1 }}>
          <div className="grid grid-cols-2 gap-4">
            <TextField
              label="Order Number"
              placeholder="Order Number"
              value={filters.orderNumber}
              onChange={(e) => handleInputChange('orderNumber', e.target.value)}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
            />

            <FormControl fullWidth variant="outlined">
              <InputLabel shrink>Payment Type</InputLabel>
              <MuiSelect
                label="Payment Type"
                value={filters.paymentOf}
                onChange={(e) => handleSelectChange('paymentOf', e.target.value as string)}
                displayEmpty
                sx={fieldStyles}
              >
                <MenuItem value=""><em>Select Type</em></MenuItem>
                <MenuItem value="FacilityBooking">Facility Booking</MenuItem>
                <MenuItem value="LockAccountBill">Account Bill</MenuItem>
                <MenuItem value="Maintenance">Maintenance</MenuItem>
                <MenuItem value="Pms::Supplier">Supplier</MenuItem>
              </MuiSelect>
            </FormControl>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormControl fullWidth variant="outlined">
              <InputLabel shrink>Status</InputLabel>
              <MuiSelect
                label="Status"
                value={filters.paymentStatus}
                onChange={(e) => handleSelectChange('paymentStatus', e.target.value as string)}
                displayEmpty
                sx={fieldStyles}
              >
                <MenuItem value=""><em>Select Status</em></MenuItem>
                <MenuItem value="success">Success</MenuItem>
                <MenuItem value="paid">Paid</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="failed">Failed</MenuItem>
              </MuiSelect>
            </FormControl>

            <FormControl fullWidth variant="outlined">
              <InputLabel shrink>Payment Method</InputLabel>
              <MuiSelect
                label="Payment Method"
                value={filters.paymentMethod}
                onChange={(e) => handleSelectChange('paymentMethod', e.target.value as string)}
                displayEmpty
                sx={fieldStyles}
              >
                <MenuItem value=""><em>Select Method</em></MenuItem>
                <MenuItem value="online">Online</MenuItem>
                <MenuItem value="cheque">Cheque</MenuItem>
                <MenuItem value="neft">NEFT</MenuItem>
                <MenuItem value="cash">Cash</MenuItem>
              </MuiSelect>
            </FormControl>
          </div>
        </Box>

        <Box className="flex gap-3 pt-6">
          <Button
            onClick={handleApply}
            className="flex-1 text-white bg-[#C72030] hover:bg-[#A01020]"
          >
            Apply
          </Button>
          <Button
            onClick={handleReset}
            variant="outline"
            className="flex-1 border-[#C72030] text-[#C72030] hover:bg-gray-50"
          >
            Reset
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
