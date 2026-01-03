import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FormControl, InputLabel, Select as MuiSelect, MenuItem, TextField } from '@mui/material';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: SosFilterParams) => void;
  currentFilters: SosFilterParams;
}

export interface SosFilterParams {
  created_at?: string;
  created_by?: string;
  status?: string;
}

const SosFilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  onApplyFilters,
  currentFilters,
}) => {
  const [filters, setFilters] = useState<SosFilterParams>(currentFilters);

  const fieldStyles = {
    '& .MuiInputBase-input, & .MuiSelect-select': {
      padding: '10px 12px',
    },
  };

  const menuProps = {
    PaperProps: {
      style: {
        maxHeight: 300,
      },
    },
    disablePortal: false,
    style: {
      zIndex: 10000,
    },
  };

  const handleTextChange = (field: keyof SosFilterParams, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleApply = () => {
    onApplyFilters(filters);
    onClose();
  };

  const handleReset = () => {
    const resetFilters: SosFilterParams = {};
    setFilters(resetFilters);
    onApplyFilters(resetFilters);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-[9998]" onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center z-[9999] p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full overflow-hidden flex flex-col border-l-[6px] border-[#C72030]">
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900 tracking-wide">FILTER BY</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Created Date */}
            <div>
              <TextField
                fullWidth
                label="Created Date"
                type="date"
                variant="outlined"
                size="small"
                value={filters.created_at || ''}
                onChange={(e) => handleTextChange('created_at', e.target.value)}
                InputLabelProps={{ shrink: true }}
                placeholder="Select Created Date"
                sx={fieldStyles}
              />
            </div>

            {/* Created By */}
            <div>
              <TextField
                fullWidth
                label="Created By"
                variant="outlined"
                size="small"
                value={filters.created_by || ''}
                onChange={(e) => handleTextChange('created_by', e.target.value)}
                placeholder="Enter Created By"
                sx={fieldStyles}
              />
            </div>

            {/* Status */}
            <div>
              <FormControl fullWidth variant="outlined" size="small">
                <InputLabel shrink>Status</InputLabel>
                <MuiSelect
                  label="Status"
                  value={filters.status || ''}
                  onChange={(e) => handleTextChange('status', e.target.value)}
                  MenuProps={menuProps}
                  sx={fieldStyles}
                  displayEmpty
                >
                  <MenuItem value=""><em>Select Status</em></MenuItem>
                  <MenuItem value="true">Active</MenuItem>
                  <MenuItem value="false">Inactive</MenuItem>
                </MuiSelect>
              </FormControl>
            </div>
          </div>

          <div className="p-6 border-t bg-gray-50 flex justify-end gap-3">
            <Button variant="outline" onClick={handleReset} className="px-8">
              Reset
            </Button>
            <Button onClick={handleApply} className="bg-[#C72030] hover:bg-[#A01020] text-white px-8">
              Apply
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SosFilterModal;
