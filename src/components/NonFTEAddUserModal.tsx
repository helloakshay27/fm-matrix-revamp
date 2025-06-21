
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';

interface NonFTEAddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NonFTEAddUserModal = ({ isOpen, onClose }: NonFTEAddUserModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    if (formData.name.trim() && formData.email.trim()) {
      console.log('Adding user:', formData);
      alert(`User added successfully: ${formData.name}`);
      setFormData({ name: '', email: '' });
      onClose();
    } else {
      alert('Please fill in all required fields');
    }
  };

  const handleReset = () => {
    setFormData({ name: '', email: '' });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white">
        <DialogHeader className="flex flex-row items-center justify-between border-b pb-4">
          <DialogTitle className="text-lg font-semibold">ADD FM USER</DialogTitle>
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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Name</label>
              <Input
                placeholder="Enter Name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <Input
                type="email"
                placeholder="Enter Email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full"
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-3 pt-4">
            <Button
              onClick={handleSubmit}
              className="text-white px-6"
              style={{ backgroundColor: '#C72030' }}
            >
              Submit
            </Button>
            <Button
              onClick={handleReset}
              variant="outline"
              className="px-6"
            >
              Reset
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
