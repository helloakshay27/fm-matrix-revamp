
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';

interface StaffsFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StaffsFilterModal = ({ isOpen, onClose }: StaffsFilterModalProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [workType, setWorkType] = useState('');
  const [status, setStatus] = useState('');

  const handleApply = () => {
    console.log('Filter applied:', { searchQuery, workType, status });
    onClose();
  };

  const handleReset = () => {
    setSearchQuery('');
    setWorkType('');
    setStatus('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white [&>button]:hidden rounded-none">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <DialogTitle className="text-lg font-semibold">FILTER</DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-6 w-6 p-0 rounded-none"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </DialogHeader>
        
        <div className="p-6 space-y-4">
          {/* Search by Name, Mobile or Staff Id */}
          <div className="space-y-2">
            <Label htmlFor="searchQuery" className="text-sm font-medium">
              Search by Name, Mobile or Staff Id
            </Label>
            <Input
              id="searchQuery"
              placeholder="Search by Name, Mobile or Staff Id"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-gray-300 rounded-none"
            />
          </div>

          {/* Work Type */}
          <div className="space-y-2">
            <Label htmlFor="workType" className="text-sm font-medium">
              Work type
            </Label>
            <Select value={workType} onValueChange={setWorkType}>
              <SelectTrigger className="border-gray-300 rounded-none">
                <SelectValue placeholder="Select Work Type" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200 shadow-lg z-50 rounded-none">
                <SelectItem value="other">Other</SelectItem>
                <SelectItem value="vendor">Vendor</SelectItem>
                <SelectItem value="contractor">Contractor</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status" className="text-sm font-medium">
              Status
            </Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="border-gray-300 rounded-none">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200 shadow-lg z-50 rounded-none">
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
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
              style={{ backgroundColor: '#C72030' }}
              className="hover:bg-[#C72030]/90 text-white px-6 py-2 rounded-none"
            >
              Apply
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
