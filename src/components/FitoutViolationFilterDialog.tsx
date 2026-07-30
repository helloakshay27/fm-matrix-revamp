import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FormSearchSelect, type FormSearchSelectOption } from '@/components/FormSearchSelect';
import { useToast } from '@/hooks/use-toast';

interface FitoutViolationFilterDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FitoutViolationFilterDialog = ({ isOpen, onClose }: FitoutViolationFilterDialogProps) => {
  const { toast } = useToast();
  const [type, setType] = useState('');
  const [severity, setSeverity] = useState('');
  const [status, setStatus] = useState('');

  const handleApply = () => {
    toast({
      title: "Success",
      description: "Filters applied successfully!",
    });
    onClose();
  };

  const handleReset = () => {
    setType('');
    setSeverity('');
    setStatus('');
  };

  const typeOptions: FormSearchSelectOption[] = [
    { value: 'safety', label: 'Safety' },
    { value: 'noise', label: 'Noise' },
    { value: 'debris', label: 'Debris' },
    { value: 'timing', label: 'Timing' },
  ];

  const severityOptions: FormSearchSelectOption[] = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'critical', label: 'Critical' },
  ];

  const statusOptions: FormSearchSelectOption[] = [
    { value: 'pending', label: 'Pending' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'resolved', label: 'Resolved' },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Filter Violations</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <FormSearchSelect
            label="Type"
            value={type}
            onChange={setType}
            options={typeOptions}
            placeholder="Select Type"
          />
          <FormSearchSelect
            label="Severity"
            value={severity}
            onChange={setSeverity}
            options={severityOptions}
            placeholder="Select Severity"
          />
          <FormSearchSelect
            label="Status"
            value={status}
            onChange={setStatus}
            options={statusOptions}
            placeholder="Select Status"
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
