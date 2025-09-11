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
    <Dialog open={open} onOpenChange={(open) => { if (!open) handleClose(); }} modal={false}>
      <DialogContent className="max-w-2xl bg-white [&>button]:hidden" aria-describedby="filter-dialog-description">
        <DialogHeader className="flex flex-row items-center justify-between border-b pb-4">
          <DialogTitle className="text-xl font-semibold">FILTER BY</DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <div className="p-6 space-y-6">
          {/* Activity Search Section */}
          <div>
            <h3 className="text-[14px] text-[#C72030] font-medium mb-4">Activity Information</h3>
            <div className="grid grid-cols-1 gap-4">
              <TextField
                label="Enter Activity"
                placeholder="Enter Name"
                value={localFilters.activityName}
                onChange={(e) => setLocalFilters(prev => ({ ...prev, activityName: e.target.value }))}
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                sx={{ '& .MuiInputBase-root': fieldStyles }}
              />
            </div>
          </div>

          {/* Filter Options */}
          <div>
            <h3 className="text-[14px] text-[#C72030] font-medium mb-4">Filter Options</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Select Type */}
              <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }}>
                <InputLabel shrink>Select Type</InputLabel>
                <MuiSelect
                  value={localFilters.type}
                  onChange={(e) => setLocalFilters(prev => ({ ...prev, type: e.target.value }))}
                  label="Select Type"
                  notched
                  displayEmpty
                  MenuProps={menuProps}
                >
                  <MenuItem value="">
                    <em>Select Type</em>
                  </MenuItem>
                  <MenuItem value="PPM">PPM</MenuItem>
                  <MenuItem value="Routine">Routine</MenuItem>
                  <MenuItem value="AMC">AMC</MenuItem>
                </MuiSelect>
              </FormControl>

              {/* Select Category */}
              <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }}>
                <InputLabel shrink>Select Category</InputLabel>
                <MuiSelect
                  value={localFilters.category}
                  onChange={(e) => setLocalFilters(prev => ({ ...prev, category: e.target.value }))}
                  label="Select Category"
                  notched
                  displayEmpty
                  MenuProps={menuProps}
                >
                  <MenuItem value="">
                    <em>Select Category</em>
                  </MenuItem>
                  <MenuItem value="Technical">Technical</MenuItem>
                  <MenuItem value="Non Technical">Non Technical</MenuItem>
                </MuiSelect>
              </FormControl>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between pt-6">
            <Button 
              className="bg-[#C72030] hover:bg-[#C72030]/90 text-white px-8 border-0"
              onClick={handleApply}
            >
              Apply Filters
            </Button>
            <Button 
              variant="outline"
              className="px-8 border-[#C72030] text-[#C72030] hover:bg-[#C72030]/10"
              onClick={handleReset}
            >
              Reset
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
