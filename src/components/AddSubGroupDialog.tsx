
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';

interface AddSubGroupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddSubGroupDialog = ({ open, onOpenChange }: AddSubGroupDialogProps) => {
  const [selectedGroup, setSelectedGroup] = useState('');
  const [subGroupName, setSubGroupName] = useState('');

  const groups = [
    'Electronic Devices',
    'Electrical',
    'Non Electrical',
    'Stand',
    'APS',
    'Technical services',
    'hvac',
    'CCTV Camera',
    'DVR',
    'Water Dispenser'
  ];

  const handleSubmit = () => {
    console.log('Adding subgroup:', { selectedGroup, subGroupName });
    setSelectedGroup('');
    setSubGroupName('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0">
        <DialogHeader className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-medium text-gray-900">ADD Sub Group</DialogTitle>
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
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Group Name
              </Label>
              <Select value={selectedGroup} onValueChange={setSelectedGroup}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Group" />
                </SelectTrigger>
                <SelectContent>
                  {groups.map((group) => (
                    <SelectItem key={group} value={group}>
                      {group}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subGroupName" className="text-sm font-medium text-gray-700">
                Group Name
              </Label>
              <Input
                id="subGroupName"
                placeholder="Enter Sub Group Name"
                value={subGroupName}
                onChange={(e) => setSubGroupName(e.target.value)}
                className="w-full"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end px-6 py-4 border-t border-gray-200">
          <Button
            onClick={handleSubmit}
            className="bg-purple-700 hover:bg-purple-800 text-white px-6"
          >
            Submit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
