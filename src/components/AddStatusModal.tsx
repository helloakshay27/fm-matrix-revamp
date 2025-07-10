
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
    status: '',
    displayName: '',
    fixedState: '',
    order: '',
    color: '#000000'
  });

  const handleSave = () => {
    onSave(formData);
    setFormData({ status: '', displayName: '', fixedState: '', order: '', color: '#000000' });
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
          <div className="grid grid-cols-2 gap-4">
            <TextField
              label={
                <span>
                  Status<span style={{ color: '#C72030' }}>*</span>
                </span>
              }
              placeholder="Enter status"
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              sx={fieldStyles}
            />
            
            <TextField
              label={
                <span>
                  Display Name<span style={{ color: '#C72030' }}>*</span>
                </span>
              }
              placeholder="Enter Display Name"
              value={formData.displayName}
              onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              sx={fieldStyles}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormControl fullWidth variant="outlined" sx={fieldStyles}>
              <InputLabel shrink>
                Fixed State<span style={{ color: '#C72030' }}>*</span>
              </InputLabel>
              <Select
                value={formData.fixedState}
                onChange={(e) => setFormData(prev => ({ ...prev, fixedState: e.target.value }))}
                label="Fixed State"
                notched
                displayEmpty
              >
                <MenuItem value="" disabled>
                  <span style={{ color: '#999' }}>Select Fixed State</span>
                </MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label={
                <span>
                  Order<span style={{ color: '#C72030' }}>*</span>
                </span>
              }
              placeholder="Enter Order"
              value={formData.order}
              onChange={(e) => setFormData(prev => ({ ...prev, order: e.target.value }))}
              fullWidth
              variant="outlined"
              type="number"
              InputLabelProps={{ shrink: true }}
              sx={fieldStyles}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
              Color<span style={{ color: '#C72030' }}>*</span>
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={formData.color}
                onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                className="w-16 h-10 border border-gray-300 rounded cursor-pointer"
              />
              <span className="text-sm text-gray-600">{formData.color}</span>
            </div>
          </div>
        </div>
        
        <div className="flex justify-center gap-2 pt-4">
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
