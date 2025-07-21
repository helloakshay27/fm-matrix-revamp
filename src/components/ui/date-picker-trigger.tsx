
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

export const DatePickerTrigger = React.forwardRef<HTMLButtonElement, DatePickerTriggerProps>(({
  value,
  placeholder = "Select date",
  className,
  onClick,
  disabled = false,
  ...props
}, ref) => {
  return (
    <Button
      ref={ref}
      variant="outline"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "w-full justify-start text-left font-normal",
        "!bg-white !text-gray-700 !border !border-gray-300 hover:!bg-gray-50",
        "!transition-all !duration-200 !ease-in-out",
        "focus:!ring-2 focus:!ring-gray-500 focus:!ring-offset-0",
        !value && "!text-gray-500",
        "[&_svg]:!text-gray-400",
        className
      )}
      {...props}
    >
      <CalendarIcon className="mr-2 h-4 w-4" />
      {value ? format(value, "dd/MM/yyyy") : placeholder}
    </Button>
  );
});

DatePickerTrigger.displayName = "DatePickerTrigger";
