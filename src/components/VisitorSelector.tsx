import React, { useState, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

const visitorOptions = [
  { id: 'purpose-wise', label: 'Purpose Wise Visitors', checked: true, chartSection: 'purposeWise' },
  { id: 'status-wise', label: 'Status Wise Distribution', checked: true, chartSection: 'statusWise' },
  { id: 'hourly-trend', label: 'Hourly Visitor Trend', checked: true, chartSection: 'hourlyTrend' },
  { id: 'location-wise', label: 'Location Wise Visitors', checked: true, chartSection: 'locationWise' },
  { id: 'visitor-summary', label: 'Visitor Summary Stats', checked: true, chartSection: 'visitorSummary' },
];

interface VisitorSelectorProps {
  onSelectionChange?: (visibleSections: string[]) => void;
}

export function VisitorSelector({ onSelectionChange }: VisitorSelectorProps) {
  const [options, setOptions] = useState(visitorOptions);
  const [isOpen, setIsOpen] = useState(false);

  // Initialize with current visible sections
  useEffect(() => {
    const visibleSections = options
      .filter(opt => opt.checked)
      .map(opt => opt.chartSection);
    onSelectionChange?.(visibleSections);
  }, []);

  const toggleOption = (id: string) => {
    setOptions(prev => {
      const newOptions = prev.map(option => 
        option.id === id ? { ...option, checked: !option.checked } : option
      );
      
      // Get visible chart sections
      const visibleSections = newOptions
        .filter(opt => opt.checked)
        .map(opt => opt.chartSection);
      
      // Notify parent component
      onSelectionChange?.(visibleSections);
      
      return newOptions;
    });
  };

  const selectedCount = options.filter(opt => opt.checked).length;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50 justify-between min-w-[180px]"
        >
          Visitor Selector ({selectedCount})
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0" align="end">
        <div className="bg-white border border-gray-200">
          <div className="p-3 border-b border-gray-200">
            <h3 className="font-medium text-gray-700">Select Visitors</h3>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {options.map((option) => (
              <div 
                key={option.id}
                className="flex items-center p-3 hover:bg-gray-50 cursor-pointer"
                onClick={() => toggleOption(option.id)}
              >
                <div className="flex items-center justify-center w-4 h-4 mr-3 border border-gray-300 bg-white">
                  {option.checked && <Check className="h-3 w-3 text-gray-700" />}
                </div>
                <span className="text-sm text-gray-700">{option.label}</span>
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}