
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";

interface GRNFilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApply: (filters: {
    inventoryName: string;
    supplierName: string;
    invoiceNumber: string;
  }) => void;
}

export const GRNFilterDialog: React.FC<GRNFilterDialogProps> = ({
  open,
  onOpenChange,
  onApply,
}) => {
  const [filters, setFilters] = useState({
    inventoryName: '',
    supplierName: '',
    invoiceNumber: ''
  });

  const handleApply = () => {
    console.log('Applying GRN filters:', filters);
    onApply(filters);
    onOpenChange(false);
  };

  const handleReset = () => {
    setFilters({
      inventoryName: '',
      supplierName: '',
      invoiceNumber: ''
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <DialogTitle className="text-lg font-semibold">FILTER BY</DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <div className="space-y-4">          
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label className="text-xs text-gray-600">Inventory Name</Label>
              <Input
                placeholder="Inventory Name"
                value={filters.inventoryName}
                onChange={(e) => setFilters({ ...filters, inventoryName: e.target.value })}
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
              <Label className="text-xs text-gray-600">Invoice Number</Label>
              <Input
                placeholder="Invoice Number"
                value={filters.invoiceNumber}
                onChange={(e) => setFilters({ ...filters, invoiceNumber: e.target.value })}
                className="text-sm"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button 
            onClick={handleApply}
            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
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
