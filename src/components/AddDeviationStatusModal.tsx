
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FormControl, InputLabel, Select as MuiSelect, MenuItem } from '@mui/material';
import { CustomTextField } from '@/components/ui/custom-text-field';
import { useToast } from '@/hooks/use-toast';

interface AddDeviationStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddDeviationStatusModal = ({ isOpen, onClose }: AddDeviationStatusModalProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    status: "",
    fixedState: "",
    order: "",
    color: "#000000"
  });

  const handleSubmit = () => {
    console.log("Adding deviation status:", formData);
    toast({
      title: "Success",
      description: "Deviation status added successfully!",
    });
    onClose();
  };

  const fieldStyles = {
    height: { xs: 28, sm: 36, md: 45 },
    '& .MuiInputBase-input, & .MuiSelect-select': {
      padding: { xs: '8px', sm: '10px', md: '12px' },
    },
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Add Deviation Status</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <CustomTextField
              placeholder="Enter status"
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
            />

            <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
              <InputLabel id="fixed-state-label" shrink>Fixed State</InputLabel>
              <MuiSelect
                labelId="fixed-state-label"
                label="Fixed State"
                displayEmpty
                value={formData.fixedState}
                onChange={(e) => setFormData(prev => ({ ...prev, fixedState: e.target.value }))}
                sx={fieldStyles}
              >
                <MenuItem value=""><em>Select Fixed State</em></MenuItem>
                <MenuItem value="state1">State 1</MenuItem>
                <MenuItem value="state2">State 2</MenuItem>
              </MuiSelect>
            </FormControl>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <CustomTextField
              placeholder="Enter status order"
              value={formData.order}
              onChange={(e) => setFormData(prev => ({ ...prev, order: e.target.value }))}
            />

            <div className="flex items-center gap-2">
              <CustomTextField
                type="color"
                value={formData.color}
                onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                sx={{ width: '60px' }}
              />
              <div 
                className="w-10 h-10 border rounded"
                style={{ backgroundColor: formData.color }}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-center pt-4">
          <Button 
            onClick={handleSubmit}
            className="bg-[#C72030] hover:bg-[#C72030]/90 text-white px-8"
          >
            Submit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
