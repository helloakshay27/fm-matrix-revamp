
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OSRDashboardFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: any) => void;
  onReset: () => void;
}

export const OSRDashboardFilterModal = ({ isOpen, onClose, onApply, onReset }: OSRDashboardFilterModalProps) => {
  const [filters, setFilters] = useState({
    tower: '',
    flats: '',
    category: '',
    createdOn: undefined as Date | undefined,
    status: '',
    rating: ''
  });

  const handleFilterChange = (field: string, value: string | Date | undefined) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const handleReset = () => {
    setFilters({
      tower: '',
      flats: '',
      category: '',
      createdOn: undefined,
      status: '',
      rating: ''
    });
    onReset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Filter</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 p-4">
          <div className="grid grid-cols-6 gap-4">
            <div>
              <Label htmlFor="tower" className="text-sm font-medium">Select Tower</Label>
              <Select onValueChange={(value) => handleFilterChange('tower', value)} value={filters.tower}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select Tower" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tower-a">Tower A</SelectItem>
                  <SelectItem value="tower-b">Tower B</SelectItem>
                  <SelectItem value="tower-c">Tower C</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="flats" className="text-sm font-medium">Select Flats</Label>
              <Select onValueChange={(value) => handleFilterChange('flats', value)} value={filters.flats}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select Flats" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="a-101">A-101</SelectItem>
                  <SelectItem value="a-102">A-102</SelectItem>
                  <SelectItem value="a-103">A-103</SelectItem>
                  <SelectItem value="a-104">A-104</SelectItem>
                  <SelectItem value="fm-office">FM - Office</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="category" className="text-sm font-medium">Select Category</Label>
              <Select onValueChange={(value) => handleFilterChange('category', value)} value={filters.category}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pest-control">Pest Control</SelectItem>
                  <SelectItem value="deep-cleaning">Deep Cleaning</SelectItem>
                  <SelectItem value="civil-mason">Civil & Mason Works</SelectItem>
                  <SelectItem value="invisible-grill">Invisible Grill</SelectItem>
                  <SelectItem value="mosquito-mesh">Mosquito Mesh Sta...</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium">Created on</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full mt-1 justify-start text-left font-normal",
                      !filters.createdOn && "text-muted-foreground"
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

            <div>
              <Label htmlFor="status" className="text-sm font-medium">Select Status</Label>
              <Select onValueChange={(value) => handleFilterChange('status', value)} value={filters.status}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="work-pending">Work Pending</SelectItem>
                  <SelectItem value="payment-pending">Payment Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="rating" className="text-sm font-medium">Select Rating</Label>
              <Select onValueChange={(value) => handleFilterChange('rating', value)} value={filters.rating}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select Rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Star</SelectItem>
                  <SelectItem value="2">2 Stars</SelectItem>
                  <SelectItem value="3">3 Stars</SelectItem>
                  <SelectItem value="4">4 Stars</SelectItem>
                  <SelectItem value="5">5 Stars</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-center gap-4 pt-4">
            <Button 
              onClick={handleApply}
              className="bg-[#C72030] hover:bg-[#C72030]/90 text-white px-8 py-2"
            >
              Apply
            </Button>
            <Button 
              onClick={handleReset}
              className="bg-[#C72030] hover:bg-[#C72030]/90 text-white px-8 py-2"
            >
              Reset
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
