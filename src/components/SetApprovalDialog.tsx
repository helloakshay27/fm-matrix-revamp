
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { X, Plus } from 'lucide-react';

interface SetApprovalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SetApprovalDialog = ({ open, onOpenChange }: SetApprovalDialogProps) => {
  const [order, setOrder] = useState('1');
  const [nameOfLevel, setNameOfLevel] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [sendEmails, setSendEmails] = useState(true);

  const handleApply = () => {
    console.log('Approval settings applied');
    onOpenChange(false);
  };

  const handleAddLevel = () => {
    console.log('Add new level');
  };

  const handleRemoveUser = (user: string) => {
    setSelectedUsers(prev => prev.filter(u => u !== user));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-xl font-bold">FILTER BY</DialogTitle>
          <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
            <X className="w-4 h-4" />
          </Button>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="grid grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Order</Label>
              <Input
                value={order}
                onChange={(e) => setOrder(e.target.value)}
                placeholder="1"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Name of Level</Label>
              <Input
                value={nameOfLevel}
                onChange={(e) => setNameOfLevel(e.target.value)}
                placeholder="Enter Name of Level"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Users</Label>
              <div className="flex items-center gap-2">
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select up to 15 Options..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user1">User 1</SelectItem>
                    <SelectItem value="user2">User 2</SelectItem>
                    <SelectItem value="user3">User 3</SelectItem>
                  </SelectContent>
                </Select>
                {selectedUsers.length > 0 && (
                  <div className="flex gap-1">
                    {selectedUsers.map(user => (
                      <div key={user} className="bg-red-100 text-red-600 px-2 py-1 rounded text-xs flex items-center gap-1">
                        {user}
                        <button 
                          onClick={() => handleRemoveUser(user)}
                          className="text-red-600 hover:text-red-800"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2 flex items-center">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  checked={sendEmails} 
                  onCheckedChange={setSendEmails}
                />
                <Label>Send Emails</Label>
              </div>
            </div>
          </div>

          <div className="flex justify-start">
            <Button 
              onClick={handleAddLevel}
              style={{ backgroundColor: '#8B4513' }}
              className="text-white hover:bg-[#8B4513]/90"
            >
              <Plus className="w-4 h-4 mr-2" />
            </Button>
          </div>
        </div>

        <div className="flex justify-center pt-4">
          <Button 
            onClick={handleApply}
            style={{ backgroundColor: '#8B4513' }}
            className="text-white hover:bg-[#8B4513]/90 px-8"
          >
            Apply
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
