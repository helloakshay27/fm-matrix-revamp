import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { useApiConfig } from '@/hooks/useApiConfig';
import { AlertTriangle } from 'lucide-react';

interface DeleteCountryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (countryId: number) => void;
  countryId: number;
}

export const DeleteCountryModal: React.FC<DeleteCountryModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  countryId
}) => {
  const { getFullUrl, getAuthHeader } = useApiConfig();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(getFullUrl(`/headquarters/${countryId}.json`), {
        method: 'DELETE',
        headers: {
          'Authorization': getAuthHeader(),
        },
      });

      if (response.ok) {
        toast.success('Country deleted successfully');
        onConfirm(countryId);
        onClose();
      } else {
        toast.error('Failed to delete country');
      }
    } catch (error) {
      console.error('Error deleting country:', error);
      toast.error('Error deleting country');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <DialogTitle className="text-lg font-semibold text-gray-900">
                Delete Country
              </DialogTitle>
            </div>
          </div>
          <DialogDescription className="text-sm text-gray-600">
            Are you sure you want to delete this country? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex gap-3 mt-6">
          <Button 
            variant="outline" 
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleConfirm}
            disabled={isDeleting}
            className="flex-1"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
