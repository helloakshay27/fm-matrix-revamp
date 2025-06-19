
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Filter Invoices</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label>Invoice Number</Label>
            <Input 
              placeholder="Enter Invoice Number"
              value={filters.invoiceNumber}
              onChange={(e) => setFilters(prev => ({ ...prev, invoiceNumber: e.target.value }))}
            />
          </div>
          
          <div>
            <Label>Invoice Date</Label>
            <Input 
              type="date"
              value={filters.invoiceDate}
              onChange={(e) => setFilters(prev => ({ ...prev, invoiceDate: e.target.value }))}
            />
          </div>
          
          <div>
            <Label>Supplier Name</Label>
            <Input 
              placeholder="Enter Supplier Name"
              value={filters.supplierName}
              onChange={(e) => setFilters(prev => ({ ...prev, supplierName: e.target.value }))}
            />
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button 
              className="flex-1 bg-[#C72030] hover:bg-[#A01020] text-white"
              onClick={handleApply}
            >
              Apply Filter
            </Button>
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={handleReset}
            >
              Reset
            </Button>
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
