
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface MaterialPRFilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const MaterialPRFilterDialog: React.FC<MaterialPRFilterDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const [filters, setFilters] = useState({
    referenceNumber: '',
    prNumber: '',
    supplierName: '',
    approvalStatus: ''
  });

  const handleApply = () => {
    console.log('Applying filters:', filters);
    onOpenChange(false);
  };

  const handleReset = () => {
    setFilters({
      referenceNumber: '',
      prNumber: '',
      supplierName: '',
      approvalStatus: ''
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <DialogTitle className="text-lg font-semibold">FILTER BY</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700">
              PR Details
            </Label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs text-gray-600">Reference Number</Label>
                <Input
                  placeholder="Search By PR Number"
                  value={filters.referenceNumber}
                  onChange={(e) => setFilters({ ...filters, referenceNumber: e.target.value })}
                  className="text-sm"
                />
              </div>
              <div>
                <Label className="text-xs text-gray-600">PR Number</Label>
                <Input
                  placeholder="Enter Reference Number"
                  value={filters.prNumber}
                  onChange={(e) => setFilters({ ...filters, prNumber: e.target.value })}
                  className="text-sm"
                />
              </div>
              <div>
                <Label className="text-xs text-gray-600">Supplier Name</Label>
                <Input
                  placeholder="Supplier Name"
                  value={filters.supplierName}
                  onChange={(e) => setFilters({ ...filters, supplierName: e.target.value })}
                  className="text-sm"
                />
              </div>
              <div>
                <Label className="text-xs text-gray-600">Approval Status</Label>
                <Select
                  value={filters.approvalStatus}
                  onValueChange={(value) => setFilters({ ...filters, approvalStatus: value })}
                >
                  <SelectTrigger className="text-sm">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button 
            onClick={handleApply}
            className="flex-1 text-white"
            style={{ backgroundColor: '#C72030' }}
          >
            Apply
          </Button>
          <Button 
            onClick={handleReset}
            variant="outline"
            className="flex-1"
          >
            Reset
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
