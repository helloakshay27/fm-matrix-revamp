
import React, { useState, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

const ticketOptions = [
  { id: 'tickets', label: 'Overall Tickets First 2 chart', checked: true, chartSection: 'statusChart' },
  { id: 'reactive-proactive', label: 'Tickets Categorywise Proactive', checked: true, chartSection: 'reactiveChart' },
  { id: 'unitCategoryWise', label: 'Unit Category Wise', checked: true, chartSection: 'unitCategoryWise' },
  { id: 'statusChart', label: 'Status Chart', checked: true, chartSection: 'statusChart' },
  { id: 'response-tat', label: 'Response TAT', checked: true, chartSection: 'responseTat' },
  { id: 'category-wise-proactive-reactive', label: 'Category-wise Proactive/Reactive', checked: true, chartSection: 'categoryWiseProactiveReactive' },
  { id: 'category-wise', label: 'Unit Category-wise Tickets', checked: true, chartSection: 'categoryChart' },
  { id: 'aging-matrix', label: 'Ticket ageing matrix', checked: true, chartSection: 'agingMatrix' },
  { id: 'resolutionTat', label: 'Resolution TAT', checked: true, chartSection: 'resolutionTat' },
];

interface TicketSelectorProps {
  onSelectionChange?: (visibleSections: string[]) => void;
}

export function TicketSelector({ onSelectionChange }: TicketSelectorProps) {
  const [options, setOptions] = useState(ticketOptions);
  const [isOpen, setIsOpen] = useState(false);

  // Initialize with current visible sections
  useEffect(() => {
    const visibleSections = options
      .filter(opt => opt.checked)
      .map(opt => opt.chartSection);
    onSelectionChange?.(visibleSections);
  }, []);

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
          Ticket Selector ({selectedCount})
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0" align="end">
        <div className="bg-white border border-[hsl(var(--analytics-border))]">
          <div className="p-3 border-b border-[hsl(var(--analytics-border))]">
            <h3 className="font-medium text-[hsl(var(--analytics-text))]">Select Tickets</h3>
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
