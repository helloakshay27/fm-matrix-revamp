import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ChevronDown } from 'lucide-react';

interface AssetAnalyticsSelectorProps {
  onSelectionChange: (selectedOptions: string[]) => void;
  dateRange: { startDate: Date; endDate: Date };
}

const analyticsOptions = [
  { id: 'groupWise', label: 'Group-wise Assets', description: 'Assets distribution by groups' },
  { id: 'categoryWise', label: 'Category-wise Assets', description: 'Assets distribution by categories' },
  { id: 'statusDistribution', label: 'Status Distribution', description: 'Assets by status (In Use, Breakdown, etc.)' },
  { id: 'assetDistributions', label: 'IT vs Non-IT Assets', description: 'Distribution between IT and Non-IT assets' },
];

export const AssetAnalyticsSelector: React.FC<AssetAnalyticsSelectorProps> = ({
  onSelectionChange,
  dateRange,
}) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>(['groupWise', 'categoryWise', 'statusDistribution', 'assetDistributions']);
  const [isOpen, setIsOpen] = useState(false);

  const handleSelectionChange = (optionId: string, checked: boolean) => {
    const newSelection = checked
      ? [...selectedOptions, optionId]
      : selectedOptions.filter(id => id !== optionId);
    
    setSelectedOptions(newSelection);
    onSelectionChange(newSelection);
  };

  const handleSelectAll = () => {
    const allIds = analyticsOptions.map(option => option.id);
    setSelectedOptions(allIds);
    onSelectionChange(allIds);
  };

  const handleSelectNone = () => {
    setSelectedOptions([]);
    onSelectionChange([]);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2 min-w-[200px] justify-between"
        >
          <span>
            {selectedOptions.length === 0
              ? 'Select Analytics'
              : selectedOptions.length === analyticsOptions.length
              ? 'All Analytics Selected'
              : `${selectedOptions.length} Analytics Selected`}
          </span>
          <ChevronDown className="w-4 h-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="start">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">Select Analytics Reports</h4>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSelectAll}
                className="text-xs"
              >
                All
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSelectNone}
                className="text-xs"
              >
                None
              </Button>
            </div>
          </div>
          
          <div className="space-y-3">
            {analyticsOptions.map((option) => (
              <div key={option.id} className="flex items-start space-x-2">
                <Checkbox
                  id={option.id}
                  checked={selectedOptions.includes(option.id)}
                  onCheckedChange={(checked) =>
                    handleSelectionChange(option.id, checked as boolean)
                  }
                />
                <div className="grid gap-1.5 leading-none">
                  <label
                    htmlFor={option.id}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {option.label}
                  </label>
                  <p className="text-xs text-muted-foreground">
                    {option.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t">
            <p className="text-xs text-muted-foreground">
              Date Range: {dateRange.startDate.toLocaleDateString()} - {dateRange.endDate.toLocaleDateString()}
            </p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
