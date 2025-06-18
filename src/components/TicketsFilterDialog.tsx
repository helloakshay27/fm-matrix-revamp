
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';

interface FilterData {
  createdDate: string;
  category: string;
  subcategory: string;
  department: string;
  site: string;
  unit: string;
  status: string;
  adminPriority: string;
  createdBy: string;
  assignedTo: string;
}

interface TicketsFilterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: FilterData) => void;
}

export const TicketsFilterDialog = ({ isOpen, onClose, onApplyFilters }: TicketsFilterDialogProps) => {
  const [filters, setFilters] = useState<FilterData>({
    createdDate: '',
    category: '',
    subcategory: '',
    department: '',
    site: '',
    unit: '',
    status: '',
    adminPriority: '',
    createdBy: '',
    assignedTo: ''
  });

  const handleFilterChange = (key: keyof FilterData, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleReset = () => {
    setFilters({
      createdDate: '',
      category: '',
      subcategory: '',
      department: '',
      site: '',
      unit: '',
      status: '',
      adminPriority: '',
      createdBy: '',
      assignedTo: ''
    });
  };

  const handleApply = () => {
    onApplyFilters(filters);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-xl font-bold">FILTER BY</DialogTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-4 py-4">
          {/* Row 1 */}
          <div className="space-y-2">
            <Label>Select Created Date</Label>
            <Input
              type="date"
              value={filters.createdDate}
              onChange={(e) => handleFilterChange('createdDate', e.target.value)}
              placeholder="Select Created Date"
            />
          </div>

          <div className="space-y-2">
            <Label>Select Category</Label>
            <Select value={filters.category} onValueChange={(value) => handleFilterChange('category', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select Category Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="air-conditioner">Air Conditioner</SelectItem>
                <SelectItem value="fire-system">FIRE SYSTEM</SelectItem>
                <SelectItem value="cleaning">Cleaning</SelectItem>
                <SelectItem value="electrical">Electrical</SelectItem>
                <SelectItem value="printer">Printer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Select Subcategory</Label>
            <Select value={filters.subcategory} onValueChange={(value) => handleFilterChange('subcategory', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select SubCategory" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="test">test</SelectItem>
                <SelectItem value="na">NA</SelectItem>
                <SelectItem value="fire">fire</SelectItem>
                <SelectItem value="dentry">dentry</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Row 2 */}
          <div className="space-y-2">
            <Label>Select Department</Label>
            <Select value={filters.department} onValueChange={(value) => handleFilterChange('department', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="technician">Technician</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="facility">Facility</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Select Site</Label>
            <Select value={filters.site} onValueChange={(value) => handleFilterChange('site', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select Site" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lockated">Lockated</SelectItem>
                <SelectItem value="mumbai">Mumbai</SelectItem>
                <SelectItem value="pune">Pune</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Select Unit</Label>
            <Select value={filters.unit} onValueChange={(value) => handleFilterChange('unit', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select Unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unit1">Unit 1</SelectItem>
                <SelectItem value="unit2">Unit 2</SelectItem>
                <SelectItem value="unit3">Unit 3</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Row 3 */}
          <div className="space-y-2">
            <Label>Select Status</Label>
            <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Select Admin Priority</Label>
            <Select value={filters.adminPriority} onValueChange={(value) => handleFilterChange('adminPriority', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select Admin Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="p1">P1</SelectItem>
                <SelectItem value="p2">P2</SelectItem>
                <SelectItem value="p3">P3</SelectItem>
                <SelectItem value="p4">P4</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Created By</Label>
            <Input
              value={filters.createdBy}
              onChange={(e) => handleFilterChange('createdBy', e.target.value)}
              placeholder="Created by"
            />
          </div>

          {/* Row 4 */}
          <div className="space-y-2">
            <Label>Assigned To</Label>
            <Input
              value={filters.assignedTo}
              onChange={(e) => handleFilterChange('assignedTo', e.target.value)}
              placeholder="Assigned To"
            />
          </div>
        </div>

        <div className="flex justify-center gap-3 pt-4">
          <Button 
            onClick={handleApply}
            style={{ backgroundColor: '#C72030' }}
            className="text-white hover:bg-[#C72030]/90 px-8"
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
      </DialogContent>
    </Dialog>
  );
};
