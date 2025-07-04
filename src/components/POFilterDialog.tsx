
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface POFilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const POFilterDialog: React.FC<POFilterDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const [filters, setFilters] = useState({
    referenceNumber: '',
    poNumber: '',
    supplierName: ''
  });

  const handleApply = () => {
    console.log('Applying filters:', filters);
    onOpenChange(false);
  };

  const handleReset = () => {
    setFilters({
      referenceNumber: '',
      poNumber: '',
      supplierName: ''
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">FILTER BY</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
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
              <Label className="text-xs text-gray-600">PO Number</Label>
              <Input
                placeholder="Search By PO Number"
                value={filters.poNumber}
                onChange={(e) => setFilters({ ...filters, poNumber: e.target.value })}
                className="text-sm"
              />
            </div>
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
        </div>

        <div className="flex gap-3 pt-4">
          <Button 
            variant="secondary"
            onClick={handleApply}
            className="flex-1"
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
