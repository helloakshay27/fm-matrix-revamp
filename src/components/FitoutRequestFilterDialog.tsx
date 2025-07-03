
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FormControl, InputLabel, Select as MuiSelect, MenuItem } from '@mui/material';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from '@/hooks/use-toast';

interface FitoutRequestFilterDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FitoutRequestFilterDialog = ({ isOpen, onClose }: FitoutRequestFilterDialogProps) => {
  const { toast } = useToast();
  const [selectedType, setSelectedType] = useState('ppm');
  const [category, setCategory] = useState('');
  const [unit, setUnit] = useState('');
  const [status, setStatus] = useState('');

  const handleApply = () => {
    console.log('Applying filters...', { selectedType, category, unit, status });
    toast({
      title: "Success",
      description: "Filters applied successfully!",
    });
    onClose();
  };

  const handleReset = () => {
    setSelectedType('ppm');
    setCategory('');
    setUnit('');
    setStatus('');
    console.log('Resetting filters...');
  };

  const fieldStyles = {
    height: { xs: 28, sm: 36, md: 45 },
    '& .MuiInputBase-input, & .MuiSelect-select': {
      padding: { xs: '8px', sm: '10px', md: '12px' },
    },
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">OPTIONS</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Category Options */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Type</label>
            <RadioGroup value={selectedType} onValueChange={setSelectedType} className="flex flex-wrap gap-6">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="ppm" id="fitout-ppm" className="border-red-500 text-red-500" />
                <label htmlFor="fitout-ppm" className="text-sm font-medium">PPM</label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="amc" id="fitout-amc" />
                <label htmlFor="fitout-amc" className="text-sm font-medium">AMC</label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="preparedness" id="fitout-preparedness" />
                <label htmlFor="fitout-preparedness" className="text-sm font-medium">Preparedness</label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="hoto" id="fitout-hoto" />
                <label htmlFor="fitout-hoto" className="text-sm font-medium">Hoto</label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="routine" id="fitout-routine" />
                <label htmlFor="fitout-routine" className="text-sm font-medium">Routine</label>
              </div>
            </RadioGroup>
          </div>

          {/* Additional Filter Options */}
          <div className="space-y-4">
            <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
              <InputLabel id="category-label" shrink>Category</InputLabel>
              <MuiSelect
                labelId="category-label"
                label="Category"
                displayEmpty
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                sx={fieldStyles}
              >
                <MenuItem value=""><em>Select Category</em></MenuItem>
                <MenuItem value="renovation">Renovation</MenuItem>
                <MenuItem value="electrical">Electrical</MenuItem>
                <MenuItem value="plumbing">Plumbing</MenuItem>
                <MenuItem value="flooring">Flooring</MenuItem>
              </MuiSelect>
            </FormControl>

            <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
              <InputLabel id="unit-label" shrink>Unit</InputLabel>
              <MuiSelect
                labelId="unit-label"
                label="Unit"
                displayEmpty
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                sx={fieldStyles}
              >
                <MenuItem value=""><em>Select Unit</em></MenuItem>
                <MenuItem value="unit-101">Unit 101</MenuItem>
                <MenuItem value="unit-102">Unit 102</MenuItem>
                <MenuItem value="unit-103">Unit 103</MenuItem>
              </MuiSelect>
            </FormControl>

            <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
              <InputLabel id="status-label" shrink>Status</InputLabel>
              <MuiSelect
                labelId="status-label"
                label="Status"
                displayEmpty
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                sx={fieldStyles}
              >
                <MenuItem value=""><em>Select Status</em></MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="approved">Approved</MenuItem>
                <MenuItem value="rejected">Rejected</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
              </MuiSelect>
            </FormControl>
          </div>
        </div>

        <div className="flex justify-center gap-4 pt-4">
          <Button 
            onClick={handleApply}
            className="bg-[#C72030] hover:bg-[#C72030]/90 text-white px-8"
          >
            Apply
          </Button>
          <Button 
            variant="outline"
            onClick={handleReset}
            className="px-8 border-[#C72030] text-[#C72030] hover:bg-[#C72030] hover:text-white"
          >
            Reset
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
