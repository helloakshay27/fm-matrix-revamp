import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from 'lucide-react';

interface TicketAnalyticsFilterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: { startDate: string; endDate: string }) => void;
  currentStartDate?: string; // Current applied start date in DD/MM/YYYY format
  currentEndDate?: string;   // Current applied end date in DD/MM/YYYY format
}

// Custom Date Picker Component
const CustomDatePicker: React.FC<{
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}> = ({ value, onChange, placeholder = "Select date" }) => {
  // Convert DD/MM/YYYY to YYYY-MM-DD for HTML input
  const convertToHTMLDate = (ddmmyyyy: string): string => {
    if (!ddmmyyyy) return '';
    const [day, month, year] = ddmmyyyy.split('/');
    if (day && month && year) {
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
    return '';
  };

  // Convert YYYY-MM-DD to DD/MM/YYYY
  const convertToDDMMYYYY = (htmlDate: string): string => {
    if (!htmlDate) return '';
    const [year, month, day] = htmlDate.split('-');
    if (year && month && day) {
      return `${day}/${month}/${year}`;
    }
    return '';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const htmlDate = e.target.value;
    const ddmmyyyy = convertToDDMMYYYY(htmlDate);
    onChange(ddmmyyyy);
  };

  return (
    <div className="relative">
      <Input
        type="date"
        value={convertToHTMLDate(value)}
        onChange={handleChange}
        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        placeholder={placeholder}
      />
      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
    </div>
  );
};

export const TicketAnalyticsFilterDialog: React.FC<TicketAnalyticsFilterDialogProps> = ({
  isOpen,
  onClose,
  onApplyFilters,
  currentStartDate,
  currentEndDate,
}) => {
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      if (currentStartDate && currentEndDate) {
        // Use current applied filter dates
        setStartDate(currentStartDate);
        setEndDate(currentEndDate);
      } else {
        // Set default dates (last year to today) only if no current dates
        const today = new Date();
        const lastYear = new Date(today);
        lastYear.setFullYear(today.getFullYear() - 1);
        
        const formatDate = (date: Date) => {
          const day = date.getDate().toString().padStart(2, '0');
          const month = (date.getMonth() + 1).toString().padStart(2, '0');
          const year = date.getFullYear();
          return `${day}/${month}/${year}`;
        };
        
        setStartDate(formatDate(lastYear));
        setEndDate(formatDate(today));
      }
    }
  }, [isOpen, currentStartDate, currentEndDate]);

  const handleSubmit = () => {
    if (startDate && endDate) {
      onApplyFilters({ 
        startDate: startDate, 
        endDate: endDate 
      });
      onClose();
    } else {
      // If dates are empty, close without applying (effectively clearing the filter)
      onClose();
    }
  };

  const handleReset = () => {
    // Reset to empty/null values to clear the data
    setStartDate('');
    setEndDate('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Filter Ticket Analytics</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Start Date</label>
            <CustomDatePicker
              value={startDate}
              onChange={setStartDate}
              placeholder="Select start date"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">End Date</label>
            <CustomDatePicker
              value={endDate}
              onChange={setEndDate}
              placeholder="Select end date"
            />
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 pt-6">
          <Button 
            onClick={handleSubmit}
            className="flex-1 h-11"
          >
            Apply Filters
          </Button>
          <Button 
            variant="outline" 
            onClick={onClose}
            className="flex-1 h-11"
          >
            Cancel
          </Button>
          <Button 
            variant="outline" 
            onClick={handleReset}
            className="flex-1 h-11"
          >
            Reset
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};