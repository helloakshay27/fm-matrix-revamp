import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CheckSquare, Square, ChevronDown, Package, Leaf, Activity, FileText, AlertTriangle, BarChart, Database } from 'lucide-react';

const inventoryAnalyticsOptions = [
  { 
    id: 'items-status', 
    label: 'Items Status', 
    checked: true, 
    endpoint: 'items_status.json',
    icon: Package 
  },
  { 
    id: 'category-wise', 
    label: 'Category Wise Items', 
    checked: true, 
    endpoint: 'category_wise_items.json',
    icon: BarChart 
  },
  { 
    id: 'green-consumption', 
    label: 'Green Consumption', 
    checked: true, 
    endpoint: 'inventory_consumption_green.json',
    icon: Leaf 
  },
  { 
    id: 'consumption-report-green', 
    label: 'Consumption Report Green', 
    checked: false, 
    endpoint: 'consumption_report_green.json',
    icon: Activity 
  },
  { 
    id: 'consumption-report-non-green', 
    label: 'Consumption Report Non-Green', 
    checked: false, 
    endpoint: 'consumption_report_non_green.json',
    icon: FileText 
  },
  { 
    id: 'current-minimum-non-green', 
    label: 'Current Minimum Stock Non-Green', 
    checked: false, 
    endpoint: 'current_minimum_stock_non_green.json',
    icon: AlertTriangle 
  },
  { 
    id: 'current-minimum-green', 
    label: 'Current Minimum Stock Green', 
    checked: false, 
    endpoint: 'current_minimum_stock_green.json',
    icon: Database 
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
        .filter(option => option.checked)
        .map(option => option.endpoint);
      
      // Notify parent component
      onSelectionChange?.(selectedEndpoints);
      
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
          <h4 className="font-semibold text-gray-900">Inventory Analytics Reports</h4>
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