import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, MapPin } from 'lucide-react';

interface DeleteSiteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  siteId: number | null;
}

export const DeleteSiteModal: React.FC<DeleteSiteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  siteId
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="w-5 h-5" />
            Delete Site
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-red-50 rounded-lg">
            <MapPin className="w-8 h-8 text-red-500" />
            <div>
              <p className="font-medium text-red-800">
                Are you sure you want to delete this site?
              </p>
              <p className="text-sm text-red-600 mt-1">
                This action cannot be undone and will permanently delete the site record.
              </p>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <p className="text-sm text-amber-800">
              <strong>Warning:</strong> Deleting this site may affect:
            </p>
            <ul className="text-sm text-amber-700 mt-2 list-disc list-inside space-y-1">
              <li>Related assets and equipment</li>
              <li>Active tickets and maintenance records</li>
              <li>User access and assignments</li>
              <li>Historical data and reports</li>
            </ul>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={onConfirm} 
            variant="outline"
            className="bg-red-600 text-white hover:bg-red-700 border-red-600 hover:border-red-700"
          >
            Delete Site
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
