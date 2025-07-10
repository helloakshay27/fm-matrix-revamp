
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { X } from 'lucide-react';

interface AddStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (status: any) => void;
}

export const AddStatusModal: React.FC<AddStatusModalProps> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    statusName: '',
    statusType: '',
    description: ''
  });

  const handleSave = () => {
    onSave(formData);
    setFormData({ statusName: '', statusType: '', description: '' });
    onClose();
  };

  const fieldStyles = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '6px',
      backgroundColor: '#FFFFFF',
      height: { xs: '36px', sm: '45px' },
      '& fieldset': {
        borderColor: '#E0E0E0',
        borderRadius: '6px',
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
      color: '#1A1A1A',
      fontWeight: 500,
      '&.Mui-focused': {
        color: '#C72030',
      },
    },
    '& .MuiInputBase-input': {
      padding: '8px 14px',
      fontSize: '14px',
    },
  };

  const descriptionFieldStyles = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '6px',
      backgroundColor: '#FFFFFF',
      '& fieldset': {
        borderColor: '#E0E0E0',
        borderRadius: '6px',
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
      color: '#1A1A1A',
      fontWeight: 500,
      '&.Mui-focused': {
        color: '#C72030',
      },
    },
    '& .MuiInputBase-input': {
      padding: '8px 14px',
      fontSize: '14px',
    },
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="relative">
          <DialogTitle>Add Status</DialogTitle>
          <button
            onClick={onClose}
            className="absolute right-0 top-0 p-2 hover:bg-gray-100 rounded-full transition-colors"
            tabIndex={-1}
            aria-label="Close"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <TextField
            label="Status Name"
            placeholder="Status Name"
            value={formData.statusName}
            onChange={(e) => setFormData(prev => ({ ...prev, statusName: e.target.value }))}
            fullWidth
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            sx={fieldStyles}
          />
          
          <FormControl fullWidth variant="outlined" sx={fieldStyles}>
            <InputLabel shrink>Status Type</InputLabel>
            <Select
              value={formData.statusType}
              onChange={(e) => setFormData(prev => ({ ...prev, statusType: e.target.value }))}
              label="Status Type"
              notched
            >
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Description"
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            fullWidth
            variant="outlined"
            multiline
            rows={3}
            InputLabelProps={{ shrink: true }}
            sx={descriptionFieldStyles}
          />
        </div>
        
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-[#C72030] hover:bg-[#C72030]/90">
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
