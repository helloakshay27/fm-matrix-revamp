
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { X } from 'lucide-react';

interface AssociateServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AssociateServiceModal = ({ isOpen, onClose }: AssociateServiceModalProps) => {
  const [selectedAsset, setSelectedAsset] = useState('');

  const handleAssociate = () => {
    if (!selectedAsset) {
      alert('Please select an asset');
      return;
    }
    console.log('Associating service with asset:', selectedAsset);
    alert('Service associated successfully!');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold text-orange-500">
              Associate Services To Asset
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Asset</label>
            <Select onValueChange={setSelectedAsset}>
              <SelectTrigger>
                <SelectValue placeholder="Select Asset" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asset1">Asset 1 - Elevator</SelectItem>
                <SelectItem value="asset2">Asset 2 - HVAC Unit</SelectItem>
                <SelectItem value="asset3">Asset 3 - Fire System</SelectItem>
                <SelectItem value="asset4">Asset 4 - Security Camera</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end">
            <Button 
              onClick={handleAssociate}
              style={{ backgroundColor: '#C72030' }}
              className="text-white hover:bg-[#C72030]/90"
            >
              Associate Service
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
