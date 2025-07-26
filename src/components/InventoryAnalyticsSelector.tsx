import React, { useState } from 'react';
import { ChevronDown, Check, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

const inventoryAnalyticsOptions = [
  { 
    id: 'items-status', 
    label: 'Items Status (Active/Inactive/Critical)', 
    checked: true, 
    endpoint: 'items_status.json',
    icon: '📊' 
  },
  { 
    id: 'category-wise', 
    label: 'Category-wise Items', 
    checked: false, 
    endpoint: 'category_wise_items.json',
    icon: '📈' 
  },
  { 
    id: 'green-consumption', 
    label: 'Green Consumption', 
    checked: false, 
    endpoint: 'inventory_consumption_green.json',
    icon: '🌱' 
  },
  { 
    id: 'consumption-green-report', 
    label: 'Consumption Green Report', 
    checked: false, 
    endpoint: 'consumption_report_green.json',
    icon: '📋' 
  },
  { 
    id: 'consumption-non-green-report', 
    label: 'Consumption Report Non Green', 
    checked: false, 
    endpoint: 'consumption_report_non_green.json',
    icon: '📄' 
  },
  { 
    id: 'current-minimum-non-green', 
    label: 'Current Minimum Stock Non Green', 
    checked: false, 
    endpoint: 'current_minimum_stock_non_green.json',
    icon: '⚠️' 
  },
  { 
    id: 'current-minimum-green', 
    label: 'Current Minimum Stock Green', 
    checked: false, 
    endpoint: 'current_minimum_stock_green.json',
    icon: '✅' 
  },
];

interface InventoryAnalyticsSelectorProps {
  onSelectionChange?: (selectedOptions: string[]) => void;
  dateRange?: { startDate: Date | undefined; endDate: Date | undefined };
}

export function InventoryAnalyticsSelector({ onSelectionChange, dateRange }: InventoryAnalyticsSelectorProps) {
  const [options, setOptions] = useState(inventoryAnalyticsOptions);
  const [isOpen, setIsOpen] = useState(false);

  const toggleOption = (id: string) => {
    setOptions(prev => {
      const newOptions = prev.map(option => 
        option.id === id ? { ...option, checked: !option.checked } : option
      );
      
      // Get selected endpoints
      const selectedEndpoints = newOptions
        .filter(opt => opt.checked)
        .map(opt => opt.endpoint);
      
      // Notify parent component
      onSelectionChange?.(selectedEndpoints);
      
      return newOptions;
    });
  };

  const selectedCount = options.filter(opt => opt.checked).length;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          className="bg-white border-[hsl(var(--analytics-border))] text-[hsl(var(--analytics-text))] hover:bg-[hsl(var(--analytics-background))] min-w-[200px] justify-between"
        >
          <div className="flex items-center gap-2">
            <Leaf className="h-4 w-4 text-green-600" />
            Inventory Analytics ({selectedCount})
          </div>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="bg-white border border-[hsl(var(--analytics-border))] rounded-lg overflow-hidden">
          <div className="p-4 border-b border-[hsl(var(--analytics-border))] bg-[hsl(var(--analytics-background))]">
            <h3 className="font-semibold text-[hsl(var(--analytics-text))] flex items-center gap-2">
              <Leaf className="h-4 w-4 text-green-600" />
              Select Inventory Reports
            </h3>
            <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">
              Choose which inventory analytics to display
            </p>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {options.map((option) => (
              <div 
                key={option.id}
                className="flex items-start p-3 hover:bg-[hsl(var(--analytics-background))] cursor-pointer transition-colors border-b border-[hsl(var(--analytics-border))]/30 last:border-b-0"
                onClick={() => toggleOption(option.id)}
              >
                <div className="flex items-center justify-center w-4 h-4 mr-3 mt-0.5 border border-[hsl(var(--analytics-border))] bg-white rounded">
                  {option.checked && <Check className="h-3 w-3 text-green-600" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{option.icon}</span>
                    <span className="text-sm font-medium text-[hsl(var(--analytics-text))]">
                      {option.label}
                    </span>
                  </div>
                  <div className="text-xs text-[hsl(var(--muted-foreground))] mt-1">
                    API: {option.endpoint}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="p-3 bg-[hsl(var(--analytics-background))] border-t border-[hsl(var(--analytics-border))]">
            <div className="text-xs text-[hsl(var(--muted-foreground))] flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              {selectedCount} report{selectedCount !== 1 ? 's' : ''} selected
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}