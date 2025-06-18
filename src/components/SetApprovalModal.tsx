
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { X, Plus } from 'lucide-react';

interface SetApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SetApprovalModal = ({ isOpen, onClose }: SetApprovalModalProps) => {
  const [order, setOrder] = useState('1');
  const [nameOfLevel, setNameOfLevel] = useState('');
  const [users, setUsers] = useState('');
  const [sendEmails, setSendEmails] = useState(true);

  const handleApply = () => {
    console.log('Applying approval settings:', {
      order,
      nameOfLevel,
      users,
      sendEmails
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>FILTER BY</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-6 w-6"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
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
          </div>

          <div className="space-y-2">
            <Label>Users</Label>
            <Select value={users} onValueChange={setUsers}>
              <SelectTrigger>
                <SelectValue placeholder="Select up to 15 Options" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user1">User 1</SelectItem>
                <SelectItem value="user2">User 2</SelectItem>
                <SelectItem value="user3">User 3</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="send-emails"
              checked={sendEmails}
              onCheckedChange={(checked) => setSendEmails(checked === true)}
            />
            <Label htmlFor="send-emails">Send Emails</Label>
          </div>

          <div className="flex justify-center pt-4">
            <Button
              onClick={handleApply}
              style={{ backgroundColor: '#C72030' }}
              className="text-white hover:bg-[#C72030]/90 px-8"
            >
              Apply
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
