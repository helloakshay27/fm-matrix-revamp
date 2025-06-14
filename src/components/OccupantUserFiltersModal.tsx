
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';

interface OccupantUserFiltersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OccupantUserFiltersModal = ({ isOpen, onClose }: OccupantUserFiltersModalProps) => {
  const [filters, setFilters] = useState({
    name: '',
    email: '',
    mobileNumber: '',
    status: '',
    entity: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleApply = () => {
    console.log('Applied filters:', filters);
    onClose();
  };

  const handleReset = () => {
    setFilters({
      name: '',
      email: '',
      mobileNumber: '',
      status: '',
      entity: ''
    });
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
            <Label className="text-sm font-medium text-gray-600">Name</Label>
            <Input
              placeholder=""
              value={filters.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="border-gray-300"
            />
          </div>
          
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-600">Email</Label>
            <Input
              type="email"
              placeholder=""
              value={filters.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="border-gray-300"
            />
          </div>
          
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-600">Mobile Number</Label>
            <Input
              placeholder=""
              value={filters.mobileNumber}
              onChange={(e) => handleInputChange('mobileNumber', e.target.value)}
              className="border-gray-300"
            />
          </div>
          
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-600">Status</Label>
            <Select value={filters.status} onValueChange={(value) => handleInputChange('status', value)}>
              <SelectTrigger className="border-gray-300">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-600">Entity</Label>
            <Select value={filters.entity} onValueChange={(value) => handleInputChange('entity', value)}>
              <SelectTrigger className="border-gray-300">
                <SelectValue placeholder="Select Entity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="entity1">Entity 1</SelectItem>
                <SelectItem value="entity2">Entity 2</SelectItem>
                <SelectItem value="lockated-hq">Lockated HQ</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button
              onClick={handleReset}
              variant="outline"
              className="border-gray-300 flex-1"
            >
              Reset
            </Button>
            <Button
              onClick={handleApply}
              className="bg-purple-700 hover:bg-purple-800 text-white flex-1"
            >
              Apply
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
