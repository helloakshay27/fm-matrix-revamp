import React, { useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

const inventoryOptions = [
  { id: 'items', label: 'Items', checked: true, chartSection: 'statusChart' },
  { id: 'critical-items', label: 'Critical Non-Critical Items', checked: true, chartSection: 'criticalityChart' },
  { id: 'category-wise', label: 'Unit Category-wise Items', checked: true, chartSection: 'categoryChart' },
  { id: 'aging-matrix', label: 'Items Aging Matrix', checked: true, chartSection: 'agingMatrix' },
  { id: 'low-stock', label: 'Low Stock Items', checked: false, chartSection: 'lowStockChart' },
  { id: 'high-value', label: 'High Value Items', checked: false, chartSection: 'highValueChart' },
  { id: 'consumable', label: 'Consumable Items', checked: false, chartSection: 'consumableChart' },
  { id: 'non-consumable', label: 'Non-Consumable Items', checked: false, chartSection: 'nonConsumableChart' },
  { id: 'critical-priority', label: 'Critical Priority Items', checked: false, chartSection: 'criticalPriorityChart' },
  { id: 'maintenance-due', label: 'Maintenance Due Items', checked: false, chartSection: 'maintenanceDueChart' },
];

interface InventorySelectorProps {
  onSelectionChange?: (visibleSections: string[]) => void;
}

export function InventorySelector({ onSelectionChange }: InventorySelectorProps) {
  const [options, setOptions] = useState(inventoryOptions);
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
          className="bg-white border-[hsl(var(--analytics-border))] text-[hsl(var(--analytics-text))] hover:bg-[hsl(var(--analytics-background))]"
        >
          Inventory Selector ({selectedCount})
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0" align="end">
        <div className="bg-white border border-[hsl(var(--analytics-border))]">
          <div className="p-3 border-b border-[hsl(var(--analytics-border))]">
            <h3 className="font-medium text-[hsl(var(--analytics-text))]">Select Items</h3>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {options.map((option) => (
              <div 
                key={option.id}
                className="flex items-center p-3 hover:bg-[hsl(var(--analytics-background))] cursor-pointer"
                onClick={() => toggleOption(option.id)}
              >
                <div className="flex items-center justify-center w-4 h-4 mr-3 border border-[hsl(var(--analytics-border))] bg-white">
                  {option.checked && <Check className="h-3 w-3 text-[hsl(var(--analytics-text))]" />}
                </div>
                <span className="text-sm text-[hsl(var(--analytics-text))]">{option.label}</span>
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}