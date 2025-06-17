
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TicketsFilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApply: (filters: any) => void;
}

export const TicketsFilterDialog: React.FC<TicketsFilterDialogProps> = ({
  open,
  onOpenChange,
  onApply,
}) => {
  const [filters, setFilters] = useState({
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

  const handleApply = () => {
    console.log('Applying Tickets filters:', filters);
    onApply(filters);
    onOpenChange(false);
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">FILTER BY</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* First Row */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Select Created Date</label>
              <Input
                type="date"
                placeholder="Select Created Date"
                value={filters.createdDate}
                onChange={(e) => setFilters({ ...filters, createdDate: e.target.value })}
                className="text-sm"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Select Category</label>
              <Select value={filters.category} onValueChange={(value) => setFilters({ ...filters, category: value })}>
                <SelectTrigger className="text-sm">
                  <SelectValue placeholder="Select Category Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fire-system">FIRE SYSTEM</SelectItem>
                  <SelectItem value="air-conditioner">Air Conditioner</SelectItem>
                  <SelectItem value="cleaning">Cleaning</SelectItem>
                  <SelectItem value="electrical">Electrical</SelectItem>
                  <SelectItem value="printer">Printer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Select Subcategory</label>
              <Select value={filters.subcategory} onValueChange={(value) => setFilters({ ...filters, subcategory: value })}>
                <SelectTrigger className="text-sm">
                  <SelectValue placeholder="Select SubCategory" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fire">fire</SelectItem>
                  <SelectItem value="dentry">dentry</SelectItem>
                  <SelectItem value="test">test</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Second Row */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Select Department</label>
              <Select value={filters.department} onValueChange={(value) => setFilters({ ...filters, department: value })}>
                <SelectTrigger className="text-sm">
                  <SelectValue placeholder="Select Department" />
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
              <label className="text-sm font-medium mb-2 block">Select Site</label>
              <Select value={filters.site} onValueChange={(value) => setFilters({ ...filters, site: value })}>
                <SelectTrigger className="text-sm">
                  <SelectValue placeholder="Select Site" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lockated">Lockated</SelectItem>
                  <SelectItem value="site-2">Site 2</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Select Unit</label>
              <Select value={filters.unit} onValueChange={(value) => setFilters({ ...filters, unit: value })}>
                <SelectTrigger className="text-sm">
                  <SelectValue placeholder="Select Unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unit-1">Unit 1</SelectItem>
                  <SelectItem value="unit-2">Unit 2</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Third Row */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Select Status</label>
              <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
                <SelectTrigger className="text-sm">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Select Admin Priority</label>
              <Select value={filters.adminPriority} onValueChange={(value) => setFilters({ ...filters, adminPriority: value })}>
                <SelectTrigger className="text-sm">
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

            <div>
              <label className="text-sm font-medium mb-2 block">Created By</label>
              <Input
                placeholder="Created by"
                value={filters.createdBy}
                onChange={(e) => setFilters({ ...filters, createdBy: e.target.value })}
                className="text-sm"
              />
            </div>
          </div>

          {/* Fourth Row */}
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Assigned To</label>
              <Input
                placeholder="Assigned To"
                value={filters.assignedTo}
                onChange={(e) => setFilters({ ...filters, assignedTo: e.target.value })}
                className="text-sm"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button 
            onClick={handleApply}
            style={{ backgroundColor: '#C72030' }}
            className="text-white hover:bg-[#C72030]/90 px-8"
          >
            Apply
          </Button>
          <Button 
            onClick={handleReset}
            variant="outline"
            className="px-8"
          >
            Reset
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
