
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
      <DialogContent className="max-w-4xl p-0 bg-white border border-gray-300 shadow-lg">
        <DialogHeader className="p-4 border-b border-gray-200">
          <DialogTitle className="text-lg font-semibold text-gray-900">Filter</DialogTitle>
          <DialogDescription className="sr-only">
            Filter receipts by tower, flat, invoice number, receipt number, and receipt date
          </DialogDescription>
        </DialogHeader>
        
        <div className="p-6">
          <div className="grid grid-cols-5 gap-4 mb-6">
            <div className="space-y-2">
              <Label htmlFor="tower" className="text-sm font-medium text-gray-700">Select Tower</Label>
              <Select onValueChange={(value) => handleFilterChange('tower', value)} value={filters.tower}>
                <SelectTrigger className="w-full border-gray-300 focus:border-[#C72030] focus:ring-[#C72030]">
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
                  <SelectItem value="tower-a">Tower A</SelectItem>
                  <SelectItem value="tower-b">Tower B</SelectItem>
                  <SelectItem value="tower-c">Tower C</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="flat" className="text-sm font-medium text-gray-700">Select Flat</Label>
              <Select onValueChange={(value) => handleFilterChange('flat', value)} value={filters.flat}>
                <SelectTrigger className="w-full border-gray-300 focus:border-[#C72030] focus:ring-[#C72030]">
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
                  <SelectItem value="flat-101">Flat 101</SelectItem>
                  <SelectItem value="flat-102">Flat 102</SelectItem>
                  <SelectItem value="flat-103">Flat 103</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="invoiceNumber" className="text-sm font-medium text-gray-700">Invoice Number</Label>
              <Input
                id="invoiceNumber"
                placeholder="Invoice Number"
                value={filters.invoiceNumber}
                onChange={(e) => handleFilterChange('invoiceNumber', e.target.value)}
                className="w-full border-gray-300 focus:border-[#C72030] focus:ring-[#C72030] placeholder-gray-400"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="receiptNumber" className="text-sm font-medium text-gray-700">Receipt Number</Label>
              <Input
                id="receiptNumber"
                placeholder="Receipt Number"
                value={filters.receiptNumber}
                onChange={(e) => handleFilterChange('receiptNumber', e.target.value)}
                className="w-full border-gray-300 focus:border-[#C72030] focus:ring-[#C72030] placeholder-gray-400"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="receiptDate" className="text-sm font-medium text-gray-700">Receipt Date</Label>
              <div className="relative">
                <Input
                  id="receiptDate"
                  type="date"
                  placeholder="Receipt Date"
                  value={filters.receiptDate}
                  onChange={(e) => handleFilterChange('receiptDate', e.target.value)}
                  className="w-full border-gray-300 focus:border-[#C72030] focus:ring-[#C72030] pr-10"
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-4 pt-4 border-t border-gray-200">
            <Button 
              onClick={handleApply}
              className="bg-[#C72030] hover:bg-[#C72030]/90 text-white px-8 py-2 font-medium"
            >
              Apply
            </Button>
            <Button 
              onClick={handleReset}
              className="bg-[#C72030] hover:bg-[#C72030]/90 text-white px-8 py-2 font-medium"
            >
              Reset
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
