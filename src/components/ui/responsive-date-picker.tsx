
import React, { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ComprehensiveDatePicker } from './comprehensive-date-picker';
import { DatePickerTrigger } from './date-picker-trigger';
import { cn } from '@/lib/utils';

interface ResponsiveDatePickerProps {
  value?: Date;
  onChange?: (date: Date) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  minDate?: Date;
  maxDate?: Date;
  showToday?: boolean;
}

export const ResponsiveDatePicker: React.FC<ResponsiveDatePickerProps> = ({
  value,
  onChange,
  placeholder = "Select date",
  className,
  disabled = false,
  minDate,
  maxDate,
  showToday = true
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleDateChange = (date: Date) => {
    onChange?.(date);
    setIsOpen(false);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <DatePickerTrigger
          value={value}
          placeholder={placeholder}
          className={className}
          disabled={disabled}
        />
      </PopoverTrigger>
      <PopoverContent 
        className={cn(
          "w-auto p-0 bg-white border shadow-lg",
          "pointer-events-auto"
        )}
        align="start"
      >
        <ComprehensiveDatePicker
          value={value}
          onChange={handleDateChange}
          onClose={handleClose}
          minDate={minDate}
          maxDate={maxDate}
          showToday={showToday}
          disabled={disabled}
        />
      </PopoverContent>
    </Popover>
  );
};
