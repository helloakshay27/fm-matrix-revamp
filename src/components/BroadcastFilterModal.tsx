
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';

interface BroadcastFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BroadcastFilterModal: React.FC<BroadcastFilterModalProps> = ({ isOpen, onClose }) => {
  const [filters, setFilters] = useState({
    communicationType: '',
    status: '',
    dateRange: ''
  });

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleApplyFilters = () => {
    console.log('Applied filters:', filters);
    onClose();
  };

  const handleResetFilters = () => {
    setFilters({
      communicationType: '',
      status: '',
      dateRange: ''
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white">
        <DialogHeader className="flex flex-row items-center justify-between border-b pb-4">
          <DialogTitle className="text-lg font-semibold">Filter</DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Communication Type */}
            <div className="space-y-2">
              <Label htmlFor="communicationType" className="text-sm font-medium">Communication Type</Label>
              <Select value={filters.communicationType} onValueChange={(value) => handleFilterChange('communicationType', value)}>
                <SelectTrigger className="border-gray-300">
                  <SelectValue placeholder="Select up to 15 Options..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="personal">Personal</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="announcement">Announcement</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="status" className="text-sm font-medium">Status</Label>
              <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
                <SelectTrigger className="border-gray-300">
                  <SelectValue placeholder="Select up to 15 Options..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Date Range */}
          <div className="space-y-2">
            <Label htmlFor="dateRange" className="text-sm font-medium">Date Range</Label>
            <Select value={filters.dateRange} onValueChange={(value) => handleFilterChange('dateRange', value)}>
              <SelectTrigger className="border-gray-300">
                <SelectValue placeholder="Select Date Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="yesterday">Yesterday</SelectItem>
                <SelectItem value="lastWeek">Last Week</SelectItem>
                <SelectItem value="lastMonth">Last Month</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              onClick={handleResetFilters}
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2"
            >
              Reset
            </Button>
            <Button
              onClick={handleApplyFilters}
              className="bg-purple-800 hover:bg-purple-900 text-white px-4 py-2"
            >
              Apply
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
