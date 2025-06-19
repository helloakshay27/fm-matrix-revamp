
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';

interface GatePassInwardsFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GatePassInwardsFilterModal = ({ isOpen, onClose }: GatePassInwardsFilterModalProps) => {
  const [searchByNameOrId, setSearchByNameOrId] = useState('');

  const handleApply = () => {
    console.log('Filter applied:', { searchByNameOrId });
    // Here you would implement the actual filter logic
    onClose();
  };

  const handleReset = () => {
    setSearchByNameOrId('');
    console.log('Filters reset');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white">
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
          {/* Search by Name or Id */}
          <div className="space-y-2">
            <Label htmlFor="searchByNameOrId" className="text-sm font-medium">
              Search by Name or Id
            </Label>
            <Input
              id="searchByNameOrId"
              placeholder="Search by Name or Id"
              value={searchByNameOrId}
              onChange={(e) => setSearchByNameOrId(e.target.value)}
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
