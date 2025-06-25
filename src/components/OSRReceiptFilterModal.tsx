
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Calendar } from 'lucide-react';

interface OSRReceiptFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: any) => void;
  onReset: () => void;  
}

export const OSRReceiptFilterModal = ({ isOpen, onClose, onApply, onReset }: OSRReceiptFilterModalProps) => {
  const [filters, setFilters] = useState({
    tower: '',
    flat: '',
    invoiceNumber: '',
    receiptNumber: '',
    receiptDate: ''
  });

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleApply = () => {
    console.log('Apply filters clicked with data:', filters);
    onApply(filters);
    onClose();
  };

  const handleReset = () => {
    console.log('Reset filters clicked');
    const resetFilters = {
      tower: '',
      flat: '',
      invoiceNumber: '',
      receiptNumber: '',
      receiptDate: ''
    };
    setFilters(resetFilters);
    onReset();
  };

  const handleClose = () => {
    console.log('Filter dialog closed');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-5xl w-full p-0 bg-white border border-gray-300 shadow-lg">
        <DialogHeader className="px-6 py-3 border-b border-gray-200 bg-gray-50">
          <DialogTitle className="text-sm font-medium text-gray-900 text-left">Filter</DialogTitle>
          <DialogDescription className="sr-only">
            Filter receipts by tower, flat, invoice number, receipt number, and receipt date
          </DialogDescription>
        </DialogHeader>
        
        <div className="p-4">
          {/* Horizontal filter layout */}
          <div className="flex items-center gap-4">
            {/* Select Tower */}
            <div className="flex-1">
              <Select onValueChange={(value) => handleFilterChange('tower', value)} value={filters.tower}>
                <SelectTrigger className="h-9 border border-gray-300 bg-white text-sm">
                  <SelectValue placeholder="Select Tower" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-lg z-[60]">
                  <SelectItem value="tower-a">Tower A</SelectItem>
                  <SelectItem value="tower-b">Tower B</SelectItem>
                  <SelectItem value="tower-c">Tower C</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Select Flat */}
            <div className="flex-1">
              <Select onValueChange={(value) => handleFilterChange('flat', value)} value={filters.flat}>
                <SelectTrigger className="h-9 border border-gray-300 bg-white text-sm">
                  <SelectValue placeholder="Select flat" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-lg z-[60]">
                  <SelectItem value="flat-101">Flat 101</SelectItem>
                  <SelectItem value="flat-102">Flat 102</SelectItem>
                  <SelectItem value="flat-103">Flat 103</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Invoice Number */}
            <div className="flex-1">
              <Input
                placeholder="Invoice Number"
                value={filters.invoiceNumber}
                onChange={(e) => handleFilterChange('invoiceNumber', e.target.value)}
                className="h-9 border border-gray-300 bg-white text-sm"
              />
            </div>

            {/* Receipt Number */}
            <div className="flex-1">
              <Input
                placeholder="Receipt Number"
                value={filters.receiptNumber}
                onChange={(e) => handleFilterChange('receiptNumber', e.target.value)}
                className="h-9 border border-gray-300 bg-white text-sm"
              />
            </div>

            {/* Receipt Date */}
            <div className="flex-1 relative">
              <Input
                type="date"
                placeholder="Receipt Date"
                value={filters.receiptDate}
                onChange={(e) => handleFilterChange('receiptDate', e.target.value)}
                className="h-9 border border-gray-300 bg-white pr-10 text-sm"
              />
              <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button 
                onClick={handleApply}
                className="bg-[#2563EB] hover:bg-[#2563EB]/90 text-white px-6 py-1 h-9 text-sm font-medium"
              >
                Apply
              </Button>
              <Button 
                onClick={handleReset}
                className="bg-[#2563EB] hover:bg-[#2563EB]/90 text-white px-6 py-1 h-9 text-sm font-medium"
              >
                Reset
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
