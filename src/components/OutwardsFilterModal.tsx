
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';

interface OutwardsFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OutwardsFilterModal = ({ isOpen, onClose }: OutwardsFilterModalProps) => {
  const [searchValue, setSearchValue] = useState('');

  const handleApply = () => {
    console.log('Applied filter with search:', searchValue);
    onClose();
  };

  const handleReset = () => {
    setSearchValue('');
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
        
        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="searchInput" className="text-sm font-medium">Search by Name or Id</Label>
            <Input
              id="searchInput"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="border-gray-300"
              placeholder="Search by Name or Id"
            />
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <Button
              onClick={handleApply}
              className="px-8 bg-[#8B4B8C] hover:bg-[#7A4077] text-white"
            >
              Apply
            </Button>
            <Button
              variant="outline"
              onClick={handleReset}
              className="px-8"
            >
              Reset
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
