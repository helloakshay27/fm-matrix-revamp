import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter, X } from 'lucide-react';

interface AttendanceFilterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApplyFilters: (filters: any) => void;
}

export const AttendanceFilterModal: React.FC<AttendanceFilterModalProps> = ({ 
  open, 
  onOpenChange,
  onApplyFilters 
}) => {
  const [filters, setFilters] = useState({
    name: '',
    department: '',
    dateRange: { start: '', end: '' }
  });

  const handleApply = () => {
    onApplyFilters(filters);
    onOpenChange(false);
  };

  const handleReset = () => {
    setFilters({
      name: '',
      department: '',
      dateRange: { start: '', end: '' }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filter Attendance Records
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Employee Name</Label>
            <Input
              id="name"
              value={filters.name}
              onChange={(e) => setFilters({ ...filters, name: e.target.value })}
              placeholder="Enter employee name"
            />
          </div>
          
          <div>
            <Label htmlFor="department">Department</Label>
            <Select value={filters.department} onValueChange={(value) => setFilters({ ...filters, department: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tech">Tech</SelectItem>
                <SelectItem value="operations">Operations</SelectItem>
                <SelectItem value="hr">HR</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Date Range</Label>
            <div className="flex gap-2">
              <Input
                type="date"
                value={filters.dateRange.start}
                onChange={(e) => setFilters({ 
                  ...filters, 
                  dateRange: { ...filters.dateRange, start: e.target.value }
                })}
              />
              <Input
                type="date"
                value={filters.dateRange.end}
                onChange={(e) => setFilters({ 
                  ...filters, 
                  dateRange: { ...filters.dateRange, end: e.target.value }
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