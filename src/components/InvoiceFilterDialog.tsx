
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';

interface InvoiceFilterDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InvoiceFilterDialog = ({ isOpen, onClose }: InvoiceFilterDialogProps) => {
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [invoiceDate, setInvoiceDate] = useState('');
  const [supplierName, setSupplierName] = useState('');

  const handleApply = () => {
    console.log('Filter applied:', { invoiceNumber, invoiceDate, supplierName });
    onClose();
  };

  const handleReset = () => {
    setInvoiceNumber('');
    setInvoiceDate('');
    setSupplierName('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white rounded-[8px] sm:rounded-[8px]">
        <DialogHeader className="flex flex-row items-center justify-between border-b pb-4">
          <DialogTitle className="text-lg font-semibold">FILTER BY</DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <div className="p-6 space-y-6">
          <div className="text-orange-500 font-medium text-sm mb-4">Work Order Details</div>
          
          {/* Invoice Number */}
          <div className="space-y-2">
            <Label htmlFor="invoiceNumber" className="text-sm font-medium">
              Invoice Number
            </Label>
            <Input
              id="invoiceNumber"
              placeholder="Search By Invoice Number"
              value={invoiceNumber}
              onChange={(e) => setInvoiceNumber(e.target.value)}
              className="border-gray-300"
            />
          </div>

          {/* Invoice Date */}
          <div className="space-y-2">
            <Label htmlFor="invoiceDate" className="text-sm font-medium">
              Invoice Date
            </Label>
            <Input
              id="invoiceDate"
              type="date"
              value={invoiceDate}
              onChange={(e) => setInvoiceDate(e.target.value)}
              className="border-gray-300"
            />
          </div>

          {/* Supplier Name */}
          <div className="space-y-2">
            <Label htmlFor="supplierName" className="text-sm font-medium">
              Supplier Name
            </Label>
            <Input
              id="supplierName"
              placeholder="Supplier Name"
              value={supplierName}
              onChange={(e) => setSupplierName(e.target.value)}
              className="border-gray-300"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 items-center justify-end">
            <Button
              onClick={handleReset}
              variant="outline"
              className="h-[42px] sm:h-[42px] px-[22px] text-[13px] font-semibold rounded-[8px]"
            >
              Reset
            </Button>
            <Button
              onClick={handleApply}
              className="fm-action-primary"
            >
              Apply
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
