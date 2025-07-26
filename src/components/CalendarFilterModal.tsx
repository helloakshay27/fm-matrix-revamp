import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, CalendarIcon } from 'lucide-react';
import { toast } from 'sonner';
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
  building: string;
  wing: string;
  floor: string;
  area: string;
  room: string;
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
    building: '',
    wing: '',
    floor: '',
    area: '',
    room: ''
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
      building: '',
      wing: '',
      floor: '',
      area: '',
      room: ''
    };
    setFilters(clearedFilters);
    onApplyFilters(clearedFilters);
    onClose();
    toast.success('Filters cleared successfully');
  };
  return <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Filter Calendar Tasks</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Date Range Section */}
          <div>
            <h3 className="text-lg font-medium mb-4">Date Range</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">From Date</label>
                <Input placeholder="01/07/2025" value={filters.dateFrom} onChange={e => handleFilterChange('dateFrom', e.target.value)} className="h-10" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">To Date</label>
                <Input placeholder="31/07/2025" value={filters.dateTo} onChange={e => handleFilterChange('dateTo', e.target.value)} className="h-10" />
              </div>
            </div>
          </div>

          {/* Task Details Section */}
          <div>
            <h3 className="text-lg font-medium mb-4">Task Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Service</label>
                <Select value={filters.service} onValueChange={value => handleFilterChange('service', value)}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Select Service" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="cleaning">Cleaning</SelectItem>
                    
                    <SelectItem value="hvac">HVAC</SelectItem>
                    <SelectItem value="electrical">Electrical</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Schedule Type</label>
                <Select value={filters.scheduleType} onValueChange={value => handleFilterChange('scheduleType', value)}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Select Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="annual">Annual</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              
            </div>
          </div>

          {/* Location Details Section */}
          
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-6 border-t">
          <Button variant="outline" onClick={handleClear} disabled={isLoading} className="px-6">
            Clear All
          </Button>
          <Button onClick={handleApply} disabled={isLoading} className="bg-purple-600 hover:bg-purple-700 text-white px-6">
            {isLoading ? 'Applying...' : 'Apply Filter'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>;
};