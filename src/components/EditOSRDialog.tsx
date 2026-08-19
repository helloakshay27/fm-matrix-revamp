
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  FormControl as MuiFormControl,
  Select as MuiSelect,
  MenuItem,
} from '@mui/material';
import { X } from 'lucide-react';

const fieldStyles = {
  height: '40px',
  backgroundColor: '#fff',
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: '#d1d5db',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: 'var(--color-primary)',
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: 'var(--color-primary)',
  },
  '& .MuiSelect-select': {
    fontSize: '14px',
  },
};

// Portals to document.body so the menu anchors under the field instead of
// inheriting the Radix Dialog's translate transform (which mispositions it).
// Radix's modal Dialog sets `pointer-events: none` on <body>, which the portaled
// menu inherits — without pointerEvents:'auto' the backdrop never receives the
// click that closes the menu.
const selectMenuProps = {
  sx: { pointerEvents: 'auto' },
  PaperProps: {
    sx: {
      maxHeight: 224,
      backgroundColor: 'white',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      zIndex: 9999,
    },
  },
  disablePortal: false,
  disableAutoFocus: true,
  disableEnforceFocus: true,
};

interface EditOSRDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  osrDetails: any;
  onSubmit: (data: any) => void;
}

export const EditOSRDialog = ({ open, onOpenChange, osrDetails, onSubmit }: EditOSRDialogProps) => {
  const [status, setStatus] = useState(osrDetails?.status || '');
  const [assignedTo, setAssignedTo] = useState(osrDetails?.assignedTo || '');
  const [comment, setComment] = useState('');

  const handleSubmit = () => {
    onSubmit({
      status,
      assignedTo,
      comment
    });
    setComment('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex flex-row items-center justify-between pb-0">
          <DialogTitle className="text-lg font-semibold">Edit Details</DialogTitle>
          <button
            onClick={() => onOpenChange(false)}
            className="text-red-500 hover:text-red-700"
          >
            <X className="h-4 w-4" />
          </button>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="status" className="text-sm font-medium mb-2 block">
              Status
            </Label>
            <MuiFormControl fullWidth size="small">
              <MuiSelect
                id="status"
                displayEmpty
                value={status}
                onChange={(event) => setStatus(event.target.value)}
                renderValue={(selected) =>
                  selected || <span className="text-gray-500">Select Status</span>
                }
                sx={fieldStyles}
                MenuProps={selectMenuProps}
              >
                <MenuItem value="Work Pending">Work Pending</MenuItem>
                <MenuItem value="Payment Pending">Payment Pending</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
                <MenuItem value="Cancelled">Cancelled</MenuItem>
              </MuiSelect>
            </MuiFormControl>
          </div>

          <div>
            <Label htmlFor="assignedTo" className="text-sm font-medium mb-2 block">
              Assigned to
            </Label>
            <MuiFormControl fullWidth size="small">
              <MuiSelect
                id="assignedTo"
                displayEmpty
                value={assignedTo}
                onChange={(event) => setAssignedTo(event.target.value)}
                renderValue={(selected) =>
                  selected || <span className="text-gray-500">Select Assignee</span>
                }
                sx={fieldStyles}
                MenuProps={selectMenuProps}
              >
                <MenuItem value="Test Test">Test Test</MenuItem>
                <MenuItem value="John Doe">John Doe</MenuItem>
                <MenuItem value="Jane Smith">Jane Smith</MenuItem>
              </MuiSelect>
            </MuiFormControl>
          </div>

          <div>
            <Label htmlFor="comment" className="text-sm font-medium mb-2 block">
              Comment
            </Label>
            <Textarea
              id="comment"
              placeholder="Message"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full min-h-24"
            />
          </div>
        </div>

        <div className="flex justify-center pt-4">
          <Button 
            onClick={handleSubmit}
            className="!bg-brand hover:!bg-brand-hover !text-white px-8"
          >
            Submit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
