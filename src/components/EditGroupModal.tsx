
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';

interface EditGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupData?: {
    id: number;
    groupName: string;
  };
}

export const EditGroupModal = ({ isOpen, onClose, groupData }: EditGroupModalProps) => {
  const [groupName, setGroupName] = useState(groupData?.groupName || '');

  const handleSubmit = () => {
    console.log('Updating group:', { id: groupData?.id, groupName });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] p-0">
        <DialogHeader className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-medium text-gray-900">Edit Group</DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="px-6 py-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="groupName" className="text-sm font-medium text-gray-700">
              Enter Group Name
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

        <div className="flex justify-center px-6 py-4 border-t border-gray-200">
          <Button
            onClick={handleSubmit}
            className="bg-green-600 hover:bg-green-700 text-white px-8"
            disabled={!groupName.trim()}
          >
            Submit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
