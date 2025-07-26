import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import { MaterialDatePicker } from '@/components/ui/material-date-picker';
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem } from '@mui/material';

const fieldStyles = {
  height: { xs: 28, sm: 36, md: 45 },
  '& .MuiInputBase-input, & .MuiSelect-select': {
    padding: { xs: '8px', sm: '10px', md: '12px' },
  },
};
interface CalendarFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: CalendarFilters) => void;
}
export interface CalendarFilters {
  dateFrom: string;
  dateTo: string;
  amc: string;
  service: string;
  status: string;
  scheduleType: string;
  priority: string;
  building: string;
  wing: string;
  floor: string;
  area: string;
  room: string;
}
export const CalendarFilterModal: React.FC<CalendarFilterModalProps> = ({
  isOpen,
  onClose,
  onApplyFilters
}) => {
  const [filters, setFilters] = useState<CalendarFilters>({
    dateFrom: '01/07/2025',
    dateTo: '31/07/2025',
    amc: '',
    service: '',
    status: '',
    scheduleType: '',
    priority: '',
    building: '',
    wing: '',
    floor: '',
    area: '',
    room: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const handleFilterChange = (key: keyof CalendarFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };
  const handleApply = async () => {
    setIsLoading(true);
    try {
      onApplyFilters(filters);
      onClose();
      toast.success('Filters applied successfully');
    } catch (error) {
      toast.error('Failed to apply filters');
    } finally {
      setIsLoading(false);
    }
  };
  const handleClear = () => {
    const clearedFilters: CalendarFilters = {
      dateFrom: '01/07/2025',
      dateTo: '31/07/2025',
      amc: '',
      service: '',
      status: '',
      scheduleType: '',
      priority: '',
      building: '',
      wing: '',
      floor: '',
      area: '',
      room: ''
    };
    setFilters(clearedFilters);
    onApplyFilters(clearedFilters);
    onClose();
    toast.success('Filters cleared successfully');
  };
  return <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <DialogTitle className="text-lg font-semibold">FILTER BY</DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Date Range Section */}
          <div>
            <h3 className="text-lg font-medium mb-4" style={{ color: '#C72030' }}>Date Range</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="mt-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
                <MaterialDatePicker 
                  value={filters.dateFrom} 
                  onChange={(value) => handleFilterChange('dateFrom', value)} 
                  placeholder="Select start date"
                />
              </div>
              <div className="mt-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
                <MaterialDatePicker 
                  value={filters.dateTo} 
                  onChange={(value) => handleFilterChange('dateTo', value)} 
                  placeholder="Select end date"
                />
              </div>
            </div>
          </div>

          {/* Task Details Section */}
          <div>
            <h3 className="text-lg font-medium mb-4" style={{ color: '#C72030' }}>Task Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                <InputLabel shrink>AMC</InputLabel>
                <MuiSelect
                  label="AMC"
                  value={filters.amc}
                  onChange={(e) => handleFilterChange('amc', e.target.value)}
                  displayEmpty
                  sx={fieldStyles}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 200,
                        width: 250,
                      },
                    },
                  }}
                >
                  <MenuItem value=""><em>Select AMC</em></MenuItem>
                  <MenuItem value="amc1">AMC Contract 1</MenuItem>
                  <MenuItem value="amc2">AMC Contract 2</MenuItem>
                  <MenuItem value="amc3">AMC Contract 3</MenuItem>
                </MuiSelect>
              </FormControl>

              <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                <InputLabel shrink>Service</InputLabel>
                <MuiSelect
                  label="Service"
                  value={filters.service}
                  onChange={(e) => handleFilterChange('service', e.target.value)}
                  displayEmpty
                  sx={fieldStyles}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 200,
                        width: 250,
                      },
                    },
                  }}
                >
                  <MenuItem value=""><em>Select Service</em></MenuItem>
                  <MenuItem value="maintenance">Maintenance</MenuItem>
                  <MenuItem value="cleaning">Cleaning</MenuItem>
                  <MenuItem value="security">Security</MenuItem>
                  <MenuItem value="hvac">HVAC</MenuItem>
                  <MenuItem value="electrical">Electrical</MenuItem>
                </MuiSelect>
              </FormControl>

              <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                <InputLabel shrink>Status</InputLabel>
                <MuiSelect
                  label="Status"
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  displayEmpty
                  sx={fieldStyles}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 200,
                        width: 250,
                      },
                    },
                  }}
                >
                  <MenuItem value=""><em>Select Status</em></MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="in-progress">In Progress</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                </MuiSelect>
              </FormControl>

              <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                <InputLabel shrink>Schedule Type</InputLabel>
                <MuiSelect
                  label="Schedule Type"
                  value={filters.scheduleType}
                  onChange={(e) => handleFilterChange('scheduleType', e.target.value)}
                  displayEmpty
                  sx={fieldStyles}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 200,
                        width: 250,
                      },
                    },
                  }}
                >
                  <MenuItem value=""><em>Select Type</em></MenuItem>
                  <MenuItem value="daily">Daily</MenuItem>
                  <MenuItem value="weekly">Weekly</MenuItem>
                  <MenuItem value="monthly">Monthly</MenuItem>
                  <MenuItem value="quarterly">Quarterly</MenuItem>
                  <MenuItem value="annual">Annual</MenuItem>
                </MuiSelect>
              </FormControl>

              <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                <InputLabel shrink>Priority</InputLabel>
                <MuiSelect
                  label="Priority"
                  value={filters.priority}
                  onChange={(e) => handleFilterChange('priority', e.target.value)}
                  displayEmpty
                  sx={fieldStyles}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 200,
                        width: 250,
                      },
                    },
                  }}
                >
                  <MenuItem value=""><em>Select Priority</em></MenuItem>
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                  <MenuItem value="critical">Critical</MenuItem>
                </MuiSelect>
              </FormControl>
            </div>
          </div>

          {/* Location Details Section */}
          <div>
            <h3 className="text-lg font-medium mb-4" style={{ color: '#C72030' }}>Location Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                <InputLabel shrink>Building</InputLabel>
                <MuiSelect
                  label="Building"
                  value={filters.building}
                  onChange={(e) => handleFilterChange('building', e.target.value)}
                  displayEmpty
                  sx={fieldStyles}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 200,
                        width: 250,
                      },
                    },
                  }}
                >
                  <MenuItem value=""><em>Select Building</em></MenuItem>
                  <MenuItem value="building-a">Building A</MenuItem>
                  <MenuItem value="building-b">Building B</MenuItem>
                  <MenuItem value="building-c">Building C</MenuItem>
                </MuiSelect>
              </FormControl>

              <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                <InputLabel shrink>Wing</InputLabel>
                <MuiSelect
                  label="Wing"
                  value={filters.wing}
                  onChange={(e) => handleFilterChange('wing', e.target.value)}
                  displayEmpty
                  sx={fieldStyles}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 200,
                        width: 250,
                      },
                    },
                  }}
                >
                  <MenuItem value=""><em>Select Wing</em></MenuItem>
                  <MenuItem value="north">North Wing</MenuItem>
                  <MenuItem value="south">South Wing</MenuItem>
                  <MenuItem value="east">East Wing</MenuItem>
                  <MenuItem value="west">West Wing</MenuItem>
                </MuiSelect>
              </FormControl>

              <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                <InputLabel shrink>Floor</InputLabel>
                <MuiSelect
                  label="Floor"
                  value={filters.floor}
                  onChange={(e) => handleFilterChange('floor', e.target.value)}
                  displayEmpty
                  sx={fieldStyles}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 200,
                        width: 250,
                      },
                    },
                  }}
                >
                  <MenuItem value=""><em>Select Floor</em></MenuItem>
                  <MenuItem value="ground">Ground Floor</MenuItem>
                  <MenuItem value="1">1st Floor</MenuItem>
                  <MenuItem value="2">2nd Floor</MenuItem>
                  <MenuItem value="3">3rd Floor</MenuItem>
                  <MenuItem value="4">4th Floor</MenuItem>
                </MuiSelect>
              </FormControl>

              <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                <InputLabel shrink>Area</InputLabel>
                <MuiSelect
                  label="Area"
                  value={filters.area}
                  onChange={(e) => handleFilterChange('area', e.target.value)}
                  displayEmpty
                  sx={fieldStyles}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 200,
                        width: 250,
                      },
                    },
                  }}
                >
                  <MenuItem value=""><em>Select Area</em></MenuItem>
                  <MenuItem value="lobby">Lobby</MenuItem>
                  <MenuItem value="office">Office Space</MenuItem>
                  <MenuItem value="cafeteria">Cafeteria</MenuItem>
                  <MenuItem value="parking">Parking</MenuItem>
                </MuiSelect>
              </FormControl>

              <TextField
                label="Room"
                placeholder="Enter room number"
                value={filters.room}
                onChange={(e) => handleFilterChange('room', e.target.value)}
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                InputProps={{ sx: fieldStyles }}
                sx={{ mt: 1 }}
              />
            </div>
          </div>
          
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-6 border-t">
          <Button 
            onClick={handleApply}
            disabled={isLoading}
            className="flex-1 text-white"
            style={{ backgroundColor: '#C72030' }}
          >
            {isLoading ? 'Applying...' : 'Apply Filter'}
          </Button>
          <Button 
            onClick={handleClear}
            disabled={isLoading}
            variant="outline"
            className="flex-1"
          >
            Clear All
          </Button>
        </div>
      </DialogContent>
    </Dialog>;
};