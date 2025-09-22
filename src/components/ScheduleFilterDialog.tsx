import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from 'lucide-react';
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem } from '@mui/material';
import { useToast } from '@/hooks/use-toast';

interface ScheduleFilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters?: {
    activityName: string;
    type: string;
    category: string;
  };
  onApplyFilters?: (filters: { activityName: string; type: string; category: string; }) => void;
  onResetFilters?: () => void;
}

const fieldStyles = {
  width: '100%',
  '& .MuiOutlinedInput-root': {
    height: { xs: '36px', md: '45px' },
    borderRadius: '8px',
    backgroundColor: '#FFFFFF',
    '& fieldset': {
      borderColor: '#E0E0E0',
    },
    '&:hover fieldset': {
      borderColor: '#1A1A1A',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#C72030',
      borderWidth: 2,
    },
  },
  '& .MuiInputLabel-root': {
    color: '#666666',
    fontSize: '14px',
    '&.Mui-focused': {
      color: '#C72030',
    },
    '&.MuiInputLabel-shrink': {
      transform: 'translate(14px, -9px) scale(0.75)',
      backgroundColor: '#FFFFFF',
      padding: '0 4px',
    },
  },
  '& .MuiOutlinedInput-input, & .MuiSelect-select': {
    color: '#1A1A1A',
    fontSize: '14px',
    padding: { xs: '8px 14px', md: '12px 14px' },
    height: 'auto',
    '&::placeholder': {
      color: '#999999',
      opacity: 1,
    },
  },
};

export const ScheduleFilterDialog = ({
  open,
  onOpenChange,
  filters,
  onApplyFilters,
  onResetFilters
}: ScheduleFilterDialogProps) => {
  const { toast } = useToast();
  const [localFilters, setLocalFilters] = useState(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleApply = () => {
    onApplyFilters(localFilters);
    onOpenChange(false);
  };

  const handleReset = () => {
    setLocalFilters({
      activityName: '',
      type: '',
      category: ''
    });
    onResetFilters();
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  const fieldStyles = {
    height: { xs: 28, sm: 36, md: 45 },
    backgroundColor: 'white',
    '& .MuiInputBase-input, & .MuiSelect-select': {
      padding: { xs: '8px', sm: '10px', md: '12px' },
      backgroundColor: 'white',
    },
    '& .MuiOutlinedInput-root': {
      backgroundColor: 'white',
    }
  };

  const menuProps = {
    PaperProps: {
      style: {
        maxHeight: 200,
        backgroundColor: 'white',
        zIndex: 9999,
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      },
    },
    disablePortal: false,
    disableAutoFocus: true,
    disableEnforceFocus: true,
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" id="schedule-filter-modal-root">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold">FILTER BY</DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Activity Name */}
          <div className="flex flex-col">
            <TextField
              label="Enter Activity"
              placeholder="Enter Name"
              value={localFilters.activityName}
              onChange={(e) => setLocalFilters(prev => ({ ...prev, activityName: e.target.value }))}
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
              sx={fieldStyles}
            />
          </div>

          {/* Select Type */}
          <div className="flex flex-col">
            <FormControl variant="outlined" sx={fieldStyles}>
              <InputLabel id="type-label" shrink>Select Type</InputLabel>
              <MuiSelect
                native
                labelId="type-label"
                label="Select Type"
                displayEmpty
                value={localFilters.type}
                onChange={(e) => setLocalFilters(prev => ({ ...prev, type: e.target.value }))}
                MenuProps={{
                  disablePortal: true,
                  container: () => document.getElementById('schedule-filter-modal-root') || document.body
                }}
              >
                <option value="">Select Type</option>
                <option value="PPM">PPM</option>
                <option value="Routine">Routine</option>
                <option value="AMC">AMC</option>
                <option value="Preparedness">Preparedness</option>
              </MuiSelect>
            </FormControl>
          </div>

          {/* Select Category */}
          <div className="flex flex-col">
            <FormControl variant="outlined" sx={fieldStyles}>
              <InputLabel id="category-label" shrink>Select Category</InputLabel>
              <MuiSelect
                native
                labelId="category-label"
                label="Select Category"
                displayEmpty
                value={localFilters.category}
                onChange={(e) => setLocalFilters(prev => ({ ...prev, category: e.target.value }))}
                MenuProps={{
                  disablePortal: true,
                  container: () => document.getElementById('schedule-filter-modal-root') || document.body
                }}
              >
                <option value="">Select Category</option>
                <option value="Technical">Technical</option>
                <option value="Non Technical">Non Technical</option>
              </MuiSelect>
            </FormControl>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-10">
            <Button
              onClick={handleApply}
            >
              Apply Filters
            </Button>
            <Button
              onClick={handleReset}
              variant="outline"
              className="px-8 border-[#C72030] text-[#C72030] hover:bg-[#C72030]/10"
            >
              Reset
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
