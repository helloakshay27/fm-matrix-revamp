
import React, { useState } from 'react';
import { TextField, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Dialog, DialogContent, DialogTitle } from '@mui/material';
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
  const [selectedSection, setSelectedSection] = useState('system_details');

  const handleAddField = () => {
    const trimmedName = fieldName.trim();
    if (!trimmedName) return;
    
    console.log('Adding field:', trimmedName, 'to section:', selectedSection);
    
    if (isItAsset && selectedSection) {
      onAddField(trimmedName, selectedSection);
    } else {
      onAddField(trimmedName);
    }
    // Only close if field was actually added
    setFieldName("");
    setSelectedSection("system_details");
    onClose();
  };

  const handleCancel = () => {
    setFieldName('');
    setSelectedSection('system_details');
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} sx={{ width: "30rem", margin:"0 auto" }}>
      <DialogContent 
      sx={{width:"100%" }}
        aria-describedby="custom-field-modal-description"
      >
        <div className="flex justify-between items-center mb-4">
          <DialogTitle>Add Custom Field</DialogTitle>
          <div id="custom-field-modal-description" className="sr-only">
            Add a new custom field to the form with name and section
          </div>
        </div>
        
        <form onSubmit={(e) => {
          e.preventDefault();
          handleAddField();
        }} className="space-y-4">
          <div>
            <TextField
              autoFocus
              id="fieldName"
              label="New Field Name"
              variant="outlined"
              fullWidth
              value={fieldName}
              onChange={(e) => setFieldName(e.target.value)}
              placeholder="Enter field name"
              sx={fieldStyles}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </div>

          {isItAsset && (
            <div>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="section-select-label" shrink>
                  Section
                </InputLabel>
                <Select
                  labelId="section-select-label"
                  id="section-select"
                  value={selectedSection}
                  onChange={(e: SelectChangeEvent) => {
                    console.log('Section dropdown changed to:', e.target.value);
                    setSelectedSection(e.target.value);
                  }}
                  label="Section"
                >
                  <MenuItem value="system_details">System Details</MenuItem>
                  <MenuItem value="hardware">Hardware Details</MenuItem>
                </Select>
              </FormControl>
              {/* Debug info */}
              <div className="text-xs text-gray-500 mt-1">
                Current selection: {selectedSection}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 border border-[#C72030] text-[#C72030] rounded-md hover:bg-[#C72030] hover:text-white transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C72030]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#F6F4EE] text-[#C72030] rounded-md hover:bg-[#F0EBE0] transition-colors text-sm flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C72030]"
            >
              <Plus className="w-4 h-4" />
              Add Field
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
