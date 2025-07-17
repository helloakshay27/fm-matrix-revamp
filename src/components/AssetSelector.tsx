import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronDown, ChevronUp, Settings } from 'lucide-react';

interface AssetSelectorProps {
  selectedItems: string[];
  onSelectionChange: (items: string[]) => void;
}

export const AssetSelector: React.FC<AssetSelectorProps> = ({
  selectedItems,
  onSelectionChange
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const items = [
    { id: 'total-available', label: 'Total Assets Available' },
    { id: 'assets-in-use', label: 'Assets In Use' },
    { id: 'asset-breakdown', label: 'Asset In Breakdown' },
    { id: 'critical-breakdown', label: 'Critical Asset In Breakdown' },
    { id: 'ppm-conducted', label: 'PPM Conducted Assets' },
    { id: 'assets-breakdown-chart', label: 'Asset BreakDown' },
    { id: 'breakdown-table', label: 'Assets Breakdown Table' }
  ];

  const handleItemToggle = (itemId: string) => {
    const newSelection = selectedItems.includes(itemId)
      ? selectedItems.filter(id => id !== itemId)
      : [...selectedItems, itemId];
    onSelectionChange(newSelection);
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="w-auto min-w-[200px] justify-between text-[hsl(var(--analytics-text))] border-[hsl(var(--analytics-border))]"
      >
        <div className="flex items-center gap-2">
          <Settings className="w-4 h-4" />
          Asset Categories
        </div>
        {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </Button>

      {isOpen && (
        <div className="absolute top-full mt-1 w-80 bg-white border border-[hsl(var(--analytics-border))] rounded-md shadow-lg z-50 p-3">
          <div className="space-y-2">
            {items.map((item) => (
              <div key={item.id} className="flex items-center space-x-2">
                <Checkbox
                  id={item.id}
                  checked={selectedItems.includes(item.id)}
                  onCheckedChange={() => handleItemToggle(item.id)}
                />
                <label
                  htmlFor={item.id}
                  className="text-sm text-[hsl(var(--analytics-text))] cursor-pointer"
                >
                  {item.label}
                </label>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};