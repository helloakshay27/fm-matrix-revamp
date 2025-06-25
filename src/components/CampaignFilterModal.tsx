
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
    project: '',
    status: '',
    createdBy: '',
    dateFrom: undefined as Date | undefined,
    dateTo: undefined as Date | undefined
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
      project: '',
      status: '',
      createdBy: '',
      dateFrom: undefined as Date | undefined,
      dateTo: undefined as Date | undefined
    };
    setFilters(resetFilters);
    onReset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full bg-white border border-gray-300 shadow-lg">
        <DialogHeader className="px-6 py-4 border-b border-gray-200">
          <DialogTitle className="text-lg font-semibold text-gray-900 text-left">Filter Campaigns</DialogTitle>
          <DialogDescription className="sr-only">
            Filter campaigns by project, status, created by, and date range
          </DialogDescription>
        </DialogHeader>
        
        <div className="px-6 py-6">
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="space-y-2">
              <Label htmlFor="project" className="text-sm font-medium text-gray-700">Project</Label>
              <Select onValueChange={(value) => handleFilterChange('project', value)} value={filters.project}>
                <SelectTrigger className="w-full h-10 border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm bg-white">
                  <SelectValue placeholder="Select Project" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-lg z-[60]">
                  <SelectItem value="godrej-city">GODREJ CITY</SelectItem>
                  <SelectItem value="godrej-rks">GODREJ RKS</SelectItem>
                  <SelectItem value="godrej-hill-retreat">GODREJ HILL RETREAT</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status" className="text-sm font-medium text-gray-700">Status</Label>
              <Select onValueChange={(value) => handleFilterChange('status', value)} value={filters.status}>
                <SelectTrigger className="w-full h-10 border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm bg-white">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-lg z-[60]">
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="hot">Hot</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="createdBy" className="text-sm font-medium text-gray-700">Created By</Label>
              <Input
                id="createdBy"
                placeholder="Enter creator name"
                value={filters.createdBy}
                onChange={(e) => handleFilterChange('createdBy', e.target.value)}
                className="w-full h-10 border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder-gray-400 text-sm bg-white"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Date Range</Label>
              <div className="flex gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "flex-1 h-10 justify-start text-left font-normal border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white hover:bg-gray-50",
                        !filters.dateFrom && "text-gray-400"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filters.dateFrom ? format(filters.dateFrom, "MM/dd/yyyy") : "From"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={filters.dateFrom}
                      onSelect={(date) => handleFilterChange('dateFrom', date)}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "flex-1 h-10 justify-start text-left font-normal border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white hover:bg-gray-50",
                        !filters.dateTo && "text-gray-400"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filters.dateTo ? format(filters.dateTo, "MM/dd/yyyy") : "To"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={filters.dateTo}
                      onSelect={(date) => handleFilterChange('dateTo', date)}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>

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
