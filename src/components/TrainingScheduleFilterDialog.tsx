import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FormControl, InputLabel, MenuItem, Select as MuiSelect } from '@mui/material';
import { X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TrainingScheduleFilterDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TrainingScheduleFilterDialog = ({ isOpen, onClose }: TrainingScheduleFilterDialogProps) => {
  const { toast } = useToast();
  const [task, setTask] = useState('');
  const [assignedTo, setAssignedTo] = useState('');

  const fieldStyles = {
    height: { xs: 40, sm: 45 },
    '& .MuiInputBase-input, & .MuiSelect-select': {
      padding: { xs: '8px', sm: '10px', md: '12px' },
    },
  };

  const selectMenuProps = {
    disablePortal: false,
    PaperProps: {
      sx: {
        maxHeight: 280,
        minWidth: 220,
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.12)',
        zIndex: 10001,
        '& .MuiMenuItem-root': {
          minHeight: 40,
          padding: '10px 16px',
          whiteSpace: 'normal',
          lineHeight: 1.4,
        },
      },
    },
  };

  const handleApply = () => {
    toast({
      title: "Success",
      description: "Filters applied successfully!",
    });
    onClose();
  };

  const handleReset = () => {
    setTask('');
    setAssignedTo('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <DialogTitle className="text-lg font-semibold text-gray-900">FILTER BY</DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-6 w-6 p-0 hover:bg-gray-100"
            aria-label="Close filters"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div>
            <h3 className="mb-4 text-sm font-medium text-brand">Training Details</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
              <FormControl fullWidth variant="outlined">
                <InputLabel id="training-task-filter-label" shrink>Task</InputLabel>
                <MuiSelect
                  labelId="training-task-filter-label"
                  label="Task"
                  value={task}
                  onChange={(event) => setTask(event.target.value)}
                  displayEmpty
                  sx={fieldStyles}
                  MenuProps={selectMenuProps}
                >
                  <MenuItem value=""><em>Select Task</em></MenuItem>
                  <MenuItem value="yes">Yes</MenuItem>
                  <MenuItem value="no">No</MenuItem>
                </MuiSelect>
              </FormControl>

              <FormControl fullWidth variant="outlined">
                <InputLabel id="training-assignee-filter-label" shrink>Task Assigned To</InputLabel>
                <MuiSelect
                  labelId="training-assignee-filter-label"
                  label="Task Assigned To"
                  value={assignedTo}
                  onChange={(event) => setAssignedTo(event.target.value)}
                  displayEmpty
                  sx={fieldStyles}
                  MenuProps={selectMenuProps}
                >
                  <MenuItem value=""><em>Select Assignee</em></MenuItem>
                  <MenuItem value="all">All</MenuItem>
                </MuiSelect>
              </FormControl>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t pt-6">
          <Button
            onClick={handleApply}
            className="bg-brand px-4 py-2 text-white hover:bg-brand-hover"
          >
            Apply Filters
          </Button>
          <Button
            variant="outline"
            onClick={handleReset}
            className="border-brand px-4 py-2 text-brand hover:bg-brand-selected hover:text-brand"
          >
            Reset
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
