
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { TextField, FormControl, InputLabel, MenuItem, Select as MuiSelect, SelectChangeEvent } from '@mui/material';
import { X, Plus } from 'lucide-react';

interface AddCustomFieldModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddField: (fieldName: string, section?: string) => void;
  isItAsset?: boolean;
}

const fieldStyles = {
  height: {
    xs: 28,
    sm: 36,
    md: 45
  },
  '& .MuiInputBase-input, & .MuiSelect-select': {
    padding: {
      xs: '8px',
      sm: '10px',
      md: '12px'
    }
  }
};

export const AddCustomFieldModal: React.FC<AddCustomFieldModalProps> = ({
  isOpen,
  onClose,
  onAddField,
  isItAsset = false
}) => {
  const [fieldName, setFieldName] = useState('');
  const [selectedSection, setSelectedSection] = useState('System Details');

  const handleAddField = () => {
    if (fieldName.trim()) {
      if (isItAsset && selectedSection) {
        onAddField(fieldName.trim(), selectedSection);
      } else {
        onAddField(fieldName.trim());
      }
      setFieldName('');
      setSelectedSection('System Details');
      onClose();
    }
  };

  const handleCancel = () => {
    setFieldName('');
    setSelectedSection('System Details');
    onClose();
  };

  const handleSectionChange = (event: SelectChangeEvent) => {
    setSelectedSection(event.target.value);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <DialogTitle className="text-lg font-semibold">Add Custom Field</DialogTitle>
          <button onClick={onClose} className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <TextField
              id="fieldName"
              label="New Field Name"
              variant="outlined"
              fullWidth
              value={fieldName}
              onChange={(e) => setFieldName(e.target.value)}
              placeholder="New Field Name"
              sx={fieldStyles}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </div>

          {isItAsset && (
            <div>
              <FormControl fullWidth variant="outlined" sx={{ minWidth: 120 }}>
                <InputLabel id="section-select-label" shrink>
                  Section
                </InputLabel>
                <MuiSelect
                  labelId="section-select-label"
                  label="Section"
                  value={selectedSection}
                  onChange={handleSectionChange}
                  sx={fieldStyles}
                >
                  <MenuItem value="System Details">System Details</MenuItem>
                  <MenuItem value="Hard Disk Details">Hard Disk Details</MenuItem>
                </MuiSelect>
              </FormControl>
            </div>
          )}
        </div>

        <div className="flex justify-center gap-4 pt-4">
          <button
            onClick={handleCancel}
            className="px-8 py-2 border border-[#C72030] text-[#C72030] rounded-md hover:bg-[#C72030] hover:text-white transition-colors text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleAddField}
            className="px-8 py-2 bg-[#F6F4EE] text-[#C72030] rounded-md hover:bg-[#F0EBE0] transition-colors text-sm flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Field
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
