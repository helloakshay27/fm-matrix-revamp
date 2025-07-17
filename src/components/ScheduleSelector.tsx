import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronDown, ChevronUp, Settings } from 'lucide-react';

interface ScheduleSelectorProps {
  selectedItems: string[];
  onSelectionChange: (items: string[]) => void;
}

export const ScheduleSelector: React.FC<ScheduleSelectorProps> = ({
  selectedItems,
  onSelectionChange
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const items = [
    { id: 'checklist', label: 'Checklist' },
    { id: 'technical-checklist', label: 'Technical Checklist' },
    { id: 'non-technical-checklist', label: 'Non Technical Checklist' },
    { id: 'top-10-checklist', label: 'Top 10 Checklist' },
    { id: 'schedule-types', label: 'Schedule Types' },
    { id: 'category-breakdown', label: 'Category Breakdown' },
    { id: 'activity-analysis', label: 'Activity Analysis' }
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
          Schedule Categories
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