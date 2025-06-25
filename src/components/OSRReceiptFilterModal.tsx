
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

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
    receiptDate: undefined as Date | undefined
  });

  const handleFilterChange = (field: string, value: string | Date | undefined) => {
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
      receiptDate: undefined as Date | undefined
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
      <DialogContent className="max-w-2xl w-full bg-white border border-gray-300 shadow-lg">
        <DialogHeader className="px-6 py-4 border-b border-gray-200">
          <DialogTitle className="text-lg font-semibold text-gray-900 text-left">Filter</DialogTitle>
          <DialogDescription className="sr-only">
            Filter receipts by tower, flat, invoice number, receipt number, and receipt date
          </DialogDescription>
        </DialogHeader>
        
        <div className="px-6 py-6">
          {/* Labels Row */}
          <div className="grid grid-cols-5 gap-4 mb-2">
            <Label htmlFor="tower" className="text-sm font-medium text-gray-700">Select Tower</Label>
            <Label htmlFor="flat" className="text-sm font-medium text-gray-700">Select Flat</Label>
            <Label htmlFor="invoiceNumber" className="text-sm font-medium text-gray-700">Invoice Number</Label>
            <Label htmlFor="receiptNumber" className="text-sm font-medium text-gray-700">Receipt Number</Label>
            <Label htmlFor="receiptDate" className="text-sm font-medium text-gray-700">Receipt Date</Label>
          </div>

          {/* Input Fields Row */}
          <div className="grid grid-cols-5 gap-4 mb-8">
            <Select onValueChange={(value) => handleFilterChange('tower', value)} value={filters.tower}>
              <SelectTrigger className="w-full h-10 border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm bg-white">
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200 shadow-lg z-[60]">
                <SelectItem value="tower-a">Tower A</SelectItem>
                <SelectItem value="tower-b">Tower B</SelectItem>
                <SelectItem value="tower-c">Tower C</SelectItem>
              </SelectContent>
            </Select>

            <Select onValueChange={(value) => handleFilterChange('flat', value)} value={filters.flat}>
              <SelectTrigger className="w-full h-10 border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm bg-white">
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200 shadow-lg z-[60]">
                <SelectItem value="flat-101">Flat 101</SelectItem>
                <SelectItem value="flat-102">Flat 102</SelectItem>
                <SelectItem value="flat-103">Flat 103</SelectItem>
              </SelectContent>
            </Select>

            <Input
              id="invoiceNumber"
              placeholder="Invoice"
              value={filters.invoiceNumber}
              onChange={(e) => handleFilterChange('invoiceNumber', e.target.value)}
              className="w-full h-10 border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder-gray-400 text-sm bg-white"
            />

            <Input
              id="receiptNumber"
              placeholder="Receipt"
              value={filters.receiptNumber}
              onChange={(e) => handleFilterChange('receiptNumber', e.target.value)}
              className="w-full h-10 border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder-gray-400 text-sm bg-white"
            />

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full h-10 justify-start text-left font-normal border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white hover:bg-gray-50",
                    !filters.receiptDate && "text-gray-400"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filters.receiptDate ? format(filters.receiptDate, "MM/dd/yyyy") : "mm/dd/yyyy"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={filters.receiptDate}
                  onSelect={(date) => handleFilterChange('receiptDate', date)}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4">
            <Button 
              onClick={handleApply}
              className="bg-[#C72030] hover:bg-[#C72030]/90 text-white px-8 py-2 h-10 text-sm font-medium min-w-[80px] rounded-sm"
            >
              Apply
            </Button>
            <Button 
              onClick={handleReset}
              className="bg-[#C72030] hover:bg-[#C72030]/90 text-white px-8 py-2 h-10 text-sm font-medium min-w-[80px] rounded-sm"
            >
              Reset
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
