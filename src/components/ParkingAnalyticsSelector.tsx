import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CheckSquare, Square, ChevronDown, Car, TrendingUp, BarChart3, Clock, Building2, Layers } from 'lucide-react';

const parkingAnalyticsOptions = [
  { 
    id: 'peak_hour_trends', 
    label: 'Peak Hour Trends', 
    checked: true, 
    endpoint: 'peak_hour_trends.json',
    icon: TrendingUp 
  },
  { 
    id: 'booking_patterns', 
    label: '2-Year Parking Comparison', 
    checked: true, 
    endpoint: 'booking_patterns.json',
    icon: BarChart3 
  },
  { 
    id: 'occupancy_rate', 
    label: 'Occupancy Rate', 
    checked: true, 
    endpoint: 'occupancy_rate.json',
    icon: Clock 
  },
  { 
    id: 'average_duration', 
    label: 'Average Duration', 
    checked: true, 
    endpoint: 'average_duration.json',
    icon: Clock 
  },
  { 
    id: 'parking_statistics', 
    label: 'Parking Statistics Overview', 
    checked: true, 
    endpoint: 'parking_statistics.json',
    icon: BarChart3 
  },
  { 
    id: 'two_four_occupancy', 
    label: '2W / 4W Occupancy (Stacked)', 
    checked: true, 
    endpoint: 'two_four_occupancy.json',
    icon: Car 
  },
  { 
    id: 'floor_wise_occupancy', 
    label: 'Floor-wise Occupancy', 
    checked: true, 
    endpoint: 'floor_wise_occupancy.json',
    icon: Building2 
  },
];

interface ParkingAnalyticsSelectorProps {
  onSelectionChange?: (selectedOptions: string[]) => void;
  dateRange?: { startDate: Date | undefined; endDate: Date | undefined };
}

export function ParkingAnalyticsSelector({ onSelectionChange, dateRange }: ParkingAnalyticsSelectorProps) {
  const [options, setOptions] = useState(parkingAnalyticsOptions);
  const [isOpen, setIsOpen] = useState(false);

  const toggleOption = (id: string) => {
    setOptions(prev => {
      const newOptions = prev.map(option => 
        option.id === id ? { ...option, checked: !option.checked } : option
      );
      
      // Get selected IDs
      const selectedIds = newOptions
        .filter(option => option.checked)
        .map(option => option.id);
      
      // Notify parent component
      onSelectionChange?.(selectedIds);
      
      return newOptions;
    });
  };

  const selectedCount = options.filter(option => option.checked).length;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          className="flex items-center gap-2 bg-white border-[#C4B99D] hover:bg-[#F6F4EE] text-[#1A1A1A]"
        >
          <Car className="w-4 h-4 text-[#C72030]" />
          Select Reports ({selectedCount})
          <ChevronDown className="w-4 h-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 bg-white border border-[#C4B99D] shadow-lg z-50" align="end">
        <div className="p-4 border-b border-[#E8E5DD]">
          <h4 className="font-semibold text-[#1A1A1A]">Parking Analytics Reports</h4>
          <p className="text-sm text-[#6B7280] mt-1">Choose reports to display</p>
        </div>
        <div className="max-h-72 overflow-y-auto">
          {options.map((option) => {
            const IconComponent = option.icon;
            return (
              <div
                key={option.id}
                className="flex items-center justify-between px-4 py-3 hover:bg-[#F6F4EE] cursor-pointer transition-colors"
                onClick={() => toggleOption(option.id)}
              >
                <div className="flex items-center gap-3">
                  <IconComponent className="w-4 h-4 text-[#C4B99D]" />
                  <span className="text-sm font-medium text-[#1A1A1A]">{option.label}</span>
                </div>
                {option.checked ? (
                  <CheckSquare className="w-4 h-4 text-[#C72030]" />
                ) : (
                  <Square className="w-4 h-4 text-[#C4B99D]" />
                )}
              </div>
            );
          })}
        </div>
        <div className="p-4 border-t border-[#E8E5DD] bg-[#F6F4EE]">
          <div className="text-xs text-[#6B7280]">
            {selectedCount} of {options.length} reports selected
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
