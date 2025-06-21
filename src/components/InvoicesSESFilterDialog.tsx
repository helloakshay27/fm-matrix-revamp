
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
    console.log('Applying filters:', filters);
    onApply(filters);
    onOpenChange(false);
  };

  const handleReset = () => {
    console.log('Resetting filters...');
    setFilters({
      invoiceNumber: '',
      invoiceDate: '',
      supplierName: ''
    });
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between text-lg font-semibold">
            FILTER BY
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Work Order Details Section */}
          <div>
            <h3 className="text-orange-500 font-medium mb-4">Work Order Details</h3>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label className="text-sm font-medium text-gray-700">Invoice Number</Label>
                <Input 
                  placeholder="Search By Invoice Number"
                  value={filters.invoiceNumber}
                  onChange={(e) => setFilters(prev => ({ ...prev, invoiceNumber: e.target.value }))}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-700">Invoice Date</Label>
                <Input 
                  placeholder="Search By Invoice Date"
                  type="date"
                  value={filters.invoiceDate}
                  onChange={(e) => setFilters(prev => ({ ...prev, invoiceDate: e.target.value }))}
                  className="mt-1"
                />
              </div>
            </div>
            
            <div className="mt-6">
              <Label className="text-sm font-medium text-gray-700">Supplier Name</Label>
              <Input 
                placeholder="Supplier Name"
                value={filters.supplierName}
                onChange={(e) => setFilters(prev => ({ ...prev, supplierName: e.target.value }))}
                className="mt-1"
              />
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
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
        </div>
      </DialogContent>
    </Dialog>
  );
};
