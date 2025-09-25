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
import { API_CONFIG, getFullUrl, getAuthenticatedFetchOptions } from '@/config/apiConfig';

interface FilterData {
  dateRange?: DateRange;
}

interface UtilityEVConsumptionFilterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: FilterData) => void;
  onResetFilters: () => void;
}

export const UtilityEVConsumptionFilterDialog = ({ 
  isOpen, 
  onClose, 
  onApplyFilters, 
  onResetFilters 
}: UtilityEVConsumptionFilterDialogProps) => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  const handleDateRangeSelect = (range: DateRange | undefined) => {
    setDateRange(range);
  };

  const handleSubmit = () => {
    console.log('Filtering EV consumption data with date range:', dateRange);
    
    // Apply filters with the selected date range
    onApplyFilters({
      dateRange: dateRange
    });
    
    onClose();
  };

  const handleExport = async () => {
    try {
      console.log('📤 Exporting filtered EV consumption data with date range:', dateRange);
      
      const url = getFullUrl('/ev_consumptions.json');
      const urlWithParams = new URL(url);
      
      // Add export parameter if the API supports it
      urlWithParams.searchParams.append('export', 'true');
      
      // Add access_token parameter if available
      if (API_CONFIG.TOKEN) {
        urlWithParams.searchParams.append('access_token', API_CONFIG.TOKEN);
      }
      
      // Add date range filter if provided
      if (dateRange?.from && dateRange?.to) {
        const fromDate = format(dateRange.from, 'yyyy-MM-dd');
        const toDate = format(dateRange.to, 'yyyy-MM-dd');
        const dateRangeQuery = `${fromDate}..${toDate}`;
        urlWithParams.searchParams.append('q[date_range]', dateRangeQuery);
        console.log('📅 Adding date range filter to export:', dateRangeQuery);
      } else if (dateRange?.from) {
        const singleDate = format(dateRange.from, 'yyyy-MM-dd');
        urlWithParams.searchParams.append('q[date_range]', singleDate);
        console.log('📅 Adding single date filter to export:', singleDate);
      }
      
      console.log('🚀 Calling export API:', urlWithParams.toString());
      
      const options = getAuthenticatedFetchOptions();
      const response = await fetch(urlWithParams.toString(), options);
      
      if (!response.ok) {
        throw new Error(`Export failed: ${response.status} ${response.statusText}`);
      }
      
      // Check if response is a file or JSON
      const contentType = response.headers.get('content-type');
      
      if (contentType && (contentType.includes('application/vnd.openxmlformats') || contentType.includes('application/octet-stream'))) {
        // If it's a file, download it
        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        
        // Generate filename with timestamp and filter info
        const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
        const filterSuffix = dateRange ? '-filtered' : '';
        link.download = `ev-consumption-export${filterSuffix}-${timestamp}.xlsx`;
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(downloadUrl);
        
        console.log('✅ EV consumption data exported successfully!');
      } else {
        // If it's JSON, show success message
        console.log('✅ Export request processed successfully');
      }
      
    } catch (error) {
      console.error('❌ Export error:', error);
    }
    
    onClose();
  };

  const handleReset = () => {
    setDateRange(undefined);
    console.log('Resetting EV consumption filters...');
    
    // Reset filters
    onResetFilters();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-6 [&>button]:hidden">
        <DialogHeader className="pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold">FILTER BY</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 p-1 bg-[#C72030] text-white hover:bg-[#C72030]/90 rounded-none shadow-none"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Date Range*</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal rounded-none shadow-none",
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

        <div className="flex justify-center gap-4 pt-6">
          <Button 
            onClick={handleSubmit}
            className="bg-[#8B3A8B] text-white hover:bg-[#7A2E7A] transition-colors duration-200 rounded-none px-8 py-2 h-9 text-sm font-medium shadow-none"
          >
            Submit
          </Button>
          <Button 
            onClick={handleExport}
            className="bg-[#8B3A8B] text-white hover:bg-[#7A2E7A] transition-colors duration-200 rounded-none px-8 py-2 h-9 text-sm font-medium shadow-none"
          >
            Export
          </Button>
          <Button 
            onClick={handleReset}
            className="bg-white text-[#C72030] border border-[#C72030] hover:bg-[#C72030] hover:text-white transition-colors duration-200 rounded-none px-8 py-2 h-9 text-sm font-medium shadow-none"
          >
            Reset
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
