
import React from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface CloseOSRDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const CloseOSRDialog = ({ isOpen, onClose, onConfirm }: CloseOSRDialogProps) => {
  const handleConfirm = () => {
    console.log('Closing OSR');
    onConfirm();
    onClose();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg font-semibold text-left">
            lockated.com says
          </AlertDialogTitle>
          <AlertDialogDescription className="text-left text-gray-700">
            Are you sure you want to close this OSR?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex justify-end gap-3">
          <AlertDialogAction 
            onClick={handleConfirm}
            className="px-6 bg-orange-600 hover:bg-orange-700 text-white border-0 rounded-full"
          >
            OK
          </AlertDialogAction>
          <AlertDialogCancel 
            onClick={onClose}
            className="px-6 bg-orange-200 text-orange-800 hover:bg-orange-300 border-0 rounded-full"
          >
            Cancel
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
