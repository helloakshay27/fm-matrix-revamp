
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem } from '@mui/material';
import { X } from 'lucide-react';

interface ScheduleFilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ScheduleFilterDialog: React.FC<ScheduleFilterDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const [activityName, setActivityName] = useState('');
  const [type, setType] = useState('');
  const [category, setCategory] = useState('');

  const fieldStyles = {
    height: { xs: 28, sm: 36, md: 45 },
    '& .MuiInputBase-input, & .MuiSelect-select': {
      padding: { xs: '8px', sm: '10px', md: '12px' },
      fontSize: { xs: '12px', sm: '13px', md: '14px' },
    },
  };

  const handleApply = () => {
    console.log('Applying filters:', { activityName, type, category });
    onOpenChange(false);
  };

  const handleReset = () => {
    setActivityName('');
    setType('');
    setCategory('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <div className="flex items-center justify-between mb-4">
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
        
        <div className="space-y-4">
          {/* Activity Name */}
          <div className="space-y-2">
            <TextField
              label="Activity Name"
              placeholder="Enter Activity Name"
              value={activityName}
              onChange={(e) => setActivityName(e.target.value)}
              variant="outlined"
              fullWidth
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
            />
          </div>

          {/* Select Type */}
          <div className="space-y-2">
            <FormControl variant="outlined" fullWidth sx={fieldStyles}>
              <InputLabel shrink>Select Type</InputLabel>
              <MuiSelect
                value={type}
                onChange={(e) => setType(e.target.value)}
                displayEmpty
                label="Select Type"
                sx={{
                  '& .MuiSelect-select': {
                    fontSize: { xs: '11px', sm: '12px', md: '13px' },
                  },
                }}
              >
                <MenuItem value="">
                  <em>Select Type</em>
                </MenuItem>
                <MenuItem value="PPM" sx={{ fontSize: { xs: '11px', sm: '12px', md: '13px' } }}>
                  PPM
                </MenuItem>
                <MenuItem value="Routine" sx={{ fontSize: { xs: '11px', sm: '12px', md: '13px' } }}>
                  Routine
                </MenuItem>
                <MenuItem value="AMC" sx={{ fontSize: { xs: '11px', sm: '12px', md: '13px' } }}>
                  AMC
                </MenuItem>
              </MuiSelect>
            </FormControl>
          </div>

          {/* Select Category */}
          <div className="space-y-2">
            <FormControl variant="outlined" fullWidth sx={fieldStyles}>
              <InputLabel shrink>Select Category</InputLabel>
              <MuiSelect
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                displayEmpty
                label="Select Category"
                sx={{
                  '& .MuiSelect-select': {
                    fontSize: { xs: '11px', sm: '12px', md: '13px' },
                  },
                }}
              >
                <MenuItem value="">
                  <em>Select Category</em>
                </MenuItem>
                <MenuItem value="Technical" sx={{ fontSize: { xs: '11px', sm: '12px', md: '13px' } }}>
                  Technical
                </MenuItem>
                <MenuItem value="Non Technical" sx={{ fontSize: { xs: '11px', sm: '12px', md: '13px' } }}>
                  Non Technical
                </MenuItem>
              </MuiSelect>
            </FormControl>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button 
              onClick={handleApply}
              style={{ backgroundColor: '#C72030' }}
              className="text-white hover:bg-[#C72030]/90 flex-1"
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
        </div>
      </DialogContent>
    </Dialog>
  );
};
