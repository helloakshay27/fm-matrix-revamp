import React from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface DeleteOrganizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  organizationId: number;
}

export const DeleteOrganizationModal: React.FC<DeleteOrganizationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  organizationId
}) => {
  const handleConfirm = () => {
    console.log('Deleting organization:', organizationId);
    onConfirm();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg font-semibold text-center">
            Delete Organization
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center text-gray-700">
            Are you sure you want to delete this organization? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex justify-center gap-3">
          <AlertDialogAction 
            onClick={handleConfirm}
            style={{ backgroundColor: '#C72030', color: 'white' }}
            className="px-6 hover:opacity-90 border-0 rounded-full"
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
