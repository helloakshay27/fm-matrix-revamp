import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, CalendarIcon } from 'lucide-react';
import { toast } from 'sonner';
import { MaterialDatePicker } from '@/components/ui/material-date-picker';
import { Label } from '@/components/ui/label';
interface CalendarFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: CalendarFilters) => void;
}
export interface CalendarFilters {
  dateFrom: string;
  dateTo: string;
  formName: string;
  scheduleType: string;
}
export const CalendarFilterModal: React.FC<CalendarFilterModalProps> = ({
  isOpen,
  onClose,
  onApplyFilters
}) => {
  const [filters, setFilters] = useState<CalendarFilters>({
    dateFrom: '01/07/2025',
    dateTo: '31/07/2025',
    formName: '',
    scheduleType: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const handleFilterChange = (key: keyof CalendarFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };
  const handleApply = async () => {
    setIsLoading(true);
    try {
      onApplyFilters(filters);
      onClose();
      toast.success('Filters applied successfully');
    } catch (error) {
      toast.error('Failed to apply filters');
    } finally {
      setIsLoading(false);
    }
  };
  const handleClear = () => {
    const clearedFilters: CalendarFilters = {
      dateFrom: '01/07/2025',
      dateTo: '31/07/2025',
      formName: '',
      scheduleType: ''
    };
    setFilters(clearedFilters);
    onApplyFilters(clearedFilters);
    onClose();
    toast.success('Filters cleared successfully');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Filter Calendar Tasks</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Date Range Section */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-4 text-gray-800">Date Range</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Start Date</Label>
                <MaterialDatePicker 
                  value={filters.dateFrom} 
                  onChange={(value) => handleFilterChange('dateFrom', value)} 
                  placeholder="Select start date"
                  className="h-10 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">End Date</Label>
                <MaterialDatePicker 
                  value={filters.dateTo} 
                  onChange={(value) => handleFilterChange('dateTo', value)} 
                  placeholder="Select end date"
                  className="h-10 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Filter Options */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-4 text-gray-800">Filter Options</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Select Type</Label>
                <Select value={filters.formName} onValueChange={value => handleFilterChange('formName', value)}>
                  <SelectTrigger className="h-10 bg-white border border-gray-300 hover:border-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <SelectValue placeholder="Select Form Name" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200 shadow-lg rounded-md z-50">
                    <SelectItem value="PPM" className="hover:bg-gray-100 focus:bg-gray-100">PPM</SelectItem>
                    <SelectItem value="AMC" className="hover:bg-gray-100 focus:bg-gray-100">AMC</SelectItem>
                    <SelectItem value="Preparedness" className="hover:bg-gray-100 focus:bg-gray-100">Preparedness</SelectItem>
                   
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Schedule Type</Label>
                <Select value={filters.scheduleType} onValueChange={value => handleFilterChange('scheduleType', value)}>
                  <SelectTrigger className="h-10 bg-white border border-gray-300 hover:border-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <SelectValue placeholder="Select Schedule Type" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200 shadow-lg rounded-md z-50">
                    <SelectItem value="asset" className="hover:bg-gray-100 focus:bg-gray-100">Asset</SelectItem>
                    <SelectItem value="service" className="hover:bg-gray-100 focus:bg-gray-100">Service</SelectItem>
                   
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-6 border-t">
          <Button 
            variant="outline" 
            onClick={handleClear} 
            disabled={isLoading} 
            className="px-6 border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Clear All
          </Button>
          <Button 
            onClick={handleApply} 
            disabled={isLoading} 
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 focus:ring-2 focus:ring-blue-500"
          >
            {isLoading ? 'Applying...' : 'Apply Filter'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};