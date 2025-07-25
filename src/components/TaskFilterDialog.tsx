import React, { useState, useEffect } from 'react';
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
import { AsyncSearchableDropdown } from '@/components/AsyncSearchableDropdown';
import { userService, User } from '@/services/userService';

interface TaskFilterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: TaskFilters) => void;
  showAll?: boolean;
  onShowAllChange?: (showAll: boolean) => void;
}

export interface TaskFilters {
  taskId?: string;
  checklist?: string;
  assignedTo?: string;
  status?: string;
  scheduleType?: string;
  type?: string;
  priority?: string;
  dateFrom?: string;
  dateTo?: string;
  assetGroupId?: string;
  assetSubGroupId?: string;
  supplierId?: string;
  showAll?: boolean;
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

export const TaskFilterDialog: React.FC<TaskFilterDialogProps> = ({ isOpen, onClose, onApply, showAll = true, onShowAllChange }) => {
  const [taskId, setTaskId] = useState('');
  const [checklist, setChecklist] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [status, setStatus] = useState('');
  const [scheduleType, setScheduleType] = useState('');
  const [type, setType] = useState('');
  const [priority, setPriority] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);

  // Fetch users when component mounts
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const fetchedUsers = await userService.searchUsers('');
        setUsers(fetchedUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
        toast.error('Failed to fetch users');
      }
    };
    fetchUsers();
  }, []);

  const statusOptions = [
    'Scheduled',
    'Open', 
    'In Progress',
    'Completed',
    'Overdue',
    'Cancelled'
  ];

  const scheduleTypeOptions = [
    'asset',
    'service'
  ];

  const typeOptions = [
    'PPM',
    'AMC',
    'Preparedness'
  ];

  const priorityOptions = [
    'Low',
    'Medium', 
    'High',
    'Critical'
  ];

  const handleApply = async () => {
    setIsLoading(true);
    try {
      const filters: TaskFilters = {
        ...(taskId && { taskId }),
        ...(checklist && { checklist }),
        ...(assignedTo && { assignedTo }),
        ...(status && { status }),
        ...(scheduleType && { scheduleType }),
        ...(type && { type }),
        ...(priority && { priority }),
        ...(dateFrom && { dateFrom }),
        ...(dateTo && { dateTo }),
      };

      console.log('Applying task filters:', filters);
      onApply(filters);
      onClose();
      
      toast.success('Filters applied successfully');
    } catch (error) {
      console.error('Error applying filters:', error);
      toast.error('Failed to apply filters');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setTaskId('');
    setChecklist('');
    setAssignedTo('');
    setStatus('');
    setScheduleType('');
    setType('');
    setPriority('');
    setDateFrom('');
    setDateTo('');
    
    onApply({});
    onClose();
    toast.success('Filters cleared successfully');
  };

  // Handle user search for assigned to dropdown
  const handleUserSearch = async (searchTerm: string) => {
    try {
      const users = await userService.searchUsers(searchTerm);
      return users.map(user => ({
        value: user.id.toString(),
        label: user.full_name
      }));
    } catch (error) {
      console.error('Error searching users:', error);
      return [];
    }
  };

  // Handle assigned user selection
  const handleAssignedUserChange = (selectedOption: { value: string; label: string } | null) => {
    setAssignedTo(selectedOption?.value || '');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose} modal={false}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white z-50" aria-describedby="task-filter-dialog-description">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <DialogTitle className="text-lg font-semibold text-gray-900">FILTER TASKS</DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-6 w-6 p-0 hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </Button>
          <div id="task-filter-dialog-description" className="sr-only">
            Filter tasks by ID, checklist, assigned to, status, schedule type, site, priority, and date range
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Task Details Section */}
          <div>
            <h3 className="text-sm font-medium text-[#C72030] mb-4">Task Details</h3>
            <div className="grid grid-cols-3 gap-6">
              <TextField
                label="Task ID"
                placeholder="Enter Task ID"
                value={taskId}
                onChange={(e) => setTaskId(e.target.value)}
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                InputProps={{ sx: fieldStyles }}
              />
              <TextField
                label="Checklist"
                placeholder="Enter Checklist Name"
                value={checklist}
                onChange={(e) => setChecklist(e.target.value)}
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                InputProps={{ sx: fieldStyles }}
              />
              <FormControl fullWidth variant="outlined">
                <InputLabel shrink>Assigned To</InputLabel>
                <MuiSelect
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                  label="Assigned To"
                  displayEmpty
                  MenuProps={selectMenuProps}
                  sx={fieldStyles}
                >
                  <MenuItem value="">
                    <em>Select User</em>
                  </MenuItem>
                  {users.map((user) => (
                    <MenuItem key={user.id} value={user.id}>
                      {user.full_name}
                    </MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>
            </div>
          </div>

          {/* Task Status & Type Section */}
          <div>
            <h3 className="text-sm font-medium text-[#C72030] mb-4">Task Status & Type</h3>
            <div className="grid grid-cols-4 gap-6">
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
                    <em>Select Schedule Type</em>
                  </MenuItem>
                  {scheduleTypeOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>

              <FormControl fullWidth variant="outlined">
                <InputLabel shrink>Type</InputLabel>
                <MuiSelect
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  label="Type"
                  displayEmpty
                  MenuProps={selectMenuProps}
                  sx={fieldStyles}
                >
                  <MenuItem value="">
                    <em>Select Type</em>
                  </MenuItem>
                  {typeOptions.map((option) => (
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

          {/* Date Range Section */}
          <div>
            <h3 className="text-sm font-medium text-[#C72030] mb-4">Date Range</h3>
            <div className="grid grid-cols-2 gap-6">
              <TextField
                label="From Date"
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                InputProps={{ sx: fieldStyles }}
              />
              <TextField
                label="To Date"
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                InputProps={{ sx: fieldStyles }}
              />
            </div>
          </div>

          {/* Show All Tasks Toggle */}
          {onShowAllChange && (
            <div>
              <h3 className="text-sm font-medium text-[#C72030] mb-4">Display Options</h3>
              <div className="flex items-center space-x-3">
                <label htmlFor="show-all-toggle" className="flex items-center cursor-pointer">
                  <input
                    id="show-all-toggle"
                    type="checkbox"
                    checked={showAll}
                    onChange={(e) => onShowAllChange(e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`w-11 h-6 rounded-full ${showAll ? 'bg-[#C72030]' : 'bg-gray-300'} transition-colors duration-200 ease-in-out relative`}>
                    <div className={`w-5 h-5 bg-white rounded-full shadow-lg transform transition-transform duration-200 ease-in-out absolute top-0.5 ${showAll ? 'translate-x-5' : 'translate-x-0.5'}`}></div>
                  </div>
                  <span className="ml-3 text-sm font-medium text-gray-700">
                    Show All Tasks
                  </span>
                </label>
                <span className="text-xs text-gray-500">
                  ({showAll ? 'Shows all tasks' : 'My Task'})
                </span>
              </div>
            </div>
          )}
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