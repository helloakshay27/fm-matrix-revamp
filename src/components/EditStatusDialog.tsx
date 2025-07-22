
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface EditStatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EditStatusDialog = ({ open, onOpenChange }: EditStatusDialogProps) => {
  const [selectedStatus, setSelectedStatus] = useState('');
  const [rootCause, setRootCause] = useState('');
  const [correctiveAction, setCorrectiveAction] = useState('');
  const [preventiveAction, setPreventiveAction] = useState('');

  const handleApply = () => {
    console.log('Status updated:', { selectedStatus, rootCause, correctiveAction, preventiveAction });
    onOpenChange(false);
  };

  const handleReset = () => {
    setSelectedStatus('');
    setRootCause('');
    setCorrectiveAction('');
    setPreventiveAction('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Status</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="status" className="text-sm font-medium">
              Status
            </Label>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="rootCause" className="text-sm font-medium">
                Root Cause
              </Label>
              <Textarea
                id="rootCause"
                value={rootCause}
                onChange={(e) => setRootCause(e.target.value)}
                className="mt-1 min-h-[80px]"
                placeholder=""
              />
            </div>
            <div>
              <Label htmlFor="correctiveAction" className="text-sm font-medium">
                Corrective Action
              </Label>
              <Textarea
                id="correctiveAction"
                value={correctiveAction}
                onChange={(e) => setCorrectiveAction(e.target.value)}
                className="mt-1 min-h-[80px]"
                placeholder=""
              />
            </div>
          </div>

          <div>
            <Label htmlFor="preventiveAction" className="text-sm font-medium">
              Preventive Action
            </Label>
            <Textarea
              id="preventiveAction"
              value={preventiveAction}
              onChange={(e) => setPreventiveAction(e.target.value)}
              className="mt-1 min-h-[80px]"
              placeholder=""
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              onClick={handleApply}
              className="bg-[#8B4B8C] hover:bg-[#7A427B] text-white flex-1"
            >
              Apply
            </Button>
            <Button 
              onClick={handleReset}
              variant="outline"
              className="flex-1"
            >
              Reset
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
