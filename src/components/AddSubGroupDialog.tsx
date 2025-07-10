
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AddSubGroupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddSubGroupDialog = ({ open, onOpenChange }: AddSubGroupDialogProps) => {
  const [subGroupName, setSubGroupName] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');

  const handleSubmit = () => {
    console.log('Adding sub group:', subGroupName, 'to group:', selectedGroup);
    setSubGroupName('');
    setSelectedGroup('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Sub Group</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="group">Group</Label>
            <Select value={selectedGroup} onValueChange={setSelectedGroup}>
              <SelectTrigger>
                <SelectValue placeholder="Select group" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="electronic-devices">Electronic Devices</SelectItem>
                <SelectItem value="electrical">Electrical</SelectItem>
                <SelectItem value="non-electrical">Non Electrical</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="subGroupName">Sub Group Name</Label>
            <Input
              id="subGroupName"
              value={subGroupName}
              onChange={(e) => setSubGroupName(e.target.value)}
              placeholder="Enter sub group name"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="bg-purple-700 hover:bg-purple-800">
            Add Sub Group
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
