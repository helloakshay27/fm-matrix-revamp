
import React, { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { format, parse, isValid } from 'date-fns';
import { cn } from '@/lib/utils';

interface MaterialDatePickerProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  minDate?: Date;
  maxDate?: Date;
}

export const MaterialDatePicker = ({ value, onChange, placeholder = "Select date", className, minDate, maxDate }: MaterialDatePickerProps) => {
  const parseDate = (dateString: string): Date | undefined => {
    if (!dateString) return undefined;
    
    // Try to parse DD/MM/YYYY format first
    const parsedDate = parse(dateString, 'dd/MM/yyyy', new Date());
    if (isValid(parsedDate)) {
      return parsedDate;
    }
    
    // Fallback to default Date parsing
    const fallbackDate = new Date(dateString);
    return isValid(fallbackDate) ? fallbackDate : undefined;
  };

  const [date, setDate] = useState<Date | undefined>(parseDate(value));
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setDate(parseDate(value));
  }, [value]);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    if (selectedDate) {
      onChange(format(selectedDate, 'dd/MM/yyyy'));
      // Close the calendar popover after selecting a date
      setOpen(false);
    } else {
      onChange('');
      setOpen(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            "!bg-white !text-gray-700 !border !border-gray-300 hover:!bg-gray-50",
            "!transition-all !duration-200 !ease-in-out",
            "focus:!ring-2 focus:!ring-gray-500 focus:!ring-offset-0",
            "!rounded-md",
            !date && "!text-gray-500",
            "[&_svg]:!text-gray-400",
            className
          )}
          onClick={() => setOpen(true)}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "dd/MM/yyyy") : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateSelect}
          disabled={[
            ...(minDate ? [{ before: minDate }] : []),
            ...(maxDate ? [{ after: maxDate }] : []),
          ]}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
};
