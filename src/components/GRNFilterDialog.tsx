
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";

interface GRNFilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const GRNFilterDialog: React.FC<GRNFilterDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const [filters, setFilters] = useState({
    inventoryName: '',
    supplierName: '',
    invoiceNumber: ''
  });

  const handleApply = () => {
    console.log('Applying filters:', filters);
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
      <DialogContent className="max-w-4xl bg-white">
        <DialogHeader className="flex flex-row items-center justify-between border-b pb-4">
          <DialogTitle className="text-lg font-semibold">FILTER BY</DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
            className="h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Label className="text-sm font-medium mb-2 block">Inventory Name</Label>
              <Input
                placeholder="Inventory Name"
                value={filters.inventoryName}
                onChange={(e) => setFilters({...filters, inventoryName: e.target.value})}
              />
            </div>
            
            <div>
              <Label className="text-sm font-medium mb-2 block">Supplier Name</Label>
              <Input
                placeholder="Supplier Name"
                value={filters.supplierName}
                onChange={(e) => setFilters({...filters, supplierName: e.target.value})}
              />
            </div>
            
            <div>
              <Label className="text-sm font-medium mb-2 block">Invoice Number</Label>
              <Input
                placeholder="Invoice Number"
                value={filters.invoiceNumber}
                onChange={(e) => setFilters({...filters, invoiceNumber: e.target.value})}
              />
            </div>
          </div>
          
          <div className="flex gap-3 justify-end pt-4">
            <Button
              onClick={handleApply}
              className="bg-[#C72030] hover:bg-[#A01020] text-white px-8"
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
        </div>
      </DialogContent>
    </Dialog>
  );
};
