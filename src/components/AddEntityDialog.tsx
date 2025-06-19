
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface AddEntityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddEntityDialog = ({ open, onOpenChange }: AddEntityDialogProps) => {
  const [entityName, setEntityName] = useState('');

  const handleSubmit = () => {
    if (!entityName.trim()) {
      toast.error('Please enter an entity name');
      return;
    }
    
    toast.success('Entity added successfully');
    setEntityName('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>ADD ENTITY</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Entity Name
            </label>
            <Input
              placeholder="Enter Entity Name"
              value={entityName}
              onChange={(e) => setEntityName(e.target.value)}
              className="focus:ring-[#C72030] focus:border-[#C72030]"
            />
          </div>

          <div className="flex justify-end">
            <Button
              onClick={handleSubmit}
              className="bg-[#C72030] hover:bg-[#A01020] text-white"
            >
              Submit
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
