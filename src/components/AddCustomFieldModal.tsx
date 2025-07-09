
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';

interface AddCustomFieldModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddField: (fieldName: string) => void;
}

export const AddCustomFieldModal: React.FC<AddCustomFieldModalProps> = ({
  isOpen,
  onClose,
  onAddField
}) => {
  const [fieldName, setFieldName] = useState('');

  const handleAddField = () => {
    if (fieldName.trim()) {
      onAddField(fieldName.trim());
      setFieldName('');
      onClose();
    }
  };

  const handleCancel = () => {
    setFieldName('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <DialogTitle className="text-lg font-semibold">Add Custom Field</DialogTitle>
          <button
            onClick={onClose}
            className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="fieldName" className="text-sm font-medium">
              New Field Name
            </Label>
            <Input
              id="fieldName"
              value={fieldName}
              onChange={(e) => setFieldName(e.target.value)}
              placeholder="New Field Name"
              className="mt-1"
            />
          </div>
        </div>

        <div className="flex justify-center gap-4 pt-4">
          <Button
            onClick={handleCancel}
            variant="outline"
            className="px-8 py-2"
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddField}
            className="px-8 py-2 bg-[#C72030] hover:bg-[#C72030]/90 text-white"
          >
            Add Field
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
