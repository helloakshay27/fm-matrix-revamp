
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface CancelBookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  booking: any;
  onCancel: (bookingId: string, reason: string) => void;
}

export const CancelBookingDialog = ({ open, onOpenChange, booking, onCancel }: CancelBookingDialogProps) => {
  const [cancelReason, setCancelReason] = useState('');

  const handleCancel = () => {
    if (booking && cancelReason.trim()) {
      onCancel(booking.id, cancelReason);
      setCancelReason('');
      onOpenChange(false);
    }
  };

  const handleClose = () => {
    setCancelReason('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Cancel Booking</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {booking && (
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                <strong>Booking ID:</strong> {booking.id}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Employee:</strong> {booking.employeeName}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Date:</strong> {booking.scheduleDate}
              </p>
            </div>
          )}
          
          <div>
            <Label htmlFor="cancelReason" className="block text-sm font-medium text-gray-700 mb-2">
              Cancellation Reason
            </Label>
            <Textarea
              id="cancelReason"
              placeholder="Enter reason for cancellation..."
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="min-h-20"
              required
            />
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button 
              onClick={handleCancel}
              className="flex-1 bg-[#C72030] hover:bg-[#C72030]/90 text-white"
              disabled={!cancelReason.trim()}
            >
              Confirm Cancel
            </Button>
            <Button 
              onClick={handleClose}
              variant="outline" 
              className="flex-1"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
