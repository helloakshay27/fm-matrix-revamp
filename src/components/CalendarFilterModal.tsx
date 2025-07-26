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
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-4 text-gray-800">Date Range</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">From Date</Label>
                <MaterialDatePicker 
                  value={filters.dateFrom} 
                  onChange={(value) => handleFilterChange('dateFrom', value)} 
                  placeholder="Select start date"
                  className="h-10"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">To Date</Label>
                <MaterialDatePicker 
                  value={filters.dateTo} 
                  onChange={(value) => handleFilterChange('dateTo', value)} 
                  placeholder="Select end date"
                  className="h-10"
                />
              </div>
            </div>
          </div>

          {/* Task Details Section */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-4 text-gray-800">Task Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">AMC</Label>
                <Select value={filters.amc} onValueChange={value => handleFilterChange('amc', value)}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Select AMC" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="amc1">AMC Contract 1</SelectItem>
                    <SelectItem value="amc2">AMC Contract 2</SelectItem>
                    <SelectItem value="amc3">AMC Contract 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Service</Label>
                <Select value={filters.service} onValueChange={value => handleFilterChange('service', value)}>
                  <SelectTrigger className="h-10">
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

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Status</Label>
                <Select value={filters.status} onValueChange={value => handleFilterChange('status', value)}>
                  <SelectTrigger className="h-10">
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

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Schedule Type</Label>
                <Select value={filters.scheduleType} onValueChange={value => handleFilterChange('scheduleType', value)}>
                  <SelectTrigger className="h-10">
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

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Priority</Label>
                <Select value={filters.priority} onValueChange={value => handleFilterChange('priority', value)}>
                  <SelectTrigger className="h-10">
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

          {/* Location Details Section */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-4 text-gray-800">Location Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Building</Label>
                <Select value={filters.building} onValueChange={value => handleFilterChange('building', value)}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Select Building" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="building-a">Building A</SelectItem>
                    <SelectItem value="building-b">Building B</SelectItem>
                    <SelectItem value="building-c">Building C</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Wing</Label>
                <Select value={filters.wing} onValueChange={value => handleFilterChange('wing', value)}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Select Wing" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="north">North Wing</SelectItem>
                    <SelectItem value="south">South Wing</SelectItem>
                    <SelectItem value="east">East Wing</SelectItem>
                    <SelectItem value="west">West Wing</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Floor</Label>
                <Select value={filters.floor} onValueChange={value => handleFilterChange('floor', value)}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Select Floor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ground">Ground Floor</SelectItem>
                    <SelectItem value="1">1st Floor</SelectItem>
                    <SelectItem value="2">2nd Floor</SelectItem>
                    <SelectItem value="3">3rd Floor</SelectItem>
                    <SelectItem value="4">4th Floor</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Area</Label>
                <Select value={filters.area} onValueChange={value => handleFilterChange('area', value)}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Select Area" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lobby">Lobby</SelectItem>
                    <SelectItem value="office">Office Space</SelectItem>
                    <SelectItem value="cafeteria">Cafeteria</SelectItem>
                    <SelectItem value="parking">Parking</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Room</Label>
                <Input 
                  placeholder="Enter room number" 
                  value={filters.room} 
                  onChange={e => handleFilterChange('room', e.target.value)} 
                  className="h-10" 
                />
              </div>
            </div>
          </div>
          
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