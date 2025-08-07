
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">FILTER</DialogTitle>
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
              className="border-gray-300 rounded-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              onClick={handleReset}
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-2 rounded-none"
            >
              Reset
            </Button>
            <Button
              onClick={handleApply}
              style={{ backgroundColor: '#F2EEE9', color: '#BF213E' }}
              className="hover:bg-[#F2EEE9]/90 px-6 py-2 rounded-none"
            >
              Apply
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
