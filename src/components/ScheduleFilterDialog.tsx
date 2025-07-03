
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from 'lucide-react';
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem } from '@mui/material';
import { useToast } from '@/hooks/use-toast';

interface ScheduleFilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ScheduleFilterDialog: React.FC<ScheduleFilterDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const { toast } = useToast();
  const [activityName, setActivityName] = useState('');
  const [type, setType] = useState('');
  const [category, setCategory] = useState('');

  const handleApply = () => {
    console.log('Applying filters:', { activityName, type, category });
    toast({
      title: "Success",
      description: "Filters applied successfully!",
    });
    onOpenChange(false);
  };

  const handleReset = () => {
    setActivityName('');
    setType('');
    setCategory('');
  };

  // Responsive styles for TextField and Select
  const fieldStyles = {
    height: { xs: 28, sm: 36, md: 45 },
    '& .MuiInputBase-root': {
      '& .MuiSelect-select': {
        fontSize: { xs: '11px', sm: '12px', md: '13px' },
        padding: { xs: '8px', sm: '10px', md: '12px' },
      },
    },
    '& .MuiInputBase-input': {
      padding: { xs: '8px', sm: '10px', md: '12px' },
      fontSize: { xs: '12px', sm: '13px', md: '14px' },
      '&::placeholder': {
        fontSize: { xs: '12px', sm: '13px', md: '14px' },
        opacity: 1,
      },
    },
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
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
          <TextField
            label="Activity Name"
            placeholder="Enter Activity Name"
            value={activityName}
            onChange={(e) => setActivityName(e.target.value)}
            fullWidth
            variant="outlined"
            InputLabelProps={{
              shrink: true,
            }}
            sx={fieldStyles}
          />

          {/* Select Type */}
          <FormControl fullWidth variant="outlined">
            <InputLabel id="type-select-label" shrink>Type</InputLabel>
            <MuiSelect
              labelId="type-select-label"
              label="Type"
              displayEmpty
              value={type}
              onChange={(e) => setType(e.target.value)}
              sx={fieldStyles}
            >
              <MenuItem value=""><em>Select Type</em></MenuItem>
              <MenuItem value="PPM">PPM</MenuItem>
              <MenuItem value="Routine">Routine</MenuItem>
              <MenuItem value="AMC">AMC</MenuItem>
            </MuiSelect>
          </FormControl>

          {/* Select Category */}
          <FormControl fullWidth variant="outlined">
            <InputLabel id="category-select-label" shrink>Category</InputLabel>
            <MuiSelect
              labelId="category-select-label"
              label="Category"
              displayEmpty
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              sx={fieldStyles}
            >
              <MenuItem value=""><em>Select Category</em></MenuItem>
              <MenuItem value="Technical">Technical</MenuItem>
              <MenuItem value="Non Technical">Non Technical</MenuItem>
            </MuiSelect>
          </FormControl>

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
