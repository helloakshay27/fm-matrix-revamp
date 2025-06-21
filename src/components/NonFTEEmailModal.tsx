
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';

interface NonFTEEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NonFTEEmailModal = ({ isOpen, onClose }: NonFTEEmailModalProps) => {
  const [email, setEmail] = useState('');

  const handleSubmit = () => {
    if (email.trim()) {
      console.log('Sending email to:', email);
      alert(`Email sent to: ${email}`);
      setEmail('');
      onClose();
    } else {
      alert('Please enter an email address');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white">
        <DialogHeader className="flex flex-row items-center justify-between border-b pb-4">
          <DialogTitle className="text-lg font-semibold">Email</DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              email*
            </label>
            <Input
              type="email"
              placeholder="enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full"
            />
          </div>
          
          <div className="flex justify-end">
            <Button
              onClick={handleSubmit}
              className="text-white px-8"
              style={{ backgroundColor: '#C72030' }}
            >
              Submit
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
