
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';

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
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Work Pending">Work Pending</SelectItem>
                <SelectItem value="Payment Pending">Payment Pending</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="assignedTo" className="text-sm font-medium mb-2 block">
              Assigned to
            </Label>
            <Select value={assignedTo} onValueChange={setAssignedTo}>
              <SelectTrigger>
                <SelectValue placeholder="Select Assignee" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Test Test">Test Test</SelectItem>
                <SelectItem value="John Doe">John Doe</SelectItem>
                <SelectItem value="Jane Smith">Jane Smith</SelectItem>
              </SelectContent>
            </Select>
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
            className="bg-green-600 hover:bg-green-700 text-white px-8"
          >
            Submit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
