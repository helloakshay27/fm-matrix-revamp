
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';

interface OccupantUsersFilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const OccupantUsersFilterDialog = ({ open, onOpenChange }: OccupantUsersFilterDialogProps) => {
  const [filters, setFilters] = useState({
    name: '',
    email: '',
    mobileNumber: '',
    entity: '',
    status: ''
  });

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleReset = () => {
    setFilters({
      name: '',
      email: '',
      mobileNumber: '',
      entity: '',
      status: ''
    });
  };

  const handleApply = () => {
    console.log('Applying filters:', filters);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0">
        <DialogHeader className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-medium text-gray-900">FILTER</DialogTitle>
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
          <div className="grid grid-cols-2 gap-4">
            {/* Name */}
            <div>
              <Input
                label="Name"
                value={filters.name}
                onChange={(e) => handleFilterChange('name', e.target.value)}
                className="w-full"
              />
            </div>

            {/* Email */}
            <div>
              <Input
                label="Email"
                value={filters.email}
                onChange={(e) => handleFilterChange('email', e.target.value)}
                className="w-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Mobile Number */}
            <div>
              <Input
                label="Mobile Number"
                value={filters.mobileNumber}
                onChange={(e) => handleFilterChange('mobileNumber', e.target.value)}
                className="w-full"
              />
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Status
              </Label>
              <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
                <SelectTrigger className="w-full">
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
          </div>

          {/* Entity */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              Entity
            </Label>
            <Select value={filters.entity} onValueChange={(value) => handleFilterChange('entity', value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Entity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lookated-ho">Lookated HO</SelectItem>
                <SelectItem value="entity1">Entity 1</SelectItem>
                <SelectItem value="entity2">Entity 2</SelectItem>
              </SelectContent>
            </Select>
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
