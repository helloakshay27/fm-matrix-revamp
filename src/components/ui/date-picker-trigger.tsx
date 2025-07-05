
import React from 'react';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface DatePickerTriggerProps {
  value?: Date;
  placeholder?: string;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

export const DatePickerTrigger: React.FC<DatePickerTriggerProps> = ({
  value,
  placeholder = "Select date",
  className,
  onClick,
  disabled = false
}) => {
  return (
    <Button
      variant="outline"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "w-full justify-start text-left font-normal",
        "border border-gray-300 bg-white hover:bg-gray-50",
        "transition-all duration-200 ease-in-out",
        !value && "text-gray-500",
        className
      )}
    >
      <CalendarIcon className="mr-2 h-4 w-4 text-gray-400" />
      {value ? format(value, "dd/MM/yyyy") : placeholder}
    </Button>
  );
};
