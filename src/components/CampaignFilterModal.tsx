
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md w-full bg-white border border-gray-300 shadow-lg">
        <DialogHeader className="px-6 py-4 border-b border-gray-200">
          <DialogTitle className="text-lg font-semibold text-gray-900 text-left">Filter</DialogTitle>
          <DialogDescription className="sr-only">
            Filter campaigns by referred by, status, and created date
          </DialogDescription>
        </DialogHeader>
        
        <div className="px-6 py-6">
          <div className="space-y-4 mb-6">
            <div className="w-full">
              <Select onValueChange={(value) => handleFilterChange('referredBy', value)} value={filters.referredBy}>
                <SelectTrigger className="w-full h-10 border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm bg-white">
                  <SelectValue placeholder="Referre..." />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-lg z-[60]">
                  <SelectItem value="deepak-gupta">Deepak Gupta</SelectItem>
                  <SelectItem value="godrej-living">Godrej Living</SelectItem>
                  <SelectItem value="kshitij-rasal">Kshitij Rasal</SelectItem>
                  <SelectItem value="samay-seth">Samay Seth</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="w-full">
              <Select onValueChange={(value) => handleFilterChange('status', value)} value={filters.status}>
                <SelectTrigger className="w-full h-10 border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm bg-white">
                  <SelectValue placeholder="Selec..." />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-lg z-[60]">
                  <SelectItem value="hot">Hot</SelectItem>
                  <SelectItem value="warm">Warm</SelectItem>
                  <SelectItem value="cold">Cold</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="w-full">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full h-10 justify-start text-left font-normal border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white hover:bg-gray-50",
                      !filters.createdOn && "text-gray-400"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.createdOn ? format(filters.createdOn, "MM/dd/yyyy") : "Created on"}
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

          <div className="flex gap-2 justify-center">
            <Button 
              onClick={handleApply}
              className="bg-[#C72030] hover:bg-[#C72030]/90 text-white px-8 py-2 h-10 text-sm font-medium"
            >
              Apply
            </Button>
            <Button 
              onClick={handleReset}
              className="bg-[#C72030] hover:bg-[#C72030]/90 text-white px-8 py-2 h-10 text-sm font-medium"
            >
              Reset
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
