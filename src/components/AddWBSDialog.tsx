
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem } from '@mui/material';

const fieldStyles = {
  height: { xs: 28, sm: 36, md: 45 },
  '& .MuiInputBase-input, & .MuiSelect-select': {
    padding: { xs: '8px', sm: '10px', md: '12px' },
  },
};

interface AddWBSDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddWBSDialog: React.FC<AddWBSDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const [formData, setFormData] = useState({
    wbsCode: '',
    wbsName: '',
    description: '',
    parentWBS: '',
    department: '',
    status: 'active'
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    console.log('Adding WBS:', formData);
    onOpenChange(false);
    // Reset form
    setFormData({
      wbsCode: '',
      wbsName: '',
      description: '',
      parentWBS: '',
      department: '',
      status: 'active'
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <DialogTitle className="text-lg font-semibold">ADD WBS</DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <TextField
              label="WBS Code*"
              placeholder="Enter WBS Code"
              value={formData.wbsCode}
              onChange={(e) => handleInputChange('wbsCode', e.target.value)}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
              sx={{ mt: 1 }}
            />
            
            <TextField
              label="WBS Name*"
              placeholder="Enter WBS Name"
              value={formData.wbsName}
              onChange={(e) => handleInputChange('wbsName', e.target.value)}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
              sx={{ mt: 1 }}
            />
          </div>

          <TextField
            label="Description"
            placeholder="Enter Description"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            fullWidth
            variant="outlined"
            multiline
            minRows={3}
            InputLabelProps={{ shrink: true }}
            sx={{ mt: 1 }}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
              <InputLabel shrink>Parent WBS</InputLabel>
              <MuiSelect
                label="Parent WBS"
                value={formData.parentWBS}
                onChange={(e) => handleInputChange('parentWBS', e.target.value)}
                displayEmpty
                sx={fieldStyles}
              >
                <MenuItem value=""><em>Select Parent WBS</em></MenuItem>
                <MenuItem value="WBS-001">WBS-001</MenuItem>
                <MenuItem value="WBS-002">WBS-002</MenuItem>
              </MuiSelect>
            </FormControl>

            <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
              <InputLabel shrink>Department</InputLabel>
              <MuiSelect
                label="Department"
                value={formData.department}
                onChange={(e) => handleInputChange('department', e.target.value)}
                displayEmpty
                sx={fieldStyles}
              >
                <MenuItem value=""><em>Select Department</em></MenuItem>
                <MenuItem value="engineering">Engineering</MenuItem>
                <MenuItem value="construction">Construction</MenuItem>
                <MenuItem value="finance">Finance</MenuItem>
              </MuiSelect>
            </FormControl>
          </div>

          <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
            <InputLabel shrink>Status</InputLabel>
            <MuiSelect
              label="Status"
              value={formData.status}
              onChange={(e) => handleInputChange('status', e.target.value)}
              sx={fieldStyles}
            >
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </MuiSelect>
          </FormControl>
        </div>

        <div className="flex gap-3 pt-4">
          <Button 
            onClick={handleSubmit}
            className="flex-1 text-white"
            style={{ backgroundColor: '#C72030' }}
          >
            Add WBS
          </Button>
          <Button 
            onClick={() => onOpenChange(false)}
            variant="outline"
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
