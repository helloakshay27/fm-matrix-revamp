
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface CampaignFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: any) => void;
  onReset: () => void;
}

export const CampaignFilterModal = ({ isOpen, onClose, onApply, onReset }: CampaignFilterModalProps) => {
  const [filters, setFilters] = useState({
    referredBy: '',
    status: '',
    createdOn: undefined as Date | undefined
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
      referredBy: '',
      status: '',
      createdOn: undefined as Date | undefined
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
      <DialogContent className="max-w-4xl w-full bg-white border border-gray-300 shadow-lg">
        <DialogHeader className="px-6 py-4 border-b border-gray-200">
          <DialogTitle className="text-lg font-semibold text-gray-900 text-left">Filter</DialogTitle>
          <DialogDescription className="sr-only">
            Filter campaigns by referred by, status, and created date
          </DialogDescription>
        </DialogHeader>
        
        <div className="px-6 py-6">
          {/* Single Row with 3 Filter Fields */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Referred by</label>
              <Select onValueChange={(value) => handleFilterChange('referredBy', value)} value={filters.referredBy}>
                <SelectTrigger className="w-full h-12 border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm bg-white">
                  <SelectValue placeholder="Referred by" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-lg z-[60]">
                  <SelectItem value="deepak-gupta">Deepak Gupta</SelectItem>
                  <SelectItem value="godrej-living">Godrej Living</SelectItem>
                  <SelectItem value="kshitij-rasal">Kshitij Rasal</SelectItem>
                  <SelectItem value="samay-seth">Samay Seth</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Select Status</label>
              <Select onValueChange={(value) => handleFilterChange('status', value)} value={filters.status}>
                <SelectTrigger className="w-full h-12 border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm bg-white">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-lg z-[60]">
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="hot">Hot</SelectItem>
                  <SelectItem value="cold">Cold</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Created on</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full h-12 justify-start text-left font-normal border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white hover:bg-gray-50",
                      !filters.createdOn && "text-gray-500"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.createdOn ? format(filters.createdOn, "dd/MM/yyyy") : "Created on"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={filters.createdOn}
                    onSelect={(date) => handleFilterChange('createdOn', date)}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4">
            <Button 
              onClick={handleReset}
              variant="outline"
              className="px-8 py-2 h-10 text-sm font-medium min-w-[80px] rounded-sm border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Reset
            </Button>
            <Button 
              onClick={handleApply}
              className="bg-[#C72030] hover:bg-[#C72030]/90 text-white px-8 py-2 h-10 text-sm font-medium min-w-[80px] rounded-sm"
            >
              Apply
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
