import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FormSearchSelect, type FormSearchSelectOption } from '@/components/FormSearchSelect';
import { useToast } from '@/hooks/use-toast';

interface OperationalAuditConductedFilterDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OperationalAuditConductedFilterDialog = ({
  isOpen,
  onClose,
}: OperationalAuditConductedFilterDialogProps) => {
  const { toast } = useToast();
  const [status, setStatus] = useState('');
  const [site, setSite] = useState('');

  const handleApply = () => {
    toast({
      title: "Success",
      description: "Filters applied successfully!",
    });
    onClose();
  };

  const handleReset = () => {
    setStatus('');
    setSite('');
  };

  const statusOptions: FormSearchSelectOption[] = [
    { value: 'completed', label: 'Completed' },
    { value: 'in-progress', label: 'In Progress' },
  ];

  const siteOptions: FormSearchSelectOption[] = [
    { value: 'mina-al-fahal', label: 'Mina Al Fahal' },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Filter Audits</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <FormSearchSelect
            label="Status"
            value={status}
            onChange={setStatus}
            options={statusOptions}
            placeholder="Select Status"
          />
          <FormSearchSelect
            label="Site"
            value={site}
            onChange={setSite}
            options={siteOptions}
            placeholder="Select Site"
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
