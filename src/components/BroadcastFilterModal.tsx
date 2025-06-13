
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';

interface BroadcastFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BroadcastFilterModal: React.FC<BroadcastFilterModalProps> = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader className="flex flex-row items-center justify-between pb-4">
          <DialogTitle>Filter</DialogTitle>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-4 w-4" />
          </button>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium">Communication Type</Label>
            <Input 
              placeholder="Select up to 15 Options..."
              className="mt-1"
            />
          </div>
          
          <div>
            <Label className="text-sm font-medium">Status</Label>
            <Input 
              placeholder="Select up to 15 Options..."
              className="mt-1"
            />
          </div>
          
          <div>
            <Label className="text-sm font-medium">Date Range</Label>
            <Input 
              placeholder="Select Date Range"
              className="mt-1"
            />
          </div>
        </div>
        
        <div className="flex justify-center space-x-3 mt-6">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="px-8"
          >
            Reset
          </Button>
          <Button 
            onClick={onClose}
            className="bg-purple-700 hover:bg-purple-800 text-white px-8"
          >
            Apply
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
