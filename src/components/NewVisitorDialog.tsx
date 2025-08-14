
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';

interface NewVisitorDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewVisitorDialog: React.FC<NewVisitorDialogProps> = ({
  isOpen,
  onClose,
}) => {
  const navigate = useNavigate();
  const [mobileNumber, setMobileNumber] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting visitor with mobile number:', mobileNumber);
    onClose();
    // Pass the mobile number as state to the visitor form page
    navigate('/visitor-form', { 
      state: { 
        mobileNumber: mobileNumber 
      } 
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md [&>button]:hidden">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <DialogTitle className="text-lg font-semibold">New Visitor</DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Mobile Number
            </label>
            <Input
              type="tel"
              placeholder="Enter Mobile Number"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              className="w-full"
              required
            />
          </div>

          <Button
            type="submit"
            style={{ backgroundColor: '#C72030' }}
            className="w-full text-white hover:bg-[#C72030]/90"
          >
            Submit
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
