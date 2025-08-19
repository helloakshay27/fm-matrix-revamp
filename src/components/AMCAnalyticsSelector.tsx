import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CheckSquare, Square, ChevronDown, Package, BarChart, Activity, AlertTriangle, Settings, Layers, MapPin } from 'lucide-react';

const amcAnalyticsOptions = [
  { 
    id: 'status_overview', 
    label: 'Status Overview', 
    checked: true, 
    endpoint: 'status_overview',
    icon: Package 
  },
  { 
    id: 'type_distribution', 
    label: 'Type Distribution', 
    checked: true, 
    endpoint: 'type_distribution',
    icon: BarChart 
  },
  { 
    id: 'unit_resource_wise', 
    label: 'Unit Resource Distribution', 
    checked: true, 
    endpoint: 'unit_resource_wise',
    icon: Layers 
  },
  { 
    id: 'service_stats', 
    label: 'Service Statistics', 
    checked: true, 
    endpoint: 'service_stats',
    icon: Activity 
  },
  { 
    id: 'expiry_analysis', 
    label: 'Expiry Analysis', 
    checked: true, 
    endpoint: 'expiry_analysis',
    icon: AlertTriangle 
  },
  // { 
  //   id: 'service_tracking', 
  //   label: 'Service Tracking', 
  //   checked: true, 
  //   endpoint: 'service_tracking',
  //   icon: Settings 
  // },
  { 
    id: 'coverage_by_location', 
    label: 'Coverage by Location', 
    checked: true, 
    endpoint: 'coverage_by_location',
    icon: MapPin 
  }
];

interface AMCAnalyticsSelectorProps {
  onSelectionChange?: (selectedOptions: string[]) => void;
  dateRange?: { startDate: Date | undefined; endDate: Date | undefined };
}

export function AMCAnalyticsSelector({ onSelectionChange, dateRange }: AMCAnalyticsSelectorProps) {
  const [options, setOptions] = useState(amcAnalyticsOptions);
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
          className="flex items-center gap-2 bg-white border-gray-300 hover:bg-gray-50"
        >
          <Package className="w-4 h-4" />
          Select Reports ({selectedCount})
          <ChevronDown className="w-4 h-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 bg-white border border-gray-200 shadow-lg z-50" align="end">
        <div className="p-4 border-b border-gray-200">
          <h4 className="font-semibold text-gray-900">AMC Analytics Reports</h4>
          <p className="text-sm text-gray-600 mt-1">Choose reports to display</p>
        </div>
        <div className="max-h-72 overflow-y-auto">
          {options.map((option) => {
            const IconComponent = option.icon;
            return (
              <div
                key={option.id}
                className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => toggleOption(option.id)}
              >
                <div className="flex items-center gap-3">
                  <IconComponent className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">{option.label}</span>
                </div>
                {option.checked ? (
                  <CheckSquare className="w-4 h-4 text-[#C72030]" />
                ) : (
                  <Square className="w-4 h-4 text-gray-400" />
                )}
              </div>
            );
          })}
        </div>
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="text-xs text-gray-600">
            {selectedCount} of {options.length} reports selected
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}