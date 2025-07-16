import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter, X } from 'lucide-react';

interface AMCFilterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApplyFilters: (filters: any) => void;
}

export const AMCFilterModal: React.FC<AMCFilterModalProps> = ({ 
  open, 
  onOpenChange,
  onApplyFilters 
}) => {
  const [filters, setFilters] = useState({
    vendorName: '',
    status: '',
    costRange: { min: '', max: '' },
    dateRange: { start: '', end: '' }
  });

  const handleApply = () => {
    onApplyFilters(filters);
    onOpenChange(false);
  };

  const handleReset = () => {
    setFilters({
      vendorName: '',
      status: '',
      costRange: { min: '', max: '' },
      dateRange: { start: '', end: '' }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filter AMC Records
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="vendorName">Vendor Name</Label>
            <Input
              id="vendorName"
              value={filters.vendorName}
              onChange={(e) => setFilters({ ...filters, vendorName: e.target.value })}
              placeholder="Enter vendor name"
            />
          </div>
          
          <div>
            <Label htmlFor="status">Status</Label>
            <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Cost Range</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Min"
                value={filters.costRange.min}
                onChange={(e) => setFilters({ 
                  ...filters, 
                  costRange: { ...filters.costRange, min: e.target.value }
                })}
              />
              <Input
                placeholder="Max"
                value={filters.costRange.max}
                onChange={(e) => setFilters({ 
                  ...filters, 
                  costRange: { ...filters.costRange, max: e.target.value }
                })}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={handleReset}>
              Reset
            </Button>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button className="bg-[#C72030] text-white hover:bg-[#C72030]/90" onClick={handleApply}>
              Apply Filters
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};