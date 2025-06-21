
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';

interface NonFTEFiltersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: any) => void;
}

export const NonFTEFiltersModal = ({ isOpen, onClose, onApplyFilters }: NonFTEFiltersModalProps) => {
  const [filters, setFilters] = useState({
    userName: '',
    email: '',
    department: '',
    circle: '',
    role: ''
  });

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleApply = () => {
    onApplyFilters(filters);
    onClose();
  };

  const handleReset = () => {
    setFilters({
      userName: '',
      email: '',
      department: '',
      circle: '',
      role: ''
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg bg-white">
        <DialogHeader className="flex flex-row items-center justify-between border-b pb-4">
          <DialogTitle className="text-lg font-semibold">FILTERS</DialogTitle>
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
          <div>
            <label className="block text-sm font-medium mb-2">User Name</label>
            <Input
              placeholder="Enter User Name"
              value={filters.userName}
              onChange={(e) => handleFilterChange('userName', e.target.value)}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <Input
              type="email"
              placeholder="Enter Email"
              value={filters.email}
              onChange={(e) => handleFilterChange('email', e.target.value)}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Department</label>
            <select
              value={filters.department}
              onChange={(e) => handleFilterChange('department', e.target.value)}
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
            >
              <option value="">-- Select Department --</option>
              <option value="FM">FM</option>
              <option value="Engineering">Engineering</option>
              <option value="Operations">Operations</option>
              <option value="Security">Security</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Circle</label>
            <select
              value={filters.circle}
              onChange={(e) => handleFilterChange('circle', e.target.value)}
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
            >
              <option value="">-- Select Circle --</option>
              <option value="north">North Circle</option>
              <option value="south">South Circle</option>
              <option value="east">East Circle</option>
              <option value="west">West Circle</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Role</label>
            <Input
              placeholder="Enter Role"
              value={filters.role}
              onChange={(e) => handleFilterChange('role', e.target.value)}
              className="w-full"
            />
          </div>
          
          <div className="flex justify-end gap-3 pt-4">
            <Button
              onClick={handleApply}
              className="text-white px-6"
              style={{ backgroundColor: '#C72030' }}
            >
              Apply
            </Button>
            <Button
              onClick={handleReset}
              variant="outline"
              className="px-6"
            >
              Reset
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
