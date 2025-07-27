import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronDown, BarChart3, PieChart, TrendingUp, Building } from 'lucide-react';

// Define available analytics options
const taskAnalyticsOptions = [
  {
    id: 'technical',
    label: 'Technical Checklist',
    checked: true,
    endpoint: 'chart_technical_checklist_monthly',
    icon: BarChart3,
  },
  {
    id: 'nonTechnical',
    label: 'Non-Technical Checklist',
    checked: true,
    endpoint: 'chart_non_technical_checklist_monthly',
    icon: PieChart,
  },
  {
    id: 'topTen',
    label: 'Top 10 Checklist Types',
    checked: true,
    endpoint: 'top_ten_checklist',
    icon: TrendingUp,
  },
  {
    id: 'siteWise',
    label: 'Site-wise Checklist Status',
    checked: true,
    endpoint: 'site_wise_checklist',
    icon: Building,
  },
];

interface TaskAnalyticsSelectorProps {
  onSelectionChange?: (selectedOptions: string[]) => void;
  dateRange?: {
    startDate: Date;
    endDate: Date;
  };
}

export const TaskAnalyticsSelector: React.FC<TaskAnalyticsSelectorProps> = ({
  onSelectionChange,
  dateRange
}) => {
  const [options, setOptions] = useState(taskAnalyticsOptions);

  const toggleOption = (id: string) => {
    const updatedOptions = options.map(option =>
      option.id === id ? { ...option, checked: !option.checked } : option
    );
    setOptions(updatedOptions);
    
    if (onSelectionChange) {
      const selectedIds = updatedOptions
        .filter(option => option.checked)
        .map(option => option.id);
      onSelectionChange(selectedIds);
    }
  };

  const selectedCount = options.filter(option => option.checked).length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          className="flex items-center gap-2 min-w-[200px] justify-between"
        >
          <span>
            {selectedCount} Report{selectedCount !== 1 ? 's' : ''} Selected
          </span>
          <ChevronDown className="w-4 h-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 bg-white border shadow-lg z-50">
        <div className="p-4">
          <h4 className="font-medium text-sm mb-3">Select Analytics Reports</h4>
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {options.map((option) => {
              const IconComponent = option.icon;
              return (
                <div key={option.id} className="flex items-center space-x-3">
                  <Checkbox
                    id={option.id}
                    checked={option.checked}
                    onCheckedChange={() => toggleOption(option.id)}
                  />
                  <div className="flex items-center space-x-2 flex-1">
                    <IconComponent className="w-4 h-4 text-muted-foreground" />
                    <label
                      htmlFor={option.id}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {option.label}
                    </label>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-4 pt-3 border-t">
            <div className="flex justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const allSelected = options.map(option => ({ ...option, checked: true }));
                  setOptions(allSelected);
                  if (onSelectionChange) {
                    onSelectionChange(allSelected.map(option => option.id));
                  }
                }}
              >
                Select All
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const noneSelected = options.map(option => ({ ...option, checked: false }));
                  setOptions(noneSelected);
                  if (onSelectionChange) {
                    onSelectionChange([]);
                  }
                }}
              >
                Clear All
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};