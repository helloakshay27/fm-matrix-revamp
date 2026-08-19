import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FormSearchSelect, type FormSearchSelectOption } from '@/components/FormSearchSelect';
import { useToast } from '@/hooks/use-toast';

interface TrainingScheduleFilterDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TrainingScheduleFilterDialog = ({ isOpen, onClose }: TrainingScheduleFilterDialogProps) => {
  const { toast } = useToast();
  const [task, setTask] = useState('');
  const [assignedTo, setAssignedTo] = useState('');

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

  const taskOptions: FormSearchSelectOption[] = [
    { value: 'yes', label: 'Yes' },
    { value: 'no', label: 'No' },
  ];

  const assignedOptions: FormSearchSelectOption[] = [
    { value: 'all', label: 'All' },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Filter Training Schedules</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <FormSearchSelect
            label="Task"
            value={task}
            onChange={setTask}
            options={taskOptions}
            placeholder="Select Task"
          />
          <FormSearchSelect
            label="Task Assigned To"
            value={assignedTo}
            onChange={setAssignedTo}
            options={assignedOptions}
            placeholder="Select Assignee"
          />
        </div>

        <div className="flex justify-center gap-4 pt-2">
          <Button
            onClick={handleApply}
            className="bg-brand hover:bg-brand-hover text-white px-8"
          >
            Apply
          </Button>
          <Button
            variant="outline"
            onClick={handleReset}
            className="px-8 border-brand text-brand hover:bg-brand-selected hover:text-brand"
          >
            Reset
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
