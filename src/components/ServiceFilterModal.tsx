import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { X } from 'lucide-react';
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem } from '@mui/material';

interface ServiceFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: any) => void;
}

export const ServiceFilterModal = ({ isOpen, onClose, onApply }: ServiceFilterModalProps) => {
  const [filters, setFilters] = useState({
    serviceName: '',
    building: '',
    area: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleApply = () => {
    console.log('Applying filters:', filters);
    onApply(filters);
    onClose();
  };

  const handleReset = () => {
    setFilters({
      serviceName: '',
      building: '',
      area: ''
    });
    onApply({});
  };

  // Responsive styles for TextField and Select
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
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold">FILTER BY</DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Service Details */}
          <div>
            <h3 className="text-orange-500 font-medium mb-4">Service Details</h3>
            <div className="space-y-4">
              <div>
                <TextField
                  label="Service Name"
                  placeholder="Enter Service Name"
                  name="serviceName"
                  value={filters.serviceName}
                  onChange={(e) => handleInputChange('serviceName', e.target.value)}
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  InputProps={{
                    sx: fieldStyles
                  }}
                />
              </div>
            </div>
          </div>

          {/* Location Details */}
          <div>
            <h3 className="text-orange-500 font-medium mb-4">Location Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="building-select-label" shrink>Building</InputLabel>
                  <MuiSelect
                    labelId="building-select-label"
                    label="Building"
                    displayEmpty
                    value={filters.building}
                    onChange={(e) => handleInputChange('building', e.target.value)}
                    sx={fieldStyles}
                  >
                    <MenuItem value=""><em>Building</em></MenuItem>
                    <MenuItem value="wing2">Wing2</MenuItem>
                    <MenuItem value="main-building">Main Building</MenuItem>
                    <MenuItem value="annexe">Annexe</MenuItem>
                  </MuiSelect>
                </FormControl>
              </div>
              <div>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="area-select-label" shrink>Area</InputLabel>
                  <MuiSelect
                    labelId="area-select-label"
                    label="Area"
                    displayEmpty
                    value={filters.area}
                    onChange={(e) => handleInputChange('area', e.target.value)}
                    sx={fieldStyles}
                  >
                    <MenuItem value=""><em>Area</em></MenuItem>
                    <MenuItem value="lobby">Lobby</MenuItem>
                    <MenuItem value="office">Office</MenuItem>
                    <MenuItem value="cafeteria">Cafeteria</MenuItem>
                  </MuiSelect>
                </FormControl>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex justify-end gap-4">
            <Button 
              variant="outline"
              onClick={handleReset}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Reset
            </Button>
            <Button 
              onClick={handleApply}
              style={{ backgroundColor: '#C72030' }}
              className="text-white hover:bg-[#C72030]/90"
            >
              Apply
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};