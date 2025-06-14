
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';

interface AddChecklistGroupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddChecklistGroupDialog = ({ open, onOpenChange }: AddChecklistGroupDialogProps) => {
  const [groupName, setGroupName] = useState('');

  const handleSubmit = () => {
    console.log('Adding checklist group:', groupName);
    setGroupName('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px] p-0">
        <DialogHeader className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-medium text-gray-900">ADD Group</DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="px-6 py-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="groupName" className="text-sm font-medium text-gray-700">
              Group Name
            </Label>
            <Input
              id="groupName"
              placeholder="Enter Group Name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="w-full"
            />
          </div>
        </div>

        <div className="flex justify-end px-6 py-4 border-t border-gray-200">
          <Button
            onClick={handleSubmit}
            className="bg-green-600 hover:bg-green-700 text-white px-6"
          >
            Submit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
