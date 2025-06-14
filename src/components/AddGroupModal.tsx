
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { X } from 'lucide-react';

interface AddGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const members = [
  'Sureshdutt Shukla',
  'Security HO 1', 
  'Security HO 2',
  'Kshitij Rasal',
  'Vinayak Mane',
  'Demo User',
  'Demo Site1',
  'Gaurav Mane',
  'Abhishek Sharma',
  'Tejas Chaudhari',
  'Sohail Ansari',
  'Sagar Singh',
  'Aquil Husain',
  'Samira Merchant',
  'Vidhya Balota',
  'Suyash Jagdale',
  'Akshay Mugale'
];

export const AddGroupModal = ({ isOpen, onClose }: AddGroupModalProps) => {
  const [groupName, setGroupName] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedMembers([]);
    } else {
      setSelectedMembers([...members]);
    }
    setSelectAll(!selectAll);
  };

  const handleMemberToggle = (member: string) => {
    if (selectedMembers.includes(member)) {
      setSelectedMembers(selectedMembers.filter(m => m !== member));
    } else {
      setSelectedMembers([...selectedMembers, member]);
    }
  };

  const handleSubmit = () => {
    console.log('Adding group:', { groupName, selectedMembers });
    setGroupName('');
    setSelectedMembers([]);
    setSelectAll(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] p-0 max-h-[80vh] overflow-hidden">
        <DialogHeader className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-medium text-gray-900">Add Group</DialogTitle>
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
        
        <div className="px-6 py-4 space-y-4 overflow-y-auto flex-1">
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

          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700">Add Members</Label>
            
            <Button
              onClick={handleSelectAll}
              className="bg-purple-700 hover:bg-purple-800 text-white text-sm px-4 py-2"
            >
              Select All Members
            </Button>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {members.map((member) => (
                <div key={member} className="flex items-center space-x-2">
                  <Checkbox
                    id={member}
                    checked={selectedMembers.includes(member)}
                    onCheckedChange={() => handleMemberToggle(member)}
                  />
                  <Label
                    htmlFor={member}
                    className="text-sm font-normal cursor-pointer flex-1"
                  >
                    {member}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end px-6 py-4 border-t border-gray-200">
          <Button
            onClick={handleSubmit}
            className="bg-green-600 hover:bg-green-700 text-white px-6"
            disabled={!groupName.trim()}
          >
            Submit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
