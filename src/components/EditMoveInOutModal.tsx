import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MoveInOutData {
  id: string;
  purpose: string;
  status: boolean;
  createdOn: string;
  createdBy: string;
}

interface EditMoveInOutModalProps {
  isOpen: boolean;
  onClose: () => void;
  moveInOutData?: MoveInOutData;
  onUpdate: (data: MoveInOutData) => void;
}

export const EditMoveInOutModal = ({ isOpen, onClose, moveInOutData, onUpdate }: EditMoveInOutModalProps) => {
  const [purpose, setPurpose] = useState('');
  const [status, setStatus] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (moveInOutData && isOpen) {
      setPurpose(moveInOutData.purpose);
      setStatus(moveInOutData.status);
    }
  }, [moveInOutData, isOpen]);

  const handleSubmit = () => {
    if (!purpose.trim()) {
      toast({
        title: "Error",
        description: "Please enter a move in/out purpose",
        variant: "destructive"
      });
      return;
    }

    if (moveInOutData) {
      const updatedData = {
        ...moveInOutData,
        purpose: purpose.trim(),
        status
      };
      onUpdate(updatedData);
      toast({
        title: "Success",
        description: "Move In/Out purpose updated successfully",
      });
      onClose();
    }
  };

  const handleClose = () => {
    setPurpose('');
    setStatus(true);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] p-0">
        <DialogHeader className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-medium text-gray-900">Edit Move In/Out Purpose</DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="px-6 py-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="purpose" className="text-sm font-medium text-gray-700">
              Enter move in/ out purpose
            </Label>
            <Input
              id="purpose"
              placeholder="Enter move in/ out purpose"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="w-full"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="status"
              checked={status}
              onCheckedChange={setStatus}
            />
            <Label htmlFor="status" className="text-sm font-medium text-gray-700">
              Active
            </Label>
          </div>
        </div>

        <div className="flex justify-center px-6 py-4 border-t border-gray-200">
          <Button
            onClick={handleSubmit}
            className="bg-green-600 hover:bg-green-700 text-white px-8"
            disabled={!purpose.trim()}
          >
            Update
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};