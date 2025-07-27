import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronDown, BarChart3, Package, Leaf, TrendingDown, AlertTriangle, CheckCircle2, Recycle } from 'lucide-react';

// Predefined inventory analytics options matching the provided APIs
const inventoryAnalyticsOptions = [
  {
    id: 'itemsStatus',
    label: 'Items Status (Active/Inactive/Critical)',
    checked: true,
    endpoint: 'inventories/items_status.json',
    icon: BarChart3,
  },
  {
    id: 'categoryWise',
    label: 'Category-wise Items',
    checked: true,
    endpoint: 'inventories/category_wise_items.json',
    icon: Package,
  },
  {
    id: 'greenConsumption',
    label: 'Green Consumption',
    checked: true,
    endpoint: 'inventories/inventory_consumption_green.json',
    icon: Leaf,
  },
  {
    id: 'consumptionGreenReport',
    label: 'Consumption Green Report',
    checked: true,
    endpoint: 'inventories/consumption_report_green.json',
    icon: Recycle,
  },
  {
    id: 'consumptionNonGreenReport',
    label: 'Consumption Report Non Green',
    checked: false,
    endpoint: 'inventories/consumption_report_non_green.json',
    icon: TrendingDown,
  },
  {
    id: 'currentMinStockNonGreen',
    label: 'Current Minimum Stock Non Green',
    checked: false,
    endpoint: 'inventories/current_minimum_stock_non_green.json',
    icon: AlertTriangle,
  },
  {
    id: 'currentMinStockGreen',
    label: 'Current Minimum Stock Green',
    checked: false,
    endpoint: 'inventories/current_minimum_stock_green.json',
    icon: CheckCircle2,
  },
];

interface InventoryAnalyticsSelectorProps {
  onSelectionChange?: (selectedOptions: string[]) => void;
  dateRange?: {
    startDate: Date;
    endDate: Date;
  };
}

export const InventoryAnalyticsSelector: React.FC<InventoryAnalyticsSelectorProps> = ({
  onSelectionChange,
  dateRange,
}) => {
  const [options, setOptions] = useState(inventoryAnalyticsOptions);

  const toggleOption = (id: string) => {
    const updatedOptions = options.map(option =>
      option.id === id ? { ...option, checked: !option.checked } : option
    );
    setOptions(updatedOptions);
    
    const selectedIds = updatedOptions.filter(option => option.checked).map(option => option.id);
    onSelectionChange?.(selectedIds);
  };

  const selectAll = () => {
    const updatedOptions = options.map(option => ({ ...option, checked: true }));
    setOptions(updatedOptions);
    
    const selectedIds = updatedOptions.map(option => option.id);
    onSelectionChange?.(selectedIds);
  };

  const clearAll = () => {
    const updatedOptions = options.map(option => ({ ...option, checked: false }));
    setOptions(updatedOptions);
    
    onSelectionChange?.([]);
  };

  const selectedCount = options.filter(option => option.checked).length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          className="justify-between min-w-[200px] bg-white border-gray-300 hover:bg-gray-50"
        >
          <span className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            {selectedCount} Report{selectedCount !== 1 ? 's' : ''} Selected
          </span>
          <ChevronDown className="w-4 h-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 bg-white border border-gray-200 shadow-lg z-50" align="start">
        <div className="flex flex-col max-h-96">
          <div className="p-4 border-b border-gray-200">
            <h4 className="font-semibold text-gray-900">Select Analytics Reports</h4>
            <div className="flex gap-2 mt-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={selectAll}
                className="text-xs"
              >
                Select All
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={clearAll}
                className="text-xs"
              >
                Clear All
              </Button>
            </div>
          </div>
          
          <div className="overflow-y-auto">
            {options.map((option) => (
              <div key={option.id} className="flex items-center space-x-3 p-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0">
                <Checkbox
                  id={option.id}
                  checked={option.checked}
                  onCheckedChange={() => toggleOption(option.id)}
                  className="flex-shrink-0"
                />
                <div className="flex items-center space-x-2 flex-1 min-w-0">
                  <option.icon className="w-4 h-4 flex-shrink-0 text-gray-600" />
                  <label 
                    htmlFor={option.id} 
                    className="text-sm font-medium text-gray-700 cursor-pointer leading-tight"
                  >
                    {option.label}
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};