
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { X, CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface SolarGeneratorFilterDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SolarGeneratorFilterDialog: React.FC<SolarGeneratorFilterDialogProps> = ({ isOpen, onClose }) => {
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const handleSubmit = () => {
    console.log('Filter submitted with date range:', dateRange);
    onClose();
  };

  const handleExport = () => {
    console.log('Export functionality triggered');
  };

  const handleReset = () => {
    setDateRange({});
    console.log('Filter reset');
  };

  const formatDateRange = () => {
    if (dateRange.from) {
      if (dateRange.to) {
        return `${format(dateRange.from, 'dd/MM/yyyy')} - ${format(dateRange.to, 'dd/MM/yyyy')}`;
      }
      return format(dateRange.from, 'dd/MM/yyyy');
    }
    return 'Select Date Range';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white p-0">
        <DialogHeader className="flex flex-row items-center justify-between p-4 border-b">
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
          {/* Date Range */}
          <div className="space-y-2">
            <Label htmlFor="dateRange" className="text-sm font-medium text-gray-700">
              Date Range*
            </Label>
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal border-gray-300",
                    !dateRange.from && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formatDateRange()}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange.from}
                  selected={dateRange.from && dateRange.to ? { from: dateRange.from, to: dateRange.to } : undefined}
                  onSelect={(range) => {
                    if (range) {
                      setDateRange({ from: range.from, to: range.to });
                      if (range.from && range.to) {
                        setIsCalendarOpen(false);
                      }
                    } else {
                      setDateRange({});
                    }
                  }}
                  numberOfMonths={2}
                  className="pointer-events-auto"
                />
                <div className="flex justify-between p-3 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setDateRange({});
                      setIsCalendarOpen(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => setIsCalendarOpen(false)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Apply
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-3 pt-4">
            <Button
              onClick={handleSubmit}
              className="bg-[#8B4B8C] hover:bg-[#7A4077] text-white px-8 py-2 rounded"
            >
              Submit
            </Button>
            <Button
              onClick={handleExport}
              className="bg-[#8B4B8C] hover:bg-[#7A4077] text-white px-8 py-2 rounded"
            >
              Export
            </Button>
            <Button
              onClick={handleReset}
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-2 rounded"
            >
              Reset
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
