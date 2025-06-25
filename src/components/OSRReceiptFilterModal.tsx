
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
      <DialogContent className="max-w-4xl w-full p-0 bg-white border border-gray-300 shadow-lg">
        <DialogHeader className="px-6 py-4 border-b border-gray-200 bg-white">
          <DialogTitle className="text-lg font-medium text-gray-900 text-left">Filter</DialogTitle>
          <DialogDescription className="sr-only">
            Filter receipts by tower, flat, invoice number, receipt number, and receipt date
          </DialogDescription>
        </DialogHeader>
        
        <div className="p-6 bg-white">
          {/* Horizontal filter layout */}
          <div className="flex items-center gap-4">
            {/* Select Tower */}
            <div className="min-w-[140px]">
              <Select onValueChange={(value) => handleFilterChange('tower', value)} value={filters.tower}>
                <SelectTrigger className="h-10 border border-gray-300 bg-white text-sm">
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-lg z-[60]">
                  <SelectItem value="tower-a">Tower A</SelectItem>
                  <SelectItem value="tower-b">Tower B</SelectItem>
                  <SelectItem value="tower-c">Tower C</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Select Flat */}
            <div className="min-w-[140px]">
              <Select onValueChange={(value) => handleFilterChange('flat', value)} value={filters.flat}>
                <SelectTrigger className="h-10 border border-gray-300 bg-white text-sm">
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-lg z-[60]">
                  <SelectItem value="flat-101">Flat 101</SelectItem>
                  <SelectItem value="flat-102">Flat 102</SelectItem>
                  <SelectItem value="flat-103">Flat 103</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Invoice Number */}
            <div className="min-w-[120px]">
              <Input
                placeholder=""
                value={filters.invoiceNumber}
                onChange={(e) => handleFilterChange('invoiceNumber', e.target.value)}
                className="h-10 border border-gray-300 bg-white text-sm"
              />
            </div>

            {/* Receipt Number */}
            <div className="min-w-[120px]">
              <Input
                placeholder=""
                value={filters.receiptNumber}
                onChange={(e) => handleFilterChange('receiptNumber', e.target.value)}
                className="h-10 border border-gray-300 bg-white text-sm"
              />
            </div>

            {/* Receipt Date */}
            <div className="min-w-[140px] relative">
              <Input
                type="date"
                placeholder="mm/dd/yyyy"
                value={filters.receiptDate}
                onChange={(e) => handleFilterChange('receiptDate', e.target.value)}
                className="h-10 border border-gray-300 bg-white text-sm"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 ml-4">
              <Button 
                onClick={handleApply}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 h-10 text-sm font-medium rounded"
              >
                Apply
              </Button>
              <Button 
                onClick={handleReset}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 h-10 text-sm font-medium rounded"
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
