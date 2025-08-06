import React, { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { ChevronDown, Check } from 'lucide-react';

const responseAnalyticsOptions = [
  {
    id: 'response-statistics',
    label: 'Response Statistics',
    description: 'Key response metrics and statistics overview',
    checked: true,
  },
  {
    id: 'survey-wise-responses',
    label: 'Survey-wise Responses',
    description: 'Responses distribution by surveys',
    checked: true,
  },
  {
    id: 'category-wise-responses',
    label: 'Category-wise Responses',
    description: 'Responses distribution by categories',
    checked: true,
  },
  {
    id: 'status-distribution',
    label: 'Status Distribution',
    description: 'Responses by status (In Use, Breakdown, etc.)',
    checked: true,
  },
  {
    id: 'feedback-vs-survey',
    label: 'Feedback vs Survey',
    description: 'Distribution between feedback and survey responses',
    checked: false,
  },
];

interface ResponseAnalyticsSelectorProps {
  onSelectionChange?: (selectedOptions: string[]) => void;
}

export const ResponseAnalyticsSelector: React.FC<ResponseAnalyticsSelectorProps> = ({
  onSelectionChange,
}) => {
  const [options, setOptions] = useState(responseAnalyticsOptions);
  const [isOpen, setIsOpen] = useState(false);

  const selectedCount = options.filter(option => option.checked).length;

  const toggleOption = (id: string) => {
    const newOptions = options.map(option =>
      option.id === id ? { ...option, checked: !option.checked } : option
    );
    setOptions(newOptions);
    
    if (onSelectionChange) {
      const selectedIds = newOptions.filter(option => option.checked).map(option => option.id);
      onSelectionChange(selectedIds);
    }
  };

  const handleSelectAll = () => {
    const newOptions = options.map(option => ({ ...option, checked: true }));
    setOptions(newOptions);
    
    if (onSelectionChange) {
      const selectedIds = newOptions.map(option => option.id);
      onSelectionChange(selectedIds);
    }
  };

  const handleSelectNone = () => {
    const newOptions = options.map(option => ({ ...option, checked: false }));
    setOptions(newOptions);
    
    if (onSelectionChange) {
      onSelectionChange([]);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="border-[#C72030] text-[#C72030] hover:bg-[#C72030]/5 min-w-[200px] justify-between"
        >
          <span>{selectedCount} Analytics Selected</span>
          <ChevronDown className="w-4 h-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0 bg-white border shadow-lg" align="end">
        {/* Header */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold">Select Analytics Reports</h3>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSelectAll}
                className="text-xs text-gray-600 hover:text-gray-800"
              >
                All
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSelectNone}
                className="text-xs text-gray-600 hover:text-gray-800"
              >
                None
              </Button>
            </div>
          </div>
        </div>

        {/* Options */}
        <div className="p-4">
          <div className="space-y-3">
            {options.map((option) => (
              <div
                key={option.id}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
                onClick={() => toggleOption(option.id)}
              >
                <div className={`w-4 h-4 mt-0.5 rounded border-2 flex items-center justify-center ${
                  option.checked 
                    ? 'bg-[#C72030] border-[#C72030]' 
                    : 'border-gray-300'
                }`}>
                  {option.checked && <Check className="w-3 h-3 text-white" />}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">
                    {option.label}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {option.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50">
          <div className="text-xs text-gray-600 mb-3">
            Date Range: 8/6/2024 - 8/6/2025
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="text-gray-600 hover:text-gray-800"
            >
              Clear All
            </Button>
            <Button
              size="sm"
              onClick={() => setIsOpen(false)}
              className="bg-[#C72030] hover:bg-[#C72030]/90 text-white"
            >
              Apply
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};