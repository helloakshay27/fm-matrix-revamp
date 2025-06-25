
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';

interface CancelOSRDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (reason: string) => void;
}

export const CancelOSRDialog = ({ open, onOpenChange, onSubmit }: CancelOSRDialogProps) => {
  const [cancellationReason, setCancellationReason] = useState('');

  const handleSubmit = () => {
    if (cancellationReason.trim()) {
      onSubmit(cancellationReason);
      setCancellationReason('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex flex-row items-center justify-between pb-0">
          <DialogTitle className="text-lg font-semibold">Cancel</DialogTitle>
          <button
            onClick={() => onOpenChange(false)}
            className="text-red-500 hover:text-red-700"
          >
            <X className="h-4 w-4" />
          </button>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="cancellationReason" className="text-sm font-medium mb-2 block">
              Cancellation Reason
            </Label>
            <Textarea
              id="cancellationReason"
              placeholder="Message"
              value={cancellationReason}
              onChange={(e) => setCancellationReason(e.target.value)}
              className="w-full min-h-24"
            />
          </div>
        </div>

        <div className="flex justify-center pt-4">
          <Button 
            onClick={handleSubmit}
            className="bg-[#17a2b8] hover:bg-[#17a2b8]/90 text-white px-8"
            disabled={!cancellationReason.trim()}
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
