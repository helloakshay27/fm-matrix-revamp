
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

const fieldStyles = {
  height: { xs: 28, sm: 36, md: 45 },
  '& .MuiInputBase-input, & .MuiSelect-select': {
    padding: { xs: '8px', sm: '10px', md: '12px' },
  },
};

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
    toast({
      title: "Success",
      description: "Filters reset successfully!",
    });
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
          <div className="space-y-2">
            <TextField
              placeholder="Enter Activity"
              value={activityName}
              onChange={(e) => setActivityName(e.target.value)}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
              sx={{ mt: 1 }}
            />
          </div>

          {/* Select Type */}
          <div className="space-y-2">
            <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
              <InputLabel id="type-label" shrink>Select Type</InputLabel>
              <MuiSelect
                labelId="type-label"
                label="Select Type"
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
          </div>

          {/* Select Category */}
          <div className="space-y-2">
            <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
              <InputLabel id="category-label" shrink>Select Category</InputLabel>
              <MuiSelect
                labelId="category-label"
                label="Select Category"
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
