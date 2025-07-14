import React, { useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface InventorySelectorOption {
  id: string;
  label: string;
  checked: boolean;
}

interface InventorySelectorProps {
  onSelectionChange: (selectedOptions: string[]) => void;
  className?: string;
}

export const InventorySelector: React.FC<InventorySelectorProps> = ({
  onSelectionChange,
  className = ''
}) => {
  const [options, setOptions] = useState<InventorySelectorOption[]>([
    { id: 'consumption-green', label: 'Inventory Consumption Green', checked: true },
    { id: 'consumption-report-green', label: 'Inventory Consumption Report Green', checked: true },
    { id: 'inventory', label: 'Inventory', checked: true },
    { id: 'inventory-trends', label: 'Inventory Trends', checked: true },
    { id: 'current-stock', label: 'Current Stock', checked: false },
    { id: 'current-stock-green', label: 'Current Stock Green', checked: false },
    { id: 'consumption', label: 'Inventory Consumption', checked: false },
    { id: 'consumption-report', label: 'Inventory Consumption Report', checked: false }
  ]);

  const handleOptionToggle = (optionId: string) => {
    const updatedOptions = options.map(option =>
      option.id === optionId ? { ...option, checked: !option.checked } : option
    );
    setOptions(updatedOptions);
    
    const selectedOptions = updatedOptions
      .filter(option => option.checked)
      .map(option => option.id);
    onSelectionChange(selectedOptions);
  };

  const selectedCount = options.filter(option => option.checked).length;

  return (
    <div className={`w-full max-w-md ${className}`}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-between bg-background/60 backdrop-blur-sm border-primary/20 hover:bg-background/80"
          >
            <span className="text-sm font-medium">
              Inventory Analytics ({selectedCount} selected)
            </span>
            <ChevronDown className="h-4 w-4 ml-2" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          className="w-80 p-2 max-h-96 overflow-y-auto bg-background/95 backdrop-blur-md border-primary/20"
          align="start"
        >
          <div className="space-y-1">
            {options.map((option) => (
              <DropdownMenuItem
                key={option.id}
                className="flex items-center space-x-3 p-3 rounded-md cursor-pointer hover:bg-muted/50"
                onSelect={(e) => {
                  e.preventDefault();
                  handleOptionToggle(option.id);
                }}
              >
                <div className={`w-4 h-4 border-2 rounded-sm flex items-center justify-center ${
                  option.checked 
                    ? 'bg-primary border-primary' 
                    : 'border-muted-foreground/30'
                }`}>
                  {option.checked && <Check className="w-3 h-3 text-primary-foreground" />}
                </div>
                <span className="text-sm font-medium flex-1">{option.label}</span>
              </DropdownMenuItem>
            ))}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};