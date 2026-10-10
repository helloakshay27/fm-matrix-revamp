
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
      <DialogContent className="max-w-lg bg-white [&>button]:hidden max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <DialogTitle className="text-lg font-semibold text-gray-900">FILTER BY</DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-6 w-6 p-0 hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
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
              className="h-11 rounded-lg border-gray-200"
            />
          </div>

          {/* Work Type */}
          <div className="space-y-2">
            <Label htmlFor="workType" className="text-sm font-medium">
              Work type
            </Label>
            <Select value={workType} onValueChange={setWorkType}>
              <SelectTrigger className="h-11 rounded-lg border-gray-200">
                <SelectValue placeholder="Select Work Type" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200 shadow-lg z-50 rounded-lg">
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
              <SelectTrigger className="h-11 rounded-lg border-gray-200">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200 shadow-lg z-50 rounded-lg">
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-2 pt-6">
            <Button
              onClick={handleReset}
              variant="outline"
              className="h-11 px-8 border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
            >
              Reset
            </Button>
            <Button
              onClick={handleApply}
              className="h-11 px-8 bg-[#1A1A18] text-white hover:bg-black"
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
