
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface POFilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApplyFilters?: (filters: any) => void;
}

export const POFilterDialog: React.FC<POFilterDialogProps> = ({
  open,
  onOpenChange,
  onApplyFilters,
}) => {
  const [filters, setFilters] = useState({
    referenceNumber: '',
    poNumber: '',
    supplierName: '',
    status: '',
    dateFrom: '',
    dateTo: '',
    plantDetail: ''
  });

  const handleApply = () => {
    console.log('Applying filters:', filters);
    if (onApplyFilters) {
      onApplyFilters(filters);
    }
    onOpenChange(false);
  };

  const handleReset = () => {
    setFilters({
      referenceNumber: '',
      poNumber: '',
      supplierName: '',
      status: '',
      dateFrom: '',
      dateTo: '',
      plantDetail: ''
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-[#C72030]">FILTER BY</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">Reference Number</Label>
              <Input
                placeholder="Search By PR Number"
                value={filters.referenceNumber}
                onChange={(e) => setFilters({ ...filters, referenceNumber: e.target.value })}
                className="text-sm"
              />
            </div>
            
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">PO Number</Label>
              <Input
                placeholder="Search By PO Number"
                value={filters.poNumber}
                onChange={(e) => setFilters({ ...filters, poNumber: e.target.value })}
                className="text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">Supplier Name</Label>
              <Input
                placeholder="Supplier Name"
                value={filters.supplierName}
                onChange={(e) => setFilters({ ...filters, supplierName: e.target.value })}
                className="text-sm"
              />
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">Status</Label>
              <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">Date From</Label>
              <Input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                className="text-sm"
              />
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">Date To</Label>
              <Input
                type="date"
                value={filters.dateTo}
                onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                className="text-sm"
              />
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2 block">Plant Detail</Label>
            <Select value={filters.plantDetail} onValueChange={(value) => setFilters({ ...filters, plantDetail: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select Plant" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="plant1">Plant 1</SelectItem>
                <SelectItem value="plant2">Plant 2</SelectItem>
                <SelectItem value="plant3">Plant 3</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button 
            onClick={handleApply}
            className="flex-1 bg-[#C72030] hover:bg-[#A01020] text-white"
          >
            Apply
          </Button>
          <Button 
            variant="outline"
            onClick={handleReset}
            className="flex-1"
          >
            Reset
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
