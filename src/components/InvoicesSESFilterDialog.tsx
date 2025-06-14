
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";

interface InvoicesSESFilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApply: (filters: {
    invoiceNumber: string;
    invoiceDate: string;
    supplierName: string;
  }) => void;
}

export const InvoicesSESFilterDialog: React.FC<InvoicesSESFilterDialogProps> = ({
  open,
  onOpenChange,
  onApply,
}) => {
  const [filters, setFilters] = useState({
    invoiceNumber: '',
    invoiceDate: '',
    supplierName: ''
  });

  const handleApply = () => {
    console.log('Applying Invoices/SES filters:', filters);
    onApply(filters);
    onOpenChange(false);
  };

  const handleReset = () => {
    setFilters({
      invoiceNumber: '',
      invoiceDate: '',
      supplierName: ''
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
          <div className="text-sm font-medium text-orange-600 mb-3">
            Work Order Details
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-xs text-gray-600">Invoice Number</Label>
              <Input
                placeholder="Search By Invoice Number"
                value={filters.invoiceNumber}
                onChange={(e) => setFilters({ ...filters, invoiceNumber: e.target.value })}
                className="text-sm"
              />
            </div>
            
            <div>
              <Label className="text-xs text-gray-600">Invoice Date</Label>
              <Input
                placeholder="Search By Invoice Date"
                value={filters.invoiceDate}
                onChange={(e) => setFilters({ ...filters, invoiceDate: e.target.value })}
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
