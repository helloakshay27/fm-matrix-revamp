import React, { useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

const ticketOptions = [
  { id: 'all', label: 'All Tickets', checked: true },
  { id: 'reactive', label: 'Reactive Tickets', checked: true },
  { id: 'proactive', label: 'Proactive Tickets', checked: true },
  { id: 'pending', label: 'Pending Tickets', checked: false },
  { id: 'inprogress', label: 'In Progress Tickets', checked: false },
  { id: 'closed', label: 'Closed Tickets', checked: false },
  { id: 'overdue', label: 'Overdue Tickets', checked: false },
  { id: 'highpriority', label: 'High Priority (P1)', checked: false },
  { id: 'medpriority', label: 'Medium Priority (P2)', checked: false },
  { id: 'lowpriority', label: 'Low Priority (P3)', checked: false },
];

export function TicketSelector() {
  const [options, setOptions] = useState(ticketOptions);
  const [isOpen, setIsOpen] = useState(false);

  const toggleOption = (id: string) => {
    setOptions(prev => prev.map(option => 
      option.id === id ? { ...option, checked: !option.checked } : option
    ));
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