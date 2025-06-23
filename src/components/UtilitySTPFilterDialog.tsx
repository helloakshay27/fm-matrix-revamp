
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';

interface UtilitySTPFilterDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UtilitySTPFilterDialog = ({ isOpen, onClose }: UtilitySTPFilterDialogProps) => {
  const [assetName, setAssetName] = useState('');
  const [assetCode, setAssetCode] = useState('');
  const [site, setSite] = useState('');
  const [building, setBuilding] = useState('');

  const handleApply = () => {
    console.log('Filter applied:', { assetName, assetCode, site, building });
    onClose();
  };

  const handleReset = () => {
    setAssetName('');
    setAssetCode('');
    setSite('');
    setBuilding('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white">
        <DialogHeader className="flex flex-row items-center justify-between border-b pb-4">
          <DialogTitle className="text-lg font-semibold">FILTER BY</DialogTitle>
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
          <div className="text-orange-500 font-medium text-sm mb-4">STP Asset Details</div>
          
          {/* Asset Name */}
          <div className="space-y-2">
            <Label htmlFor="assetName" className="text-sm font-medium">
              Asset Name
            </Label>
            <Input
              id="assetName"
              placeholder="Search By Asset Name"
              value={assetName}
              onChange={(e) => setAssetName(e.target.value)}
              className="border-gray-300"
            />
          </div>

          {/* Asset Code */}
          <div className="space-y-2">
            <Label htmlFor="assetCode" className="text-sm font-medium">
              Asset Code
            </Label>
            <Input
              id="assetCode"
              placeholder="Search By Asset Code"
              value={assetCode}
              onChange={(e) => setAssetCode(e.target.value)}
              className="border-gray-300"
            />
          </div>

          {/* Site */}
          <div className="space-y-2">
            <Label htmlFor="site" className="text-sm font-medium">
              Site
            </Label>
            <Input
              id="site"
              placeholder="Search By Site"
              value={site}
              onChange={(e) => setSite(e.target.value)}
              className="border-gray-300"
            />
          </div>

          {/* Building */}
          <div className="space-y-2">
            <Label htmlFor="building" className="text-sm font-medium">
              Building
            </Label>
            <Input
              id="building"
              placeholder="Search By Building"
              value={building}
              onChange={(e) => setBuilding(e.target.value)}
              className="border-gray-300"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-3 pt-4">
            <Button
              onClick={handleReset}
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-2"
            >
              Reset
            </Button>
            <Button
              onClick={handleApply}
              className="bg-[#8B4B8C] hover:bg-[#7A4077] text-white px-6 py-2"
            >
              Apply
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
