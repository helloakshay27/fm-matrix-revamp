import React, { useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

const amcOptions = [
  { id: 'status', label: 'AMC Status', checked: true, chartSection: 'statusChart' },
  { id: 'expiry', label: 'AMC Expiry Analysis', checked: true, chartSection: 'expiryChart' },
  { id: 'resource-type', label: 'Resource Type Distribution', checked: true, chartSection: 'resourceChart' },
  { id: 'vendor-wise', label: 'Vendor-wise AMCs', checked: false, chartSection: 'vendorChart' },
  { id: 'monthly-trends', label: 'Monthly Trends', checked: false, chartSection: 'trendsChart' },
  { id: 'active-amc', label: 'Active AMCs', checked: false, chartSection: 'activeChart' },
  { id: 'expired-amc', label: 'Expired AMCs', checked: false, chartSection: 'expiredChart' },
  { id: 'upcoming-renewal', label: 'Upcoming Renewals', checked: false, chartSection: 'renewalChart' },
];

interface AMCSelectorProps {
  onSelectionChange?: (visibleSections: string[]) => void;
}

export function AMCSelector({ onSelectionChange }: AMCSelectorProps) {
  const [options, setOptions] = useState(amcOptions);
  const [isOpen, setIsOpen] = useState(false);

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
          className="bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
        >
          AMC Selector ({selectedCount})
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0" align="end">
        <div className="bg-white border border-gray-200">
          <div className="p-3 border-b border-gray-200">
            <h3 className="font-medium text-gray-700">Select AMC Charts</h3>
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