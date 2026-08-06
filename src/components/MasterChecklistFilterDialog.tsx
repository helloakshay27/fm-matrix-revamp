import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FormSearchSelect, type FormSearchSelectOption } from '@/components/FormSearchSelect';
import { useToast } from '@/hooks/use-toast';

interface MasterChecklistFilterDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MasterChecklistFilterDialog = ({ isOpen, onClose }: MasterChecklistFilterDialogProps) => {
  const { toast } = useToast();
  const [activityName, setActivityName] = useState('');

  const handleApply = () => {
    toast({
      title: "Success",
      description: "Filters applied successfully!",
    });
    onClose();
  };

  const handleReset = () => {
    setActivityName('');
  };

  const activityOptions: FormSearchSelectOption[] = [
    { value: 'all', label: 'All Activities' },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Filter Master Checklists</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <FormSearchSelect
            label="Activity Name"
            value={activityName}
            onChange={setActivityName}
            options={activityOptions}
            placeholder="Select Activity"
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
