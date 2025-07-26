import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem } from '@mui/material';
import { X } from 'lucide-react';
import { toast } from 'sonner';

interface CalendarFilterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: CalendarFilters) => void;
}

export interface CalendarFilters {
  startDate?: string;
  endDate?: string;
  amc?: string;
  service?: string;
  status?: string;
  building?: string;
  wing?: string;
  floor?: string;
  area?: string;
  room?: string;
  scheduleType?: string;
  priority?: string;
}

const fieldStyles = {
  height: { xs: 28, sm: 36, md: 45 },
  '& .MuiInputBase-input, & .MuiSelect-select': {
    padding: { xs: '8px', sm: '10px', md: '12px' },
  },
};

const selectMenuProps = {
  PaperProps: {
    style: {
      maxHeight: 224,
      backgroundColor: 'white',
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      zIndex: 9999,
    },
  },
  disablePortal: false,
  disableAutoFocus: true,
  disableEnforceFocus: true,
};

export const CalendarFilterDialog: React.FC<CalendarFilterDialogProps> = ({ isOpen, onClose, onApply }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [amc, setAmc] = useState('');
  const [service, setService] = useState('');
  const [status, setStatus] = useState('');
  const [building, setBuilding] = useState('');
  const [wing, setWing] = useState('');
  const [floor, setFloor] = useState('');
  const [area, setArea] = useState('');
  const [room, setRoom] = useState('');
  const [scheduleType, setScheduleType] = useState('');
  const [priority, setPriority] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const statusOptions = [
    'Scheduled',
    'Open', 
    'In Progress',
    'Completed',
    'Overdue',
    'Cancelled'
  ];

  const scheduleTypeOptions = [
    'PPM',
    'CBM',
    'Reactive',
    'Emergency'
  ];

  const priorityOptions = [
    'Low',
    'Medium', 
    'High',
    'Critical'
  ];

  const amcOptions = [
    'AMC 1',
    'AMC 2',
    'AMC 3',
    'AMC 4'
  ];

  const serviceOptions = [
    'HVAC',
    'Electrical',
    'Plumbing',
    'Mechanical',
    'Civil',
    'Cleaning',
    'Security',
    'Landscaping'
  ];

  const buildingOptions = [
    'Building A',
    'Building B',
    'Building C',
    'Building D'
  ];

  const wingOptions = [
    'North Wing',
    'South Wing',
    'East Wing',
    'West Wing'
  ];

  const floorOptions = [
    'Ground Floor',
    'First Floor',
    'Second Floor',
    'Third Floor',
    'Fourth Floor',
    'Basement'
  ];

  const handleApply = async () => {
    setIsLoading(true);
    try {
      const filters: CalendarFilters = {
        ...(startDate && { startDate }),
        ...(endDate && { endDate }),
        ...(amc && { amc }),
        ...(service && { service }),
        ...(status && { status }),
        ...(building && { building }),
        ...(wing && { wing }),
        ...(floor && { floor }),
        ...(area && { area }),
        ...(room && { room }),
        ...(scheduleType && { scheduleType }),
        ...(priority && { priority }),
      };

      console.log('Applying calendar filters:', filters);
      onApply(filters);
      onClose();
      
      toast.success('Calendar filters applied successfully');
    } catch (error) {
      console.error('Error applying calendar filters:', error);
      toast.error('Failed to apply calendar filters');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setStartDate('');
    setEndDate('');
    setAmc('');
    setService('');
    setStatus('');
    setBuilding('');
    setWing('');
    setFloor('');
    setArea('');
    setRoom('');
    setScheduleType('');
    setPriority('');
    
    onApply({});
    onClose();
    toast.success('Calendar filters cleared successfully');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose} modal={false}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white z-50" aria-describedby="calendar-filter-dialog-description">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <DialogTitle className="text-lg font-semibold text-gray-900">CALENDAR FILTER</DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-6 w-6 p-0 hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </Button>
          <div id="calendar-filter-dialog-description" className="sr-only">
            Filter calendar events by date range, AMC, service, status, location, schedule type, and priority
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Date Range Section */}
          <div>
            <h3 className="text-sm font-medium text-[#C72030] mb-4">Date Range</h3>
            <div className="grid grid-cols-2 gap-6">
              <TextField
                label="Start Date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                InputProps={{ sx: fieldStyles }}
              />
              <TextField
                label="End Date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                InputProps={{ sx: fieldStyles }}
              />
            </div>
          </div>

          {/* Service & AMC Section */}
          <div>
            <h3 className="text-sm font-medium text-[#C72030] mb-4">Service & AMC</h3>
            <div className="grid grid-cols-2 gap-6">
              <FormControl fullWidth variant="outlined">
                <InputLabel shrink>AMC</InputLabel>
                <MuiSelect
                  value={amc}
                  onChange={(e) => setAmc(e.target.value)}
                  label="AMC"
                  displayEmpty
                  MenuProps={selectMenuProps}
                  sx={fieldStyles}
                >
                  <MenuItem value="">
                    <em>All AMC</em>
                  </MenuItem>
                  {amcOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>

              <FormControl fullWidth variant="outlined">
                <InputLabel shrink>Service</InputLabel>
                <MuiSelect
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  label="Service"
                  displayEmpty
                  MenuProps={selectMenuProps}
                  sx={fieldStyles}
                >
                  <MenuItem value="">
                    <em>All Services</em>
                  </MenuItem>
                  {serviceOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>
            </div>
          </div>

          {/* Status & Schedule Type Section */}
          <div>
            <h3 className="text-sm font-medium text-[#C72030] mb-4">Status & Schedule Type</h3>
            <div className="grid grid-cols-3 gap-6">
              <FormControl fullWidth variant="outlined">
                <InputLabel shrink>Status</InputLabel>
                <MuiSelect
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  label="Status"
                  displayEmpty
                  MenuProps={selectMenuProps}
                  sx={fieldStyles}
                >
                  <MenuItem value="">
                    <em>All Status</em>
                  </MenuItem>
                  {statusOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>

              <FormControl fullWidth variant="outlined">
                <InputLabel shrink>Schedule Type</InputLabel>
                <MuiSelect
                  value={scheduleType}
                  onChange={(e) => setScheduleType(e.target.value)}
                  label="Schedule Type"
                  displayEmpty
                  MenuProps={selectMenuProps}
                  sx={fieldStyles}
                >
                  <MenuItem value="">
                    <em>All Types</em>
                  </MenuItem>
                  {scheduleTypeOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>

              <FormControl fullWidth variant="outlined">
                <InputLabel shrink>Priority</InputLabel>
                <MuiSelect
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  label="Priority"
                  displayEmpty
                  MenuProps={selectMenuProps}
                  sx={fieldStyles}
                >
                  <MenuItem value="">
                    <em>All Priorities</em>
                  </MenuItem>
                  {priorityOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>
            </div>
          </div>

          {/* Location Section */}
          <div>
            <h3 className="text-sm font-medium text-[#C72030] mb-4">Location Details</h3>
            <div className="grid grid-cols-2 gap-6">
              <FormControl fullWidth variant="outlined">
                <InputLabel shrink>Building</InputLabel>
                <MuiSelect
                  value={building}
                  onChange={(e) => setBuilding(e.target.value)}
                  label="Building"
                  displayEmpty
                  MenuProps={selectMenuProps}
                  sx={fieldStyles}
                >
                  <MenuItem value="">
                    <em>All Buildings</em>
                  </MenuItem>
                  {buildingOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>

              <FormControl fullWidth variant="outlined">
                <InputLabel shrink>Wing</InputLabel>
                <MuiSelect
                  value={wing}
                  onChange={(e) => setWing(e.target.value)}
                  label="Wing"
                  displayEmpty
                  MenuProps={selectMenuProps}
                  sx={fieldStyles}
                >
                  <MenuItem value="">
                    <em>All Wings</em>
                  </MenuItem>
                  {wingOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>

              <FormControl fullWidth variant="outlined">
                <InputLabel shrink>Floor</InputLabel>
                <MuiSelect
                  value={floor}
                  onChange={(e) => setFloor(e.target.value)}
                  label="Floor"
                  displayEmpty
                  MenuProps={selectMenuProps}
                  sx={fieldStyles}
                >
                  <MenuItem value="">
                    <em>All Floors</em>
                  </MenuItem>
                  {floorOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>

              <TextField
                label="Area"
                placeholder="Enter Area"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                InputProps={{ sx: fieldStyles }}
              />

              <TextField
                label="Room"
                placeholder="Enter Room"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                InputProps={{ sx: fieldStyles }}
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-6 border-t">
          <Button
            variant="outline"
            onClick={handleClear}
            className="px-6 py-2"
          >
            Clear All
          </Button>
          <Button
            onClick={handleApply}
            disabled={isLoading}
            className="bg-[#C72030] text-white hover:bg-[#C72030]/90 px-6 py-2"
          >
            {isLoading ? 'Applying...' : 'Apply Filter'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};