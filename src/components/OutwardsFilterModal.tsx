
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';

interface OutwardsFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OutwardsFilterModal = ({ isOpen, onClose }: OutwardsFilterModalProps) => {
  const [filters, setFilters] = useState({
    type: '',
    returnableNonReturnable: '',
    category: '',
    modeOfTransport: '',
    dateFrom: '',
    dateTo: '',
    personName: '',
    tripId: '',
    expectedReturnDate: ''
  });

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleApplyFilters = () => {
    console.log('Applied filters:', filters);
    onClose();
  };

  const handleClearFilters = () => {
    setFilters({
      type: '',
      returnableNonReturnable: '',
      category: '',
      modeOfTransport: '',
      dateFrom: '',
      dateTo: '',
      personName: '',
      tripId: '',
      expectedReturnDate: ''
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between border-b pb-4">
          <DialogTitle className="text-lg font-semibold">Filters</DialogTitle>
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
            <Label htmlFor="type" className="text-sm font-medium">Type</Label>
            <Select value={filters.type} onValueChange={(value) => handleFilterChange('type', value)}>
              <SelectTrigger className="border-gray-300">
                <SelectValue placeholder="Select Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="faulty">Faulty</SelectItem>
                <SelectItem value="fresh">Fresh</SelectItem>
                <SelectItem value="rsr">RS&R</SelectItem>
                <SelectItem value="srn">SRN</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="returnableNonReturnable" className="text-sm font-medium">Returnable/Non Returnable</Label>
            <Select value={filters.returnableNonReturnable} onValueChange={(value) => handleFilterChange('returnableNonReturnable', value)}>
              <SelectTrigger className="border-gray-300">
                <SelectValue placeholder="Select Option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="returnable">Returnable</SelectItem>
                <SelectItem value="non-returnable">Non Returnable</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="expectedReturnDate" className="text-sm font-medium">Expected Return Date</Label>
            <Input
              id="expectedReturnDate"
              type="date"
              value={filters.expectedReturnDate}
              onChange={(e) => handleFilterChange('expectedReturnDate', e.target.value)}
              className="border-gray-300"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category" className="text-sm font-medium">Category</Label>
            <Select value={filters.category} onValueChange={(value) => handleFilterChange('category', value)}>
              <SelectTrigger className="border-gray-300">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="staff">Staff</SelectItem>
                <SelectItem value="vendor">Vendor</SelectItem>
                <SelectItem value="visitor">Visitor</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="modeOfTransport" className="text-sm font-medium">Mode of Transport</Label>
            <Select value={filters.modeOfTransport} onValueChange={(value) => handleFilterChange('modeOfTransport', value)}>
              <SelectTrigger className="border-gray-300">
                <SelectValue placeholder="Select Mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="by-vehicle">By Vehicle</SelectItem>
                <SelectItem value="by-courier">By Courier</SelectItem>
                <SelectItem value="by-hand">By Hand</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dateFrom" className="text-sm font-medium">Date From</Label>
              <Input
                id="dateFrom"
                type="date"
                value={filters.dateFrom}
                onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                className="border-gray-300"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateTo" className="text-sm font-medium">Date To</Label>
              <Input
                id="dateTo"
                type="date"
                value={filters.dateTo}
                onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                className="border-gray-300"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="personName" className="text-sm font-medium">Person Name</Label>
            <Input
              id="personName"
              value={filters.personName}
              onChange={(e) => handleFilterChange('personName', e.target.value)}
              className="border-gray-300"
              placeholder="Enter person name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tripId" className="text-sm font-medium">Trip ID</Label>
            <Input
              id="tripId"
              value={filters.tripId}
              onChange={(e) => handleFilterChange('tripId', e.target.value)}
              className="border-gray-300"
              placeholder="Enter trip ID"
            />
          </div>

          <div className="flex justify-between gap-4 pt-4">
            <Button
              variant="outline"
              onClick={handleClearFilters}
              className="flex-1"
            >
              Clear
            </Button>
            <Button
              onClick={handleApplyFilters}
              className="flex-1 bg-[#8B4B8C] hover:bg-[#7A4077] text-white"
            >
              Apply
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
