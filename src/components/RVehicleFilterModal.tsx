
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';

interface RVehicleFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RVehicleFilterModal = ({ isOpen, onClose }: RVehicleFilterModalProps) => {
  const [vehicleNumber, setVehicleNumber] = useState('');

  const handleApply = () => {
    console.log('Filter applied:', { vehicleNumber });
    onClose();
  };

  const handleReset = () => {
    setVehicleNumber('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg bg-white [&>button]:hidden">
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
          {/* Vehicle Number */}
          <div className="space-y-2">
            <Label htmlFor="vehicleNumber" className="text-sm font-medium">
              Vehicle Number
            </Label>
            <Input
              id="vehicleNumber"
              placeholder="Vehicle no."
              value={vehicleNumber}
              onChange={(e) => setVehicleNumber(e.target.value)}
              className="border-gray-300"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              onClick={handleReset}
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-2"
            >
              Reset
            </Button>
            <Button
              onClick={handleApply}
              style={{ backgroundColor: '#C72030' }}
              className="hover:bg-[#C72030]/90 text-white px-6 py-2"
            >
              Apply
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
