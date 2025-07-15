
import React, { useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

const ticketOptions = [
  { id: 'tickets', label: 'Tickets', checked: true, chartSection: 'statusChart' },
  { id: 'reactive-proactive', label: 'Reactive Proactive Tickets', checked: true, chartSection: 'reactiveChart' },
  { id: 'category-wise', label: 'Category-wise Tickets', checked: true, chartSection: 'categoryChart' },
  { id: 'category-proactive', label: 'Category-wise Proactive Tickets', checked: false, chartSection: 'categoryProactiveChart' },
  { id: 'aging-matrix', label: 'Aging Matrix', checked: true, chartSection: 'agingMatrix' },
  { id: 'pending', label: 'Pending Tickets', checked: false, chartSection: 'pendingChart' },
  { id: 'inprogress', label: 'In Progress Tickets', checked: false, chartSection: 'inProgressChart' },
  { id: 'closed', label: 'Closed Tickets', checked: false, chartSection: 'closedChart' },
  { id: 'overdue', label: 'Overdue Tickets', checked: false, chartSection: 'overdueChart' },
  { id: 'highpriority', label: 'High Priority (P1)', checked: false, chartSection: 'p1Chart' },
  { id: 'medpriority', label: 'Medium Priority (P2)', checked: false, chartSection: 'p2Chart' },
  { id: 'lowpriority', label: 'Low Priority (P3)', checked: false, chartSection: 'p3Chart' },
];

interface TicketSelectorProps {
  onSelectionChange?: (visibleSections: string[]) => void;
}

export function TicketSelector({ onSelectionChange }: TicketSelectorProps) {
  const [options, setOptions] = useState(ticketOptions);
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
