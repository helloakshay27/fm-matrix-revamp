import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface UpdateNumberDialogProps {
  isOpen: boolean;
  onClose: () => void;
  currentNumber: string;
  onUpdate: (newNumber: string) => void;
}

export const UpdateNumberDialog: React.FC<UpdateNumberDialogProps> = ({
  isOpen,
  onClose,
  currentNumber,
  onUpdate,
}) => {
  const [number, setNumber] = useState(currentNumber);

  React.useEffect(() => {
    setNumber(currentNumber);
  }, [currentNumber, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(number);
    onClose();
  };

  const handleCancel = () => {
    setNumber(currentNumber);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Update Number</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            type="tel"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="px-6 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white"
            >
              Submit
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};