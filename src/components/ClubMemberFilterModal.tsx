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

export interface ClubMembershipFilters {
  email: string;
  mobile: string;
  startDate: string;
  endDate: string;
  clubMemberEnabled: string;
  accessCardEnabled: string;
  search?: string;
  status?: string;
}

interface ClubMemberFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: ClubMembershipFilters) => void;
  initialFilters?: ClubMembershipFilters;
}

export const ClubMemberFilterModal: React.FC<ClubMemberFilterModalProps> = ({
  isOpen,
  onClose,
  onApply,
  initialFilters
}) => {
  const [filters, setFilters] = useState<ClubMembershipFilters>(initialFilters || {
    email: '',
    mobile: '',
    startDate: '',
    endDate: '',
    clubMemberEnabled: '',
    accessCardEnabled: '',
    status: '',
  });

  React.useEffect(() => {
    if (isOpen && initialFilters) {
      setFilters(initialFilters);
    }
  }, [isOpen, initialFilters]);

  const handleInputChange = (field: keyof ClubMembershipFilters, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleSelectChange = (field: keyof ClubMembershipFilters, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const handleReset = () => {
    setFilters({
      email: '',
      mobile: '',
      startDate: '',
      endDate: '',
      clubMemberEnabled: '',
      accessCardEnabled: '',
      status: '',
    });
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
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
          onClick={onClose}
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
              label="Email"
              placeholder="Email"
              value={filters.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
            />

            <TextField
              label="Mobile"
              placeholder="Mobile"
              value={filters.mobile}
              onChange={(e) => handleInputChange('mobile', e.target.value)}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <TextField
              label="Start Date"
              type="date"
              value={filters.startDate}
              onChange={(e) => handleInputChange('startDate', e.target.value)}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
            />
            <TextField
              label="End Date"
              type="date"
              value={filters.endDate}
              onChange={(e) => handleInputChange('endDate', e.target.value)}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormControl fullWidth variant="outlined">
              <InputLabel shrink>Club Member Enabled</InputLabel>
              <MuiSelect
                label="Club Member Enabled"
                value={filters.clubMemberEnabled}
                onChange={(e) => handleSelectChange('clubMemberEnabled', e.target.value as string)}
                displayEmpty
                sx={fieldStyles}
              >
                <MenuItem value=""><em>Select Option</em></MenuItem>
                <MenuItem value="true">Enabled</MenuItem>
                <MenuItem value="false">Disabled</MenuItem>
              </MuiSelect>
            </FormControl>

            <FormControl fullWidth variant="outlined">
              <InputLabel shrink>Membership Status</InputLabel>
              <MuiSelect
                label="Membership Status"
                value={filters.status}
                onChange={(e) => handleSelectChange('status', e.target.value as string)}
                displayEmpty
                sx={fieldStyles}
              >
                <MenuItem value=""><em>Select Status</em></MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
                <MenuItem value="expired">Expired</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
              </MuiSelect>
            </FormControl>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormControl fullWidth variant="outlined">
              <InputLabel shrink>Card Allocated</InputLabel>
              <MuiSelect
                label="Card Allocated"
                value={filters.accessCardEnabled}
                onChange={(e) => handleSelectChange('accessCardEnabled', e.target.value as string)}
                displayEmpty
                sx={fieldStyles}
              >
                <MenuItem value=""><em>Select Option</em></MenuItem>
                <MenuItem value="true">Yes</MenuItem>
                <MenuItem value="false">No</MenuItem>
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
