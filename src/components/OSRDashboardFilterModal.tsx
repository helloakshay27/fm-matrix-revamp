
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DateRange } from 'react-day-picker';

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
    dateRange: undefined as DateRange | undefined,
    status: '',
    rating: ''
  });

  const [tempDateRange, setTempDateRange] = useState<DateRange | undefined>(filters.dateRange);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const handleFilterChange = (field: string, value: string | DateRange | undefined) => {
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
      dateRange: undefined,
      status: '',
      rating: ''
    });
    setTempDateRange(undefined);
    onReset();
  };

  const handleDateRangeCancel = () => {
    setTempDateRange(filters.dateRange);
    setIsDatePickerOpen(false);
  };

  const handleDateRangeApply = () => {
    handleFilterChange('dateRange', tempDateRange);
    setIsDatePickerOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Filter</DialogTitle>
          <DialogDescription className="sr-only">
            Filter the OSR dashboard data by various criteria
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 p-4">
          <div className="flex items-end gap-4 flex-wrap">
            <div className="min-w-[150px]">
              <Label htmlFor="tower" className="text-sm font-medium mb-1 block">Select Tower</Label>
              <Select onValueChange={(value) => handleFilterChange('tower', value)} value={filters.tower}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Select Tower" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tower-a">Tower A</SelectItem>
                  <SelectItem value="tower-b">Tower B</SelectItem>
                  <SelectItem value="tower-c">Tower C</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="min-w-[150px]">
              <Label htmlFor="flats" className="text-sm font-medium mb-1 block">Select Flats</Label>
              <Select onValueChange={(value) => handleFilterChange('flats', value)} value={filters.flats}>
                <SelectTrigger className="h-9">
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

            <div className="min-w-[200px]">
              <Label htmlFor="category" className="text-sm font-medium mb-1 block">Select Category</Label>
              <Select onValueChange={(value) => handleFilterChange('category', value)} value={filters.category}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Invisible Grill Starts from (per sq. ft.)" />
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

            <div className="min-w-[200px]">
              <Label className="text-sm font-medium mb-1 block">Created on</Label>
              <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "h-9 w-full justify-start text-left font-normal",
                      !filters.dateRange && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.dateRange?.from ? (
                      filters.dateRange.to ? (
                        <>
                          {format(filters.dateRange.from, "dd/MM/yyyy")} -{" "}
                          {format(filters.dateRange.to, "dd/MM/yyyy")}
                        </>
                      ) : (
                        format(filters.dateRange.from, "dd/MM/yyyy")
                      )
                    ) : (
                      "01/01/2025 - 12/31/2025"
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <div className="p-4">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={filters.dateRange?.from}
                      selected={tempDateRange}
                      onSelect={setTempDateRange}
                      numberOfMonths={2}
                      className="pointer-events-auto"
                    />
                    <div className="border-t pt-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Input
                          placeholder="01/01/2025 - 12/31/2025"
                          value={
                            tempDateRange?.from
                              ? tempDateRange.to
                                ? `${format(tempDateRange.from, "dd/MM/yyyy")} - ${format(tempDateRange.to, "dd/MM/yyyy")}`
                                : format(tempDateRange.from, "dd/MM/yyyy")
                              : ""
                          }
                          readOnly
                          className="flex-1"
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleDateRangeCancel}
                        >
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          onClick={handleDateRangeApply}
                          className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90"
                        >
                          Apply
                        </Button>
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            <div className="min-w-[150px]">
              <Label htmlFor="status" className="text-sm font-medium mb-1 block">Select Status</Label>
              <Select onValueChange={(value) => handleFilterChange('status', value)} value={filters.status}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="work-pending">Work Pending</SelectItem>
                  <SelectItem value="payment-pending">Payment Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="min-w-[150px]">
              <Label htmlFor="rating" className="text-sm font-medium mb-1 block">Select Rating</Label>
              <Select onValueChange={(value) => handleFilterChange('rating', value)} value={filters.rating}>
                <SelectTrigger className="h-9">
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

            <div className="flex gap-2 ml-auto">
              <Button 
                onClick={handleApply}
                className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white px-6 py-2 h-9"
              >
                Apply
              </Button>
              <Button 
                onClick={handleReset}
                className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white px-6 py-2 h-9"
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
