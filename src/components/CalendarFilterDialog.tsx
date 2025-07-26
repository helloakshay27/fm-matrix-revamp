import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, CalendarIcon, X } from 'lucide-react';
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
  amc: string;
  service: string;
  status: string;
  scheduleType: string;
  priority: string;

}
export const CalendarFilterModal: React.FC<CalendarFilterModalProps> = ({
  isOpen,
  onClose,
  onApplyFilters
}) => {
  const [filters, setFilters] = useState<CalendarFilters>({
    dateFrom: '01/07/2025',
    dateTo: '31/07/2025',
    amc: '',
    service: '',
    status: '',
    scheduleType: '',
    priority: '',

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
      amc: '',
      service: '',
      status: '',
      scheduleType: '',
      priority: '',

    };
    setFilters(clearedFilters);
    onApplyFilters(clearedFilters);
    onClose();
    toast.success('Filters cleared successfully');
  };
  return <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent className="sm:max-w-2xl">
      <DialogHeader className="relative">
        <DialogTitle className="text-lg font-semibold">Calendar Filter</DialogTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onClose()}
          className="absolute right-0 top-0 h-8 w-8 p-0 hover:bg-gray-100"
        >
          <X className="h-4 w-4" />
        </Button>
      </DialogHeader>

      <div className="space-y-4">
        {/* Date Range Section */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium text-gray-700">From Date</Label>
            <MaterialDatePicker
              value={filters.dateFrom}
              onChange={(value) => handleFilterChange('dateFrom', value)}
              placeholder="Select start date"
              className="mt-1 h-10"
            />
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-700">To Date</Label>
            <MaterialDatePicker
              value={filters.dateTo}
              onChange={(value) => handleFilterChange('dateTo', value)}
              placeholder="Select end date"
              className="mt-1 h-10"
            />
          </div>
        </div>

        {/* Task Details Section */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium text-gray-700">AMC</Label>
            <Select value={filters.amc} onValueChange={value => handleFilterChange('amc', value)}>
              <SelectTrigger className="mt-1 h-10">
                <SelectValue placeholder="Select AMC" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="amc1">AMC Contract 1</SelectItem>
                <SelectItem value="amc2">AMC Contract 2</SelectItem>
                <SelectItem value="amc3">AMC Contract 3</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700">Service</Label>
            <Select value={filters.service} onValueChange={value => handleFilterChange('service', value)}>
              <SelectTrigger className="mt-1 h-10">
                <SelectValue placeholder="Select Service" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="cleaning">Cleaning</SelectItem>
                <SelectItem value="security">Security</SelectItem>
                <SelectItem value="hvac">HVAC</SelectItem>
                <SelectItem value="electrical">Electrical</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium text-gray-700">Status</Label>
            <Select value={filters.status} onValueChange={value => handleFilterChange('status', value)}>
              <SelectTrigger className="mt-1 h-10">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700">Schedule Type</Label>
            <Select value={filters.scheduleType} onValueChange={value => handleFilterChange('scheduleType', value)}>
              <SelectTrigger className="mt-1 h-10">
                <SelectValue placeholder="Select Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
                <SelectItem value="annual">Annual</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div>
            <Label className="text-sm font-medium text-gray-700">Priority</Label>
            <Select value={filters.priority} onValueChange={value => handleFilterChange('priority', value)}>
              <SelectTrigger className="mt-1 h-10">
                <SelectValue placeholder="Select Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button
          variant="outline"
          onClick={handleClear}
          disabled={isLoading}
          className="mr-2"
        >
          Clear All
        </Button>
        <Button
          onClick={handleApply}
          disabled={isLoading}
          style={{ backgroundColor: '#C72030' }}
          className="text-white hover:bg-[#C72030]/90 px-8"
        >
          {isLoading ? 'Applying...' : 'Apply'}
        </Button>
      </div>
    </DialogContent>
  </Dialog>;
};