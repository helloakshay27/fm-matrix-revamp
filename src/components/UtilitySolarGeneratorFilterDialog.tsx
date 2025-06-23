
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, X } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { DateRange } from 'react-day-picker';

interface UtilitySolarGeneratorFilterDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UtilitySolarGeneratorFilterDialog = ({ isOpen, onClose }: UtilitySolarGeneratorFilterDialogProps) => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  const handleDateRangeSelect = (range: DateRange | undefined) => {
    setDateRange(range);
  };

  const handleSubmit = () => {
    console.log('Filtering solar generator data with date range:', dateRange);
    onClose();
  };

  const handleExport = () => {
    // Create and download CSV file for filtered results
    const csvContent = "data:text/csv;charset=utf-8," + 
      "ID,Date,Total Units,Plant day Generation,Tower\n" +
      "001,2024-01-15,250.5,2450.8,Tower A";
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "solar_generator_filtered.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log('Exporting filtered solar generator data...');
    onClose();
  };

  const handleReset = () => {
    setDateRange(undefined);
    console.log('Resetting solar generator filters...');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md [&>button]:hidden">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold">FILTER BY</DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Date Range*</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dateRange?.from && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange?.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "LLL dd, y")} -{" "}
                          {format(dateRange.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(dateRange.from, "LLL dd, y")
                      )
                    ) : (
                      <span>Select Date Range</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange?.from}
                    selected={dateRange}
                    onSelect={handleDateRangeSelect}
                    numberOfMonths={2}
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-4 pt-4">
          <Button 
            onClick={handleSubmit}
            className="bg-[#8B3A8B] text-white hover:bg-[#7A2E7A] transition-colors duration-200 rounded-lg px-8 py-2 h-9 text-sm font-medium"
          >
            Submit
          </Button>
          <Button 
            onClick={handleExport}
            className="bg-[#8B3A8B] text-white hover:bg-[#7A2E7A] transition-colors duration-200 rounded-lg px-8 py-2 h-9 text-sm font-medium"
          >
            Export
          </Button>
          <Button 
            onClick={handleReset}
            className="bg-white text-[#C72030] border border-[#C72030] hover:bg-[#C72030] hover:text-white transition-colors duration-200 rounded-lg px-8 py-2 h-9 text-sm font-medium"
          >
            Reset
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
