import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { X } from 'lucide-react';
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem, CircularProgress } from '@mui/material';
import { fetchBuildings, fetchAreas, clearAreas } from '@/store/slices/serviceFilterSlice';
import type { RootState, AppDispatch } from '@/store/store';

interface ServiceFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: any) => void;
}

export const ServiceFilterModal = ({ isOpen, onClose, onApply }: ServiceFilterModalProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const serviceFilterState = useSelector((state: RootState) => state.serviceFilter);
  console.log('ServiceFilter state:', serviceFilterState);
  
  // Fallback to empty state if serviceFilter is undefined
  const { buildings = [], areas = [], loading = { buildings: false, areas: false }, error = { buildings: null, areas: null } } = serviceFilterState || {};
  
  const [filters, setFilters] = useState({
    serviceName: '',
    building: '',
    area: ''
  });

  // Load buildings on modal open (using siteId = 1 as default)
  useEffect(() => {
    if (isOpen && buildings.length === 0) {
      dispatch(fetchBuildings(1));
    }
  }, [isOpen, dispatch, buildings.length]);

  console.log('ServiceFilterModal rendered with filters:', filters);
  console.log('Modal isOpen:', isOpen);

  const handleInputChange = (field: string, value: string) => {
    console.log(`Updating ${field} to:`, value);
    setFilters(prev => {
      const updated = { ...prev, [field]: value };
      console.log('Updated filters:', updated);
      
      // Clear areas when building changes
      if (field === 'building') {
        updated.area = '';
        dispatch(clearAreas());
        
        // Fetch areas for the selected building (using wingId = building value for now)
        if (value) {
          const wingId = parseInt(value);
          if (!isNaN(wingId)) {
            dispatch(fetchAreas(wingId));
          }
        }
      }
      
      return updated;
    });
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
    backgroundColor: 'white',
    '& .MuiInputBase-input, & .MuiSelect-select': {
      padding: { xs: '8px', sm: '10px', md: '12px' },
      backgroundColor: 'white',
    },
    '& .MuiOutlinedInput-root': {
      backgroundColor: 'white',
    }
  };

  const menuProps = {
    PaperProps: {
      style: {
        maxHeight: 200,
        backgroundColor: 'white',
        zIndex: 9999,
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      },
    },
    // Prevent focus conflicts with Dialog
    disablePortal: false,
    disableAutoFocus: true,
    disableEnforceFocus: true,
  };
  return (
    <Dialog open={isOpen} onOpenChange={onClose} modal={false}>
      <DialogContent className="max-w-2xl" aria-describedby="filter-dialog-description">
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
          <div id="filter-dialog-description" className="sr-only">
            Filter services by name, building, and area
          </div>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Service Details */}
          <div>
            <h3 className="text-[14px] text-[#C72030] font-medium mb-4 ">Service Details</h3>
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
            <h3 className="font-medium mb-4 text-[14px] text-[#C72030]">Location Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="building-select-label" shrink sx={{ backgroundColor: 'white', px: 1 }}>Building</InputLabel>
                  <MuiSelect
                    labelId="building-select-label"
                    label="Building"
                    displayEmpty
                    value={filters.building}
                    onChange={(e) => {
                      console.log('Building dropdown onChange triggered with value:', e.target.value);
                      handleInputChange('building', e.target.value as string);
                    }}
                    sx={fieldStyles}
                    MenuProps={menuProps}
                    disabled={loading.buildings}
                  >
                    <MenuItem value=""><em>Building</em></MenuItem>
                    {loading.buildings ? (
                      <MenuItem disabled>
                        <CircularProgress size={16} sx={{ mr: 1 }} />
                        Loading...
                      </MenuItem>
                    ) : (
                      buildings.map((building) => (
                        <MenuItem key={building.id} value={building.id.toString()}>
                          {building.name}
                        </MenuItem>
                      ))
                    )}
                  </MuiSelect>
                </FormControl>
              </div>
              <div>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="area-select-label" shrink sx={{ backgroundColor: 'white', px: 1 }}>Area</InputLabel>
                  <MuiSelect
                    labelId="area-select-label"
                    label="Area"
                    displayEmpty
                    value={filters.area}
                    onChange={(e) => {
                      console.log('Area dropdown onChange triggered with value:', e.target.value);
                      handleInputChange('area', e.target.value as string);
                    }}
                    sx={fieldStyles}
                    MenuProps={menuProps}
                    disabled={loading.areas || !filters.building}
                  >
                    <MenuItem value=""><em>Area</em></MenuItem>
                    {loading.areas ? (
                      <MenuItem disabled>
                        <CircularProgress size={16} sx={{ mr: 1 }} />
                        Loading...
                      </MenuItem>
                    ) : !filters.building ? (
                      <MenuItem disabled>
                        <em>Select a building first</em>
                      </MenuItem>
                    ) : (
                      areas.map((area) => (
                        <MenuItem key={area.id} value={area.id.toString()}>
                          {area.name}
                        </MenuItem>
                      ))
                    )}
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