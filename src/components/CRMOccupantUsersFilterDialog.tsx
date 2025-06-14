
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';

interface CRMOccupantUsersFilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CRMOccupantUsersFilterDialog = ({ open, onOpenChange }: CRMOccupantUsersFilterDialogProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleReset = () => {
    setSearchTerm('');
  };

  const handleApply = () => {
    console.log('Applying filter with search term:', searchTerm);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0">
        <DialogHeader className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-medium text-gray-900">FILTER BY</DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="px-6 py-4 space-y-4">
          {/* Search by Name or Email */}
          <div className="space-y-2">
            <Label htmlFor="searchTerm" className="text-sm font-medium text-gray-700">
              Search by Name or Email
            </Label>
            <Input
              id="searchTerm"
              placeholder="Search by Name or Email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200">
          <Button
            variant="outline"
            onClick={handleReset}
            className="px-6"
          >
            Reset
          </Button>
          <Button
            onClick={handleApply}
            className="bg-purple-700 hover:bg-purple-800 text-white px-6"
          >
            Apply
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
