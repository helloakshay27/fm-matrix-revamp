
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';

interface RVehicleFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RVehicleFilterModal = ({ isOpen, onClose }: RVehicleFilterModalProps) => {
  const [vehicleNumber, setVehicleNumber] = useState('');

  const handleApply = () => {
    console.log('Apply filter:', { vehicleNumber });
    // Handle filter application
    onClose();
  };

  const handleReset = () => {
    setVehicleNumber('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white [&>button]:hidden">
        <DialogHeader className="flex flex-row items-center justify-between border-b pb-4">
          <DialogTitle className="text-lg font-semibold">FILTER</DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <div className="p-6 space-y-6">
          {/* Vehicle Number Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Vehicle Number
            </label>
            <Input
              placeholder="Vehicle no."
              value={vehicleNumber}
              onChange={(e) => setVehicleNumber(e.target.value)}
              className="border-gray-300"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <Button
              onClick={handleReset}
              style={{ backgroundColor: '#F2EEE9', color: '#BF213E' }}
              className="text-[#BF213E] hover:bg-[#F2EEE9]/90 px-6 py-2"
            >
              Reset
            </Button>
            <Button
              onClick={handleApply}
              style={{ backgroundColor: '#F2EEE9', color: '#BF213E' }}
              className="text-[#BF213E] hover:bg-[#F2EEE9]/90 px-6 py-2"
            >
              Apply
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
