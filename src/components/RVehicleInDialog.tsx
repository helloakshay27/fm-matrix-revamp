
import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface RVehicleInDialogProps {
  isOpen: boolean;
  onClose: () => void;
  vehicleNumber: string;
}

export const RVehicleInDialog = ({ isOpen, onClose, vehicleNumber }: RVehicleInDialogProps) => {
  const handleSubmit = () => {
    // Handle the vehicle in logic here
    console.log(`Marking vehicle ${vehicleNumber} as In`);
    onClose();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-md rounded-none">
        <AlertDialogHeader>
          <AlertDialogTitle>Registered Vehicle In</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to mark the vehicle in?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose} className="rounded-none">Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleSubmit}
            style={{ backgroundColor: '#C72030' }}
            className="hover:opacity-90 text-white rounded-none"
          >
            Submit
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
