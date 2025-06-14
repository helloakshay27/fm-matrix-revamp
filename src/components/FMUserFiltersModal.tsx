
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';

interface FMUserFiltersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FMUserFiltersModal = ({ isOpen, onClose }: FMUserFiltersModalProps) => {
  const [filters, setFilters] = useState({
    name: '',
    email: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleApply = () => {
    console.log('Applied filters:', filters);
    onClose();
  };

  const handleReset = () => {
    setFilters({ name: '', email: '' });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white">
        <DialogHeader className="flex flex-row items-center justify-between border-b pb-4">
          <DialogTitle className="text-lg font-semibold">Filter</DialogTitle>
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
          <div className="space-y-2">
            <Label className="text-sm font-medium">Name</Label>
            <Input
              placeholder="Enter Name"
              value={filters.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="border-gray-300"
            />
          </div>
          
          <div className="space-y-2">
            <Label className="text-sm font-medium">Email</Label>
            <Input
              type="email"
              placeholder="Enter Email"
              value={filters.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="border-gray-300"
            />
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button
              onClick={handleApply}
              className="bg-purple-700 hover:bg-purple-800 text-white flex-1"
            >
              Apply
            </Button>
            <Button
              onClick={handleReset}
              variant="outline"
              className="border-gray-300 flex-1"
            >
              Reset
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
