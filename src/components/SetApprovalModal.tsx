
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { X } from 'lucide-react';
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem } from '@mui/material';

interface SetApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const fieldStyles = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    backgroundColor: 'white',
    '& fieldset': {
      borderColor: '#e5e7eb',
    },
    '&:hover fieldset': {
      borderColor: '#9ca3af',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#C72030',
    },
  },
  '& .MuiInputLabel-root': {
    color: '#6b7280',
    '&.Mui-focused': {
      color: '#C72030',
    },
  },
  '& .MuiInputBase-input': {
    padding: '12px 14px',
    fontSize: '14px',
  },
  '& .MuiSelect-select': {
    padding: '12px 14px',
    fontSize: '14px',
  },
};

const menuProps = {
  PaperProps: {
    style: {
      maxHeight: 300,
      zIndex: 9999,
      backgroundColor: 'white',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    },
  },
  MenuListProps: {
    style: {
      padding: 0,
    },
  },
  anchorOrigin: {
    vertical: 'bottom' as const,
    horizontal: 'left' as const,
  },
  transformOrigin: {
    vertical: 'top' as const,
    horizontal: 'left' as const,
  },
};

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
      <DialogContent className="max-w-xs sm:max-w-md md:max-w-lg w-full mx-4">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold">Set Approval</DialogTitle>
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
        
        <div className="space-y-4 p-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Order</Label>
              <TextField
                value={order}
                onChange={(e) => setOrder(e.target.value)}
                placeholder="1"
                fullWidth
                variant="outlined"
                size="small"
                sx={fieldStyles}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Name of Level</Label>
              <TextField
                value={nameOfLevel}
                onChange={(e) => setNameOfLevel(e.target.value)}
                placeholder="Enter Name of Level"
                fullWidth
                variant="outlined"
                size="small"
                sx={fieldStyles}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">Users</Label>
            <FormControl fullWidth size="small">
              <MuiSelect
                value={users}
                onChange={(e) => setUsers(e.target.value)}
                displayEmpty
                sx={fieldStyles}
                MenuProps={menuProps}
              >
                <MenuItem value="">
                  <em>Select up to 15 Options</em>
                </MenuItem>
                <MenuItem value="user1">User 1</MenuItem>
                <MenuItem value="user2">User 2</MenuItem>
                <MenuItem value="user3">User 3</MenuItem>
              </MuiSelect>
            </FormControl>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="send-emails"
              checked={sendEmails}
              onCheckedChange={(checked) => setSendEmails(checked === true)}
              className="data-[state=checked]:bg-[#C72030] data-[state=checked]:border-[#C72030] data-[state=checked]:text-white"
            />
            <Label htmlFor="send-emails" className="text-sm font-medium text-gray-700">Send Emails</Label>
          </div>

          <div className="flex justify-center pt-4">
            <Button
              onClick={handleApply}
              style={{ backgroundColor: '#C72030' }}
              className="text-white hover:bg-[#C72030]/90 px-6 sm:px-8 py-2 w-full sm:w-auto"
            >
              Apply
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
