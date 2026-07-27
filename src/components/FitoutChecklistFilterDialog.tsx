import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FormSearchSelect, type FormSearchSelectOption } from '@/components/FormSearchSelect';
import { useToast } from '@/hooks/use-toast';

interface FitoutChecklistFilterDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FitoutChecklistFilterDialog = ({ isOpen, onClose }: FitoutChecklistFilterDialogProps) => {
  const { toast } = useToast();
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');

  const handleApply = () => {
    toast({
      title: "Success",
      description: "Filters applied successfully!",
    });
    onClose();
  };

  const handleReset = () => {
    setCategory('');
    setStatus('');
  };

  const categoryOptions: FormSearchSelectOption[] = [
    { value: 'renovation', label: 'Renovation' },
    { value: 'electrical', label: 'Electrical' },
    { value: 'plumbing', label: 'Plumbing' },
    { value: 'flooring', label: 'Flooring' },
  ];

  const statusOptions: FormSearchSelectOption[] = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'draft', label: 'Draft' },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Filter Checklists</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <FormSearchSelect
            label="Category"
            value={category}
            onChange={setCategory}
            options={categoryOptions}
            placeholder="Select Category"
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
            className="px-8 border-brand text-brand hover:bg-brand hover:text-white"
          >
            Reset
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
