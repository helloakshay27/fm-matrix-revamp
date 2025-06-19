
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface RVehicleInDialogProps {
  isOpen: boolean;
  onClose: () => void;
  vehicleNumber: string;
}

export const RVehicleInDialog = ({ isOpen, onClose, vehicleNumber }: RVehicleInDialogProps) => {
  const handleSubmit = () => {
    console.log('Marking vehicle as In:', vehicleNumber);
    // Handle the "In" action here
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm bg-white [&>button]:hidden">
        <DialogHeader className="flex flex-row items-center justify-between border-b pb-4">
          <DialogTitle className="text-lg font-semibold">Registered Vehicle In</DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <div className="p-6 text-center space-y-6">
          <p className="text-gray-700">
            Are you sure you want to mark the vehicle in?
          </p>

          {/* Action Buttons */}
          <div className="flex justify-center gap-3">
            <Button
              onClick={handleCancel}
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-2"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              style={{ backgroundColor: '#C72030' }}
              className="hover:opacity-90 text-white px-6 py-2"
            >
              Submit
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
